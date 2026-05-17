"""Fetch a job page and use an LLM to pull out structured fields."""

from __future__ import annotations

import os
import re
import json
from typing import Optional
from urllib.parse import urlparse

import httpx
from bs4 import BeautifulSoup

from llm_client import get_client, default_model


USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)

EMAIL_RE = re.compile(r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}")

NOREPLY_PREFIXES = (
    "noreply", "no-reply", "donotreply", "sentry", "wordpress",
    "support", "info", "hello", "admin", "contact", "team",
    "notifications", "mailer", "bounce", "postmaster",
)
ASSET_SUFFIXES = (".png", ".jpg", ".jpeg", ".gif", ".css", ".js", ".svg", ".webp")

HIRING_KEYWORDS = (
    "recruit", "hiring", "talent", "hr", "people", "jobs", "careers",
    "apply", "staffing", "workforce",
)


def fetch_page(url: str, timeout: float = 12.0) -> Optional[str]:
    """Fetch a page; return cleaned text or None on failure."""
    try:
        with httpx.Client(
            headers={"User-Agent": USER_AGENT, "Accept-Language": "en-US,en;q=0.9"},
            follow_redirects=True,
            timeout=timeout,
        ) as client:
            resp = client.get(url)
            if resp.status_code >= 400:
                return None
            html = resp.text
    except Exception:
        return None

    soup = BeautifulSoup(html, "html.parser")
    for tag in soup(["script", "style", "noscript", "svg"]):
        tag.decompose()
    text = soup.get_text("\n", strip=True)
    # Keep token budget reasonable.
    return text[:9000] if text else None


def sniff_email(text: str) -> Optional[str]:
    """Regex-based fallback: prefer hiring/HR emails; fall back to any valid email."""
    if not text:
        return None

    candidates: list[str] = []
    for match in EMAIL_RE.findall(text):
        e = match.lower()
        if e.endswith(ASSET_SUFFIXES):
            continue
        local = e.split("@")[0]
        if any(local.startswith(p) for p in NOREPLY_PREFIXES):
            continue
        candidates.append(match)

    if not candidates:
        return None

    # Prefer emails whose local-part contains a hiring-related keyword.
    for candidate in candidates:
        local = candidate.lower().split("@")[0]
        if any(kw in local for kw in HIRING_KEYWORDS):
            return candidate

    # Fall back to the first acceptable candidate.
    return candidates[0]


def _confidence(job: dict) -> float:
    """Weighted completeness score for downstream UI badges."""
    weights = {
        "title": 0.18,
        "company": 0.12,
        "description": 0.18,
        "apply_url": 0.08,
        "location": 0.08,
        "work_mode": 0.06,
        "employment_type": 0.05,
        "experience_level": 0.05,
        "posted_at": 0.04,
        "salary": 0.06,
        "hiring_email": 0.08,
        "tags": 0.02,
    }
    score = 0.0
    for k, w in weights.items():
        v = job.get(k)
        if isinstance(v, str) and v.strip():
            score += w
        elif isinstance(v, list) and len(v) > 0:
            score += w
        elif v not in (None, "", [], {}):
            score += w
    return round(min(score, 1.0), 2)


