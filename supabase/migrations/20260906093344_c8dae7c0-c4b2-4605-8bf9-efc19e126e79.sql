CREATE POLICY "Signed-in users can view all HQ updates"
ON public.hq_updates FOR SELECT
TO authenticated
USING (true);