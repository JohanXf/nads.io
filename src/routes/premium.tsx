import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Check, Crown } from "lucide-react";

export const Route = createFileRoute("/premium")({
  component: PremiumPage,
  head: () => ({
    meta: [
      { title: "Premium — nads.io" },
      { name: "description", content: "Unlock unlimited links, analytics, and custom themes with nads.io Premium." },
    ],
  }),
});

const tiers = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    features: [
      "Custom username & bio",
      "Up to 5 links",
      "Profile view counter",
      "Light & dark mode",
    ],
    cta: "Current plan",
    highlight: false,
  },
  {
    name: "Premium",
    price: "$5",
    cadence: "/month",
    features: [
      "Custom profile banner",
      "Built-in music player with timeline & visualizer",
      "Animated glowing ring around avatar",
      "Verified Crown badge",
      "Realtime analytics dashboard",
      "Priority support",
    ],
    cta: "Upgrade to Premium",
    highlight: true,
  },
];

function PremiumPage() {
  return (
    <div className="min-h-screen bg-hero">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-5 py-16">
        <div className="text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card-glass px-4 py-1.5 text-xs">
            <Crown className="h-3.5 w-3.5" /> nads.io Premium
          </div>
          <h1 className="mt-6 font-display text-5xl font-semibold leading-tight sm:text-6xl">
            Go further with <span className="text-gradient">Premium</span>.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Everything you need to grow your audience and own your bio.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`rounded-3xl border p-8 ${
                t.highlight ? "border-foreground bg-card-glass shadow-card" : "border-border bg-card-glass/60"
              }`}
            >
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{t.name}</p>
              <p className="mt-3 font-display text-5xl font-semibold">
                {t.price}
                <span className="font-body text-sm font-normal text-muted-foreground"> {t.cadence}</span>
              </p>
              <ul className="mt-6 space-y-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 text-foreground" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                disabled={!t.highlight}
                className={`mt-8 h-12 w-full ${t.highlight ? "bg-gradient-primary shadow-glow" : ""}`}
                variant={t.highlight ? "default" : "outline"}
              >
                {t.cta}
              </Button>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Questions? <Link to="/help" className="underline">Visit Help</Link>
        </p>
      </main>
    </div>
  );
}
