import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { AppSidebar, SidebarTrigger } from "@/components/AppSidebar";

export function SiteHeader() {
  const { user, signOut } = useAuth();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <>
      <AppSidebar open={open} onClose={() => setOpen(false)} />
      <header className="sticky top-0 z-30 border-b border-border/40 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <SidebarTrigger open={open} onClick={() => setOpen((v) => !v)} />
            <Link to="/" className="flex items-center gap-2 font-display text-2xl font-semibold tracking-tight">
              <span>nads.io</span>
            </Link>
          </div>
          <nav className="flex items-center gap-2">
            <Button size="icon" variant="ghost" onClick={toggle} aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            {user ? (
              <Button size="sm" variant="outline" onClick={() => signOut()}>
                Sign out
              </Button>
            ) : (
              <Link to="/login">
                <Button size="sm" className="bg-gradient-primary">Get started</Button>
              </Link>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}
