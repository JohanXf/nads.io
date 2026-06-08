
-- 1. Prevent users from self-granting premium status
CREATE OR REPLACE FUNCTION public.prevent_premium_self_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.is_premium IS DISTINCT FROM OLD.is_premium THEN
    IF current_setting('role', true) <> 'service_role' THEN
      RAISE EXCEPTION 'Premium status can only be modified by trusted server-side processes';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_prevent_premium_escalation ON public.profiles;
CREATE TRIGGER profiles_prevent_premium_escalation
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.prevent_premium_self_escalation();

-- 2. Enforce safe URL schemes on links at DB level
ALTER TABLE public.links
  ADD CONSTRAINT links_url_safe_scheme CHECK (url ~* '^https?://');

-- 3. Lock down RPCs publicly callable
REVOKE EXECUTE ON FUNCTION public.record_profile_view(TEXT, TEXT) FROM anon, authenticated, public;
DROP FUNCTION IF EXISTS public.increment_profile_views(TEXT);

-- 4. Remove tables from realtime publication (not needed by app)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='profiles') THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE public.profiles';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='links') THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE public.links';
  END IF;
END $$;