def extract_job(url: str, page_text: str) -> Optional[dict]:
    """Use the LLM to extract structured job fields. Returns dict or None."""
    client = get_client()
    if client is None or not page_text:
        return None

    model = os.getenv("SCRAPER_MODEL", default_model())

    system = """\
You are a precise job-data extraction engine. Extract ALL available information from \
the raw text of a job posting page. Return ONLY a single JSON object — no markdown, \
no code fences, no commentary.

REQUIRED JSON KEYS
==================
title (string)
  The exact job title as written on the page. Do not abbreviate or alter it.
  Examples: "Senior Software Engineer", "Product Designer (Remote)", "Data Analyst II"

company (string)
  The official name of the HIRING company. If a staffing/recruiting agency is posting
  on behalf of a client, use the client company name if stated; otherwise use the agency.

location (string | null)
  Full location string including city, state/region, country where available.
  Append work-mode cues if present in the location text.
  Examples: "Austin, TX, USA", "London, UK (Hybrid)", "Remote – Worldwide", "Berlin, Germany"

work_mode (string | null)
  Exactly one of: "remote", "hybrid", "onsite".
  Infer from title, location, or description text.
  remote  = fully remote, work from anywhere, no office requirement
  hybrid  = mix of remote and office days, partially remote
  onsite  = fully in-person, on-site, in-office, no remote option
  null    = not mentioned or genuinely ambiguous

employment_type (string | null)
  Exactly one of: "Full-time", "Part-time", "Contract", "Internship", "Freelance".
  Normalize synonyms: Permanent → Full-time, Temp/Temporary → Contract,
  Consultant → Contract, Intern/Co-op → Internship, Gig/Independent → Freelance.
  null if not stated.

experience_level (string | null)
  Exactly one of: "Entry", "Mid", "Senior", "Lead".
  Entry  = 0–2 years, junior, associate, graduate, new grad
  Mid    = 2–5 years, mid-level, intermediate, software engineer (no modifier)
  Senior = 5+ years, senior, sr., experienced
  Lead   = staff, lead, principal, director, head of, VP, manager
  Infer from the job title first; use the requirements section as tie-breaker.
  null if impossible to determine.

description (string)
  The COMPLETE, VERBATIM job description text — responsibilities, qualifications,
  benefits, company overview, EEO statements. Do NOT summarize, paraphrase, or
  truncate. Copy the full text exactly as it appears on the page.

requirements (array of strings)
  The 5–10 most important, specific requirements extracted from the posting.
  Short, factual phrases. Examples:
    ["5+ years Python", "Experience with React and TypeScript",
     "BS/MS in Computer Science or related", "AWS or GCP cloud experience",
     "Strong communication skills"]
  Empty array [] if no requirements section is present.

tags (array of strings)
  All specific technologies, programming languages, frameworks, tools, cloud
  platforms, databases, certifications, methodologies, and domain keywords
  explicitly mentioned in the posting. Maximum 20 items. All lowercase.
  Examples: ["python", "fastapi", "postgresql", "aws", "docker", "kubernetes",
             "rest api", "machine learning", "agile", "ci/cd"]
  Do NOT include generic soft skills ("teamwork", "communication", "leadership").
  Empty array [] if none found.

salary (string | null)
  Full salary or compensation text exactly as written.
  Examples: "$120,000–$150,000/yr", "£45k–£55k", "€70,000 + equity + benefits",
            "₹15–20 LPA", "Competitive, based on experience"
  null if not mentioned.

posted_at (string | null)
  ISO-8601 date the job was posted: YYYY-MM-DD.
  Interpret relative dates ("3 days ago", "Posted yesterday") relative to today.
  null if not found.

closing_at (string | null)
  ISO-8601 application deadline: YYYY-MM-DD. null if not found.

apply_url (string | null)
  Direct URL to apply for this role, if different from the source URL and
  explicitly linked on the page. null otherwise.

hiring_email (string | null)
  An email address of a recruiter, HR contact, or hiring manager that is
  EXPLICITLY displayed on the page for application/inquiry purposes.
  Ignore: noreply@, donotreply@, info@, support@, hello@, admin@, contact@
  unless they are explicitly labelled as the hiring contact.
  null if no qualifying email is present.

HARD RULES
==========
- Use JSON null (not the string "null") for any field you cannot find.
- NEVER invent or hallucinate data. If a field is absent or ambiguous, use null / [].
- description must be full verbatim text — never a summary.
- tags must be specific technical terms only — no generic words.
- Return ONLY the JSON object. No explanation, no markdown wrapper."""

    user = f"Source URL: {url}\n\nPage text:\n\"\"\"\n{page_text}\n\"\"\""

    try:
        resp = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            response_format={"type": "json_object"},
            temperature=0.0,
            max_tokens=3000,
        )
        content = resp.choices[0].message.content or "{}"
        data = json.loads(content)
    except Exception:
        return None

    if not isinstance(data, dict):
        return None

    # Sanity-check minimum viable fields.
    title = (data.get("title") or "").strip()
    company = (data.get("company") or "").strip()
    description = (data.get("description") or "").strip()
    if not title or not company or len(description) < 40:
        return None

    if not data.get("hiring_email"):
        sniffed = sniff_email(page_text)
        if sniffed:
            data["hiring_email"] = sniffed

    if not data.get("apply_url"):
        data["apply_url"] = url

    data["title"] = title
    data["company"] = company
    data["description"] = description
    data["source_domain"] = urlparse(url).netloc.lower() or None
    data["canonical_url"] = url
    data["extraction_confidence"] = _confidence(data)
    return data
