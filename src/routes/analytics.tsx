import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3, Eye, Link2, Radio, Sparkles } from "lucide-react";

export const Route = createFileRoute("/analytics")({
  component: AnalyticsPage,
  head: () => ({
    meta: [
      { title: "Analytics — nads.io" },
      { name: "description", content: "Realtime profile views and link stats for your nads.io page." },
    ],
  }),
});

type Profile = {
  id: string;
  username: string;
  view_count: number | null;
  is_premium: boolean | null;
};

function AnalyticsPage() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [linkCount, setLinkCount] = useState<number>(0);
  const [pulse, setPulse] = useState(false);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (!user) return;
    let active = true;

    (async () => {
      const { data: p } = await supabase
        .from("profiles")
        .select("id, username, view_count, is_premium")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!active || !p) return;
      setProfile(p as Profile);

      const { count } = await supabase
        .from("links")
        .select("id", { count: "exact", head: true })
        .eq("profile_id", p.id);
      if (active) setLinkCount(count ?? 0);

      const channel = supabase
        .channel(`analytics:${p.id}`)
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "profiles", filter: `id=eq.${p.id}` },
          (payload) => {
            const next = payload.new as Profile;
            setProfile((prev) => (prev ? { ...prev, ...next } : next));
            setPulse(true);
            setTimeout(() => setPulse(false), 600);
          },
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "links", filter: `profile_id=eq.${p.id}` },
          async () => {
            const { count: c } = await supabase
              .from("links")
              .select("id", { count: "exact", head: true })
              .eq("profile_id", p.id);
            setLinkCount(c ?? 0);
          },
        )
        .subscribe((status) => {
          if (status === "SUBSCRIBED") setLive(true);
        });

      return () => {
        supabase.removeChannel(channel);
      };
    })();

    return () => {
      active = false;
    };
  }, [user]);

  return (
    <div className="min-h-screen bg-hero">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-5 py-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-6 w-6" />
            <h1 className="font-display text-4xl font-semibold">Analytics</h1>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border border-border bg-card-glass px-3 py-1 text-[11px] font-medium ${
              live ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            <Radio className={`h-3 w-3 ${live ? "text-emerald-500" : ""}`} />
            {live ? "Live" : "Connecting…"}
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Realtime — these numbers update the moment something happens.
        </p>

        {loading ? (
          <p className="mt-10 text-sm text-muted-foreground">Loading…</p>
        ) : !user ? (
          <div className="mt-10 rounded-2xl border border-border bg-card-glass p-8 text-center">
            <p className="font-display text-xl">Sign in to view analytics</p>
            <Link to="/login" className="mt-4 inline-block text-sm text-primary underline">
              Go to login →
            </Link>
          </div>
        ) : !profile ? (
          <div className="mt-10 rounded-2xl border border-border bg-card-glass p-8 text-center">
            <p className="font-display text-xl">Set up your profile first</p>
            <Link to="/setup" className="mt-4 inline-block text-sm text-primary underline">
              Open setup →
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <StatCard
                icon={Eye}
                label="Profile views"
                value={profile.view_count ?? 0}
                pulse={pulse}
              />
              <StatCard icon={Link2} label="Links published" value={linkCount} />
              <StatCard
                icon={Sparkles}
                label="Plan"
                value={profile.is_premium ? "Premium" : "Free"}
              />
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-card-glass p-5">
              <p className="font-display text-lg">Your page</p>
              <Link
                to="/$username"
                params={{ username: profile.username }}
                className="mt-1 inline-block text-sm text-primary hover:underline"
              >
                nads.io/{profile.username}
              </Link>
            </div>

            {!profile.is_premium && (
              <div className="mt-6 rounded-2xl border border-dashed border-border bg-card-glass/60 p-8 text-center">
                <p className="font-display text-xl">Per-link clicks & referrers</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Available with <Link to="/premium" className="font-semibold underline">Premium</Link>.
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  pulse = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  pulse?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-border bg-card-glass p-6 transition-all ${
        pulse ? "ring-2 ring-foreground/40 scale-[1.02]" : ""
      }`}
    >
      <Icon className="h-5 w-5" />
      <p className="mt-4 font-display text-3xl font-semibold tabular-nums">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
}
