-- Drop the outreach feature.
-- Outreach functionality has been folded into the Find Jobs page,
-- which now sends users straight to Gmail with the scraped hiring email.

DROP TABLE IF EXISTS public.outreach_logs CASCADE;
