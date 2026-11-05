import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, ClipboardList, Eye, Search, UserCheck, Users } from "lucide-react";
import { Shell } from "@/components/Shell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { adminNavigation } from "@/lib/admin-navigation";
import { adminCounselors, counselorMetrics, percentage, type AdminCounselor } from "@/lib/admin-counselors";

export const Route = createFileRoute("/admin_/konselor")({
  head: () => ({ meta: [
    { title: "Dashboard Analitik Konselor — RuangPulih Admin" },
    { name: "description", content: "Analitik status pengajuan, penerimaan, penolakan, dan pembatalan konseling per konselor RuangPulih." },
    { property: "og:title", content: "Dashboard Analitik Konselor — RuangPulih Admin" },
    { property: "og:description", content: "Rekap layanan dan keputusan pengajuan konseling per konselor FK UPN Veteran Jakarta." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: AdminCounselors,
});

function Rate({ count, total, tone = "bg-primary" }: { count: number; total: number; tone?: string }) {
  const value = percentage(count, total);
  return <div className="min-w-24">
    <div className="flex items-baseline justify-between gap-3"><span className="font-semibold tabular-nums">{value.toLocaleString("id-ID")}%</span><span className="text-xs text-muted-foreground">{count}</span></div>
    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full ${tone}`} style={{ width: `${value}%` }} /></div>
  </div>;
}

function Legend({ items }: { items: { label: string; tone: string }[] }) {
  return <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">{items.map((item) => <span key={item.label} className="flex items-center gap-1.5"><span className={`size-2 rounded-sm ${item.tone}`} />{item.label}</span>)}</div>;
}

function StackedBar({ segments, total, label }: { segments: { count: number; tone: string; label: string }[]; total: number; label: string }) {
  return <div role="img" aria-label={`${label}: ${segments.map((s) => `${s.label} ${s.count}`).join(", ")}`} className="mt-3 flex h-3 overflow-hidden rounded-full bg-muted">{segments.map((s) => <div key={s.label} title={`${s.label}: ${s.count} (${percentage(s.count, total)}%)`} className={`h-full ${s.tone}`} style={{ width: `${total === 0 ? 0 : s.count / total * 100}%` }} />)}</div>;
}

function AdminCounselors() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  const [selected, setSelected] = useState<AdminCounselor | null>(null);
  const rows = adminCounselors.filter((c) => (category === "Semua" || c.category === category) && `${c.name} ${c.expertise}`.toLowerCase().includes(query.trim().toLowerCase()));
  const totals = adminCounselors.reduce((acc, c) => {
    const metrics = counselorMetrics(c);
    return { total: acc.total + metrics.total, accepted: acc.accepted + metrics.accepted, decided: acc.decided + metrics.decided, completed: acc.completed + c.completed };
  }, { total: 0, accepted: 0, decided: 0, completed: 0 });
  const stats = [
    { label: "Total Konselor", value: adminCounselors.length, suffix: "", note: "Dosen dan psikolog", icon: Users },
    { label: "Total Pengajuan", value: totals.total, suffix: "", note: "Seluruh konselor", icon: ClipboardList },
    { label: "Sesi Selesai", value: totals.completed, suffix: "", note: "Konseling telah diselesaikan", icon: CheckCircle2 },
    { label: "Pengajuan Diterima", value: percentage(totals.accepted, totals.decided), suffix: "%", note: `${totals.accepted} dari ${totals.decided} keputusan`, icon: UserCheck },
  ];

  return <div className="counselor-portal">
    <Shell nav={adminNavigation.map((item) => item.label)} navigationItems={adminNavigation}>
      <section className="mx-auto max-w-6xl px-5 py-8 lg:px-9">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Portal Admin</p>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-semibold">Dashboard Analitik Konselor</h1>
          <span className="rounded-md border bg-card px-3 py-1.5 text-xs text-muted-foreground">2026</span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Rekap layanan, penyelesaian kasus, dan penerimaan pengajuan konseling per konselor.</p>

        <h2 className="mt-10 text-lg font-semibold">Rekapitulasi Konselor</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, suffix, note, icon: Icon }) => <div key={label} className="rounded-lg border bg-card p-5">
            <div className="flex items-center justify-between gap-2"><p className="text-sm text-muted-foreground">{label}</p><Icon className="size-4 shrink-0 text-primary" /></div>
            <p className="mt-3 text-3xl font-semibold tabular-nums">{value.toLocaleString("id-ID")}{suffix}</p>
            <p className="mt-2 text-xs text-muted-foreground">{note}</p>
          </div>)}
        </div>

        <section className="mt-8" aria-label="Filter Konselor">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <p className="text-xs text-muted-foreground">{rows.length} dari {adminCounselors.length} konselor · Rekap 2026</p>
            <div className="flex w-full flex-wrap gap-2 sm:w-auto">
              <label className="relative min-w-0 flex-1 sm:w-64"><span className="sr-only">Cari konselor</span><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari nama atau keahlian…" className="h-10 w-full rounded-md border bg-card pl-9 pr-3 text-sm" /></label>
              <select aria-label="Kategori konselor" value={category} onChange={(e) => setCategory(e.target.value)} className="h-10 max-w-full rounded-md border bg-card px-3 text-sm"><option value="Semua">Semua Kategori</option><option>Dosen Program Studi</option><option>Psikolog Ahli</option></select>
            </div>
          </div>
        </section>

        {rows.length === 0 && <div className="py-12 text-center"><p className="font-medium">Tidak Ada Konselor yang Cocok</p><Button variant="link" onClick={() => { setQuery(""); setCategory("Semua"); }}>Reset Filter</Button></div>}

        <div className="mt-6 grid items-start gap-8 xl:grid-cols-[1.2fr_1fr]">
          <section className="min-w-0 border-t pt-6" aria-labelledby="completion-heading">
            <h2 id="completion-heading" className="text-lg font-semibold">Penyelesaian Kasus Setiap Konselor</h2>
            <p className="mt-2 text-xs text-muted-foreground">Status dari seluruh pengajuan konseling</p>
            <div className="mt-4"><Legend items={[{ label: "Selesai", tone: "bg-primary" }, { label: "Berlangsung", tone: "bg-chart-ongoing" }, { label: "Pending", tone: "bg-warning" }, { label: "Status Lain", tone: "bg-border" }]} /></div>
            <div className="mt-5 divide-y">{rows.map((c) => {
              const m = counselorMetrics(c);
              return <div key={c.id} className="py-5 first:pt-0">
                <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-sm font-semibold">{c.name}</p><p className="mt-1 text-xs text-muted-foreground">{c.category}</p></div><Button variant="ghost" size="icon" className="shrink-0" aria-label={`Lihat detail ${c.name}`} title="Lihat detail konselor" onClick={() => setSelected(c)}><Eye className="size-4" /></Button></div>
                <StackedBar total={m.total} label={`Penyelesaian ${c.name}`} segments={[{ label: "Selesai", count: c.completed, tone: "bg-primary" }, { label: "Berlangsung", count: c.ongoing, tone: "bg-chart-ongoing" }, { label: "Pending", count: c.pending, tone: "bg-warning" }, { label: "Status Lain", count: c.acceptedWaiting + c.cancelled + c.rejected, tone: "bg-border" }]} />
                <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground"><span className="font-medium text-primary">{percentage(c.completed, m.total)}% Selesai</span><span>{percentage(c.ongoing, m.total)}% Berlangsung</span><span>{percentage(c.pending, m.total)}% Pending</span></div>
                <p className="mt-2 text-xs text-muted-foreground">{c.completed} sesi selesai · {m.total} pengajuan</p>
              </div>;
            })}</div>
          </section>

          <section className="min-w-0 border-t pt-6" aria-labelledby="acceptance-heading">
            <h2 id="acceptance-heading" className="text-lg font-semibold">Rasio Penerimaan Konseling</h2>
            <p className="mt-2 text-xs text-muted-foreground">Pengajuan yang telah diterima atau ditolak</p>
            <div className="mt-4"><Legend items={[{ label: "Diterima", tone: "bg-primary" }, { label: "Ditolak", tone: "bg-destructive" }]} /></div>
            <div className="mt-5 divide-y">{rows.map((c) => {
              const m = counselorMetrics(c);
              return <div key={c.id} className="py-5 first:pt-0">
                <p className="text-sm font-semibold">{c.name}</p>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs"><span className="text-primary">{percentage(m.accepted, m.decided)}% Diterima ({m.accepted})</span><span className="text-destructive">{percentage(c.rejected, m.decided)}% Ditolak ({c.rejected})</span></div>
                <StackedBar total={m.decided} label={`Penerimaan ${c.name}`} segments={[{ label: "Diterima", count: m.accepted, tone: "bg-primary" }, { label: "Ditolak", count: c.rejected, tone: "bg-destructive" }]} />
              </div>;
            })}</div>
            <div className="mt-1 border-t pt-4"><p className="text-sm text-muted-foreground">Rasio penerimaan keseluruhan <span className="font-semibold text-primary">{percentage(totals.accepted, totals.decided)}%</span></p><p className="mt-1 text-xs text-muted-foreground">{totals.accepted} diterima dari {totals.decided} pengajuan yang telah diputuskan</p></div>
          </section>
        </div>
      </section>
    </Shell>

    <Dialog open={selected !== null} onOpenChange={(open) => { if (!open) setSelected(null); }}>
      <DialogContent className="counselor-portal max-h-[85dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-lg">
        {selected && <>
          <DialogHeader><DialogTitle className="pr-6 text-xl leading-normal">{selected.name}</DialogTitle><DialogDescription>{selected.category} · Rekap 2026</DialogDescription></DialogHeader>
          <p className="border-b pb-4 text-sm text-muted-foreground">{selected.expertise}</p>
          <div><h3 className="font-semibold">Status Pengajuan</h3><dl className="mt-3 divide-y text-sm">{[
            ["Total Pengajuan", counselorMetrics(selected).total], ["Pending", selected.pending], ["Diterima — Belum Berlangsung", selected.acceptedWaiting], ["Berlangsung", selected.ongoing], ["Selesai", selected.completed], ["Ditolak", selected.rejected], ["Dibatalkan Setelah Diterima", selected.cancelled],
          ].map(([label, value]) => <div key={label} className="flex justify-between gap-4 py-2.5"><dt className="text-muted-foreground">{label}</dt><dd className="font-semibold tabular-nums">{value}</dd></div>)}</dl></div>
          <div className="border-t pt-4"><h3 className="font-semibold">Keputusan Pengajuan</h3><div className="mt-3 grid grid-cols-2 gap-5"><div><p className="mb-2 text-xs text-muted-foreground">Diterima</p><Rate count={counselorMetrics(selected).accepted} total={counselorMetrics(selected).decided} /></div><div><p className="mb-2 text-xs text-muted-foreground">Ditolak</p><Rate count={selected.rejected} total={counselorMetrics(selected).decided} tone="bg-destructive" /></div></div></div>
        </>}
      </DialogContent>
    </Dialog>
  </div>;
}