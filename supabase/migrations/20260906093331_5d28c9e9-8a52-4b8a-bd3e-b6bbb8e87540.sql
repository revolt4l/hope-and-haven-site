CREATE TYPE public.hq_update_status AS ENUM ('pending_review','approved','published','rejected');

CREATE TABLE public.hq_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text,
  original_content text,
  source text NOT NULL DEFAULT 'trem_website',
  source_url text,
  source_id text,
  image_url text,
  content_type text NOT NULL DEFAULT 'news',
  publication_date timestamptz,
  event_date timestamptz,
  event_location text,
  status public.hq_update_status NOT NULL DEFAULT 'pending_review',
  imported_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (source, source_id)
);

GRANT SELECT ON public.hq_updates TO anon;
GRANT SELECT ON public.hq_updates TO authenticated;
GRANT ALL ON public.hq_updates TO service_role;

ALTER TABLE public.hq_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published HQ updates are viewable by everyone"
ON public.hq_updates FOR SELECT
USING (status = 'published');

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_hq_updates_updated_at
BEFORE UPDATE ON public.hq_updates
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_hq_updates_status ON public.hq_updates (status);
CREATE INDEX idx_hq_updates_publication_date ON public.hq_updates (publication_date DESC);