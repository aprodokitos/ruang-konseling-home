import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { QrCode, CalendarDays, MapPin, XCircle, FileText, Plus, History } from "lucide-react";
import { Shell, Badge } from "@/components/Shell";

export const Route = createFileRoute("/status")({
  head: () => ({
    meta: [
      { title: "Status Konseling — RuangPulih" },
      { name: "description", content: "Lihat status pengajuan dan riwayat sesi konselingmu di RuangPulih FK UPN Veteran Jakarta." },
      { property: "og:title", content: "Status Konseling — RuangPulih" },
      { property: "og:description", content: "Pantau status pengajuan konseling tatap muka dan riwayat sesimu." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Status,
});

const active = {
  category: "Masalah Akademik",
  counselor: "Andika Pratama, M.Psi., Psikolog",
  day: "Kamis, 5 November",
  slot: "09.00–10.00",
  place: "Ruang BK Lt. 2",
  status: "Diterima",
  sesi: "Sesi 1 dari 2 untuk kategori ini",
};

const history = [
  { id: "RP-2409", category: "Masalah Manajemen Waktu", counselor: "dr. Ratna Sari, M.Pd.Ked", date: "Rabu, 22 Oktober", status: "Selesai" },
  { id: "RP-2385", category: "Masalah Sosial", counselor: "dr. Maya Lestari, Sp.KJ", date: "Senin, 13 Oktober", status: "Selesai" },
  { id: "RP-2341", category: "Masalah Pribadi", counselor: "dr. Ratna Sari, M.Pd.Ked", date: "Jumat, 3 Oktober", status: "Ditolak" },
];

function Status() {
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  return (
    <Shell nav={["Beranda", "Jadwal", "Daftar", "Status", "Profil"]}>
      <section className="mx-auto max-w-4xl px-6 py-14">
        <p className="text-sm font-medium text-primary">Status Konseling</p>
        <h1 className="mt-3 text-4xl md:text-5xl">Pantau <em className="text-primary">pengajuanmu</em>.</h1>
        <p className="mt-4 max-w-lg text-muted-foreground">Lihat status pengajuan aktif dan riwayat sesi konseling yang pernah kamu ikuti.</p>

        {cancelled ? (
          <div className="mt-10 rounded-2xl border border-dashed bg-muted/40 p-8 text-center">
            <p className="font-semibold">Tidak ada pengajuan aktif</p>
            <p className="mt-1 text-sm text-muted-foreground">Ajukan kembali kapan pun kamu siap bercerita.</p>
            <Link to="/daftar" className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
              <Plus className="h-4 w-4" /> Ajukan Konseling
            </Link>
          </div>
        ) : (
          <div className="mt-10 rounded-3xl border bg-card p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Pengajuan aktif · {active.category}</p>
                <p className="mt-2 font-serif text-2xl">{active.counselor}</p>
              </div>
              <Badge s={active.status} />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[[CalendarDays, "Jadwal", `${active.day} · ${active.slot}`], [MapPin, "Lokasi", active.place]].map(([I, k, v]) => {
                const Icon = I as typeof MapPin;
                return (
                  <div key={k as string} className="flex items-start gap-3 rounded-xl bg-muted px-4 py-3">
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">{k as string}</p>
                      <p className="text-sm font-medium">{v as string}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex flex-col items-center gap-4 rounded-2xl border bg-secondary/50 p-6 sm:flex-row">
              <div className="grid h-36 w-36 shrink-0 place-items-center rounded-xl border-2 border-dashed bg-background">
                <QrCode className="h-16 w-16 text-muted-foreground" />
              </div>
              <div className="text-center sm:text-left">
                <p className="font-semibold">QR kedatangan</p>
                <p className="mt-1 text-sm text-muted-foreground">Tunjukkan kode ini kepada konselor saat sesi dimulai.</p>
                <p className="mt-2 text-sm">{active.sesi}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
                <FileText className="h-4 w-4" /> Isi formulir detail
              </a>
              <button
                onClick={() => setCancelOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium text-destructive transition hover:bg-destructive/10"
              >
                <XCircle className="h-4 w-4" /> Batalkan pengajuan
              </button>
            </div>
          </div>
        )}

        <div className="mt-12">
          <h2 className="flex items-center gap-2 text-2xl"><History className="h-5 w-5 text-primary" /> Riwayat sesi</h2>
          <div className="mt-5 space-y-3">
            {history.map((h) => (
              <div key={h.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-4">
                <div>
                  <p className="font-semibold">{h.category} · <span className="font-mono text-xs text-muted-foreground">{h.id}</span></p>
                  <p className="text-xs text-muted-foreground">{h.counselor} · {h.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge s={h.status} />
                  {h.status === "Selesai" && (
                    <a href="#" className="text-xs font-medium text-primary underline-offset-4 hover:underline">Lihat rekomendasi</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Shell>
  );
}
