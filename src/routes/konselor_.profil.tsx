import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BadgeCheck, ChevronRight, KeyRound, LogOut, Mail, Phone, Pencil, ShieldCheck, User } from "lucide-react";
import { Shell } from "@/components/Shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

function CounselorProfile() {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(initialProfile);
  const [draft, setDraft] = useState(initialProfile);
  const [notice, setNotice] = useState("");

  function startEdit() { setDraft(profile); setEditing(true); setNotice(""); }
  function cancelEdit() { setDraft(profile); setEditing(false); }
  function saveEdit() {
    setProfile(draft);
    setEditing(false);
    setNotice("Perubahan data diri tersimpan (contoh tampilan, belum tersimpan ke server).");
  }

  return (
    <div className="counselor-portal">
      <Shell nav={counselorNavigation.map((item) => item.label)} navigationItems={counselorNavigation}>
        <div className="border-b bg-card px-5 py-4 lg:px-9">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground sm:text-sm">Portal Konselor <ChevronRight className="mx-2 inline size-3" /><span className="font-medium text-foreground">Profil</span></p>
            <div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">AP</span><div><p className="text-xs font-semibold">{profile.name}</p><p className="text-xs text-muted-foreground">{profile.category}</p></div></div>
          </div>
        </div>

        <section className="mx-auto max-w-5xl px-5 py-8 lg:px-9">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Akun konselor</p>
          <h1 className="mt-2 text-3xl font-semibold">Profil</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">Data ini tampil ke mahasiswa saat mereka memilih konselor dan jadwal konseling.</p>

          <div role="status" aria-live="polite" className="mt-4 min-h-5 text-xs text-primary">{notice}</div>

          <div className="mt-4 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
            <div className="rounded-lg border bg-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="grid size-14 place-items-center rounded-full bg-secondary text-lg font-semibold text-secondary-foreground"><User className="size-6" /></span>
                  <div>
                    <p className="text-lg font-semibold">{profile.name}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <Badge variant="secondary"><BadgeCheck />{profile.category}</Badge>
                      <Badge variant="outline">Akun aktif</Badge>
                    </div>
                  </div>
                </div>
                {!editing && <Button variant="outline" size="sm" onClick={startEdit}><Pencil />Ubah data</Button>}
              </div>

              {editing ? (
                <div className="mt-6 space-y-4">
                  <div className="space-y-2"><Label htmlFor="nama">Nama lengkap & gelar</Label><Input id="nama" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></div>
                  <div className="space-y-2"><Label htmlFor="telepon">Nomor telepon</Label><Input id="telepon" value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} /></div>
                  <div className="space-y-2"><Label htmlFor="keahlian">Bidang keahlian</Label><Input id="keahlian" value={draft.expertise} onChange={(e) => setDraft({ ...draft, expertise: e.target.value })} /></div>
                  <div className="flex gap-3 pt-2">
                    <Button onClick={saveEdit} disabled={!draft.name.trim() || !draft.phone.trim() || !draft.expertise.trim()}>Simpan perubahan</Button>
                    <Button variant="outline" onClick={cancelEdit}>Batal</Button>
                  </div>
                </div>
              ) : (
                <dl className="mt-6 space-y-4 text-sm">
                  <div className="flex items-start gap-3"><Mail className="mt-0.5 size-4 text-muted-foreground" /><div><dt className="text-xs text-muted-foreground">Email kampus (login Google)</dt><dd className="font-medium">{profile.email}</dd></div></div>
                  <div className="flex items-start gap-3"><Phone className="mt-0.5 size-4 text-muted-foreground" /><div><dt className="text-xs text-muted-foreground">Nomor telepon</dt><dd className="font-medium">{profile.phone}</dd></div></div>
                  <div className="flex items-start gap-3"><BadgeCheck className="mt-0.5 size-4 text-muted-foreground" /><div><dt className="text-xs text-muted-foreground">Bidang keahlian</dt><dd className="font-medium">{profile.expertise}</dd></div></div>
                </dl>
              )}
            </div>

            <div className="space-y-5">
              <div className="rounded-lg border bg-card p-6">
                <div className="flex items-center gap-2"><ShieldCheck className="size-4 text-primary" /><h2 className="text-sm font-semibold">Kerahasiaan data</h2></div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">Catatan sesi dan data mahasiswa bersifat rahasia. Hanya kamu dan Admin yang dapat mengaksesnya sesuai ketentuan layanan RuangPulih.</p>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <div className="flex items-center gap-2"><KeyRound className="size-4 text-primary" /><h2 className="text-sm font-semibold">Keamanan akun</h2></div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">Login menggunakan akun Google kampus. Kata sandi dikelola oleh Google, bukan oleh RuangPulih.</p>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <h2 className="text-sm font-semibold">Keluar akun</h2>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">Akhiri sesi konselor kamu di perangkat ini.</p>
                <Button variant="outline" className="mt-4 w-full" asChild><a href="/login"><LogOut />Keluar</a></Button>
              </div>
            </div>
          </div>
        </section>
      </Shell>
    </div>
  );
}
