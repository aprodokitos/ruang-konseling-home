import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Star, MessageSquareText, Download } from "lucide-react";
import { Shell } from "@/components/Shell";
import { adminNavigation } from "@/lib/admin-navigation";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Dashboard Analitik Mahasiswa — RuangPulih Admin" },
      { name: "description", content: "Rekap pengajuan, distribusi data mahasiswa, dan analitik survei kepuasan RuangPulih." },
      { property: "og:title", content: "Dashboard Analitik Mahasiswa — RuangPulih Admin" },
      { property: "og:description", content: "Statistik konseling dan survei kepuasan mahasiswa FK UPNVJ." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminStudents,
});

type Status = "Pending" | "Berlangsung" | "Selesai";
const students: { name: string; nim: string; prodi: string; cat: string; date: string; status: Status; counselor: string }[] = [
  { name: "Nadia Putri Rahma", nim: "2210211045", prodi: "Sarjana Kedokteran", cat: "Akademik", date: "28 Okt 2026", status: "Selesai", counselor: "Andika Pratama, M.Psi." },
  { name: "Rizky Maulana", nim: "2310212011", prodi: "Sarjana Farmasi", cat: "Manajemen Waktu", date: "29 Okt 2026", status: "Berlangsung", counselor: "dr. Ratna Sari" },
  { name: "Salsabila Hanum", nim: "2110211078", prodi: "Profesi Kedokteran", cat: "Pribadi", date: "30 Okt 2026", status: "Pending", counselor: "Andika Pratama, M.Psi." },
  { name: "Fajar Ramadhan", nim: "2210213020", prodi: "Sarjana Biologi", cat: "Keluarga", date: "30 Okt 2026", status: "Selesai", counselor: "dr. Bima Aditya" },
  { name: "Aulia Kartika", nim: "2310211102", prodi: "Sarjana Kedokteran", cat: "Sosial", date: "31 Okt 2026", status: "Pending", counselor: "dr. Ratna Sari" },
  { name: "Dimas Prasetyo", nim: "2210212055", prodi: "Sarjana Farmasi", cat: "Finansial", date: "1 Nov 2026", status: "Selesai", counselor: "Andika Pratama, M.Psi." },
  { name: "Intan Permata", nim: "2110211033", prodi: "Profesi Kedokteran", cat: "Karier", date: "2 Nov 2026", status: "Berlangsung", counselor: "dr. Bima Aditya" },
  { name: "Yoga Saputra", nim: "2310213007", prodi: "Sarjana Biologi", cat: "Akademik", date: "2 Nov 2026", status: "Selesai", counselor: "dr. Ratna Sari" },
];

const byCategory = [["Akademik", 32], ["Manajemen Waktu", 18], ["Pribadi", 16], ["Sosial", 10], ["Keluarga", 9], ["Finansial", 7], ["Karier", 5], ["Lainnya", 3]] as const;
const byProdi = [["Sarjana Kedokteran", 44], ["Profesi Kedokteran", 22], ["Sarjana Farmasi", 21], ["Sarjana Biologi", 13]] as const;
const dimensions = [["Keandalan", 3.6], ["Responsivitas", 3.4], ["Jaminan", 3.7], ["Empati", 3.8], ["Bukti Fisik", 3.2]] as const;
const questions = [
  "Konselor hadir tepat waktu sesuai jadwal",
  "Proses pendaftaran mudah dipahami",
  "Konselor menanggapi cerita dengan cepat",
  "Informasi jadwal diberikan dengan jelas",
  "Kerahasiaan cerita terasa terjaga",
  "Konselor kompeten menangani masalah",
  "Konselor mendengarkan dengan empati",
  "Ruang konseling nyaman dan tenang",
];
const dist = [[60, 30, 8, 2], [52, 35, 10, 3], [45, 38, 13, 4], [50, 33, 12, 5], [68, 25, 5, 2], [62, 30, 6, 2], [72, 22, 5, 1], [40, 36, 18, 6]];
const overall = [["Sangat Puas", 58], ["Puas", 30], ["Cukup Puas", 9], ["Tidak Puas", 3]] as const;
const feedback = [
  { period: "Nov 2026", kendala: "Slot jadwal sore cepat penuh.", saran: "Tambah slot di hari Jumat sore." },
  { period: "Okt 2026", kendala: "Ruangan agak bising saat jam istirahat.", saran: "Sediakan ruang konseling yang lebih kedap suara." },
  { period: "Okt 2026", kendala: "Belum tahu harus mengisi tautan detail masalah.", saran: "Beri pengingat sebelum mengirim pengajuan." },
  { period: "Sep 2026", kendala: "—", saran: "Sesi sangat membantu, semoga ada sesi lanjutan." },
];

