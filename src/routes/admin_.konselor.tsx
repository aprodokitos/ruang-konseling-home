import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, ChevronRight, ClipboardList, Eye, Search, UserCheck, Users } from "lucide-react";
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

        <h2 className="mt-10 text-lg font-semibold">Rekapitulasi Konselor</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, suffix, note, icon: Icon }) => <div key={label} className="rounded-lg border bg-card p-5">
            <div className="flex items-center justify-between gap-2"><p className="text-sm text-muted-foreground">{label}</p><Icon className="size-4 shrink-0 text-primary" /></div>
            <p className="mt-3 text-3xl font-semibold tabular-nums">{value.toLocaleString("id-ID")}{suffix}</p>
            <p className="mt-2 text-xs text-muted-foreground">{note}</p>
          </div>)}
        </div>

        <section className="mt-10" aria-labelledby="counselor-table-heading">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div><h2 id="counselor-table-heading" className="text-lg font-semibold">Data Konselor</h2><p className="mt-1 text-xs text-muted-foreground">{rows.length} dari {adminCounselors.length} konselor</p></div>
            <div className="flex w-full flex-wrap gap-2 sm:w-auto">
              <label className="relative min-w-0 flex-1 sm:w-64"><span className="sr-only">Cari konselor</span><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari nama atau keahlian…" className="h-10 w-full rounded-md border bg-card pl-9 pr-3 text-sm" /></label>
              <select aria-label="Kategori konselor" value={category} onChange={(e) => setCategory(e.target.value)} className="h-10 max-w-full rounded-md border bg-card px-3 text-sm"><option value="Semua">Semua Kategori</option><option>Dosen Program Studi</option><option>Psikolog Ahli</option></select>
            </div>
          </div>
          <div className="mt-4 overflow-x-auto rounded-lg border bg-card">
            <table className="w-full min-w-[1120px] text-sm">
              <thead className="bg-muted/60 text-left text-xs text-muted-foreground"><tr>{["Konselor", "Total Pengajuan", "Pending", "Berlangsung", "Selesai", "Diterima", "Ditolak", "Dibatalkan¹", "Detail"].map((heading) => <th key={heading} scope="col" className="px-4 py-4 font-medium">{heading}</th>)}</tr></thead>
              <tbody>{rows.map((c) => {
                const metrics = counselorMetrics(c);
                return <tr key={c.id} className="border-t transition-colors hover:bg-muted/30">
                  <td className="px-4 py-5"><p className="whitespace-nowrap font-semibold">{c.name}</p><p className="mt-1 text-xs text-muted-foreground">{c.category}</p></td>
                  <td className="px-4 py-5 font-semibold tabular-nums">{metrics.total}</td>
                  <td className="px-4 py-5"><Rate count={c.pending} total={metrics.total} tone="bg-warning" /></td>
                  <td className="px-4 py-5"><Rate count={c.ongoing} total={metrics.total} tone="bg-success" /></td>
                  <td className="px-4 py-5"><Rate count={c.completed} total={metrics.total} /></td>
                  <td className="px-4 py-5"><Rate count={metrics.accepted} total={metrics.decided} /></td>
                  <td className="px-4 py-5"><Rate count={c.rejected} total={metrics.decided} tone="bg-destructive" /></td>
                  <td className="px-4 py-5"><Rate count={c.cancelled} total={metrics.accepted} tone="bg-destructive/60" /></td>
                  <td className="px-4 py-5"><Button variant="ghost" size="icon" aria-label={`Lihat detail ${c.name}`} title={`Lihat detail ${c.name}`} onClick={() => setSelected(c)}><Eye /></Button></td>
                </tr>;
              })}{rows.length === 0 && <tr><td colSpan={9} className="px-4 py-12 text-center"><p className="font-medium">Tidak Ada Konselor yang Cocok</p><Button variant="link" onClick={() => { setQuery(""); setCategory("Semua"); }}>Reset Filter</Button></td></tr>}</tbody>
            </table>
          </div>
          <div className="mt-4 space-y-1.5 text-xs leading-relaxed text-muted-foreground">
            <p>Pending, Berlangsung, dan Selesai: persentase dari total pengajuan masing-masing konselor.</p>
            <p>Diterima dan Ditolak: persentase dari pengajuan yang sudah diputuskan, tidak termasuk Pending.</p>
            <p>¹ Dibatalkan setelah diterima: persentase dari seluruh pengajuan yang pernah diterima konselor.</p>
          </div>
        </section>

        <section className="mt-10 border-t pt-6" aria-labelledby="summary-heading">
          <h2 id="summary-heading" className="text-lg font-semibold">Ringkasan Layanan per Konselor</h2>
          <div className="mt-4 grid gap-x-8 gap-y-5 md:grid-cols-2">
            {rows.map((c) => <div key={c.id} className="border-b pb-4">
              <div className="flex items-center justify-between gap-3"><div><p className="text-sm font-semibold">{c.name}</p><p className="mt-1 text-xs text-muted-foreground">{c.category}</p></div><Button variant="ghost" size="icon" aria-label={`Ringkasan ${c.name}`} title="Lihat ringkasan" onClick={() => setSelected(c)}><ChevronRight /></Button></div>
              <div className="mt-3 flex items-center justify-between text-sm"><span className="text-muted-foreground">Sesi Selesai</span><span className="font-semibold">{c.completed} sesi</span></div>
              <div className="mt-2"><Rate count={c.completed} total={counselorMetrics(c).total} /></div>
            </div>)}
          </div>
        </section>
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