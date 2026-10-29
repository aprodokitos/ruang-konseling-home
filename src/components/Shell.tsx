import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Leaf, Menu, X } from "lucide-react";

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground">
        <Leaf className="h-4 w-4" />
      </span>
      <span className="font-serif text-xl">RuangPulih</span>
    </Link>
  );
}

export function Shell({ nav, children }: { nav: string[]; children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const navLinks = (
    <nav className="flex flex-col gap-1">
      {nav.map((n, i) => (
        <span
          key={n}
          className={`rounded-xl px-3 py-2 text-sm transition cursor-pointer ${
            i === 0
              ? "bg-primary/10 font-semibold text-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          {n}
        </span>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen lg:flex">
      {/* Sidebar (desktop) */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col justify-between border-r bg-card/60 px-5 py-6 lg:flex">
        <div>
          <Brand />
          <p className="mt-6 mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Menu</p>
          {navLinks}
        </div>
        <p className="px-3 text-[11px] leading-relaxed text-muted-foreground">
          RuangPulih · Fakultas Kedokteran UPN "Veteran" Jakarta
        </p>
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
          {navLinks}
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
  Diterima: "bg-secondary text-secondary-foreground",
  Berlangsung: "bg-primary text-primary-foreground",
  Selesai: "bg-muted text-muted-foreground",
  Ditolak: "bg-destructive/15 text-destructive",
};
export function Badge({ s }: { s: string }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${tone[s] ?? "bg-muted"}`}>{s}</span>;
}
