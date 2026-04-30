import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Settings as SettingsIcon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
  head: () => ({
    meta: [
      { title: "Settings — nads.io" },
      { name: "description", content: "Manage your nads.io account preferences." },
    ],
  }),
});

function SettingsPage() {
  const { theme, toggle } = useTheme();
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-hero">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-5 py-12">
        <div className="flex items-center gap-3">
          <SettingsIcon className="h-6 w-6" />
          <h1 className="font-display text-4xl font-semibold">Settings</h1>
        </div>

        <div className="mt-10 space-y-4">
          <Section title="Appearance" desc="Switch between light and dark mode.">
            <Button onClick={toggle} variant="outline">
              Current: {theme === "dark" ? "Dark" : "Light"} — switch
            </Button>
          </Section>

          <Section title="Account" desc={user?.email ?? "Not signed in"}>
            {user ? (
              <Button variant="outline" onClick={() => signOut()}>Sign out</Button>
            ) : (
              <p className="text-sm text-muted-foreground">Sign in to manage your account.</p>
            )}
          </Section>
        </div>
      </main>
    </div>
  );
}

function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card-glass p-6">
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      {desc && <p className="mt-1 text-sm text-muted-foreground">{desc}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
}
