-- Drop the old select policy
DROP POLICY "Anyone can view approved testimonies" ON public.testimonies;

-- Allow viewing all testimonies (no approval needed)
CREATE POLICY "Anyone can view all testimonies"
  ON public.testimonies FOR SELECT
  USING (true);

-- Set default is_approved to true so they show immediately
ALTER TABLE public.testimonies ALTER COLUMN is_approved SET DEFAULT true;