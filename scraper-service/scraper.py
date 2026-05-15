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


def _build_query(query: str, country: Optional[str]) -> str:
    q = query.strip()
    parts = [q]
    if country:
        parts.append(f'"{country}"')
    # Bias toward direct postings; subtract obvious noise.
    parts.append('(jobs OR hiring OR careers OR "apply now")')
    parts.append('-"top 10" -"directory" -"news"')
    return " ".join(parts)


def run_discovery(
    run_id: str,
    query: str,
    country: Optional[str],
    max_results: int,
) -> Iterator[dict]:
    """Generator yielding SSE-shaped events. Persists rows as it goes."""
    cap = int(os.getenv("SCRAPER_MAX_RESULTS_CAP", "50"))
    max_results = max(1, min(max_results, cap))

    total_found = 0
    total_kept = 0
    total_inserted = 0
    error: Optional[str] = None

    yield {"type": "log", "message": f"Starting discovery for '{query}'" + (f" in {country}" if country else "")}

    try:
        search_query = _build_query(query, country)

        with DDGS() as ddgs:
            # Pull a wider net than max_results so classification can be picky.
            results = ddgs.text(search_query, max_results=max_results * 4)

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

                # 4. Persist
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
