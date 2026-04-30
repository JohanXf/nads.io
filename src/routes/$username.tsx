import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, X, Eye, Crown, Play, Pause, Music } from "lucide-react";

export const Route = createFileRoute("/$username")({
  loader: async ({ params }) => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, username, display_name, bio, avatar_url, view_count, is_premium, banner_url, music_url, music_title")
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
    const desc = profile.bio || `${name} on nads.io`;
    return {
      meta: [
        { title: `${name} — nads.io/${profile.username}` },
        { name: "description", content: desc },
        { property: "og:title", content: `${name} — nads.io` },
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
        <p className="mt-3 text-muted-foreground">This nads.io profile doesn't exist.</p>
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
        <div className="w-full overflow-hidden rounded-3xl border border-border bg-card-glass shadow-3d">
          {profile.is_premium && profile.banner_url && (
            <div className="relative h-32 w-full overflow-hidden">
              <img src={profile.banner_url} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent via-card/40 to-card/80" />
            </div>
          )}
          <div className={`px-6 pt-6 pb-3 ${profile.is_premium && profile.banner_url ? "pt-0 -mt-12 relative" : ""}`}>
            <div className="flex flex-col items-center">
              <div className={`relative ${profile.is_premium ? "premium-glow-ring" : ""}`}>
                <div className="h-24 w-24 overflow-hidden rounded-full bg-gradient-primary shadow-3d-sm ring-4 ring-card">
                  {profile.avatar_url && (
                    <img src={profile.avatar_url} alt={profile.display_name ?? profile.username ?? ""} className="h-full w-full object-cover" />
                  )}
                </div>
                {profile.is_premium && (
                  <span className="absolute -bottom-1 -right-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background shadow-glow ring-2 ring-card">
                    <Crown className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>
              <h1 className="mt-3 font-display text-2xl font-bold leading-tight">{profile.display_name || profile.username}</h1>
              <p className="text-sm text-primary leading-tight">@{profile.username}</p>
              {profile.bio && (
                <p className="max-w-sm text-center text-sm leading-snug text-muted-foreground">
                  {profile.bio}
                </p>
              )}
            </div>

            <div className="mt-3 w-full">
              {links.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground">No links yet.</p>
              ) : (
                <LinkGrid links={links} />
              )}
            </div>
          </div>
        </div>

        <div className="mt-3 w-full rounded-xl border border-border bg-card-glass px-3 py-1.5 shadow-3d-sm">
          <div className="flex items-center justify-center gap-1.5 text-[11px]">
            <Eye className="h-3 w-3 text-primary" />
            <span className="font-semibold">{views.toLocaleString()}</span>
            <span className="text-muted-foreground">{views === 1 ? "profile view" : "profile views"}</span>
          </div>
        </div>

        {profile.is_premium && profile.music_url && (
          <MusicPlayer url={profile.music_url} title={profile.music_title || "Now Playing"} />
        )}


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
            <p className="font-display text-lg font-semibold">Want your own nads.io link?</p>
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
          made on nads.io
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
      className={`group flex items-center justify-center rounded-md border border-border bg-background/50 px-3 py-2.5 text-xs font-medium shadow-3d-sm transition-all hover:-translate-y-0.5 hover:border-primary ${className}`}
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

function fmt(t: number) {
  if (!isFinite(t) || t < 0) t = 0;
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function MusicPlayer({ url, title }: { url: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = (function () {
    const [a] = useState<HTMLAudioElement | null>(() =>
      typeof Audio !== "undefined" ? new Audio(url) : null,
    );
    return a;
  })();
  const [bars, setBars] = useState<number[]>(() => Array.from({ length: 28 }, () => 0.2));

  useEffect(() => {
    if (!audioRef) return;
    const a = audioRef;
    const onTime = () => setCurrent(a.currentTime);
    const onMeta = () => setDuration(a.duration || 0);
    const onEnd = () => setPlaying(false);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("ended", onEnd);
    return () => {
      a.pause();
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("ended", onEnd);
    };
  }, [audioRef]);

  // Animated frequency meter (visual only — random walk while playing)
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setBars((prev) => prev.map(() => 0.15 + Math.random() * 0.85));
    }, 110);
    return () => clearInterval(id);
  }, [playing]);

  const toggle = () => {
    if (!audioRef) return;
    if (playing) {
      audioRef.pause();
      setPlaying(false);
    } else {
      audioRef.play().catch(() => {});
      setPlaying(true);
    }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioRef.currentTime = ratio * duration;
    setCurrent(audioRef.currentTime);
  };

  const progress = duration ? (current / duration) * 100 : 0;

  return (
    <div className="mt-3 w-full rounded-2xl border border-border bg-card-glass p-4 shadow-3d-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
          <Music className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-display text-base font-semibold leading-tight">{title}</div>
          <div className="truncate text-xs text-muted-foreground">Now playing</div>
        </div>
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause" : "Play"}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-foreground text-background shadow-glow transition hover:scale-105"
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-0.5" />}
        </button>
      </div>

      <div className="mt-4 flex items-center gap-3 text-[10px] tabular-nums text-muted-foreground">
        <span>{fmt(current)}</span>
        <div
          onClick={seek}
          className="group relative h-1.5 flex-1 cursor-pointer overflow-hidden rounded-full bg-background/60"
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-primary"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span>{fmt(duration)}</span>
      </div>

      <div className="mt-3 flex h-4 items-end justify-between gap-[2px]">
        {bars.map((h, i) => (
          <span
            key={i}
            className="w-[3px] rounded-full bg-gradient-to-t from-primary/40 to-foreground transition-[height] duration-150 ease-out"
            style={{ height: `${(playing ? h : 0.15) * 100}%` }}
          />
        ))}
      </div>
    </div>
  );
}
