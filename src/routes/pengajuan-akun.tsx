import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, GraduationCap, Stethoscope } from "lucide-react";

export const Route = createFileRoute("/pengajuan-akun")({
  head: () => ({
    meta: [
      { title: "Pengajuan Akun · RuangPulih" },
      { name: "description", content: "Ajukan akun RuangPulih sebagai mahasiswa atau konselor, menunggu persetujuan Admin." },
      { property: "og:title", content: "Pengajuan Akun · RuangPulih" },
      { property: "og:description", content: "Ajukan akun RuangPulih sebagai mahasiswa atau konselor." },
    ],
  }),
  component: PengajuanAkun,
});

type Role = "Mahasiswa" | "Konselor";
const input = "mt-1.5 w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium">
      {label}
      {children}
    </label>
  );
}

function PengajuanAkun() {
  const [role, setRole] = useState<Role>("Mahasiswa");
  const [f, setF] = useState({ nama: "", email: "", nim: "", prodi: "", hp: "", kategori: "", keahlian: "" });
  const [sent, setSent] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF({ ...f, [k]: e.target.value });

  const base = f.nama && f.email && f.hp;
  const valid = role === "Mahasiswa" ? base && f.nim && f.prodi : base && f.kategori && f.keahlian;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b bg-background/85 px-5 py-3 backdrop-blur">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Kembali ke halaman masuk
        </Link>
      </header>

      <main className="mx-auto max-w-xl px-5 py-12">
        {sent ? (
          <div className="rounded-2xl border bg-card p-8 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
            <h1 className="mt-4 font-serif text-3xl">Pengajuan terkirim.</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Akun {role.toLowerCase()} kamu sedang menunggu persetujuan Admin. Kami akan mengabari melalui email{" "}
              <span className="font-medium text-foreground">{f.email}</span>.
            </p>
            <Link to="/login" className="mt-6 inline-block rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
              Kembali ke halaman masuk
            </Link>
          </div>
        ) : (
          <>
            <h1 className="font-serif text-4xl">Pengajuan akun.</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Untuk mahasiswa yang gagal masuk otomatis, atau konselor yang ingin bergabung. Akun aktif setelah disetujui Admin.
            </p>

            <form
              className="mt-8 space-y-6 rounded-2xl border bg-card p-6"
              onSubmit={(e) => {
                e.preventDefault();
                if (valid) setSent(true);
              }}
            >
              <div>
                <p className="text-sm font-medium">Daftar sebagai</p>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  {([["Mahasiswa", GraduationCap], ["Konselor", Stethoscope]] as const).map(([r, Icon]) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`flex items-center gap-3 rounded-xl border p-4 text-left text-sm transition ${
                        role === r ? "border-primary bg-primary/10 font-semibold" : "hover:bg-muted"
                      }`}
                    >
                      <Icon className="h-5 w-5 text-primary" /> {r}
                    </button>
                  ))}
                </div>
              </div>

              <Field label="Nama lengkap">
                <input className={input} value={f.nama} onChange={set("nama")} />
              </Field>
              <Field label="Email Google (akun yang akan dipakai login)">
                <input type="email" className={input} value={f.email} onChange={set("email")} placeholder="nama@upnvj.ac.id" />
              </Field>

              {role === "Mahasiswa" ? (
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label="NIM">
                    <input className={input} value={f.nim} onChange={set("nim")} />
                  </Field>
                  <Field label="Program studi">
                    <select className={input} value={f.prodi} onChange={set("prodi")}>
                      <option value="">Pilih…</option>
                      <option>S1 Kedokteran</option>
                      <option>S1 Keperawatan</option>
                      <option>S1 Farmasi</option>
                      <option>S1 Gizi</option>
                    </select>
                  </Field>
                </div>
              ) : (
                <>
                  <Field label="Kategori konselor">
                    <select className={input} value={f.kategori} onChange={set("kategori")}>
                      <option value="">Pilih…</option>
                      <option>Dosen Program Studi</option>
                      <option>Psikolog Ahli</option>
                    </select>
                  </Field>
                  <Field label="Bidang keahlian">
                    <input className={input} value={f.keahlian} onChange={set("keahlian")} placeholder="Contoh: akademik, keluarga" />
                  </Field>
                </>
              )}

              <Field label="Nomor HP">
                <input className={input} value={f.hp} onChange={set("hp")} />
              </Field>

              <button
                type="submit"
                disabled={!valid}
                className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                Kirim pengajuan akun
              </button>
            </form>
          </>
        )}
      </main>
    </div>
  );
}
