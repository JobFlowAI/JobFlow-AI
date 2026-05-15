# JobFlow Scraper Service

Internal-only Python FastAPI microservice that powers job discovery for the JobFlow-AI app. It performs:

1. DuckDuckGo search for a role + country
2. Heuristic + LLM classification (`direct_job_posting`, `careers_page`, `aggregator`, `noise`)
3. Page fetch + LLM-based structured extraction (title, company, dates, salary, hiring email)
4. Upsert into Supabase `job_listings` with provenance + confidence

This service is **not** exposed to the public internet. Calls must include the `X-Internal-Token` header matching `SCRAPER_INTERNAL_TOKEN`.

## Run locally

```bash
cp .env.example .env
# fill in OPENROUTER_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SCRAPER_INTERNAL_TOKEN
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

## Run with Docker

From the repo root:

```bash
docker compose up --build scraper
```

## Endpoints

- `GET /healthz` — liveness probe
- `POST /scrape/run` — start a discovery run, returns `{ run_id }`
  - body: `{ "query": "frontend engineer", "country": "Germany", "max_results": 20, "user_id": "..." }`
- `GET /scrape/run/{run_id}/stream?query=...&country=...&max_results=...` — SSE progress stream (deferred for MVP UI; provided for future use)

All write endpoints require the `X-Internal-Token` header.

## What's intentionally NOT here (deferred)

- Playwright / headless browser rendering
- ATS-vendor-specific adapters (Greenhouse / Lever / Ashby / Workday)
- Re-verification / expiry cron
- Admin review UI for low-confidence rows
