
CREATE TABLE public.profile_views (
  profile_id UUID NOT NULL,
  ip_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (profile_id, ip_hash)
);

ALTER TABLE public.profile_views ENABLE ROW LEVEL SECURITY;

-- No client policies: only service role (server) writes/reads. Owners can read their own via separate policy.
CREATE POLICY "Owners can view their own view records"
ON public.profile_views
FOR SELECT
USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = profile_views.profile_id AND profiles.id = auth.uid()));

CREATE OR REPLACE FUNCTION public.record_profile_view(_username text, _ip_hash text)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _profile_id UUID;
  _inserted BOOLEAN := false;
  _count BIGINT;
BEGIN
  SELECT id INTO _profile_id FROM public.profiles WHERE username = lower(_username);
  IF _profile_id IS NULL THEN
    RETURN 0;
  END IF;

  INSERT INTO public.profile_views (profile_id, ip_hash)
  VALUES (_profile_id, _ip_hash)
  ON CONFLICT (profile_id, ip_hash) DO NOTHING;

  GET DIAGNOSTICS _inserted = ROW_COUNT;

  IF _inserted THEN
    UPDATE public.profiles
    SET view_count = view_count + 1
    WHERE id = _profile_id
    RETURNING view_count INTO _count;
  ELSE
    SELECT view_count INTO _count FROM public.profiles WHERE id = _profile_id;
  END IF;

  RETURN COALESCE(_count, 0);
END;
$$;
