CREATE TABLE public.inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL CHECK (kind IN ('contact','demo')),
  full_name text NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 120),
  email text NOT NULL CHECK (char_length(email) <= 255),
  company text NOT NULL CHECK (char_length(company) <= 160),
  phone text CHECK (char_length(phone) <= 40),
  job_title text CHECK (char_length(job_title) <= 120),
  country text CHECK (char_length(country) <= 80),
  volume text CHECK (char_length(volume) <= 60),
  services text[] NOT NULL DEFAULT '{}',
  integration text CHECK (char_length(integration) <= 2000),
  message text CHECK (char_length(message) <= 4000),
  language text NOT NULL DEFAULT 'en',
  consent boolean NOT NULL CHECK (consent = true),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.inquiries TO anon, authenticated;
GRANT ALL ON public.inquiries TO service_role;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit an inquiry" ON public.inquiries FOR INSERT TO anon, authenticated WITH CHECK (consent = true);