"""Supabase persistence for runs and scraped jobs."""

from __future__ import annotations

import os
import hashlib
from datetime import datetime, timezone
from typing import Optional

from supabase import create_client, Client


_client: Client | None = None


def client() -> Client:
    global _client
    if _client is not None:
        return _client
    url = os.environ["SUPABASE_URL"]
    key = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
    _client = create_client(url, key)
    return _client


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _norm(s: Optional[str]) -> str:
    return (s or "").strip().lower()


def make_external_id(job: dict) -> str:
    """Stable dedupe key for scraped jobs.

    Prefer canonical_url. Fall back to a hash of (domain + title + company + location).
    """
    canonical = (job.get("canonical_url") or "").strip()
    if canonical:
        return hashlib.sha1(canonical.encode("utf-8")).hexdigest()[:24]

    key = "|".join([
        _norm(job.get("source_domain")),
        _norm(job.get("title")),
        _norm(job.get("company")),
        _norm(job.get("location")),
    ])
    return hashlib.sha1(key.encode("utf-8")).hexdigest()[:24]


# ──────────────────────────────────────────────────────────────────────────────
# Runs
# ──────────────────────────────────────────────────────────────────────────────

def create_run(
    query: str,
    country: Optional[str],
    max_results: int,
    user_id: Optional[str],
    filters: Optional[dict] = None,
) -> str:
    row: dict = {
        "query": query,
        "country": country,
        "max_results": max_results,
        "user_id": user_id,
        "status": "running",
    }
    if filters:
        row["filters"] = filters
    try:
        res = client().table("job_discovery_runs").insert(row).execute()
        return res.data[0]["id"]
    except Exception:
        # Fallback: retry without filters if the column doesn't exist yet.
        row.pop("filters", None)
        res = client().table("job_discovery_runs").insert(row).execute()
        return res.data[0]["id"]


def update_run(run_id: str, **fields) -> None:
    client().table("job_discovery_runs").update(fields).eq("id", run_id).execute()


def finish_run(run_id: str, *, total_found: int, total_kept: int, total_inserted: int, error: Optional[str] = None) -> None:
    update_run(
        run_id,
        status="failed" if error else "done",
        total_found=total_found,
        total_kept=total_kept,
        total_inserted=total_inserted,
        finished_at=_now(),
        error=error,
    )


# ──────────────────────────────────────────────────────────────────────────────
# Jobs
# ──────────────────────────────────────────────────────────────────────────────

def upsert_job(job: dict, run_id: str) -> bool:
    """Upsert into job_listings keyed on (source, external_id). Returns True if written."""
    external_id = make_external_id(job)
    now = _now()

    row = {
        "external_id": external_id,
        "source": "scraped",
        "source_type": "scraped",
        "source_domain": job.get("source_domain"),
        "canonical_url": job.get("canonical_url"),
        "title": job.get("title"),
        "company": job.get("company"),
        "company_logo": job.get("company_logo"),
        "location": job.get("location"),
        "country": job.get("country"),
        "employment_type": job.get("employment_type"),
        "description": job.get("description"),
        "salary": job.get("salary"),
        "tags": job.get("tags") or [],
        "apply_url": job.get("apply_url"),
        "posted_at": job.get("posted_at"),
        "closing_at": job.get("closing_at"),
        "deadline": job.get("closing_at"),
        "hiring_email": job.get("hiring_email"),
        "contact_email": job.get("hiring_email") or job.get("contact_email"),
        "extraction_confidence": job.get("extraction_confidence"),
        "validation_status": "verified",
        "posting_classification": job.get("posting_classification"),
        "is_active": True,
        "last_seen_at": now,
        "last_verified_at": now,
        "fetched_at": now,
        "run_id": run_id,
    }
    # Drop None values so we don't overwrite existing fields with NULL.
    row = {k: v for k, v in row.items() if v is not None}

    try:
        client().table("job_listings").upsert(
            row,
            on_conflict="source,external_id",
        ).execute()
        return True
    except Exception as e:
        print(f"[persistence] upsert failed: {e}")
        return False
