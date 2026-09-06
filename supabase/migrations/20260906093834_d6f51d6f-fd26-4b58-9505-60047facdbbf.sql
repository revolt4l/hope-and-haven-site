ALTER TABLE public.hq_updates
  ADD COLUMN IF NOT EXISTS content_hash text,
  ADD COLUMN IF NOT EXISTS month_key text;

CREATE INDEX IF NOT EXISTS idx_hq_updates_month_key ON public.hq_updates (month_key);
CREATE INDEX IF NOT EXISTS idx_hq_updates_content_type ON public.hq_updates (content_type);

CREATE TABLE public.hq_sync_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  status text NOT NULL DEFAULT 'running',
  items_found integer NOT NULL DEFAULT 0,
  items_created integer NOT NULL DEFAULT 0,
  items_updated integer NOT NULL DEFAULT 0,
  error text
);

GRANT SELECT ON public.hq_sync_runs TO anon;
GRANT SELECT ON public.hq_sync_runs TO authenticated;
GRANT ALL ON public.hq_sync_runs TO service_role;

ALTER TABLE public.hq_sync_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sync runs are viewable by everyone"
ON public.hq_sync_runs FOR SELECT
USING (true);