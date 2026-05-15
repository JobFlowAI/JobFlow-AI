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
    "facebook.com", "instagram.com", "twitter.com", "x.com",
    "pinterest.com", "tiktok.com", "youtube.com", "reddit.com",
    "quora.com", "wikipedia.org", "amazon.com", "ebay.com",
    "yelp.com", "yellowpages.com", "tripadvisor.com",
}

BLACKLIST_URL_HINTS = (
    "/blog", "/news", "/article", "/wiki",
    "top-10", "top-20", "list-of", "best-companies",
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

    system = (
        "You classify web search results for a job-discovery engine. "
        "Given a search intent and a single result (url, title, snippet), choose ONE label:\n"
        "- direct_job_posting: a single specific job ad on a company site or ATS (Greenhouse, Lever, Ashby, Workday, BambooHR, SmartRecruiters, etc.)\n"
        "- careers_page: a company's careers/jobs index page (multiple roles, not a single posting)\n"
        "- aggregator: a job board listing (LinkedIn, Indeed, Glassdoor, ZipRecruiter, themuse, etc.)\n"
        "- noise: anything else (blog, news, directory, marketing page, unrelated)\n"
        "Respond ONLY with valid JSON: {\"label\": \"<one of the four labels>\"}."
    )

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
            max_tokens=20,
        )
        content = resp.choices[0].message.content or "{}"
        data = json.loads(content)
        label = str(data.get("label", "noise")).strip().lower()
        if label in {"direct_job_posting", "careers_page", "aggregator", "noise"}:
            return label  # type: ignore[return-value]
        return "noise"
    except Exception:
        return "noise"
