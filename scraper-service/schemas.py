"""Pydantic schemas shared across the scraper service."""

from __future__ import annotations

from typing import List, Optional
from pydantic import BaseModel, Field


class ScrapeRunRequest(BaseModel):
    query: str = Field(..., min_length=2, max_length=200)
    country: Optional[str] = Field(default=None, max_length=80)
    max_results: int = Field(default=20, ge=1, le=50)
    user_id: Optional[str] = None


class ScrapeRunResponse(BaseModel):
    run_id: str
    status: str


class ScrapedJob(BaseModel):
    external_id: str
    source: str = "scraped"
    source_type: str = "scraped"
    source_domain: Optional[str] = None
    canonical_url: Optional[str] = None
    title: str
    company: str
    company_logo: Optional[str] = None
    location: Optional[str] = None
    country: Optional[str] = None
    employment_type: Optional[str] = None
    description: str
    salary: Optional[str] = None
    tags: List[str] = []
    apply_url: Optional[str] = None
    posted_at: Optional[str] = None
    closing_at: Optional[str] = None
    hiring_email: Optional[str] = None
    contact_email: Optional[str] = None
    extraction_confidence: float = 0.0
    validation_status: str = "verified"
    posting_classification: Optional[str] = None
    is_active: bool = True
