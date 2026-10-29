import { createFileRoute } from "@tanstack/react-router";
import { Download, Lock } from "lucide-react";
import { Shell, Stat } from "@/components/Shell";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Dashboard Admin — RuangPulih" },
      { name: "description", content: "Analitik konseling dengan identitas mahasiswa tersamarkan." },
      { property: "og:title", content: "Dashboard Admin — RuangPulih" },
      { property: "og:description", content: "Analitik konseling tersamarkan." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Admin,
});

const cats = [["Akademik", 48], ["Pribadi", 27], ["Keluarga", 15], ["Sosial", 10]] as const;
const rows = [
  ["RP-7K2Q", "2022", "Okt 2026", "Akademik", "2"],
  ["RP-M93X", "2023", "Okt 2026", "Pribadi", "1"],
  ["RP-A41F", "2021", "Sep 2026", "Keluarga", "2"],
  ["RP-Z8TC", "2022", "Sep 2026", "Akademik", "1"],
];

function Admin() {
  return (
    <Shell nav={["Dashboard Mahasiswa", "Dashboard Konselor", "Kelola Akun", "Profil"]}>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-wrap items-end gap-4">
          <div><h1 className="text-4xl">Dashboard Mahasiswa</h1><p className="text-muted-foreground">Semester Ganjil 2026/2027</p></div>
          <button className="ml-auto flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"><Download className="h-4 w-4" /> Unduh Laporan Tersamarkan</button>
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-secondary px-4 py-3 text-sm text-secondary-foreground">
          <Lock className="h-4 w-4" /> Identitas mahasiswa ditampilkan sebagai kode samaran. Isi kesimpulan & foto sesi tidak dapat diakses.
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <Stat label="Total pengajuan" value="128" /><Stat label="Sesi selesai" value="104" /><Stat label="Rata-rata durasi" value="47m" /><Stat label="Kepuasan" value="4.7" hint="dari 5" />
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border bg-card p-6">
            <h2 className="text-2xl">Kategori masalah</h2>
            <div className="mt-5 space-y-4">
              {cats.map(([c, v]) => (
                <div key={c}><div className="flex justify-between text-sm"><span>{c}</span><span className="text-muted-foreground">{v}%</span></div>
                  <div className="mt-1.5 h-2 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${v}%` }} /></div></div>
              ))}
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl border bg-card md:col-span-2">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>{["Kode samaran", "Angkatan", "Bulan", "Kategori", "Sesi"].map((h) => <th key={h} className="px-5 py-3 font-medium">{h}</th>)}</tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r[0]} className="border-t">
                    {r.map((c, i) => <td key={i} className={`px-5 py-3 ${i === 0 ? "font-mono font-semibold text-primary" : ""}`}>{c}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="border-t px-5 py-3 text-xs text-muted-foreground">Kelompok dengan kurang dari 5 mahasiswa disembunyikan (aturan agregat minimum).</p>
          </div>
        </div>
      </div>
    </Shell>
  );
}
