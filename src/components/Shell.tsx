import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  Leaf,
  Menu,
  X,
  Home,
  CalendarDays,
  ClipboardList,
  Clock,
  User,
  PanelLeftClose,
  PanelLeftOpen,
  type LucideIcon,
} from "lucide-react";

function Brand({ collapsed }: { collapsed?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
        <Leaf className="h-4 w-4" />
      </span>
      {!collapsed && <span className="font-serif text-xl">RuangPulih</span>}
    </Link>
  );
}

type NavItem = { label: string; to?: string; icon: LucideIcon };

const items: NavItem[] = [
  { label: "Beranda", to: "/", icon: Home },
  { label: "Jadwal", to: "/jadwal", icon: CalendarDays },
  { label: "Daftar", to: "/daftar", icon: ClipboardList },
  { label: "Status", to: "/status", icon: Clock },
  { label: "Profil", icon: User },
];

export function Shell({ nav, children }: { nav: string[]; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(window.localStorage.getItem("rp-sidebar") === "mini");
  }, []);
  const toggle = (v: boolean) => {
    setCollapsed(v);
    window.localStorage.setItem("rp-sidebar", v ? "mini" : "full");
  };

  const visible = items.filter((i) => nav.includes(i.label));

  const navLinks = (mini: boolean) => (
    <nav className="flex flex-col gap-1">
      {visible.map((item) => {
        const Icon = item.icon;
        const base = mini
          ? "group relative grid h-10 w-10 place-items-center rounded-xl transition"
          : "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition";
        const active = "bg-primary/10 font-semibold text-foreground";
        const inactive = "text-muted-foreground hover:bg-muted hover:text-foreground";
        const tooltip = mini && (
          <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg border bg-popover px-2.5 py-1.5 text-xs font-medium text-popover-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100">
            {item.label}
          </span>
        );
        if (!item.to) {
          return (
            <span key={item.label} className={`${base} cursor-pointer ${inactive}`}>
              <Icon className="h-4 w-4 shrink-0" />
              {!mini && item.label}
              {tooltip}
            </span>
          );
        }
        return (
          <Link
            key={item.label}
            to={item.to}
            activeOptions={{ exact: item.to === "/" }}
            activeProps={{ className: `${base} ${active}` }}
            inactiveProps={{ className: `${base} ${inactive}` }}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {!mini && item.label}
            {tooltip}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen lg:flex">
      {/* Sidebar (desktop) — fixed di kiri, bisa diminimize */}
      <aside
        className={`sticky top-0 hidden h-screen shrink-0 flex-col justify-between border-r bg-card/60 py-6 transition-[width] duration-200 lg:flex ${
          collapsed ? "w-20 items-center px-3" : "w-64 px-5"
        }`}
      >
        <div className={collapsed ? "flex w-full flex-col items-center" : undefined}>
          <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
            <Brand collapsed={collapsed} />
            {!collapsed && (
              <button
                type="button"
                aria-label="Minimalkan sidebar"
                onClick={() => toggle(true)}
                className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>
            )}
          </div>
          {collapsed && (
            <button
              type="button"
              aria-label="Perluas sidebar"
              onClick={() => toggle(false)}
              className="mt-3 grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <PanelLeftOpen className="h-4 w-4" />
            </button>
          )}
          {!collapsed && <div className="mt-6" />}
          <div className={collapsed ? "mt-6" : undefined}>{navLinks(collapsed)}</div>
        </div>
        {!collapsed && (
          <p className="px-3 text-[11px] leading-relaxed text-muted-foreground">
            RuangPulih · Fakultas Kedokteran UPN "Veteran" Jakarta
          </p>
        )}
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b bg-background/85 px-5 py-3 backdrop-blur lg:hidden">
        <button
          type="button"
          aria-label="Buka menu"
          onClick={() => setOpen(!open)}
          className="grid h-9 w-9 place-items-center rounded-xl border bg-card"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
        <Brand />
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-x-0 top-[57px] z-30 border-b bg-background px-5 py-4 lg:hidden">
          {navLinks(false)}
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <main className="min-w-0">{children}</main>
        <footer className="mt-20 border-t py-8 text-center text-xs text-muted-foreground">
          RuangPulih · Fakultas Kedokteran UPN "Veteran" Jakarta · Konseling umum, non-medis
        </footer>
      </div>
    </div>
  );
}

export function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 font-serif text-4xl">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

const tone: Record<string, string> = {
  Menunggu: "bg-warning/20 text-accent-foreground",
  Pending: "bg-warning/20 text-accent-foreground",
  Diterima: "bg-secondary text-secondary-foreground",
  Berlangsung: "bg-primary text-primary-foreground",
  Selesai: "bg-muted text-muted-foreground",
  Ditolak: "bg-destructive/15 text-destructive",
};
export function Badge({ s }: { s: string }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${tone[s] ?? "bg-muted"}`}>{s}</span>;
}
