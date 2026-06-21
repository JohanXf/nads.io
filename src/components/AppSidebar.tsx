import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, X, Home, HelpCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  to: string;
  label: string;
  icon: typeof Home;
}

const items: NavItem[] = [
  { to: "/", label: "Home", icon: Home },
  { to: "/help", label: "Help", icon: HelpCircle },
];

export function SidebarTrigger({ onClick, open }: { onClick: () => void; open: boolean }) {
  return (
    <button
      onClick={onClick}
      aria-label={open ? "Close menu" : "Open menu"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground transition hover:bg-accent/50"
    >
      {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
    </button>
  );
}

export function AppSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm transition-opacity",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-2xl transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b border-sidebar-border px-5 py-4">
          <Link to="/" onClick={onClose} className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight">
            <Sparkles className="h-5 w-5" />
            <span>nads.io</span>
          </Link>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-sidebar-accent"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="px-3 pb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Menu</p>
          <ul className="space-y-1">
            {items.map((it) => {
              const active = pathname === it.to;
              const Icon = it.icon;
              return (
                <li key={it.to}>
                  <Link to={it.to} onClick={onClose}>
                    <span
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition",
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "hover:bg-sidebar-accent/60",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {it.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <p className="px-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            nads.io · v1.0
          </p>
        </div>
      </aside>
    </>
  );
}

export function useSidebarState() {
  const [open, setOpen] = useState(false);
  return { open, setOpen };
}
