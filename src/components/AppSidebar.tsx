import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, X, User, Crown, BarChart3, Settings, LogOut, LogIn, Home, HelpCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

interface NavItem {
  to: string;
  label: string;
  icon: typeof User;
  badge?: string;
  authRequired?: boolean;
}

const items: NavItem[] = [
  { to: "/", label: "Home", icon: Home },
  { to: "/setup", label: "Edit profile", icon: User, authRequired: true },
  { to: "/premium", label: "Premium", icon: Crown, badge: "PRO" },
  { to: "/analytics", label: "Analytics", icon: BarChart3, authRequired: true },
  { to: "/settings", label: "Settings", icon: Settings, authRequired: true },
  { to: "/help", label: "Help", icon: HelpCircle },
];

export function SidebarTrigger({ onClick, open }: { onClick: () => void; open: boolean }) {
  return (
    <button
      onClick={onClick}
      aria-label={open ? "Close menu" : "Open menu"}
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card-glass transition hover:bg-accent/40"
    >
      {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </button>
  );
}

export function AppSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, signOut } = useAuth();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm transition-opacity",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      {/* Drawer */}
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

        {user && (
          <div className="border-b border-sidebar-border px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Signed in</p>
            <p className="mt-1 truncate text-sm font-medium">{user.email}</p>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="px-3 pb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Menu</p>
          <ul className="space-y-1">
            {items.map((it) => {
              const disabled = it.authRequired && !user;
              const active = pathname === it.to;
              const Icon = it.icon;
              const inner: ReactNode = (
                <span
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm transition",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "hover:bg-sidebar-accent/60",
                    disabled && "cursor-not-allowed opacity-40",
                  )}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    {it.label}
                  </span>
                  {it.badge && (
                    <span className="rounded-full bg-foreground px-2 py-0.5 font-mono text-[9px] font-semibold tracking-wider text-background">
                      {it.badge}
                    </span>
                  )}
                </span>
              );
              return (
                <li key={it.to}>
                  {disabled ? (
                    <div title="Sign in required">{inner}</div>
                  ) : (
                    <Link to={it.to} onClick={onClose}>
                      {inner}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-sidebar-border p-3">
          {user ? (
            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={async () => {
                await signOut();
                onClose();
              }}
            >
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          ) : (
            <Link to="/login" onClick={onClose}>
              <Button className="w-full justify-start gap-3 bg-gradient-primary">
                <LogIn className="h-4 w-4" /> Sign in
              </Button>
            </Link>
          )}
          <p className="mt-3 px-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
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
