"""LLM-based classifier: decide whether a search result is a real job posting."""

from __future__ import annotations

import os
import json
from typing import Literal
from urllib.parse import urlparse

from llm_client import get_client, default_model


Classification = Literal[
    "direct_job_posting",
    "careers_page",
    "aggregator",
    "noise",
]


BLACKLIST_DOMAINS = {
    # Social / content
    "facebook.com", "instagram.com", "twitter.com", "x.com",
    "pinterest.com", "tiktok.com", "youtube.com", "reddit.com",
    "quora.com", "wikipedia.org", "medium.com", "substack.com",
    # E-commerce / reviews / unrelated
    "amazon.com", "ebay.com", "yelp.com", "yellowpages.com",
    "tripadvisor.com", "trustpilot.com", "g2.com",
    # Salary / research (not job postings)
    "salary.com", "payscale.com", "levels.fyi", "glassdoor.com",
    "comparably.com", "crunchbase.com", "pitchbook.com",
}

BLACKLIST_URL_HINTS = (
    # Editorial / content paths
    "/blog", "/news", "/article", "/wiki", "/press", "/media",
    "/forum", "/community", "/discussion", "/podcast",
    # List / guide pages
    "top-10", "top-20", "top-50", "list-of", "best-companies",
    "how-to-", "-guide", "-tips", "-advice", "-salary",
    # Review / research paths
    "/reviews", "/interview-", "/salary-", "/benefits",
    "/company-overview", "/about-us",
)


def heuristic_prefilter(url: str, title: str, description: str) -> bool:
    """Cheap, fast reject for obvious junk before paying for an LLM call."""
    try:
        domain = urlparse(url).netloc.lower()
    except Exception:
        return False

    if not domain:
        return False

    for bad in BLACKLIST_DOMAINS:
        if bad in domain:
            return False

    haystack = f"{url} {title}".lower()
    for hint in BLACKLIST_URL_HINTS:
        if hint in haystack:
            return False

    return True


def classify_result(query: str, url: str, title: str, description: str) -> Classification:
    """Ask the LLM to bucket a search result. Falls back to 'noise' on error."""
    client = get_client()
    if client is None:
        # No key — be optimistic so the rest of the pipeline can still run.
        return "direct_job_posting"

    model = os.getenv("SCRAPER_MODEL", default_model())

    system = """\
You are a classification engine for a job-discovery scraper. \
Given a search intent and one web result (URL + title + snippet), output exactly one label.

LABEL DEFINITIONS
=================
direct_job_posting
  A single, specific open role at ONE company, hosted on that company's own site or on an ATS.
  Strong URL signals (any of these → direct_job_posting):
    boards.greenhouse.io/<company>/jobs/<id>
    jobs.lever.co/<company>/<uuid>
    jobs.ashbyhq.com/<company>/<slug>
    <company>.workday.com/*/job/<id>
    jobs.smartrecruiters.com/<Company>/<id>
    <company>.bamboohr.com/jobs/<id>
    <company>.myworkdayjobs.com/*/job/*
    <company>.icims.com/jobs/<id>/*
    <company>.taleo.net/careersection/*/jobdetail.ftl
    apply.workable.com/<company>/j/<slug>
    job-boards.eu.greenhouse.io/*/jobs/<id>
    /careers/<role-slug>  or  /jobs/<role-slug>  on a company domain (with a specific role slug, not an index)

careers_page
  A company's OWN listing of multiple open roles — an index/directory, NOT a single posting.
  URL patterns: /careers, /jobs, /open-roles, /opportunities, /work-with-us (with no specific role ID).

aggregator
  A third-party job board that aggregates postings from many employers.
  Always aggregator regardless of whether it shows a single job:
    linkedin.com, indeed.com, ziprecruiter.com, monster.com, dice.com,
    simplyhired.com, careerbuilder.com, themuse.com, adzuna.com,
    remotive.com, weworkremotely.com, wellfound.com, angel.co,
    builtin.com, hired.com, flexjobs.com, jobsora.com, jooble.org,
    talent.com, snagajob.com, internshala.com, naukri.com,
    seek.com.au, stepstone.de, jobstreet.com, workopolis.com.

noise
  Anything that is NOT a job posting: blog posts, salary guides, company reviews,
  interview-prep articles, directories, marketing pages, news, press releases,
  or results entirely unrelated to the search intent.

DECISION ORDER (apply top-to-bottom, stop at first match)
==========================================================
1. Domain is a known aggregator → aggregator
2. URL contains an ATS job-ID pattern listed above → direct_job_posting
3. URL path is a specific role slug on a company domain (no index) → direct_job_posting
4. URL path is a careers/jobs index (no role ID) → careers_page
5. Title/snippet describe a single open role at a named company → direct_job_posting
6. Title/snippet describe multiple open roles at a company → careers_page
7. Everything else → noise

Respond ONLY with valid JSON: {"label": "<label>"}"""

    user = (
        f"Search intent: {query}\n\n"
        f"URL: {url}\n"
        f"Title: {title}\n"
        f"Snippet: {description}\n"
    )

    try:
        resp = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            response_format={"type": "json_object"},
            temperature=0.0,
            max_tokens=60,
        )
        content = resp.choices[0].message.content or "{}"
        data = json.loads(content)
        label = str(data.get("label", "noise")).strip().lower()
        if label in {"direct_job_posting", "careers_page", "aggregator", "noise"}:
            return label  # type: ignore[return-value]
        return "noise"
    except Exception:
        return "noise"
