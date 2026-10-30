import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Clock, Users, Repeat, QrCode, ExternalLink, ArrowLeft } from "lucide-react";

import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/daftar")({
  head: () => ({
    meta: [
      { title: "Daftar Konseling — RuangPulih" },
      { name: "description", content: "Formulir pendaftaran konseling tatap muka Fakultas Kedokteran UPN Veteran Jakarta." },
      { property: "og:title", content: "Daftar Konseling — RuangPulih" },
      { property: "og:description", content: "Ajukan sesi konseling tatap muka dengan konselor FK UPN Veteran Jakarta." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Daftar,
});

const categories: { name: string; items: string[] }[] = [
  { name: "Masalah Akademik", items: ["Kesulitan memahami materi perkuliahan", "Nilai akademik menurun", "Beban tugas dan ujian yang terlalu banyak", "Kesulitan menghadapi praktikum atau skill lab", "Cemas menghadapi ujian", "Kehilangan motivasi belajar"] },
  { name: "Masalah Manajemen Waktu", items: ["Sulit membagi waktu antara kuliah dan kegiatan lain", "Sering menunda pekerjaan", "Kesulitan mengatur jadwal belajar", "Merasa tidak memiliki waktu untuk istirahat"] },
  { name: "Masalah Pribadi", items: ["Merasa kehilangan motivasi", "Kesulitan beradaptasi dengan lingkungan kampus", "Merasa tidak percaya diri", "Mengalami masalah dalam mengambil keputusan", "Merasa kesulitan memahami atau mengelola diri sendiri"] },
  { name: "Masalah Sosial", items: ["Kesulitan beradaptasi dengan teman baru", "Konflik dengan teman", "Merasa kesepian", "Kesulitan bekerja dalam kelompok", "Mengalami masalah dengan lingkungan pertemanan"] },
  { name: "Masalah Keluarga", items: ["Konflik dengan keluarga", "Tekanan atau ekspektasi dari orang tua", "Masalah komunikasi dengan keluarga", "Kondisi keluarga yang memengaruhi kegiatan perkuliahan"] },
  { name: "Masalah Finansial", items: ["Kesulitan memenuhi kebutuhan perkuliahan", "Kekhawatiran mengenai biaya pendidikan", "Masalah keuangan pribadi", "Tekanan karena harus bekerja sambil kuliah"] },
  { name: "Masalah Karier", items: ["Bingung menentukan pilihan karier", "Tidak yakin dengan jurusan atau bidang yang dipilih"] },
];

const counselors = [
  { name: "dr. Ratna Sari, M.Pd.Ked", role: "Dosen Program Studi", days: { Senin: ["13.00", "14.00", "15.00"], Rabu: ["13.00", "15.00"] } },
  { name: "Andika Pratama, M.Psi., Psikolog", role: "Psikolog Ahli", days: { Selasa: ["09.00", "10.00"], Kamis: ["10.00", "11.00", "13.00"] } },
  { name: "dr. Maya Lestari, Sp.KJ", role: "Dosen Program Studi", days: { Jumat: ["09.00", "10.00", "14.00"] } },
] as const;

const profile = { nama: "Nadia Putri", nim: "2310211045", prodi: "Kedokteran (S1)", hp: "0812-3456-7890" };

const policies = [
  { icon: Users, text: "Sesi dilakukan tatap muka di ruang konseling fakultas." },
  { icon: Clock, text: "Durasi maksimal 1 jam per sesi." },
  { icon: Repeat, text: "Maksimal 2 pengajuan untuk kategori masalah yang sama." },
];

function Daftar() {
  const [checked, setChecked] = useState<string[]>([]);
  const [other, setOther] = useState("");
  const [useOther, setUseOther] = useState(false);
  const [consent, setConsent] = useState([false, false, false]);
  const [counselor, setCounselor] = useState("");
  const [day, setDay] = useState("");
  const [slot, setSlot] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [done, setDone] = useState(false);

  const c = counselors.find((x) => x.name === counselor);
  const dayOptions = c ? Object.keys(c.days) : [];
  const slotOptions = c && day ? (c.days as Record<string, readonly string[]>)[day] ?? [] : [];

  const toggle = (s: string) => setChecked((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));
  const hasCategory = checked.length > 0 || (useOther && other.trim().length > 0);
  const valid = hasCategory && consent.every(Boolean) && counselor && day && slot;

  if (done) {
    return (
      <Page>
        <section className="mx-auto max-w-xl px-6 py-16 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
          <h1 className="mt-4 text-3xl md:text-4xl">Pengajuan terkirim</h1>
          <p className="mt-3 text-muted-foreground">
            Status pengajuanmu sekarang <strong className="text-foreground">Pending</strong> — menunggu respons {counselor} untuk {day}, pukul {slot}.
          </p>
          <Link to="/status" className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
            Lihat Status Pengajuan
          </Link>
          <div>
            <Link to="/" className="mt-6 inline-block text-sm text-primary underline-offset-4 hover:underline">Kembali ke Beranda</Link>
          </div>
        </section>
      </Page>
    );
  }

  if (stage === "link") {
    return (
      <Page>
        <section className="mx-auto max-w-3xl px-6 py-14">
          <button onClick={() => setStage("form")} className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> Kembali ke formulir
          </button>
          <p className="mt-6 text-sm font-medium text-primary">Langkah terakhir</p>
          <h1 className="mt-3 text-4xl md:text-5xl">Isi formulir <em className="text-primary">detail masalah</em>.</h1>
          <p className="mt-4 max-w-lg text-muted-foreground">
            Sebelum mengirim pengajuan, isi detail masalah dan pertanyaan tambahan di formulir Fakultas Kedokteran lewat tautan atau pindai kode QR di bawah.
          </p>

          <div className="mt-8 grid gap-6 rounded-2xl border bg-card p-6 sm:grid-cols-[auto_1fr] sm:items-center">
            <div className="mx-auto grid h-40 w-40 place-items-center rounded-xl border-2 border-dashed bg-muted">
              <QrCode className="h-20 w-20 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold">Formulir Detail Konseling FK</p>
              <p className="mt-1 text-sm text-muted-foreground">Pindai kode QR dengan ponsel, atau buka tautan di tab baru.</p>
              <a href="#" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium hover:bg-muted">
                Buka formulir <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-2xl border bg-accent/40 p-5 text-sm">
            <input type="checkbox" className="mt-0.5 accent-[var(--primary)]" checked={linkDone} onChange={() => setLinkDone((v) => !v)} />
            Saya sudah mengisi formulir detail masalah melalui tautan / kode QR di atas.
          </label>

          <div className="mt-10 flex items-center justify-end gap-4">
            {!linkDone && <p className="text-sm text-muted-foreground">Centang konfirmasi untuk mengirim.</p>}
            <button disabled={!linkDone} onClick={() => setConfirmOpen(true)} className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity disabled:opacity-40">
              Kirim Pengajuan
            </button>
          </div>
        </section>
        {dialog}
      </Page>
    );
  }

  return (
    <Page>
      <section className="mx-auto max-w-3xl px-6 py-14">
        <p className="text-sm font-medium text-primary">Daftar Konseling</p>
        <h1 className="mt-3 text-4xl md:text-5xl">Ajukan sesi <em className="text-primary">konseling</em>.</h1>
        <p className="mt-4 max-w-lg text-muted-foreground">Jadwal yang bisa dipilih hanya untuk minggu ini.</p>

        <div className="mt-8 rounded-2xl border bg-accent/40 p-6">
          <p className="font-semibold">Kebijakan layanan</p>
          <ul className="mt-3 space-y-2">
            {policies.map((p) => (
              <li key={p.text} className="flex items-start gap-3 text-sm">
                <p.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {p.text}
              </li>
            ))}
          </ul>
        </div>

        <Step n={1} title="Data diri" note="Diambil dari Profil. Ubah lewat menu Profil.">
          <dl className="grid gap-4 sm:grid-cols-2">
            {[["Nama", profile.nama], ["NIM", profile.nim], ["Program studi", profile.prodi], ["Nomor HP", profile.hp]].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-muted px-4 py-3">
                <dt className="text-xs text-muted-foreground">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </Step>

        <Step n={2} title="Kategori masalah" note="Boleh pilih lebih dari satu.">
          <div className="space-y-3">
            {categories.map((cat) => {
              const selected = checked.includes(cat.name);
              return (
                <label key={cat.name} className={`block cursor-pointer rounded-xl border px-4 py-3 transition-colors ${selected ? "border-primary bg-accent" : "hover:bg-muted"}`}>
                  <span className="flex items-center gap-2.5 text-sm font-semibold">
                    <input type="checkbox" className="accent-[var(--primary)]" checked={selected} onChange={() => toggle(cat.name)} />
                    {cat.name}
                  </span>
                  <p className="mt-1.5 pl-6 text-xs leading-relaxed text-muted-foreground">Contohnya: {cat.items.join(", ")}</p>
                </label>
              );
            })}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold">
                <input type="checkbox" className="accent-[var(--primary)]" checked={useOther} onChange={(e) => setUseOther(e.target.checked)} /> Lainnya (Other)
              </label>
              {useOther && (
                <input value={other} onChange={(e) => setOther(e.target.value)} placeholder="Tuliskan singkat masalahmu…" className="mt-2 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
              )}
            </div>
          </div>
        </Step>

        <Step n={3} title="Pilih konselor & jadwal">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Konselor">
              <select value={counselor} onChange={(e) => { setCounselor(e.target.value); setDay(""); setSlot(""); }} className="w-full rounded-lg border bg-background px-3 py-2 text-sm">
                <option value="">Pilih konselor</option>
                {counselors.map((x) => <option key={x.name} value={x.name}>{x.name} — {x.role}</option>)}
              </select>
            </Field>
            <Field label="Hari">
              <select disabled={!c} value={day} onChange={(e) => { setDay(e.target.value); setSlot(""); }} className="w-full rounded-lg border bg-background px-3 py-2 text-sm disabled:opacity-50">
                <option value="">Pilih hari</option>
                {dayOptions.map((d) => <option key={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="Sesi (1 jam)">
              <select disabled={!day} value={slot} onChange={(e) => setSlot(e.target.value)} className="w-full rounded-lg border bg-background px-3 py-2 text-sm disabled:opacity-50">
                <option value="">Pilih sesi</option>
                {slotOptions.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>
        </Step>

        <Step n={4} title="Persetujuan (informed consent)">
          <div className="space-y-3">
            {[
              "Saya menyatakan data yang saya isi benar dan jujur.",
              "Saya memahami data saya digunakan hanya selama proses konseling.",
              "Saya bersedia sesi didokumentasikan dengan foto.",
            ].map((t, i) => (
              <label key={t} className="flex cursor-pointer items-start gap-3 text-sm">
                <input type="checkbox" className="mt-0.5 accent-[var(--primary)]" checked={consent[i]} onChange={() => setConsent((p) => p.map((v, j) => (j === i ? !v : v)))} />
                {t}
              </label>
            ))}
          </div>
        </Step>

        <div className="mt-10 flex items-center justify-end gap-4">
          {!valid && <p className="text-sm text-muted-foreground">Lengkapi semua langkah untuk melanjutkan.</p>}
          <button disabled={!valid} onClick={() => { setStage("link"); window.scrollTo(0, 0); }} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity disabled:opacity-40">
            Selanjutnya <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sudah yakin isi data dengan benar?</AlertDialogTitle>
            <AlertDialogDescription>
              Pengajuan ke {counselor} pada {day}, pukul {slot}. Data tidak bisa diubah setelah dikirim, tapi kamu masih bisa membatalkan selama status Pending.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Periksa lagi</AlertDialogCancel>
            <AlertDialogAction onClick={() => setDone(true)}>Ya, kirim</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Page>
  );
}

function Step({ n, title, note, children }: { n: number; title: string; note?: string; children: React.ReactNode }) {
  return (
    <div className="mt-8 rounded-2xl border bg-card p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">{n}</span>
        <div>
          <p className="font-semibold">{title}</p>
          {note && <p className="text-xs text-muted-foreground">{note}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center px-6 py-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm font-medium transition hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
          </Link>
        </div>
      </header>
      <main className="min-w-0 flex-1">{children}</main>
      <footer className="mt-20 border-t py-8 text-center text-xs text-muted-foreground">
        RuangPulih · Fakultas Kedokteran UPN "Veteran" Jakarta · Konseling umum, non-medis
      </footer>
    </div>
  );
}
