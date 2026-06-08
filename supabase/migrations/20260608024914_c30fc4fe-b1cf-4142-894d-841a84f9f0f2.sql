
REVOKE EXECUTE ON FUNCTION public.prevent_premium_self_escalation() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_updated_at() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.enforce_username_cooldown() FROM anon, authenticated, public;
