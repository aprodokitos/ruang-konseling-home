import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarDays, MapPin, XCircle, FileText, Plus, History, ChevronDown, CheckCircle2 } from "lucide-react";
import { Shell, Badge } from "@/components/Shell";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  { id: "RP-2409", category: "Masalah Manajemen Waktu", counselor: "dr. Ratna Sari, M.Pd.Ked", date: "Rabu, 22 Oktober", status: "Selesai", rec: { ringkasan: "Mahasiswa menyampaikan kesulitan membagi waktu antara kuliah, organisasi, dan istirahat. Sesi berfokus pada pemetaan prioritas mingguan.", saran: ["Susun jadwal harian dengan blok waktu belajar dan istirahat", "Coba teknik pomodoro selama 2 minggu", "Catat aktivitas harian untuk evaluasi mandiri"], tindakLanjut: "Evaluasi mandiri; konseling lanjutan dapat diajukan bila diperlukan." } },
  { id: "RP-2385", category: "Masalah Sosial", counselor: "dr. Maya Lestari, Sp.KJ", date: "Senin, 13 Oktober", status: "Selesai", rec: { ringkasan: "Mahasiswa merasa sulit menyesuaikan diri dengan lingkungan baru di kampus. Sesi membahas cara memulai percakapan dan membangun kepercayaan diri.", saran: ["Ikut kegiatan organisasi atau komunitas kampus yang sesuai minat", "Latih memulai percakapan kecil dengan rekelas", "Jaga komunikasi dengan keluarga sebagai sumber dukungan"], tindakLanjut: "Dianjurkan melanjutkan ke sesi berikutnya dalam kategori yang sama." } },
  { id: "RP-2341", category: "Masalah Pribadi", counselor: "dr. Ratna Sari, M.Pd.Ked", date: "Jumat, 3 Oktober", status: "Ditolak", alasan: "Sedang Rapat" },
];

function Status() {
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [openRec, setOpenRec] = useState<string | null>(null);

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


            <div className="mt-6 flex flex-wrap gap-3">
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
              <div key={h.id} className="rounded-2xl border bg-card">
                <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div>
                    <p className="font-semibold">{h.category} · <span className="font-mono text-xs text-muted-foreground">{h.id}</span></p>
                    <p className="text-xs text-muted-foreground">{h.counselor} · {h.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge s={h.status} />
                    {h.status === "Selesai" && h.rec && (
                      <button
                        onClick={() => setOpenRec(openRec === h.id ? null : h.id)}
                        aria-expanded={openRec === h.id}
                        className="inline-flex items-center gap-1 rounded-full text-xs font-medium text-primary transition hover:bg-primary/10 px-3 py-1.5"
                      >
                        Lihat rekomendasi
                        <ChevronDown className={"h-3.5 w-3.5 transition-transform " + (openRec === h.id ? "rotate-180" : "")} />
                      </button>
                    )}
                    {h.status === "Ditolak" && h.alasan && (
                      <button
                        onClick={() => setOpenRec(openRec === h.id ? null : h.id)}
                        aria-expanded={openRec === h.id}
                        className="inline-flex items-center gap-1 rounded-full text-xs font-medium text-destructive transition hover:bg-destructive/10 px-3 py-1.5"
                      >
                        Lihat alasan
                        <ChevronDown className={"h-3.5 w-3.5 transition-transform " + (openRec === h.id ? "rotate-180" : "")} />
                      </button>
                    )}
                  </div>
                </div>
                {h.status === "Selesai" && h.rec && openRec === h.id && (
                  <div className="border-t bg-muted/40 px-4 py-4 text-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ringkasan sesi</p>
                    <p className="mt-1 leading-relaxed">{h.rec.ringkasan}</p>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rekomendasi</p>
                    <ul className="mt-1 space-y-1.5">
                      {h.rec.saran.map((s, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <span className="leading-relaxed">{s}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tindak lanjut</p>
                    <p className="mt-1 leading-relaxed">{h.rec.tindakLanjut}</p>
                  </div>
                )}
                {h.status === "Ditolak" && h.alasan && openRec === h.id && (
                  <div className="border-t bg-muted/40 px-4 py-4 text-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Alasan penolakan</p>
                    <p className="mt-1 leading-relaxed">{h.alasan}</p>
                    <p className="mt-3 text-xs text-muted-foreground">Kalau mau mengajukan lagi, isi form pengajuan yang baru ya.</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Batalkan pengajuan ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Pengajuan ke {active.counselor} pada {active.day} akan dibatalkan dan jadwalnya dibuka untuk mahasiswa lain.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Jangan batalkan</AlertDialogCancel>
            <AlertDialogAction onClick={() => setCancelled(true)}>Ya, batalkan</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Shell>
  );
}
