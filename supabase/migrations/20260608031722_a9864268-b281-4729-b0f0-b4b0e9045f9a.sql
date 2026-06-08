
-- Add missing profile-creation trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill missing profiles
INSERT INTO public.profiles (id, display_name, avatar_url)
SELECT u.id,
       COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', split_part(u.email, '@', 1)),
       u.raw_user_meta_data->>'avatar_url'
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL;

-- Temporarily drop the premium guard, grant premium, then reinstall it
ALTER TABLE public.profiles DISABLE TRIGGER profiles_prevent_premium_escalation;

UPDATE public.profiles
SET is_premium = true
WHERE id = (SELECT id FROM auth.users WHERE email = 'bcode6117@gmail.com');

ALTER TABLE public.profiles ENABLE TRIGGER profiles_prevent_premium_escalation;
