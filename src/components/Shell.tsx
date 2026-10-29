import { Link, useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Leaf } from "lucide-react";

const roles = [
  { to: "/", label: "Mahasiswa" },
  { to: "/konselor", label: "Konselor" },
  { to: "/admin", label: "Admin" },
] as const;

export function Shell({ nav, children }: { nav: string[]; children: ReactNode }) {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground">
              <Leaf className="h-4 w-4" />
            </span>
            <span className="font-serif text-xl">RuangPulih</span>
          </Link>
          <nav className="hidden gap-5 text-sm text-muted-foreground md:flex">
            {nav.map((n, i) => (
              <span key={n} className={i === 0 ? "font-semibold text-foreground" : "hover:text-foreground cursor-pointer"}>{n}</span>
            ))}
          </nav>
          <div className="ml-auto flex rounded-full bg-muted p-1 text-xs">
            {roles.map((r) => (
              <Link key={r.to} to={r.to}
                className={`rounded-full px-3 py-1.5 transition ${pathname === r.to ? "bg-card font-semibold shadow-sm" : "text-muted-foreground"}`}>
                {r.label}
              </Link>
            ))}
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="mt-20 border-t py-8 text-center text-xs text-muted-foreground">
        RuangPulih · Fakultas Kedokteran UPN "Veteran" Jakarta · Konseling umum, non-medis
      </footer>
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
  Diterima: "bg-secondary text-secondary-foreground",
  Berlangsung: "bg-primary text-primary-foreground",
  Selesai: "bg-muted text-muted-foreground",
  Ditolak: "bg-destructive/15 text-destructive",
};
export function Badge({ s }: { s: string }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${tone[s] ?? "bg-muted"}`}>{s}</span>;
}
