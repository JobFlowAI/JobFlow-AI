-- Scraper MVP schema upgrade.
-- Extends job_listings with provenance, confidence, lifecycle, and hiring contact
-- fields, and adds a job_discovery_runs table to track each scrape run.

-- ──────────────────────────────────────────────────────────────────────────────
-- 1. Extend job_listings
-- ──────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.job_listings
  ADD COLUMN IF NOT EXISTS source_type TEXT NOT NULL DEFAULT 'api',
  ADD COLUMN IF NOT EXISTS source_domain TEXT,
  ADD COLUMN IF NOT EXISTS canonical_url TEXT,
  ADD COLUMN IF NOT EXISTS extraction_confidence NUMERIC,
  ADD COLUMN IF NOT EXISTS validation_status TEXT NOT NULL DEFAULT 'verified',
  ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS closing_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS hiring_email TEXT,
  ADD COLUMN IF NOT EXISTS posting_classification TEXT,
  ADD COLUMN IF NOT EXISTS run_id UUID;

-- Backfill provenance fields for existing rows (all are API-sourced today).
UPDATE public.job_listings
SET
  source_type        = COALESCE(source_type, 'api'),
  validation_status  = COALESCE(validation_status, 'verified'),
  is_active          = COALESCE(is_active, TRUE),
  last_seen_at       = COALESCE(last_seen_at, fetched_at),
  last_verified_at   = COALESCE(last_verified_at, fetched_at)
WHERE source_type IS NULL
   OR last_seen_at IS NULL
   OR last_verified_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_job_listings_source_type
  ON public.job_listings(source_type);

CREATE INDEX IF NOT EXISTS idx_job_listings_is_active
  ON public.job_listings(is_active);

CREATE INDEX IF NOT EXISTS idx_job_listings_canonical_url
  ON public.job_listings(canonical_url);

CREATE INDEX IF NOT EXISTS idx_job_listings_run_id
  ON public.job_listings(run_id);

-- ──────────────────────────────────────────────────────────────────────────────
-- 2. job_discovery_runs
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.job_discovery_runs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  query         TEXT NOT NULL,
  country       TEXT,
  max_results   INTEGER NOT NULL DEFAULT 25,
  status        TEXT NOT NULL DEFAULT 'running',
  total_found   INTEGER NOT NULL DEFAULT 0,
  total_kept    INTEGER NOT NULL DEFAULT 0,
  total_inserted INTEGER NOT NULL DEFAULT 0,
  started_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at   TIMESTAMPTZ,
  error         TEXT
);

CREATE INDEX IF NOT EXISTS idx_job_discovery_runs_user_id
  ON public.job_discovery_runs(user_id);

CREATE INDEX IF NOT EXISTS idx_job_discovery_runs_started_at
  ON public.job_discovery_runs(started_at DESC);

ALTER TABLE public.job_discovery_runs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own runs" ON public.job_discovery_runs;
CREATE POLICY "Users read own runs"
  ON public.job_discovery_runs FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role manages runs" ON public.job_discovery_runs;
CREATE POLICY "Service role manages runs"
  ON public.job_discovery_runs FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
