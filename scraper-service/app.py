"""FastAPI entrypoint for the JobFlow-AI scraper microservice."""

from __future__ import annotations

import os
import json
import asyncio
from threading import Thread

from dotenv import load_dotenv
from fastapi import FastAPI, Header, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse

from schemas import ScrapeRunRequest, ScrapeRunResponse
from persistence import create_run
from scraper import run_discovery


load_dotenv()

app = FastAPI(title="JobFlow Scraper Service", version="0.1.0")

# CORS is intentionally restrictive — this service is internal only.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


def _require_internal_token(token: str | None) -> None:
    expected = os.getenv("SCRAPER_INTERNAL_TOKEN")
    if not expected:
        raise HTTPException(500, "SCRAPER_INTERNAL_TOKEN not configured")
    if not token or token != expected:
        raise HTTPException(401, "Invalid internal token")


@app.get("/healthz")
def healthz() -> dict:
    return {"status": "ok"}


@app.post("/scrape/run", response_model=ScrapeRunResponse)
def scrape_run(
    body: ScrapeRunRequest,
    x_internal_token: str | None = Header(default=None, alias="X-Internal-Token"),
) -> ScrapeRunResponse:
    """Create a run row and kick off discovery in a background thread."""
    _require_internal_token(x_internal_token)

    run_id = create_run(
        query=body.query,
        country=body.country,
        max_results=body.max_results,
        user_id=body.user_id,
    )

    def _worker():
        # Drain the generator so persistence side-effects happen.
        for _ in run_discovery(run_id, body.query, body.country, body.max_results):
            pass

    Thread(target=_worker, daemon=True).start()

    return ScrapeRunResponse(run_id=run_id, status="running")


@app.get("/scrape/run/{run_id}/stream")
async def scrape_run_stream(
    run_id: str,
    request: Request,
    x_internal_token: str | None = Header(default=None, alias="X-Internal-Token"),
):
    """Synchronous discovery with SSE streaming.

    NOTE: this runs an independent discovery for streaming UX. For MVP the
    Next.js client uses the POST + polling pattern; this endpoint is provided
    for future SSE-based UIs.
    """
    _require_internal_token(x_internal_token)

    # Re-read query params for the SSE variant.
    query = request.query_params.get("query", "").strip()
    country = request.query_params.get("country") or None
    max_results = int(request.query_params.get("max_results") or "20")
    if not query:
        raise HTTPException(400, "query is required")

    async def event_gen():
        loop = asyncio.get_event_loop()
        gen = run_discovery(run_id, query, country, max_results)
        while True:
            if await request.is_disconnected():
                break
            event = await loop.run_in_executor(None, lambda: next(gen, None))
            if event is None:
                break
            yield {"data": json.dumps(event)}
            if event.get("type") in ("done", "error"):
                break

    return EventSourceResponse(event_gen())
