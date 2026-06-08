
-- 1) Column-level lock on profiles.is_premium
REVOKE UPDATE (is_premium) ON public.profiles FROM authenticated, anon, public;

-- 2) Hide ip_hash from profile_views readers
REVOKE SELECT (ip_hash) ON public.profile_views FROM authenticated, anon, public;
