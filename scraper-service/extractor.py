"""Fetch a job page and use an LLM to pull out structured fields."""

from __future__ import annotations

import os
import re
import json
from typing import Optional
from urllib.parse import urlparse

import httpx
from bs4 import BeautifulSoup
from openai import OpenAI


USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)

EMAIL_RE = re.compile(r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}")

NOREPLY_PREFIXES = ("noreply", "no-reply", "donotreply", "sentry", "wordpress")
ASSET_SUFFIXES = (".png", ".jpg", ".jpeg", ".gif", ".css", ".js", ".svg", ".webp")


_client: OpenAI | None = None


def _client_lazy() -> OpenAI | None:
    global _client
    if _client is not None:
        return _client
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return None
    _client = OpenAI(api_key=api_key)
    return _client


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
    """Regex-based fallback for finding a hiring email in raw text."""
    if not text:
        return None
    for match in EMAIL_RE.findall(text):
        e = match.lower()
        if e.endswith(ASSET_SUFFIXES):
            continue
        if any(e.startswith(p) for p in NOREPLY_PREFIXES):
            continue
        return match
    return None


def _confidence(job: dict) -> float:
    """Weighted completeness score for downstream UI badges."""
    weights = {
        "title": 0.20,
        "company": 0.15,
        "description": 0.20,
        "apply_url": 0.10,
        "location": 0.10,
        "posted_at": 0.05,
        "closing_at": 0.05,
        "salary": 0.05,
        "hiring_email": 0.10,
    }
    score = 0.0
    for k, w in weights.items():
        v = job.get(k)
        if isinstance(v, str) and v.strip():
            score += w
        elif v not in (None, "", [], {}):
            score += w
    return round(min(score, 1.0), 2)


def extract_job(url: str, page_text: str) -> Optional[dict]:
    """Use the LLM to extract structured job fields. Returns dict or None."""
    client = _client_lazy()
    if client is None or not page_text:
        return None

    model = os.getenv("SCRAPER_OPENAI_MODEL", "gpt-4o-mini")

    system = (
        "You extract structured job posting data from raw web page text. "
        "Return strict JSON with these keys: "
        "title, company, location, employment_type, description, salary, "
        "posted_at (ISO date if found else null), "
        "closing_at (ISO date if found else null), "
        "apply_url (string or null), "
        "hiring_email (recruiter/hiring/HR contact email explicitly on the page, else null). "
        "Keep description full and rich, do not summarize. "
        "Use null for missing fields. Only valid JSON, no prose."
    )

    user = f"Source URL: {url}\n\nPage text:\n\"\"\"\n{page_text}\n\"\"\""

    try:
        resp = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            response_format={"type": "json_object"},
            temperature=0.1,
            max_tokens=2000,
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
