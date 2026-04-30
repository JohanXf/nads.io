-- Fix: prevent public listing of avatars bucket while still allowing direct access
-- via public CDN URLs (public buckets bypass RLS for individual object reads via public URL).
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;

-- Restrict SELECT (which controls listing) to only the file owner.
-- Public profile pages will continue working because they use the public CDN URL,
-- which does not go through RLS.
CREATE POLICY "Users can read own avatar objects"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (auth.uid())::text = (storage.foldername(name))[1]
);

-- Fix: revoke EXECUTE on SECURITY DEFINER functions from anon/authenticated roles.
-- handle_new_user is only invoked by the auth trigger (runs as postgres), and
-- handle_updated_at is only invoked by table triggers — neither should be callable via the API.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_updated_at() FROM anon, authenticated, public;