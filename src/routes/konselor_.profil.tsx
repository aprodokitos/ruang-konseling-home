import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BadgeCheck, CheckCircle2, ChevronRight, KeyRound, LogOut, Pencil, ShieldCheck, User } from "lucide-react";
import { Shell } from "@/components/Shell";
import { Badge } from "@/components/ui/badge";
import { counselorNavigation } from "@/lib/counselor-navigation";

export const Route = createFileRoute("/konselor_/profil")({
  head: () => ({ meta: [
    { title: "Profil Konselor — RuangPulih" },
    { name: "description", content: "Kelola data diri dan akun konselor RuangPulih Fakultas Kedokteran UPN Veteran Jakarta." },
    { property: "og:title", content: "Profil Konselor — RuangPulih" },
    { property: "og:description", content: "Data diri, kategori konselor, dan keamanan akun portal konselor RuangPulih." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: CounselorProfile,
});

const initialProfile = {
  name: "Andika Pratama, M.Psi.",
  email: "andika.pratama@upnvj.ac.id",
  phone: "0812-3456-7890",
  category: "Psikolog Ahli",
  expertise: "Kesehatan mental mahasiswa, manajemen stres, konseling karier",
};

const fields: { key: keyof typeof initialProfile; label: string; editable: boolean }[] = [
  { key: "name", label: "Nama lengkap & gelar", editable: true },
  { key: "email", label: "Email kampus (login Google)", editable: false },
  { key: "phone", label: "Nomor telepon", editable: true },
  { key: "category", label: "Kategori konselor", editable: false },
  { key: "expertise", label: "Bidang keahlian", editable: true },
];

function CounselorProfile() {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(initialProfile);
  const [draft, setDraft] = useState(initialProfile);
  const [saved, setSaved] = useState(false);

  function startEdit() { setDraft(profile); setEditing(true); setSaved(false); }
  function saveEdit() {
    setProfile({ ...draft, name: draft.name.trim() || initialProfile.name });
    setEditing(false);
    setSaved(true);
  }

  const initials = profile.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="counselor-portal">
      <Shell nav={counselorNavigation.map((item) => item.label)} navigationItems={counselorNavigation}>
        <div className="border-b bg-card px-5 py-4 lg:px-9">
          <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground sm:text-sm">Portal Konselor <ChevronRight className="mx-2 inline size-3" /><span className="font-medium text-foreground">Profil</span></p>
            <div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">{initials}</span><div><p className="text-xs font-semibold">{profile.name}</p><p className="text-xs text-muted-foreground">{profile.category}</p></div></div>
          </div>
        </div>

        <section className="mx-auto max-w-3xl px-5 py-8 lg:px-9">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Akun konselor</p>
          <h1 className="mt-2 text-3xl font-semibold">Profil</h1>
          <p className="mt-3 max-w-lg text-sm text-muted-foreground">Data ini tampil ke mahasiswa saat mereka memilih konselor dan jadwal konseling. Pastikan semuanya sudah benar.</p>

          <div className="mt-8 rounded-3xl border bg-card p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="grid size-16 place-items-center rounded-full bg-secondary text-2xl font-semibold text-secondary-foreground">{initials || <User className="size-6" />}</span>
                <div>
                  <p className="text-2xl font-semibold">{profile.name}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <Badge variant="secondary"><BadgeCheck />{profile.category}</Badge>
                    <Badge variant="outline">Akun aktif</Badge>
                  </div>
                </div>
              </div>
              {!editing && (
                <button onClick={startEdit} className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition hover:bg-muted">
                  <Pencil className="size-4" /> Ubah data
                </button>
              )}
            </div>

            {!editing ? (
              <dl className="mt-8 grid gap-3 sm:grid-cols-2">
                {fields.map((f) => (
                  <div key={f.key} className={f.key === "expertise" ? "rounded-xl bg-muted px-4 py-3 sm:col-span-2" : "rounded-xl bg-muted px-4 py-3"}>
                    <dt className="text-xs text-muted-foreground">{f.label}</dt>
                    <dd className="mt-0.5 font-medium">{profile[f.key]}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <div className="mt-8">
                <div className="grid gap-4 sm:grid-cols-2">
                  {fields.map((f) => (
                    <label key={f.key} className={f.key === "expertise" ? "block text-sm sm:col-span-2" : "block text-sm"}>
                      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{f.label}{!f.editable && " (tidak bisa diubah)"}</span>
                      <input
                        value={draft[f.key]}
                        disabled={!f.editable}
                        onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                        className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </label>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-end gap-3">
                  <button onClick={() => setEditing(false)} className="rounded-full px-5 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted">Batal</button>
                  <button onClick={saveEdit} disabled={!draft.name.trim() || !draft.phone.trim() || !draft.expertise.trim()} className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50">Simpan perubahan</button>
                </div>
              </div>
            )}

            {saved && !editing && (
              <p className="mt-6 flex items-center gap-2 text-sm text-primary">
                <CheckCircle2 className="size-4" /> Perubahan berhasil disimpan (contoh tampilan, belum tersimpan ke server).
              </p>
            )}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border bg-card p-6">
              <p className="flex items-center gap-2 font-semibold"><ShieldCheck className="size-4 text-primary" /> Kerahasiaan data</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Catatan sesi dan data mahasiswa bersifat rahasia sesuai ketentuan layanan RuangPulih.</p>
            </div>
            <div className="rounded-2xl border bg-card p-6">
              <p className="flex items-center gap-2 font-semibold"><KeyRound className="size-4 text-primary" /> Keamanan akun</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Login memakai akun Google kampus. Kata sandi dikelola Google, bukan RuangPulih.</p>
            </div>
            <div className="rounded-2xl border bg-card p-6">
              <p className="flex items-center gap-2 font-semibold"><LogOut className="size-4 text-primary" /> Keluar akun</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Akhiri sesi konselor kamu di perangkat ini.</p>
              <a href="/login" className="mt-4 inline-block rounded-full border border-destructive/40 px-5 py-2.5 text-sm font-medium text-destructive transition hover:bg-destructive/10">Keluar</a>
            </div>
          </div>
        </section>
      </Shell>
    </div>
  );
}
