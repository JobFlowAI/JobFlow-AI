"""Job discovery pipeline: search -> prefilter -> classify -> extract -> persist."""

from __future__ import annotations

import os
import time
from typing import Iterator, Optional
from urllib.parse import urlparse

from duckduckgo_search import DDGS

from classifier import heuristic_prefilter, classify_result
from extractor import fetch_page, extract_job
from persistence import upsert_job, finish_run
from schemas import DiscoverFilters


_WORK_MODE_TERMS: dict[str, str] = {
    "remote": "remote",
    "hybrid": "hybrid",
    "onsite": "(on-site OR onsite OR in-office)",
}

_JOB_TYPE_TERMS: dict[str, str] = {
    "full_time": '("full-time" OR "full time")',
    "part_time": '("part-time" OR "part time")',
    "contract": "contract",
    "internship": "(internship OR intern)",
    "freelance": "(freelance OR freelancer)",
}

_EXP_TERMS: dict[str, str] = {
    "entry": "(entry level OR junior OR graduate)",
    "mid": "(mid-level OR intermediate)",
    "senior": "(senior OR sr)",
    "lead": "(lead OR staff OR principal)",
}

# Maps date_posted values to DDGS timelimit codes.
_DATE_TIMELIMIT: dict[str, Optional[str]] = {
    "any": None,
    "24h": "d",
    "week": "w",
    "month": "m",
}


def _build_query(query: str, country: Optional[str], filters: Optional[DiscoverFilters] = None) -> str:
    q = query.strip()
    parts = [q]

    if filters:
        wm = [_WORK_MODE_TERMS[m] for m in filters.work_modes if m in _WORK_MODE_TERMS]
        if wm:
            parts.append(" OR ".join(wm))

        jt = [_JOB_TYPE_TERMS[t] for t in filters.job_types if t in _JOB_TYPE_TERMS]
        if jt:
            parts.append(" OR ".join(jt))

        exp = [_EXP_TERMS[e] for e in filters.experience_levels if e in _EXP_TERMS]
        if exp:
            parts.append(" OR ".join(exp))

    if country:
        parts.append(f'"{country}"')
    # Bias toward direct postings; subtract obvious noise.
    parts.append('(jobs OR hiring OR careers OR "apply now")')
    parts.append('-"top 10" -"directory" -"news"')
    return " ".join(parts)


def _passes_filters(job: dict, filters: DiscoverFilters) -> bool:
    """Soft post-filter using extracted work_mode and employment_type fields."""
    # ── work_mode filter ──────────────────────────────────────────────────────
    if filters.work_modes:
        extracted_mode = (job.get("work_mode") or "").lower()
        if extracted_mode and extracted_mode in {"remote", "hybrid", "onsite"}:
            if extracted_mode not in filters.work_modes:
                return False
        # If the LLM didn't extract a mode, let the result through (query-level
        # filtering already biased the search; don't over-discard).

    # ── job_type filter ───────────────────────────────────────────────────────
    if filters.job_types:
        emp = (job.get("employment_type") or "").lower()
        if emp:
            _EMP_KEYWORDS: dict[str, tuple[str, ...]] = {
                "full_time": ("full-time", "full time", "permanent"),
                "part_time": ("part-time", "part time"),
                "contract": ("contract", "contractor", "temp"),
                "internship": ("intern", "internship", "trainee"),
                "freelance": ("freelance", "freelancer", "gig"),
            }
            matched = False
            for jtype in filters.job_types:
                if any(kw in emp for kw in _EMP_KEYWORDS.get(jtype, ())):
                    matched = True
                    break
            if not matched:
                return False

    return True


def run_discovery(
    run_id: str,
    query: str,
    country: Optional[str],
    max_results: int,
    filters: Optional[DiscoverFilters] = None,
) -> Iterator[dict]:
    """Generator yielding SSE-shaped events. Persists rows as it goes."""
    cap = int(os.getenv("SCRAPER_MAX_RESULTS_CAP", "50"))
    max_results = max(1, min(max_results, cap))
    filters = filters or DiscoverFilters()

    total_found = 0
    total_kept = 0
    total_inserted = 0
    error: Optional[str] = None

    active_labels: list[str] = []
    for m in filters.work_modes:
        active_labels.append(m.replace("_", "-"))
    for t in filters.job_types:
        active_labels.append(t.replace("_", "-"))
    for e in filters.experience_levels:
        active_labels.append(e)
    if filters.date_posted != "any":
        active_labels.append(f"last {filters.date_posted}")

    summary_suffix = f" [{', '.join(active_labels)}]" if active_labels else ""
    yield {"type": "log", "message": f"Starting discovery for '{query}'{(' in ' + country) if country else ''}{summary_suffix}"}

    try:
        search_query = _build_query(query, country, filters)
        timelimit = _DATE_TIMELIMIT.get(filters.date_posted)

        with DDGS() as ddgs:
            # Pull a wider net than max_results so classification can be picky.
            results = ddgs.text(search_query, max_results=max_results * 4, timelimit=timelimit)

            for result in results:
                if total_kept >= max_results:
                    break

                total_found += 1
                url = (result.get("href") or "").strip()
                title = (result.get("title") or "").strip()
                snippet = (result.get("body") or "").strip()

                if not url or not title:
                    continue

                # 1. Cheap heuristic prefilter
                if not heuristic_prefilter(url, title, snippet):
                    continue

                domain = urlparse(url).netloc
                yield {"type": "log", "message": f"Classifying {domain}..."}

                # 2. LLM classification
                label = classify_result(query, url, title, snippet)
                if label not in ("direct_job_posting", "careers_page"):
                    yield {"type": "log", "message": f"Skipped ({label}): {domain}"}
                    continue

                # 3. Fetch + extract
                page_text = fetch_page(url)
                if not page_text:
                    yield {"type": "log", "message": f"Fetch failed: {domain}"}
                    continue

                job = extract_job(url, page_text)
                if not job:
                    yield {"type": "log", "message": f"No structured data: {domain}"}
                    continue

                job["posting_classification"] = label
                if country:
                    job.setdefault("country", country)

                # 4. Soft post-filter against requested job_types
                if not _passes_filters(job, filters):
                    yield {"type": "log", "message": f"Filtered out (type mismatch): {domain}"}
                    continue

                # 5. Persist
                ok = upsert_job(job, run_id)
                if ok:
                    total_kept += 1
                    total_inserted += 1
                    yield {
                        "type": "job",
                        "data": {
                            "title": job.get("title"),
                            "company": job.get("company"),
                            "url": job.get("canonical_url"),
                            "location": job.get("location"),
                            "work_mode": job.get("work_mode"),
                            "employment_type": job.get("employment_type"),
                            "experience_level": job.get("experience_level"),
                            "tags": job.get("tags") or [],
                            "confidence": job.get("extraction_confidence"),
                            "hiring_email": job.get("hiring_email"),
                        },
                    }
                else:
                    yield {"type": "log", "message": f"Persist failed: {domain}"}

                # Be polite.
                time.sleep(0.15)

    except Exception as e:
        error = str(e)
        yield {"type": "error", "message": error}

    finish_run(
        run_id,
        total_found=total_found,
        total_kept=total_kept,
        total_inserted=total_inserted,
        error=error,
    )
    yield {
        "type": "done",
        "summary": {
            "found": total_found,
            "kept": total_kept,
            "inserted": total_inserted,
        },
    }
