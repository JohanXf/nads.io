import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { BarChart3, Eye, MousePointerClick, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/analytics")({
  component: AnalyticsPage,
  head: () => ({
    meta: [
      { title: "Analytics — nads.io" },
      { name: "description", content: "Track profile views and link clicks for your nads.io page." },
    ],
  }),
});

const stats = [
  { label: "Profile views", value: "—", icon: Eye },
  { label: "Link clicks", value: "—", icon: MousePointerClick },
  { label: "Click-through rate", value: "—", icon: TrendingUp },
];

function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-hero">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-5 py-12">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-6 w-6" />
          <h1 className="font-display text-4xl font-semibold">Analytics</h1>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          A snapshot of how your nads.io page is performing.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card-glass p-6">
              <s.icon className="h-5 w-5" />
              <p className="mt-4 font-display text-3xl font-semibold">{s.value}</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-dashed border-border bg-card-glass/60 p-10 text-center">
          <p className="font-display text-xl">Detailed analytics coming soon</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Per-link clicks, referrers, and geography are part of <span className="font-semibold">Premium</span>.
          </p>
        </div>
      </main>
    </div>
  );
}
