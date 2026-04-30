import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { HelpCircle } from "lucide-react";

export const Route = createFileRoute("/help")({
  component: HelpPage,
  head: () => ({
    meta: [
      { title: "Help — nads.io" },
      { name: "description", content: "Frequently asked questions about nads.io." },
    ],
  }),
});

const faqs = [
  { q: "What is nads.io?", a: "A simple bio-link page. One link, all your stuff." },
  { q: "Is it free?", a: "Yes — the core is free forever. Premium unlocks unlimited links and analytics." },
  { q: "Can I change my username?", a: "Yes, once every 7 days." },
  { q: "How many links can I add?", a: "Up to 5 on the free plan, unlimited on Premium." },
];

function HelpPage() {
  return (
    <div className="min-h-screen bg-hero">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-5 py-12">
        <div className="flex items-center gap-3">
          <HelpCircle className="h-6 w-6" />
          <h1 className="font-display text-4xl font-semibold">Help</h1>
        </div>

        <div className="mt-10 space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-border bg-card-glass p-5">
              <summary className="cursor-pointer list-none font-display text-lg font-medium">
                {f.q}
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </main>
    </div>
  );
}
