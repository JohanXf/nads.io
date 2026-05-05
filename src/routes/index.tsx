import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight, Link as LinkIcon, Sparkles, Zap, Pencil, Crown, Eye, Music, BarChart3 } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-hero">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-5 pt-14 pb-24 sm:pt-20">
        {/* HERO */}
        <section className="text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card-glass px-3 py-1 text-[11px] text-muted-foreground shadow-3d-sm">
            <Sparkles className="h-3 w-3 text-primary" />
            One link. Everything you are.
          </div>

          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.02] tracking-tight sm:text-7xl">
            Your bio,
            <br />
            <span className="text-gradient">one nads.io link.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-lg text-sm text-muted-foreground sm:text-base">
            Sign in, pick your username, and share every link that matters from one
            beautifully simple page.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            {user ? (
              <Link to="/setup">
                <Button size="lg" className="h-11 rounded-xl bg-gradient-primary px-7 text-sm font-semibold shadow-3d">
                  <Pencil className="mr-2 h-4 w-4" /> Edit your profile
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button size="lg" className="h-11 rounded-xl bg-gradient-primary px-7 text-sm font-semibold shadow-3d">
                  Claim your link <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
            <span className="text-[11px] text-muted-foreground">Free forever · No card required</span>
          </div>

          {/* PROFILE PREVIEW MOCK */}
          <div className="mx-auto mt-14 w-full max-w-sm">
            <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-border bg-card-glass px-2 py-0.5 text-[9px] shadow-3d-sm">
              <Eye className="h-2.5 w-2.5 text-primary" />
              <span className="font-semibold tabular-nums">1,284</span>
              <span className="text-muted-foreground">views</span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border bg-card-glass text-left shadow-3d">
              <div className="relative h-20 w-full overflow-hidden bg-gradient-primary">
                <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-b from-transparent via-card/40 to-card/80" />
              </div>
              <div className="relative -mt-10 px-5 pb-4">
                <div className="flex flex-col items-center">
                  <div className="premium-glow-ring">
                    <div className="h-16 w-16 rounded-full border-4 border-card bg-gradient-primary" />
                  </div>
                  <div className="mt-2 font-display text-lg font-semibold">Your name</div>
                  <div className="-mt-0.5 text-xs text-muted-foreground">@you</div>
                  <p className="mt-1 text-center text-xs text-muted-foreground">
                    Builder. Writer. Creator of cool things.
                  </p>
                </div>

                <div className="mt-3 space-y-1.5">
                  {["My website", "Twitter / X", "Latest project"].map((l) => (
                    <div
                      key={l}
                      className="rounded-lg border border-border bg-background/60 px-4 py-2.5 text-sm font-medium shadow-3d-sm"
                    >
                      {l}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="mt-24 grid gap-4 sm:grid-cols-3">
          {[
            { icon: Zap, title: "60 seconds setup", body: "Sign in, pick a username, you're live." },
            { icon: LinkIcon, title: "Up to 5 links", body: "Curate the links that matter — no clutter." },
            { icon: Sparkles, title: "Yours forever", body: "nads.io/yourname stays yours. Edit anytime." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card-glass p-5 shadow-3d-sm">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-3d-sm">
                <f.icon className="h-4 w-4 text-primary-foreground" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </section>

        {/* PREMIUM TEASER */}
        <section className="mt-16">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card-glass p-6 shadow-3d sm:p-8">
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-md">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary shadow-3d-sm">
                  <Crown className="h-3 w-3" /> Premium · $1/mo
                </div>
                <h2 className="mt-3 font-display text-2xl font-semibold sm:text-3xl">
                  Stand out with <span className="text-gradient">Premium</span>.
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Custom banner, animated profile glow, music player and realtime analytics.
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
                  {[
                    { icon: Sparkles, label: "Custom banner" },
                    { icon: Music, label: "Music player" },
                    { icon: Crown, label: "Glowing avatar" },
                    { icon: BarChart3, label: "Realtime analytics" },
                  ].map((p) => (
                    <span
                      key={p.label}
                      className="inline-flex items-center gap-1 rounded-full border border-border bg-background/60 px-2 py-0.5 text-muted-foreground shadow-3d-sm"
                    >
                      <p.icon className="h-3 w-3 text-primary" />
                      {p.label}
                    </span>
                  ))}
                </div>
              </div>
              <Link to="/premium">
                <Button size="lg" className="h-11 rounded-xl bg-gradient-primary px-6 text-sm font-semibold shadow-3d">
                  Go Premium <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