const tone: Record<Status, string> = {
  Pending: "bg-accent text-accent-foreground",
  Berlangsung: "bg-secondary text-secondary-foreground",
  Selesai: "bg-primary text-primary-foreground",
};
const scale = ["Sangat Baik", "Baik", "Cukup", "Kurang"];
const scaleTone = ["bg-primary", "bg-primary/60", "bg-primary/30", "bg-destructive/60"];

function Bars({ data }: { data: readonly (readonly [string, number])[] }) {
  const total = data.reduce((a, [, v]) => a + v, 0);
  return (
    <ul className="space-y-3">
      {data.map(([k, v]) => {
        const pct = Math.round((v / total) * 100);
        return (
          <li key={k}>
            <div className="flex justify-between text-sm"><span>{k}</span><span className="text-muted-foreground">{pct}%</span></div>
            <div className="mt-1 h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${pct}%` }} /></div>
          </li>
        );
      })}
    </ul>
  );
}

function Card({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border bg-card p-6 ${className}`}>
      <h3 className="text-base font-semibold">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function AdminStudents() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"Semua" | Status>("Semua");
  const [period, setPeriod] = useState("Semua");

  const rows = useMemo(() => students.filter((s) =>
    (status === "Semua" || s.status === status) &&
    [s.name, s.nim, s.prodi, s.cat, s.counselor].join(" ").toLowerCase().includes(q.toLowerCase())), [q, status]);
  const fb = feedback.filter((f) => period === "Semua" || f.period === period);

  const stats = [["Total pengajuan", "100"], ["Pending", "14"], ["Berlangsung", "9"], ["Selesai", "77"]];

  return (
    <div className="counselor-portal">
      <Shell nav={adminNavigation.map((n) => n.label)} navigationItems={adminNavigation}>
        <section className="mx-auto max-w-6xl px-5 py-8 lg:px-9">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Portal Admin</p>
          <h1 className="mt-2 text-3xl font-semibold">Dashboard Analitik Mahasiswa</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">Rekap pengajuan, distribusi data, dan hasil survei kepuasan. Identitas lengkap hanya tampil di dashboard ini — rekapitulasi yang dibagikan tetap tersamarkan.</p>

          <h2 className="mt-10 text-lg font-semibold">Rekapitulasi pengajuan</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map(([l, v]) => (
              <div key={l} className="rounded-2xl border bg-card p-5">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{l}</p>
                <p className="mt-2 text-3xl font-semibold">{v}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-10 text-lg font-semibold">Distribusi data mahasiswa</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Card title="Berdasarkan kategori masalah"><Bars data={byCategory} /></Card>
            <Card title="Berdasarkan program studi"><Bars data={byProdi} /></Card>
          </div>

          <div className="mt-10 flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-lg font-semibold">Data Mahasiswa</h2>
            <div className="flex flex-wrap gap-2">
              <label className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari nama, NIM, konselor…" className="h-10 w-64 rounded-full border bg-background pl-9 pr-4 text-sm" />
              </label>
              <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className="h-10 rounded-full border bg-background px-4 text-sm">
                {["Semua", "Pending", "Berlangsung", "Selesai"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-4 overflow-x-auto rounded-2xl border bg-card">
            <table className="w-full min-w-[860px] text-sm">
              <thead className="bg-muted/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>{["Nama lengkap", "NIM", "Program studi", "Kategori", "Tanggal", "Status", "Konselor", "Laporan"].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
              </thead>
              <tbody>
                {rows.map((s) => (
                  <tr key={s.nim} className="border-t">
                    <td className="px-4 py-3 font-medium">{s.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.nim}</td>
                    <td className="px-4 py-3">{s.prodi}</td>
                    <td className="px-4 py-3">{s.cat}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.date}</td>
                    <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${tone[s.status]}`}>{s.status}</span></td>
                    <td className="px-4 py-3">{s.counselor}</td>
                    <td className="px-4 py-3">
                      <button type="button" className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-secondary">
                        <Download className="size-3.5" />Unduh
                      </button>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && <tr><td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">Tidak ada data yang cocok.</td></tr>}
              </tbody>
            </table>
          </div>

          <h2 className="mt-10 text-lg font-semibold">Analitik survei kepuasan</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <Card title="Tingkat pengisian">
              <p className="text-4xl font-semibold">62<span className="text-lg text-muted-foreground"> / 77</span></p>
              <p className="mt-1 text-sm text-muted-foreground">responden dari sesi selesai</p>
              <div className="mt-4 h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: "81%" }} /></div>
              <p className="mt-2 text-sm font-medium text-primary">81% tingkat pengisian</p>
            </Card>
            <Card title="Rata-rata skor per dimensi" className="md:col-span-2">
              <ul className="grid gap-3 sm:grid-cols-5">
                {dimensions.map(([d, v]) => (
                  <li key={d} className="rounded-xl bg-muted/60 p-4 text-center">
                    <p className="text-xs text-muted-foreground">{d}</p>
                    <p className="mt-1 flex items-center justify-center gap-1 text-2xl font-semibold"><Star className="size-4 fill-primary text-primary" />{v.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">dari 4</p>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <Card title="Distribusi jawaban per pertanyaan" className="md:col-span-2">
              <div className="mb-4 flex flex-wrap gap-3 text-xs">
                {scale.map((s, i) => <span key={s} className="flex items-center gap-1.5"><span className={`size-2.5 rounded-full ${scaleTone[i]}`} />{s}</span>)}
              </div>
              <ul className="space-y-3">
                {questions.map((qq, i) => (
                  <li key={qq}>
                    <p className="text-sm"><span className="text-muted-foreground">{i + 1}.</span> {qq}</p>
                    <div className="mt-1 flex h-3 overflow-hidden rounded-full">
                      {(dist[i] ?? []).map((v, j) => <div key={j} className={scaleTone[j]} style={{ width: `${v}%` }} title={`${scale[j]}: ${v}%`} />)}
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
            <Card title="Kepuasan keseluruhan (Q9)"><Bars data={overall} /></Card>
          </div>

          <div className="mt-4 rounded-2xl border bg-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 text-base font-semibold"><MessageSquareText className="size-4 text-primary" />Kendala & Saran Mahasiswa</h3>
              <select value={period} onChange={(e) => setPeriod(e.target.value)} className="h-9 rounded-full border bg-background px-4 text-sm">
                {["Semua", "Nov 2026", "Okt 2026", "Sep 2026"].map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Ditampilkan tanpa identitas mahasiswa.</p>
            <ul className="mt-4 divide-y">
              {fb.map((f, i) => (
                <li key={i} className="grid gap-2 py-3 text-sm md:grid-cols-[100px_1fr_1fr]">
                  <span className="text-muted-foreground">{f.period}</span>
                  <span><span className="text-xs text-muted-foreground">Kendala: </span>{f.kendala}</span>
                  <span><span className="text-xs text-muted-foreground">Saran: </span>{f.saran}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 border-t pt-4">
              <button type="button" className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-secondary">
                <Download className="size-4" />Unduh laporan tahunan
              </button>
            </div>
          </div>
        </section>
      </Shell>
    </div>
  );
}
