import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowUpRight, CalendarDays, Camera, CheckCircle2, ChevronRight, Clock3, FileText, MapPin, Play, Save, Search, ShieldCheck, Timer, Upload, X } from "lucide-react";
import { Badge, Shell } from "@/components/Shell";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { counselorNavigation } from "@/lib/counselor-navigation";
import { canFinishSession, finishSession, hasCompleteRecord, isClosingTime, remainingSeconds, sampleSessions, SESSION_SECONDS, startSession, type Session } from "@/lib/counselor-sessions";

export const Route = createFileRoute("/konselor_/sesi")({
  head: () => ({ meta: [
    { title: "Sesi Konseling Konselor — RuangPulih" },
    { name: "description", content: "Sesi konseling RuangPulih: jadwal mahasiswa, timer sesi, kesimpulan, rekomendasi dan dokumentasi konseling." },
    { property: "og:title", content: "Sesi Konseling Konselor — RuangPulih" },
    { property: "og:description", content: "Ruang kerja konselor untuk melaksanakan dan menyelesaikan sesi konseling mahasiswa FK UPN Veteran Jakarta." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: CounselorSessions,
});

function timeLabel(seconds: number) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function CounselorSessions() {
  const [sessions, setSessions] = useState(sampleSessions);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState("Semua");
  const [search, setSearch] = useState("");
  const [now, setNow] = useState(0);
  const [notice, setNotice] = useState("");
  const [confirmEnd, setConfirmEnd] = useState(false);
  const photoInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const timestamp = Date.now();
    setNow(timestamp);
    setSessions((items) => items.map((item) => item.status === "Berlangsung" && item.startedAt === undefined ? { ...item, startedAt: timestamp - 45 * 60 * 1000 } : item));
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);
  const selected = sessions.find((item) => item.id === selectedId);
  const seconds = selected?.startedAt === undefined ? SESSION_SECONDS : remainingSeconds(selected.startedAt, now);
  const live = selected?.status === "Berlangsung";
  const completed = selected?.status === "Selesai";
  const visible = sessions.filter((item) => (filter === "Semua" || filter === item.status) && `${item.name} ${item.nim} ${item.category}`.toLowerCase().includes(search.toLowerCase()));
  function updateSession(id: string, changes: Partial<Session>) {
    setSessions((items) => items.map((item) => item.id === id ? { ...item, ...changes } : item));
  }
  function openSession(item: Session) {
    const timestamp = Date.now();
    setNow(timestamp);
    setSessions((items) => items.map((session) => session.id === item.id ? startSession(session, timestamp) : session));
    setSelectedId(item.id); setNotice("");
  }
  function previewTime(remaining: number) {
    if (!selected || !live) return;
    const timestamp = Date.now(); setNow(timestamp);
    updateSession(selected.id, { startedAt: timestamp - (SESSION_SECONDS - remaining) * 1000 });
  }
  async function uploadPhoto(file: File | undefined) {
    if (!file || !selected) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) { setNotice("Pilih foto berformat JPG, PNG, atau WebP."); return; }
    const sessionId = selected.id;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      updateSession(sessionId, { photo: reader.result, saved: false });
      setNotice("");
    };
    reader.onerror = () => setNotice("Foto belum dapat dibaca. Silakan unggah kembali.");
    reader.readAsDataURL(file);
  }
  function endSession() {
    if (!selected) return;
    const timestamp = Date.now();
    if (!canFinishSession(selected, timestamp)) return;
    setSessions((items) => items.map((item) => item.id === selected.id ? finishSession(item, timestamp) : item));
    setNotice("Sesi selesai. Kesimpulan, rekomendasi, dan dokumentasi telah dicatat untuk sesi ini.");
  }
  return <div className="counselor-portal">
    <Shell nav={counselorNavigation.map((item) => item.label)} navigationItems={counselorNavigation}>
      <div className="border-b bg-card px-5 py-4 lg:px-9"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground sm:text-sm">Portal Konselor <ChevronRight className="mx-2 inline size-3" /><span className="font-medium text-foreground">Sesi Konseling</span></p>
        <div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">AP</span><div><p className="text-xs font-semibold">Andika Pratama, M.Psi.</p><p className="text-xs text-muted-foreground">Psikolog Ahli</p></div></div>
      </div></div>
      <div className="mx-auto max-w-6xl px-5 py-8 lg:px-9">
        {selected ? <>
          <Button variant="ghost" size="sm" className="mb-5 -ml-3 text-muted-foreground" onClick={() => { setSelectedId(null); setNotice(""); }}><ArrowLeft />Daftar sesi</Button>
          <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-widest text-primary">{completed ? "Hasil konseling" : "Konseling tatap muka"}</p><h1 className="mt-2 text-3xl font-semibold">Sesi {selected.name}</h1></div><Badge s={selected.status} /></div>
          <div className="mt-6 grid gap-8 xl:grid-cols-[minmax(0,1fr)_280px]">
            <div className="min-w-0">
              {live && <section className={`border-y py-5 ${seconds <= 300 ? "border-warning/40 bg-warning/5" : "border-primary/20"}`}>
                <div className="flex flex-wrap items-center justify-between gap-4"><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-lg bg-secondary text-primary"><Timer className="size-5" /></span><div><p className="text-xs text-muted-foreground">Sisa waktu sesi</p><p aria-label="Sisa waktu sesi" className="mt-1 text-4xl font-semibold tabular-nums">{timeLabel(seconds)}</p></div></div><p className="text-xs text-muted-foreground">Durasi maksimal 60 menit</p></div>
                {isClosingTime(seconds) && <p role="status" className="mt-4 flex items-start gap-2 text-sm"><Clock3 className="mt-0.5 size-4 shrink-0 text-primary" />Sesi akan berakhir dalam 5 menit. Persiapkan penutupan dan ingatkan mahasiswa mengisi survei kepuasan.</p>}
                {seconds === 0 && <p role="status" className="mt-4 text-sm font-medium text-primary">Waktu sesi telah selesai. Lengkapi dan simpan hasil konseling sebelum mengakhiri sesi.</p>}
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-3"><span className="mr-1 text-[11px] text-muted-foreground">Waktu contoh</span><Button variant="ghost" size="sm" onClick={() => previewTime(3600)}>60 menit</Button><Button variant="ghost" size="sm" onClick={() => previewTime(300)}>5 menit terakhir</Button><Button variant="ghost" size="sm" onClick={() => previewTime(0)}>Waktu habis</Button></div>
              </section>}
              {notice && <p role="status" className="mt-5 flex items-start gap-2 rounded-md border bg-secondary p-3 text-sm text-secondary-foreground"><CheckCircle2 className="mt-0.5 size-4 shrink-0" />{notice}</p>}
              <section className="mt-7"><h2 className="flex items-center gap-2 text-lg font-semibold"><FileText className="size-5 text-primary" />Catatan hasil sesi</h2>
                <div className="mt-5 space-y-5">{([{ key: "conclusion", label: "Kesimpulan", placeholder: "Tuliskan ringkasan sesi dan hal utama yang dibahas…" }, { key: "recommendation", label: "Rekomendasi", placeholder: "Tuliskan saran dan langkah tindak lanjut untuk mahasiswa…" }] as const).map(({ key, label, placeholder }) => <div key={key}><label htmlFor={key} className="text-sm font-semibold">{label}{!completed && <span className="ml-1 text-destructive">*</span>}</label>{completed ? <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{selected[key]}</p> : <textarea id={key} rows={5} value={selected[key]} placeholder={placeholder} onChange={(event) => updateSession(selected.id, { [key]: event.target.value, saved: false })} className="mt-2 w-full resize-y rounded-md border bg-card p-3 text-sm leading-relaxed outline-none focus:ring-1 focus:ring-ring" />}</div>)}</div>
              </section>
              <section className="mt-7 border-t pt-6"><h2 className="flex items-center gap-2 text-lg font-semibold"><Camera className="size-5 text-primary" />Dokumentasi sesi{!completed && <span className="text-sm text-destructive">*</span>}</h2>
                <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"><ShieldCheck className="size-4 shrink-0 text-primary" />Ambil foto dari belakang. Wajah mahasiswa tidak boleh terlihat pada foto.</p>
                {selected.photo ? <div className="relative mt-4 w-full max-w-sm"><img src={selected.photo} alt={`Dokumentasi sesi ${selected.name}`} className="aspect-video w-full rounded-md border object-contain bg-muted" />{!completed && <Button size="icon" variant="outline" className="absolute right-2 top-2" title="Hapus foto" aria-label="Hapus foto" onClick={() => { updateSession(selected.id, { photo: "", saved: false }); if (photoInput.current) photoInput.current.value = ""; }}><X /></Button>}</div> : completed ? <p className="mt-4 text-sm text-muted-foreground">Dokumentasi foto tidak tersedia pada contoh riwayat ini.</p> : <div className="mt-4 flex flex-col items-center gap-3 rounded-md border border-dashed bg-card px-5 py-7"><Camera className="size-7 text-muted-foreground" /><Button variant="outline" onClick={() => photoInput.current?.click()}><Upload />Unggah foto</Button><span className="text-xs text-muted-foreground">JPG, PNG, WebP</span></div>}
                <input ref={photoInput} type="file" accept="image/jpeg,image/png,image/webp" aria-label="Unggah dokumentasi sesi" className="hidden" onChange={(event) => void uploadPhoto(event.target.files?.[0])} />
              </section>
              {!completed && <div className="mt-7 border-t pt-5"><div className="flex flex-wrap items-center justify-between gap-3"><Button variant="outline" disabled={!hasCompleteRecord(selected) || selected.saved} onClick={() => { updateSession(selected.id, { saved: true }); setNotice("Catatan dan foto tersimpan untuk sesi contoh ini."); }}><Save />{selected.saved ? "Hasil tersimpan" : "Simpan hasil sesi"}</Button><Button disabled={!canFinishSession(selected, now)} onClick={() => setConfirmEnd(true)}><CheckCircle2 />Akhiri Sesi</Button></div><p className="mt-3 text-xs leading-relaxed text-muted-foreground">Sesi dapat diakhiri setelah waktu habis serta kesimpulan, rekomendasi, dan foto telah tersimpan.</p></div>}
            </div>
            <aside className="min-w-0 border-t pt-6 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0"><h2 className="text-sm font-semibold">Informasi mahasiswa</h2><dl className="mt-5 space-y-4">{[["Nama lengkap", selected.name], ["NIM", selected.nim], ["Program studi", selected.program], ["Nomor HP", selected.contact], ["Kategori masalah", selected.category], ["Urutan pengajuan", `Ke-${selected.order} untuk kategori ini`]].map(([label, value]) => <div key={label}><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-1 break-words text-sm font-medium">{value}</dd></div>)}</dl><div className="mt-6 border-t pt-5"><p className="flex items-center gap-2 text-xs font-semibold"><CalendarDays className="size-4 text-primary" />Jadwal konseling</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{selected.schedule}</p><p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"><MapPin className="size-4" />Tatap muka · Ruang konseling FK</p></div><p className="mt-6 flex items-start gap-2 border-t pt-5 text-xs leading-relaxed text-muted-foreground"><ShieldCheck className="size-4 shrink-0 text-primary" />Kesimpulan dan rekomendasi bersifat rahasia, hanya untuk mahasiswa terkait dan konselor yang menangani.</p></aside>
          </div>
        </> : <>
          <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-widest text-primary">RuangPulih · Portal Konselor</p><h1 className="mt-2 text-3xl font-semibold">Sesi Konseling</h1><p className="mt-2 text-sm text-muted-foreground">Jadwal sesi dan hasil konseling mahasiswa Anda.</p></div><span className="flex items-center gap-2 text-xs text-muted-foreground"><Clock3 className="size-4" />Tatap muka · Maksimal 60 menit</span></div>
          <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-b pb-4"><Tabs value={filter} onValueChange={setFilter}><TabsList className="h-auto flex-wrap bg-transparent p-0">{["Semua", "Diterima", "Berlangsung", "Selesai"].map((item) => <TabsTrigger value={item} key={item} className="text-xs data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground data-[state=active]:shadow-none">{item}<span className="ml-2 tabular-nums">{item === "Semua" ? sessions.length : sessions.filter((session) => session.status === item).length}</span></TabsTrigger>)}</TabsList></Tabs><label className="flex w-full items-center gap-2 rounded-md border bg-card px-3 sm:w-64"><Search className="size-4 shrink-0 text-muted-foreground" /><input aria-label="Cari sesi konseling" placeholder="Cari nama, NIM, kategori…" value={search} onChange={(event) => setSearch(event.target.value)} className="h-10 w-full min-w-0 bg-transparent text-xs outline-none" /></label></div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">{visible.map((item) => <article key={item.id} className={`min-w-0 rounded-lg border bg-card p-5 ${item.status === "Berlangsung" ? "border-primary/40" : ""}`}><div className="flex items-start justify-between gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">{item.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><Badge s={item.status} /></div><h2 className="mt-4 text-lg font-semibold">{item.name}</h2><p className="mt-1 text-xs text-muted-foreground">{item.nim} · {item.program}</p><p className="mt-4 text-sm font-medium">{item.category}</p><p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"><CalendarDays className="size-4 shrink-0" />{item.schedule}</p><div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-4"><p className="flex items-center gap-2 text-xs text-muted-foreground">{item.status === "Berlangsung" ? <><Timer className="size-4 text-primary" />{item.startedAt === undefined ? "15:00" : timeLabel(remainingSeconds(item.startedAt, now))} tersisa</> : item.status === "Selesai" ? <><CheckCircle2 className="size-4" />Hasil sesi tersedia</> : <><MapPin className="size-4" />Tatap muka</>}</p><Button size="sm" variant={item.status === "Selesai" ? "outline" : "default"} onClick={() => openSession(item)} aria-label={`${item.status === "Diterima" ? "Mulai Sesi" : item.status === "Berlangsung" ? "Buka Sesi" : "Lihat hasil"} ${item.name}`}>{item.status === "Diterima" ? <><Play />Mulai Sesi</> : item.status === "Berlangsung" ? <><ArrowUpRight />Buka Sesi</> : <><FileText />Lihat hasil</>}</Button></div></article>)}</div>
          {visible.length === 0 && <div className="py-16 text-center"><Search className="mx-auto size-7 text-muted-foreground" /><p className="mt-3 text-sm font-medium">Tidak ada sesi ditemukan</p><Button variant="link" onClick={() => { setSearch(""); setFilter("Semua"); }}>Tampilkan semua sesi</Button></div>}
        </>}
      </div>
    </Shell>
    <AlertDialog open={confirmEnd} onOpenChange={setConfirmEnd}><AlertDialogContent className="counselor-portal w-[calc(100%-2rem)] rounded-lg"><AlertDialogHeader><AlertDialogTitle>Akhiri sesi konseling?</AlertDialogTitle><AlertDialogDescription>Sesi {selected?.name} akan ditandai selesai. Mahasiswa dapat melihat kesimpulan dan rekomendasi sesi ini.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Kembali</AlertDialogCancel><AlertDialogAction onClick={endSession}>Ya, akhiri sesi</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
  </div>;
}