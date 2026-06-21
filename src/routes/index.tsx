import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { LinkIcon, Sparkles, Zap, Eye } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-hero">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-5 pt-14 pb-24 sm:pt-20">
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
            Browse beautifully simple bio link pages on nads.io.
          </p>

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

                <div className="mt-3 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    {["Link 1", "Link 2"].map((l) => (
                      <div
                        key={l}
                        className="flex items-center justify-center rounded-md border border-border bg-background/50 px-3 py-2.5 text-xs font-medium shadow-3d-sm"
                      >
                        {l}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center rounded-md border border-border bg-background/50 px-3 py-2.5 text-xs font-medium shadow-3d-sm">
                    Link 3
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-24 grid gap-4 sm:grid-cols-3">
          {[
            { icon: Zap, title: "Beautifully simple", body: "Clean profile pages, no clutter." },
            { icon: LinkIcon, title: "Curated links", body: "Only the links that matter." },
            { icon: Sparkles, title: "Always yours", body: "nads.io/yourname stays yours." },
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

        <section className="mt-16 text-center">
          <Link to="/help" className="text-sm text-primary underline underline-offset-4">
            Need help?
          </Link>
        </section>
      </main>
    </div>
  );
}
