-- Migration to add country, category, subcategory, contact_email, and translation fields to job_listings
-- Run this in your Supabase SQL Editor

ALTER TABLE job_listings
  ADD COLUMN IF NOT EXISTS country TEXT,
  ADD COLUMN IF NOT EXISTS category TEXT,
  ADD COLUMN IF NOT EXISTS subcategory TEXT,
  ADD COLUMN IF NOT EXISTS contact_email TEXT,
  ADD COLUMN IF NOT EXISTS original_language TEXT,
  ADD COLUMN IF NOT EXISTS is_translated BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS translated_from TEXT,
  ADD COLUMN IF NOT EXISTS deadline TIMESTAMPTZ;

-- Add indexes for common filter combinations
CREATE INDEX IF NOT EXISTS idx_job_listings_country ON job_listings(country);
CREATE INDEX IF NOT EXISTS idx_job_listings_category ON job_listings(category);
CREATE INDEX IF NOT EXISTS idx_job_listings_subcategory ON job_listings(subcategory);
