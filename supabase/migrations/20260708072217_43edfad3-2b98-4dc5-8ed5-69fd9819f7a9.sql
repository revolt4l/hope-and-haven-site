ALTER TABLE public.giveaway_attempts ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.giveaway_winner ADD COLUMN IF NOT EXISTS email text;