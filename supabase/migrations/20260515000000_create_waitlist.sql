CREATE TABLE IF NOT EXISTS public.waitlist (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anyone (unauthenticated) to join the waitlist
CREATE POLICY "Anyone can join waitlist"
  ON public.waitlist FOR INSERT
  WITH CHECK (true);

-- Only the service role can read entries (admin only)
CREATE POLICY "Service role can view waitlist"
  ON public.waitlist FOR SELECT
  USING (auth.role() = 'service_role');
