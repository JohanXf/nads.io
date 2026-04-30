import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight, Link as LinkIcon, Sparkles, Zap, Pencil } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-hero">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-5 pt-16 pb-24 sm:pt-24">
        <section className="text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card-glass px-4 py-1.5 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            One link. Everything you are.
          </div>
          <h1 className="mt-6 font-display text-6xl font-semibold leading-[1.02] sm:text-8xl">
            Your bio,
            <br />
            <span className="text-gradient">one nads.io link.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
            Sign in with Google, pick your username, and share every link that matters from a single page.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            {user ? (
              <Link to="/setup">
                <Button size="lg" className="h-12 bg-gradient-primary px-8 text-base shadow-glow">
                  <Pencil className="mr-2 h-4 w-4" /> Edit your profile
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button size="lg" className="h-12 bg-gradient-primary px-8 text-base shadow-glow">
                  Claim your link <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
            <span className="text-xs text-muted-foreground">Free forever · No card required</span>
          </div>

          <div className="mx-auto mt-16 max-w-md rounded-2xl border border-border bg-card-glass p-2 shadow-card">
            <div className="rounded-xl bg-background/60 p-6 text-left">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-primary" />
                <div>
                  <div className="font-semibold">Your name</div>
                  <div className="text-sm text-primary">@you</div>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">Builder. Writer. Creator of cool things.</p>
              <div className="mt-4 space-y-2">
                {["My website", "Twitter / X", "Latest project"].map((l) => (
                  <div key={l} className="rounded-lg border border-border bg-background/50 px-4 py-3 text-sm">
                    {l}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-24 grid gap-5 sm:grid-cols-3">
          {[
            { icon: Zap, title: "60 seconds setup", body: "Google sign-in, pick a username, you're live." },
            { icon: LinkIcon, title: "Up to 5 links", body: "Curate the links that matter most — no clutter." },
            { icon: Sparkles, title: "Yours forever", body: "nads.io/yourname is yours. Edit anytime." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card-glass p-6">
              <f.icon className="h-5 w-5 text-primary" />
              <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
