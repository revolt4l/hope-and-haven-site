-- Create testimonies table for public submissions
CREATE TABLE public.testimonies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  testimony TEXT NOT NULL,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.testimonies ENABLE ROW LEVEL SECURITY;

-- Anyone can read approved testimonies
CREATE POLICY "Anyone can view approved testimonies"
  ON public.testimonies FOR SELECT
  USING (is_approved = true);

-- Anyone can submit a testimony (anonymous submissions allowed)
CREATE POLICY "Anyone can submit a testimony"
  ON public.testimonies FOR INSERT
  WITH CHECK (true);