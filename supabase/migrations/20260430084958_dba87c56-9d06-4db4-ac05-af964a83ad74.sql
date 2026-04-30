ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER TABLE public.links REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.links;