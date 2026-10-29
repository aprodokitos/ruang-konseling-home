import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Play, Square, Upload } from "lucide-react";
import { Shell, Stat, Badge } from "@/components/Shell";

export const Route = createFileRoute("/konselor")({
  head: () => ({
    meta: [
      { title: "Dashboard Konselor — RuangPulih" },
      { name: "description", content: "Kelola pengajuan, sesi, dan tindak lanjut konseling mahasiswa." },
      { property: "og:title", content: "Dashboard Konselor — RuangPulih" },
      { property: "og:description", content: "Kelola pengajuan dan sesi konseling." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Konselor,
});

const list = [
  { n: "Nadia Putri", nim: "2210211042", k: "Akademik", w: "Kam, 5 Nov · 09.00", s: "Menunggu" },
  { n: "Rizky Ramadhan", nim: "2310211017", k: "Pribadi", w: "Kam, 5 Nov · 10.30", s: "Diterima" },
  { n: "Salsa Amalia", nim: "2110211088", k: "Keluarga", w: "Rab, 4 Nov · 13.00", s: "Selesai" },
];

function Konselor() {
  const [run, setRun] = useState(false);
  const [sec, setSec] = useState(3600);
  useEffect(() => {
    if (!run) return;
    const t = setInterval(() => setSec((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [run]);
  const mm = String(Math.floor(sec / 60)).padStart(2, "0"), ss = String(sec % 60).padStart(2, "0");
  return (
    <Shell nav={["Dashboard", "List Konseling", "Profil"]}>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-4xl">Selamat siang, Andika</h1>
        <p className="text-muted-foreground">Psikolog Ahli · 2 sesi hari ini</p>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <Stat label="Menunggu" value="3" /><Stat label="Minggu ini" value="7" /><Stat label="Selesai" value="42" /><Stat label="Kepuasan" value="4.8" hint="dari 5" />
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl bg-primary p-7 text-primary-foreground">
            <p className="text-sm opacity-80">Sesi berikutnya · Rizky R.</p>
            <p className="mt-4 font-serif text-6xl tabular-nums">{mm}:{ss}</p>
            <p className="text-xs opacity-70">Batas maksimal 1 jam</p>
            <button onClick={() => setRun(!run)} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary-foreground py-3 text-sm font-semibold text-primary">
              {run ? <><Square className="h-4 w-4" /> Akhiri Sesi</> : <><Play className="h-4 w-4" /> Mulai Sesi</>}
            </button>
          </div>
          <div className="rounded-3xl border bg-card p-6 md:col-span-2">
            <h2 className="text-2xl">Kesimpulan & rekomendasi</h2>
            <textarea rows={4} placeholder="Tulis kesimpulan sesi…" className="mt-4 w-full rounded-xl border bg-background p-3 text-sm outline-none" />
            <div className="mt-3 flex gap-3">
              <button className="flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold"><Upload className="h-3.5 w-3.5" /> Unggah foto sesi</button>
              <button className="ml-auto rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground">Simpan</button>
            </div>
          </div>
        </div>
        <h2 className="mt-12 text-2xl">List konseling</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border bg-card">
          {list.map((r) => (
            <div key={r.nim} className="flex flex-wrap items-center gap-4 border-b p-4 last:border-0">
              <div className="min-w-48 flex-1"><p className="font-semibold">{r.n}</p><p className="text-xs text-muted-foreground">{r.nim} · {r.k}</p></div>
              <p className="text-sm text-muted-foreground">{r.w}</p>
              <Badge s={r.s} />
              {r.s === "Menunggu" && <div className="flex gap-2"><button className="rounded-full border px-3 py-1.5 text-xs">Tolak</button><button className="rounded-full bg-primary px-3 py-1.5 text-xs text-primary-foreground">Terima</button></div>}
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}
