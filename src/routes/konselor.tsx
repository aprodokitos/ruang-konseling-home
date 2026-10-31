import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, BookOpen, CalendarDays, Check, CheckCircle2, ChevronRight, ClipboardList, Clock3, Download, LayoutDashboard, Search, ShieldCheck, User, Users, Video, X } from "lucide-react";
import { Shell, Badge, type NavItem } from "@/components/Shell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { canReject, decideApplication, rejectionReasons, sampleApplications, type CounselingStatus } from "@/lib/counselor-dashboard";
import counselingImage from "@/assets/hero.jpg";

export const Route = createFileRoute("/konselor")({
  head: () => ({ meta: [
    { title: "Dashboard Portal Konselor — RuangPulih" },
    { name: "description", content: "Dashboard konselor RuangPulih: statistik layanan, pengajuan mahasiswa, keputusan konseling dan prosedur layanan." },
    { property: "og:title", content: "Dashboard Portal Konselor — RuangPulih" },
    { property: "og:description", content: "Kelola pengajuan mahasiswa dan tinjau prosedur konseling tatap muka FK UPN Veteran Jakarta." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: CounselorDashboard,
});

const navigation: NavItem[] = [
  { label: "Dashboard", to: "/konselor", icon: LayoutDashboard },
  { label: "Jadwal Konseling", icon: CalendarDays },
  { label: "Sesi Konseling", icon: ClipboardList },
  { label: "Profil", icon: User },
];
const filters = ["Semua", "Pending", "Diterima", "Berlangsung", "Selesai", "Ditolak"] as const;
type Filter = typeof filters[number];

function CounselorDashboard() {
  const [applications, setApplications] = useState(sampleApplications);
  const [filter, setFilter] = useState<Filter>("Semua");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [other, setOther] = useState("");
  const [notice, setNotice] = useState("");
  const selected = applications.find((item) => item.id === selectedId);
  const visible = applications.filter((item) => (filter === "Semua" || item.status === filter) && `${item.name} ${item.nim} ${item.category}`.toLowerCase().includes(search.toLowerCase()));
  const count = (status: CounselingStatus) => applications.filter((item) => item.status === status).length;
  const stats = [
    { label: "Total mahasiswa", value: applications.length, icon: Users, hint: "Mahasiswa yang memilih Anda", tone: "bg-secondary text-secondary-foreground" },
    { label: "Pending", value: count("Pending"), icon: Clock3, hint: "Menunggu keputusan Anda", tone: "bg-warning/15 text-accent-foreground" },
    { label: "Berlangsung", value: count("Berlangsung"), icon: Video, hint: "Sesi konseling aktif", tone: "bg-primary/10 text-primary" },
    { label: "Selesai", value: count("Selesai"), icon: CheckCircle2, hint: "Sesi telah diselesaikan", tone: "bg-muted text-muted-foreground" },
  ];
  function openDetail(id: string) {
    setSelectedId(id); setRejecting(false); setReason(""); setOther("");
  }
  function decide(decision: "Diterima" | "Ditolak") {
    if (!selected || selected.status !== "Pending") return;
    const updated = decideApplication(selected, decision, reason, other);
    if (updated === selected) return;
    setApplications((items) => items.map((item) => item.id === selected.id ? updated : item));
    setNotice(`Pengajuan ${selected.name} ${decision === "Diterima" ? "diterima" : "ditolak"}.`);
    setSelectedId(null);
  }
  return (
    <div className="counselor-portal">
      <Shell nav={navigation.map((item) => item.label)} navigationItems={navigation}>
        <div className="border-b bg-card px-6 py-4 lg:px-9">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">Portal Konselor <ChevronRight className="mx-2 inline size-3" /><span className="font-medium text-foreground">Dashboard</span></p>
            <div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">AP</span><div><p className="text-xs font-semibold">Andika Pratama, M.Psi.</p><p className="text-xs text-muted-foreground">Psikolog Ahli</p></div></div>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-5 py-8 lg:px-9">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div><p className="text-xs font-semibold uppercase tracking-widest text-primary">RuangPulih · Portal Konselor</p><h1 className="mt-2 text-3xl font-semibold">Selamat datang, Andika.</h1><p className="mt-2 text-sm text-muted-foreground">Ringkasan layanan dan pengajuan konseling mahasiswa Anda.</p></div>
            <span className="flex items-center gap-2 text-xs text-muted-foreground"><CalendarDays className="size-4" />Semester Ganjil 2026/2027</span>
          </div>
          <div className="mt-7 grid grid-cols-2 gap-3 xl:grid-cols-4">
            {stats.map(({ label, value, icon: Icon, hint, tone }) => <div key={label} className="rounded-lg border bg-card p-4 lg:p-5"><div className="flex items-center justify-between gap-2"><p className="text-xs font-medium text-muted-foreground">{label}</p><span className={`grid size-9 shrink-0 place-items-center rounded-lg ${tone}`}><Icon className="size-4" /></span></div><p className="mt-2 text-3xl font-semibold tabular-nums">{value}</p><p className="mt-2 text-xs text-muted-foreground">{hint}</p></div>)}
          </div>
          {notice && <div role="status" className="mt-5 flex items-center gap-2 rounded-lg border bg-secondary p-3 text-sm text-secondary-foreground"><CheckCircle2 className="size-4" />{notice}<Button variant="ghost" size="icon" aria-label="Tutup pemberitahuan" className="ml-auto shrink-0" onClick={() => setNotice("")}><X /></Button></div>}
          <section className="mt-9">
            <div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-xl font-semibold">List Konseling</h2><p className="mt-1 text-sm text-muted-foreground">{count("Pending")} pengajuan menunggu keputusan</p></div><label className="flex w-full items-center gap-2 rounded-md border bg-card px-3 sm:w-64"><Search className="size-4 shrink-0 text-muted-foreground" /><input aria-label="Cari pengajuan" placeholder="Cari nama, NIM, kategori…" value={search} onChange={(event) => setSearch(event.target.value)} className="h-10 w-full min-w-0 bg-transparent text-xs outline-none" /></label></div>
            <div className="mt-5 flex flex-wrap gap-1 border-b pb-3" role="group" aria-label="Filter status pengajuan">{filters.map((item) => <Button key={item} size="sm" variant={filter === item ? "secondary" : "ghost"} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}{item === "Pending" && <span className="ml-1 font-semibold">{count("Pending")}</span>}</Button>)}</div>
            <div className="hidden grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1.2fr)_100px_100px] gap-4 px-4 py-3 text-xs font-medium text-muted-foreground xl:grid"><span>Mahasiswa</span><span>Kategori masalah</span><span>Jadwal konseling</span><span>Status</span><span className="text-right">Tindakan</span></div>
            <div className="space-y-3 pt-3 xl:pt-0">
              {visible.map((item) => <article key={item.id} className="grid items-center gap-4 rounded-lg border bg-card p-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1.2fr)_100px_100px]">
                <div className="flex min-w-0 items-center gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">{item.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><div className="min-w-0"><h3 className="text-sm font-semibold">{item.name}</h3><p className="mt-1 text-xs text-muted-foreground">{item.nim}</p></div></div>
                <div><p className="text-sm">{item.category}</p>{item.status === "Pending" && <p className="mt-1 text-xs text-primary">Pengajuan ke-{item.order} untuk kategori ini</p>}</div>
                <p className="text-xs leading-relaxed text-muted-foreground">{item.schedule}</p>
                <div><Badge s={item.status} /></div>
                <Button variant="outline" size="sm" onClick={() => openDetail(item.id)} aria-label={`Lihat detail ${item.name}`}>Detail<ArrowUpRight /></Button>
              </article>)}
              {visible.length === 0 && <div className="py-12 text-center"><Search className="mx-auto size-7 text-muted-foreground" /><p className="mt-3 text-sm font-medium">Tidak ada pengajuan ditemukan</p><Button variant="link" onClick={() => { setSearch(""); setFilter("Semua"); }}>Tampilkan semua pengajuan</Button></div>}
            </div>
          </section>
          <section className="mt-10 border-t pt-8">
            <div className="grid gap-7 md:grid-cols-[1fr_220px]">
              <div><div className="flex items-center gap-2"><BookOpen className="size-5 text-primary" /><h2 className="text-xl font-semibold">Prosedur Konseling</h2></div><ol className="mt-5 grid gap-4 sm:grid-cols-2">{[
                ["Tinjau pengajuan", "Periksa data mahasiswa, kategori masalah, jadwal, dan urutan pengajuan sebelum menerima atau menolak."],
                ["Laksanakan sesi tatap muka", "Mulai sesi melalui halaman Sesi Konseling. Durasi maksimal satu jam; peringatan muncul lima menit sebelum selesai."],
                ["Catat hasil & dokumentasi", "Isi kesimpulan dan rekomendasi. Dokumentasi diambil dari belakang, tanpa memperlihatkan wajah mahasiswa."],
                ["Selesaikan sesi", "Setelah timer selesai, pastikan kesimpulan, rekomendasi, dan foto tersimpan sebelum mengakhiri sesi."],
              ].map(([title, text], index) => <li key={title} className="flex gap-3"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">{index + 1}</span><div><h3 className="text-sm font-semibold">{title}</h3><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{text}</p></div></li>)}</ol><div className="mt-6 flex flex-wrap items-center gap-3"><Button variant="outline" disabled><Download />Unduh SOP</Button><span className="text-xs text-muted-foreground">Menunggu dokumen resmi Fakultas</span></div></div>
              <div><img src={counselingImage} alt="Ilustrasi suasana konseling tatap muka" className="aspect-[4/3] w-full rounded-lg object-cover" /><p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"><ShieldCheck className="size-4 shrink-0 text-primary" />Data mahasiswa dan hasil sesi bersifat rahasia.</p></div>
            </div>
          </section>
        </div>
      </Shell>
      <Dialog open={Boolean(selected)} onOpenChange={(open) => { if (!open) setSelectedId(null); }}>
        <DialogContent className="counselor-portal max-h-[90dvh] w-[calc(100%-2rem)] overflow-y-auto rounded-lg">
          {selected && <>
            <DialogHeader><DialogTitle>{rejecting ? "Tolak pengajuan" : "Detail pengajuan konseling"}</DialogTitle><DialogDescription>{selected.name} · {selected.nim}</DialogDescription></DialogHeader>
            <div className="flex items-center justify-between border-b pb-3"><span className="text-sm font-semibold">Informasi mahasiswa</span><Badge s={selected.status} /></div>
            <dl className="grid gap-3 text-sm">{[["Nama lengkap", selected.name], ["NIM", selected.nim], ["Program studi", selected.program], ["Nomor HP", selected.contact], ["Kategori masalah", selected.category], ["Jadwal konseling", selected.schedule], ["Urutan pengajuan", `Pengajuan ke-${selected.order} untuk kategori ${selected.category}`]].map(([label, value]) => <div key={label} className="grid gap-1 sm:grid-cols-[140px_1fr]"><dt className="text-xs text-muted-foreground">{label}</dt><dd className="break-words text-sm font-medium">{value}</dd></div>)}</dl>
            {selected.status === "Ditolak" && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive"><p className="font-semibold">Alasan penolakan</p><p className="mt-1">{selected.reason}</p></div>}
            {selected.status === "Pending" && (rejecting ? <div className="space-y-3 border-t pt-4"><label className="block text-sm font-medium" htmlFor="rejection-reason">Alasan penolakan <span className="text-destructive">*</span></label><select id="rejection-reason" value={reason} onChange={(event) => setReason(event.target.value)} className="h-10 w-full rounded-md border bg-card px-3 text-sm"><option value="">Pilih alasan</option>{rejectionReasons.map((item) => <option key={item}>{item}</option>)}</select>{reason === "Lainnya" && <div><label className="text-xs font-medium" htmlFor="other-reason">Keterangan alasan</label><textarea id="other-reason" rows={3} value={other} onChange={(event) => setOther(event.target.value)} placeholder="Tuliskan alasan penolakan…" className="mt-2 w-full rounded-md border bg-card p-3 text-sm" /></div>}<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setRejecting(false)}>Kembali</Button><Button variant="destructive" disabled={!canReject(reason, other)} onClick={() => decide("Ditolak")}>Konfirmasi penolakan</Button></div></div> : <div className="flex justify-end gap-2 border-t pt-4"><Button variant="outline" className="text-destructive" onClick={() => setRejecting(true)}><X />Tolak</Button><Button onClick={() => decide("Diterima")}><Check />Terima pengajuan</Button></div>)}
          </>}
        </DialogContent>
      </Dialog>
    </div>
  );
}
