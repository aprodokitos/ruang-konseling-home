import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Pencil, Lock, ShieldCheck, User } from "lucide-react";
import { Shell } from "@/components/Shell";

export const Route = createFileRoute("/profil")({
  head: () => ({
    meta: [
      { title: "Profil — RuangPulih" },
      { name: "description", content: "Kelola data dirimu di RuangPulih FK UPN Veteran Jakarta." },
      { property: "og:title", content: "Profil — RuangPulih" },
      { property: "og:description", content: "Lihat dan perbarui data dirimu untuk pengajuan konseling." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Profil,
});

const initial = { nama: "Nadia Putri", nim: "2310211045", prodi: "Kedokteran (S1)", hp: "0812-3456-7890" };

function Profil() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(initial);
  const [draft, setDraft] = useState(initial);
  const [saved, setSaved] = useState(false);

  const start = () => {
    setDraft(form);
    setEditing(true);
    setSaved(false);
  };
  const save = () => {
    setForm({ ...draft, nama: draft.nama.trim() || initial.nama });
    setEditing(false);
    setSaved(true);
  };

  const fields: { key: keyof typeof form; label: string; type?: string }[] = [
    { key: "nama", label: "Nama lengkap" },
    { key: "nim", label: "NIM" },
    { key: "prodi", label: "Program studi" },
    { key: "hp", label: "Nomor HP (WhatsApp)" },
  ];

  const initials = form.nama
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Shell nav={["Beranda", "Jadwal", "Daftar", "Status", "Profil"]}>
      <section className="mx-auto max-w-3xl px-6 py-14">
        <p className="text-sm font-medium text-primary">Profil</p>
        <h1 className="mt-3 text-4xl md:text-5xl">Data <em className="text-primary">dirimu</em>.</h1>
        <p className="mt-4 max-w-lg text-muted-foreground">
          Data ini otomatis terisi saat kamu mengajukan konseling. Pastikan semuanya sudah benar.
        </p>

        <div className="mt-8 rounded-3xl border bg-card p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-primary/15 font-serif text-2xl text-primary">
                {initials || <User className="h-6 w-6" />}
              </span>
              <div>
                <p className="font-serif text-2xl">{form.nama}</p>
                <p className="text-sm text-muted-foreground">{form.nim} · {form.prodi}</p>
              </div>
            </div>
            {!editing && (
              <button
                onClick={start}
                className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition hover:bg-muted"
              >
                <Pencil className="h-4 w-4" /> Ubah data
              </button>
            )}
          </div>

          {!editing ? (
            <dl className="mt-8 grid gap-3 sm:grid-cols-2">
              {fields.map((f) => (
                <div key={f.key} className="rounded-xl bg-muted px-4 py-3">
                  <dt className="text-xs text-muted-foreground">{f.label}</dt>
                  <dd className="mt-0.5 font-medium">{form[f.key]}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <div className="mt-8">
              <div className="grid gap-4 sm:grid-cols-2">
                {fields.map((f) => (
                  <label key={f.key} className="block text-sm">
                    <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{f.label}</span>
                    <input
                      value={draft[f.key]}
                      onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                      className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </label>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  onClick={() => setEditing(false)}
                  className="rounded-full px-5 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted"
                >
                  Batal
                </button>
                <button
                  onClick={save}
                  className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground"
                >
                  Simpan perubahan
                </button>
              </div>
            </div>
          )}

          {saved && !editing && (
            <p className="mt-6 flex items-center gap-2 text-sm text-primary">
              <CheckCircle2 className="h-4 w-4" /> Perubahan berhasil disimpan.
            </p>
          )}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border bg-card p-6">
            <p className="flex items-center gap-2 font-semibold"><ShieldCheck className="h-4 w-4 text-primary" /> Kerahasiaan data</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Seluruh isi konselingmu bersifat rahasia. Data hanya digunakan untuk proses layanan konseling.
            </p>
          </div>
          <div className="rounded-2xl border bg-card p-6">
            <p className="flex items-center gap-2 font-semibold"><Lock className="h-4 w-4 text-primary" /> Keluar akun</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Kamu bisa keluar dari akun kapan pun. Data pengajuan yang sudah dikirim tetap tersimpan.
            </p>
            <button className="mt-4 rounded-full border px-5 py-2.5 text-sm font-medium text-destructive transition hover:bg-destructive/10">
              Keluar
            </button>
          </div>
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          Data di atas masih contoh. <Link to="/daftar" className="text-primary hover:underline">Ajukan konseling</Link> untuk melihat data ini terisi otomatis di form.
        </p>
      </section>
    </Shell>
  );
}
