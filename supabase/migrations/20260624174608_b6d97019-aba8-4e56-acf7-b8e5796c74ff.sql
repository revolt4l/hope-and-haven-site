
CREATE TABLE public.giveaway_winner (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.giveaway_winner TO anon, authenticated;
GRANT ALL ON public.giveaway_winner TO service_role;
ALTER TABLE public.giveaway_winner ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view winner" ON public.giveaway_winner FOR SELECT USING (true);
CREATE POLICY "Anyone can insert winner when none exists" ON public.giveaway_winner FOR INSERT WITH CHECK (
  NOT EXISTS (SELECT 1 FROM public.giveaway_winner)
);

CREATE TABLE public.giveaway_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  score int NOT NULL,
  is_winner boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX giveaway_attempts_phone_idx ON public.giveaway_attempts(phone);
GRANT SELECT, INSERT ON public.giveaway_attempts TO anon, authenticated;
GRANT ALL ON public.giveaway_attempts TO service_role;
ALTER TABLE public.giveaway_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view attempts" ON public.giveaway_attempts FOR SELECT USING (true);
CREATE POLICY "Anyone can insert attempt" ON public.giveaway_attempts FOR INSERT WITH CHECK (true);
