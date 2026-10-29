import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, CalendarDays, ClipboardCheck, Clock, ShieldCheck } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { Shell, Badge } from "@/components/Shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RuangPulih — E-Counseling FK UPN Veteran Jakarta" },
      { name: "description", content: "Ajukan sesi konseling tatap muka dengan dosen atau psikolog Fakultas Kedokteran secara mudah dan rahasia." },
      { property: "og:title", content: "RuangPulih — E-Counseling FK" },
      { property: "og:description", content: "Konseling tatap muka untuk mahasiswa FK UPN Veteran Jakarta." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const faqs = [
  { q: "Bagaimana jika saya tertinggal materi kuliah?", a: "Diskusikan dengan dosen pembimbing akademik, susun jadwal belajar mingguan, dan manfaatkan kelompok belajar angkatan." },
  { q: "Apakah identitas saya dirahasiakan?", a: "Ya. Identitas Anda hanya terlihat oleh konselor yang menangani. Admin hanya melihat kode samaran." },
  { q: "Berapa lama satu sesi konseling?", a: "Setiap sesi tatap muka maksimal 1 jam, dimulai saat konselor menekan tombol Mulai Sesi." },
  { q: "Berapa kali saya bisa mengajukan konseling?", a: "Maksimal 2 sesi untuk kategori masalah yang sama." },
];

const counselors = [
  { n: "dr. Ratna Sari, M.Pd.Ked", t: "Dosen Program Studi", d: "Senin & Rabu · 13.00–16.00" },
  { n: "Andika Pratama, M.Psi., Psikolog", t: "Psikolog Ahli", d: "Selasa & Kamis · 09.00–12.00" },
  { n: "dr. Maya Hapsari, Sp.KJ", t: "Dosen Program Studi", d: "Jumat · 10.00–14.00" },
];

function Index() {
  const [q, setQ] = useState("");
  return (
    <Shell nav={["Beranda", "Jadwal", "Daftar", "Status", "Profil"]}>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-primary">E-Counseling Fakultas Kedokteran</p>
          <h1 className="mt-4 text-5xl leading-[1.05] md:text-6xl">Ruang aman untuk <em className="text-primary">bercerita</em> dan pulih.</h1>
          <p className="mt-5 max-w-md text-muted-foreground">Ajukan sesi konseling tatap muka dengan dosen atau psikolog. Rahasia, terjadwal, dan tanpa ribet.</p>
          <div className="mt-8 flex gap-3">
            <button className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20">Ajukan Konseling</button>
            <button className="rounded-full border px-6 py-3 text-sm font-semibold">Lihat Jadwal</button>
          </div>
          <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="h-4 w-4 text-primary" /> Masuk dengan email kampus via Google</p>
        </div>
        <img src={hero} alt="Suasana sesi konseling" width={1200} height={912} className="aspect-[4/3] w-full rounded-[2rem] object-cover" />
      </section>

      <section className="mx-auto max-w-3xl px-6">
        <FaqChat />
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-6">
        <h2 className="text-3xl">Alur konseling</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {[[CalendarDays, "Pilih jadwal", "Lihat profil & jadwal konselor"], [ClipboardCheck, "Ajukan", "Isi kategori & keluhan singkat"], [Clock, "Sesi tatap muka", "Maks. 1 jam dengan timer"], [ShieldCheck, "Tindak lanjut", "Baca rekomendasi & isi survei"]].map(([I, t, d], i) => {
            const Icon = I as typeof Clock;
            return (
              <div key={i} className="rounded-2xl bg-secondary p-6">
                <span className="font-serif text-sm text-primary">0{i + 1}</span>
                <Icon className="mt-3 h-6 w-6 text-primary" />
                <p className="mt-4 font-semibold">{t as string}</p>
                <p className="text-sm text-muted-foreground">{d as string}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto mt-20 grid max-w-6xl gap-8 px-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <h2 className="text-3xl">Konselor tersedia</h2>
          <div className="mt-6 space-y-3">
            {counselors.map((c) => (
              <div key={c.n} className="flex items-center gap-4 rounded-2xl border bg-card p-4">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-accent font-serif text-accent-foreground">{c.n.replace(/^dr\. /, "")[0]}</div>
                <div className="flex-1"><p className="font-semibold">{c.n}</p><p className="text-xs text-muted-foreground">{c.t} · {c.d}</p></div>
                <button className="rounded-full border px-4 py-2 text-xs font-semibold">Pilih</button>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-3xl">Status saya</h2>
          <div className="mt-6 rounded-2xl border bg-card p-5">
            <div className="flex items-center justify-between"><p className="font-semibold">Akademik</p><Badge s="Diterima" /></div>
            <p className="mt-1 text-sm text-muted-foreground">Kamis, 5 Nov · 09.00 · Ruang BK Lt.2</p>
            <p className="mt-1 text-sm text-muted-foreground">Andika Pratama, M.Psi.</p>
            <div className="mt-4 h-1.5 rounded-full bg-muted"><div className="h-full w-1/2 rounded-full bg-primary" /></div>
            <p className="mt-2 text-xs text-muted-foreground">Sesi 1 dari 2 untuk kategori ini</p>
          </div>
        </div>
      </section>
    </Shell>
  );
}
