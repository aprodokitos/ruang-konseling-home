import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, ChevronRight, Database, History, KeyRound, LogOut, ShieldCheck, User } from "lucide-react";
import { Shell } from "@/components/Shell";
import { Badge } from "@/components/ui/badge";
import { adminNavigation } from "@/lib/admin-navigation";
import { MAX_ACTIVE_ADMINS, activeAdminCount, adminProfile, sampleAccounts } from "@/lib/admin-accounts";

export const Route = createFileRoute("/admin_/profil")({
  head: () => ({ meta: [
    { title: "Profil Admin — RuangPulih" },
    { name: "description", content: "Data akun Admin RuangPulih Fakultas Kedokteran UPN Veteran Jakarta: identitas, role, dan log akses." },
    { property: "og:title", content: "Profil Admin — RuangPulih" },
    { property: "og:description", content: "Identitas admin, batas akun Admin, kerahasiaan data, dan log akses RuangPulih." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: AdminProfilePage,
});

const accessLog = [
  { time: "5 Nov 2026 · 10.12", action: "Membuka laporan individu", detail: "Alya Rahmadani · sesi 28 Okt 2026" },
  { time: "4 Nov 2026 · 14.05", action: "Menambah pengguna", detail: "Rizky Maulana sebagai Mahasiswa" },
  { time: "3 Nov 2026 · 09.31", action: "Menyetujui pengajuan akun", detail: "Fikri Ramadhan sebagai Konselor" },
  { time: "1 Nov 2026 · 16.47", action: "Mengunduh rekapitulasi tahunan", detail: "Periode 2025 · tersamarkan" },
];

function AdminProfilePage() {
  const profile = adminProfile(sampleAccounts);
  const seats = activeAdminCount(sampleAccounts);
  const initials = profile.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  const fields: { label: string; value: string; wide?: boolean }[] = [
    { label: "Nama lengkap & gelar", value: profile.name },
    { label: "Jabatan", value: profile.position },
    { label: "Email kampus (login Google)", value: profile.email, wide: true },
    { label: "Nomor telepon", value: profile.phone },
    { label: "Role", value: profile.role },
    { label: "Status akun", value: profile.status },
    { label: "Cara akun dibuat", value: profile.source === "Developer" ? "Dimasukkan developer (Admin pertama)" : profile.source },
    { label: "Bergabung sejak", value: profile.joined },
  ];

  return (
    <div className="counselor-portal">
      <Shell nav={adminNavigation.map((item) => item.label)} navigationItems={adminNavigation}>
        <div className="border-b bg-card px-5 py-4 lg:px-9">
          <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground sm:text-sm">Portal Admin <ChevronRight className="mx-2 inline size-3" /><span className="font-medium text-foreground">Profil</span></p>
            <div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">{initials}</span><div><p className="text-xs font-semibold">{profile.name}</p><p className="text-xs text-muted-foreground">{profile.position}</p></div></div>
          </div>
        </div>

        <section className="mx-auto max-w-3xl px-5 py-8 lg:px-9">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Akun Admin</p>
          <h1 className="mt-2 text-3xl font-semibold">Profil</h1>
          <p className="mt-3 max-w-lg text-sm text-muted-foreground">Data admin terisi otomatis dari database. Kamu tidak mengubahnya sendiri — nama, email, role, dan status akun dikelola Admin lainnya lewat Kelola Akun &amp; Role.</p>

          <div className="mt-8 rounded-3xl border bg-card p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="grid size-16 place-items-center rounded-full bg-secondary text-2xl font-semibold text-secondary-foreground">{initials || <User className="size-6" />}</span>
                <div>
                  <p className="text-2xl font-semibold">{profile.name}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <Badge variant="secondary"><BadgeCheck />{profile.role}</Badge>
                    <Badge variant="outline">Akun aktif</Badge>
                  </div>
                </div>
              </div>
              <span className="rounded-full border bg-muted px-4 py-2 text-xs font-medium text-muted-foreground">Hanya baca</span>
            </div>

            <dl className="mt-8 grid gap-3 sm:grid-cols-2">
              {fields.map((f) => (
                <div key={f.label} className={f.wide ? "rounded-xl bg-muted px-4 py-3 sm:col-span-2" : "rounded-xl bg-muted px-4 py-3"}>
                  <dt className="text-xs text-muted-foreground">{f.label}</dt>
                  <dd className="mt-0.5 font-medium">{f.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/25 bg-secondary/50 px-4 py-3">
              <p className="flex items-center gap-2 text-sm font-medium text-secondary-foreground"><Database className="size-4 shrink-0" /> Admin aktif {seats} dari {MAX_ACTIVE_ADMINS} orang</p>
              <Link to="/admin/akun" className="rounded-full border px-4 py-2 text-xs font-medium transition hover:bg-muted">Kelola akun pengguna</Link>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border bg-card p-6 md:p-8">
            <p className="flex items-center gap-2 text-lg font-semibold"><History className="size-5 text-primary" /> Log Akses</p>
            <p className="mt-2 text-sm text-muted-foreground">Setiap tindakan Admin dicatat: pembukaan laporan individu, penambahan pengguna, perubahan role, dan unduhan rekapitulasi.</p>
            <ul className="mt-5 divide-y">
              {accessLog.map((entry) => (
                <li key={entry.time} className="flex flex-wrap items-start justify-between gap-x-6 gap-y-1 py-3">
                  <div>
                    <p className="text-sm font-medium">{entry.action}</p>
                    <p className="text-xs text-muted-foreground">{entry.detail}</p>
                  </div>
                  <span className="text-xs tabular-nums text-muted-foreground">{entry.time}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">Contoh tampilan — pencatatan log masih usulan dan belum tersimpan ke server.</p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border bg-card p-6">
              <p className="flex items-center gap-2 font-semibold"><ShieldCheck className="size-4 text-primary" /> Kerahasiaan data</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Admin melihat identitas lengkap mahasiswa di dashboard dan laporan individu. Rekapitulasi ke pihak atas selalu tersamarkan.</p>
            </div>
            <div className="rounded-2xl border bg-card p-6">
              <p className="flex items-center gap-2 font-semibold"><KeyRound className="size-4 text-primary" /> Keamanan akun</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Login memakai akun Google kampus UPN. Role dan status akunmu tidak dapat kamu ubah sendiri.</p>
            </div>
            <div className="rounded-2xl border bg-card p-6">
              <p className="flex items-center gap-2 font-semibold"><LogOut className="size-4 text-primary" /> Keluar akun</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Akhiri sesi admin kamu di perangkat ini.</p>
              <a href="/login" className="mt-4 inline-block rounded-full border border-destructive/40 px-5 py-2.5 text-sm font-medium text-destructive transition hover:bg-destructive/10">Keluar</a>
            </div>
          </div>
        </section>
      </Shell>
    </div>
  );
}
