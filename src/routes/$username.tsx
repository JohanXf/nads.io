import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, X, Eye } from "lucide-react";

export const Route = createFileRoute("/$username")({
  loader: async ({ params }) => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, username, display_name, bio, avatar_url, view_count")
      .eq("username", params.username.toLowerCase())
      .maybeSingle();

    if (!profile) throw notFound();

    const { data: links } = await supabase
      .from("links")
      .select("id, label, url, position")
      .eq("profile_id", profile.id)
      .order("position");

    return { profile, links: links ?? [] };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [] };
    const { profile } = loaderData;
    const name = profile.display_name || `@${profile.username}`;
    const desc = profile.bio || `${name} on the10ksquad.io`;
    return {
      meta: [
        { title: `${name} — the10ksquad.io/${profile.username}` },
        { name: "description", content: desc },
        { property: "og:title", content: `${name} — the10ksquad.io` },
        { property: "og:description", content: desc },
        ...(profile.avatar_url ? [{ property: "og:image", content: profile.avatar_url }] : []),
      ],
    };
  },
  component: ProfilePage,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-hero px-4">
      <div className="text-center">
        <h1 className="font-display text-5xl font-bold text-gradient">404</h1>
        <p className="mt-3 text-muted-foreground">This the10ksquad.io profile doesn't exist.</p>
        <Link to="/" className="mt-6 inline-block text-primary hover:underline">
          Claim it →
        </Link>
      </div>
    </div>
  ),
});

function ProfilePage() {
  const { profile, links } = Route.useLoaderData();
  const [showClaim, setShowClaim] = useState(true);
  const [views, setViews] = useState<number>(profile.view_count ?? 0);

  useEffect(() => {
    // Avoid double-counting in a single browser session
    const key = `viewed:${profile.username}`;
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");

    (supabase.rpc as any)("increment_profile_views", { _username: profile.username ?? "" })
      .then(({ data, error }: { data: number | null; error: unknown }) => {
        if (!error && typeof data === "number") setViews(data);
      });
  }, [profile.username]);

  return (
    <div className="min-h-screen bg-hero">
      <main className="mx-auto flex max-w-md flex-col items-center px-5 pt-16 pb-12">
        <div className="w-full rounded-3xl border border-border bg-card-glass p-8 shadow-3d">
          <div className="flex flex-col items-center">
            <div className="h-24 w-24 overflow-hidden rounded-full bg-gradient-primary shadow-3d-sm">
              {profile.avatar_url && (
                <img src={profile.avatar_url} alt={profile.display_name ?? profile.username ?? ""} className="h-full w-full object-cover" />
              )}
            </div>
            <h1 className="mt-3 font-display text-2xl font-bold">{profile.display_name || `@${profile.username}`}</h1>
            <p className="text-sm text-primary">@{profile.username}</p>
            {profile.bio && (
              <p className="mt-2 max-w-sm text-center text-sm leading-relaxed text-muted-foreground">
                {profile.bio}
              </p>
            )}
          </div>

          <div className="mt-4 w-full">
            {links.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">No links yet.</p>
            ) : (
              <LinkGrid links={links} />
            )}
          </div>
        </div>

        <div className="mt-3 w-full rounded-xl border border-border bg-card-glass px-3 py-1.5 shadow-3d-sm">
          <div className="flex items-center justify-center gap-1.5 text-[11px]">
            <Eye className="h-3 w-3 text-primary" />
            <span className="font-semibold">{views.toLocaleString()}</span>
            <span className="text-muted-foreground">{views === 1 ? "profile view" : "profile views"}</span>
          </div>
        </div>


        {showClaim && (
          <div className="relative mt-10 w-full rounded-2xl border border-border bg-card-glass p-5 text-center shadow-3d-sm">
            <button
              type="button"
              onClick={() => setShowClaim(false)}
              aria-label="Dismiss"
              className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition hover:bg-background/60 hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
            <p className="font-display text-lg font-semibold">Want your own the10ksquad.io link?</p>
            <p className="mt-1 text-xs text-muted-foreground">Free forever · 60 seconds to set up</p>
            <Link to="/login" className="mt-4 inline-block">
              <Button className="h-11 bg-gradient-primary px-6 shadow-glow">
                Claim your username <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}

        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-1.5 text-xs text-muted-foreground/70 hover:text-foreground"
        >
          <Sparkles className="h-3 w-3" />
          made on the10ksquad.io
        </Link>
      </main>
    </div>
  );
}

type LinkItem = { id: string; label: string; url: string };

function LinkTile({ link, className = "" }: { link: LinkItem; className?: string }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex items-center justify-center rounded-xl border border-border bg-background/50 px-3 py-2.5 text-xs font-medium shadow-3d-sm transition-all hover:-translate-y-0.5 hover:border-primary ${className}`}
    >
      <span className="truncate text-center">{link.label}</span>
    </a>
  );
}

function LinkGrid({ links }: { links: LinkItem[] }) {
  const n = links.length;

  if (n === 1) {
    return <LinkTile link={links[0]} />;
  }

  if (n === 2) {
    return (
      <div className="grid grid-cols-2 gap-3">
        <LinkTile link={links[0]} />
        <LinkTile link={links[1]} />
      </div>
    );
  }

  if (n === 3) {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <LinkTile link={links[0]} />
          <LinkTile link={links[1]} />
        </div>
        <LinkTile link={links[2]} />
      </div>
    );
  }

  if (n === 4) {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-5 gap-3">
          <LinkTile link={links[0]} className="col-span-3" />
          <LinkTile link={links[1]} className="col-span-2" />
        </div>
        <div className="grid grid-cols-5 gap-3">
          <LinkTile link={links[2]} className="col-span-2" />
          <LinkTile link={links[3]} className="col-span-3" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <LinkTile link={links[0]} />
        <LinkTile link={links[1]} />
        <LinkTile link={links[2]} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <LinkTile link={links[3]} />
        <LinkTile link={links[4]} />
      </div>
    </div>
  );
}
