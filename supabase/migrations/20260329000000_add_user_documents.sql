CREATE TABLE IF NOT EXISTS public.user_documents (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  file_name text NOT NULL,
  r2_object_key text NOT NULL UNIQUE,
  content_type text NOT NULL,
  size bigint NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Turn on row level security
ALTER TABLE public.user_documents ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert their own documents"
  ON public.user_documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own documents"
  ON public.user_documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents"
  ON public.user_documents FOR DELETE
  USING (auth.uid() = user_id);

-- Create a storage index for quick lookups
CREATE INDEX idx_user_documents_user_id ON public.user_documents(user_id);
