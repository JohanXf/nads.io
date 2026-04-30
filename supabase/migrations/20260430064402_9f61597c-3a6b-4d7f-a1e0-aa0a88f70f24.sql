
-- Add premium fields to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_premium boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS banner_url text,
  ADD COLUMN IF NOT EXISTS music_url text,
  ADD COLUMN IF NOT EXISTS music_title text;

-- Create banners storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('banners', 'banners', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('music', 'music', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for banners
DO $$ BEGIN
  CREATE POLICY "Banners are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'banners');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can upload own banners"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'banners' AND auth.uid()::text = (storage.foldername(name))[1]);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update own banners"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'banners' AND auth.uid()::text = (storage.foldername(name))[1]);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can delete own banners"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'banners' AND auth.uid()::text = (storage.foldername(name))[1]);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- RLS policies for music
DO $$ BEGIN
  CREATE POLICY "Music is publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'music');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can upload own music"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'music' AND auth.uid()::text = (storage.foldername(name))[1]);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update own music"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'music' AND auth.uid()::text = (storage.foldername(name))[1]);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can delete own music"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'music' AND auth.uid()::text = (storage.foldername(name))[1]);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Grant premium status to specific user by email
UPDATE public.profiles
SET is_premium = true
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'bcode6117@gmail.com'
);
