import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { AppSidebar, SidebarTrigger } from "@/components/AppSidebar";

export function SiteHeader() {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <>
      <AppSidebar open={open} onClose={() => setOpen(false)} />
      <header className="sticky top-0 z-30 bg-transparent">
        <div className="mx-auto mt-4 flex max-w-5xl items-center justify-between gap-3 px-5">
          <div className="flex items-center gap-2 rounded-full bg-card-glass px-3 py-2">
            <SidebarTrigger open={open} onClick={() => setOpen((v) => !v)} />
            <Link to="/" className="flex items-center gap-2 px-2 font-display text-xl font-bold tracking-tight">
              <span>nads.io</span>
            </Link>
          </div>
          <nav className="flex items-center gap-2 rounded-full bg-card-glass p-1.5">
            <Button size="icon" variant="ghost" onClick={toggle} aria-label="Toggle theme" className="rounded-full">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </nav>
        </div>
      </header>
    </>
  );
}
