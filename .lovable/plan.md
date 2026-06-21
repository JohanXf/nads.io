## Heads up

Removing both email and Google sign-in leaves the app with **no way for anyone to authenticate**. Every user-scoped feature breaks:

- `/setup` — needs a signed-in user to create/edit a profile
- `/settings` — edits the current user's profile
- `/analytics` — shows the current user's view stats
- `/premium` — gated by `profiles.is_premium`
- `/$username` — read-only public profile page (this one keeps working)

The database still has `profiles`, `links`, `profile_views` tables with RLS scoped to `auth.uid()`. With no auth, no one can write to them. The only thing the public site can still do is **read public profile pages by username**.

## What this plan does

1. **Delete `src/routes/login.tsx`** and remove the `lovable.auth.signInWithOAuth` Google flow.
2. **Delete `src/context/AuthContext.tsx`** and strip every `useAuth`, `signOut`, `Link to="/login"` reference from:
   - `src/routes/__root.tsx`, `index.tsx`, `setup.tsx`, `settings.tsx`, `analytics.tsx`, `premium.tsx`
   - `src/components/SiteHeader.tsx`, `src/components/AppSidebar.tsx`
3. **Delete the now-unusable routes**: `setup.tsx`, `settings.tsx`, `analytics.tsx`, `premium.tsx` (they're meaningless without a session).
4. **Rebuild `/` (index)** as a public landing that only links to existing public username pages — no "Get started / Sign in" CTAs.
5. **Keep `/$username`** as the only functional app surface.
6. Leave the database schema and RLS untouched. Profile creation, premium grants, link edits would need to be done directly in the Cloud dashboard.

## Confirm before I proceed

This is a destructive change — most of the app goes away. Two saner alternatives:

- **A. Keep Google only, remove email/password** — one-click sign-in, full app still works.
- **B. Hide the login page from visitors** but keep auth wired up, so you can still sign in via a hidden URL to manage profiles.

Reply **"proceed"** to do the full removal as planned, or pick **A** or **B**.