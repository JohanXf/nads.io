-- Add username_changed_at column to track when username was last changed
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS username_changed_at timestamptz;

-- Validation trigger: enforce 7-day cooldown on username change
CREATE OR REPLACE FUNCTION public.enforce_username_cooldown()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only check when username actually changes
  IF NEW.username IS DISTINCT FROM OLD.username THEN
    IF OLD.username_changed_at IS NOT NULL
       AND OLD.username_changed_at > (now() - interval '7 days') THEN
      RAISE EXCEPTION 'Username can only be changed once every 7 days. Try again after %',
        (OLD.username_changed_at + interval '7 days')
        USING ERRCODE = 'check_violation';
    END IF;
    NEW.username_changed_at := now();
  END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.enforce_username_cooldown() FROM anon, authenticated, public;

DROP TRIGGER IF EXISTS profiles_username_cooldown ON public.profiles;
CREATE TRIGGER profiles_username_cooldown
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.enforce_username_cooldown();