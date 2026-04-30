import { Link, useLocation } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Sparkles, Moon, Sun } from "lucide-react";

export function SiteHeader() {
  const { user, signOut } = useAuth();
  const { theme, toggle } = useTheme();
  const { pathname } = useLocation();
  const onSetup = pathname === "/setup";

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="text-gradient">the10ksquad.io</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Button size="icon" variant="ghost" onClick={toggle} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {user ? (
            <>
              {!onSetup && (
                <Link to="/setup">
                  <Button size="sm" variant="ghost">Edit profile</Button>
                </Link>
              )}
              <Button size="sm" variant="outline" onClick={() => signOut()}>
                Sign out
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button size="sm" className="bg-gradient-primary">Get started</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
