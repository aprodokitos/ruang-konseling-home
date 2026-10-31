import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Leaf, ShieldCheck, AlertCircle } from "lucide-react";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Masuk · RuangPulih" },
      { name: "description", content: "Masuk ke RuangPulih menggunakan email kampus melalui Google." },
      { property: "og:title", content: "Masuk · RuangPulih" },
      { property: "og:description", content: "Masuk ke RuangPulih menggunakan email kampus melalui Google." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

function LoginPage() {
  const [failed, setFailed] = useState(false);
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img src={hero} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-primary/40" />
        <div className="absolute bottom-10 left-10 right-10 text-primary-foreground">
          <p className="font-serif text-4xl leading-tight">Ruang aman untuk bercerita dan pulih.</p>
          <p className="mt-3 text-sm opacity-90">Layanan konseling Fakultas Kedokteran UPN "Veteran" Jakarta.</p>
        </div>
      </div>

      <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground">
              <Leaf className="h-5 w-5" />
            </span>
            <span className="font-serif text-2xl">RuangPulih</span>
          </Link>

          <h1 className="mt-10 font-serif text-4xl">Selamat datang.</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Masuk menggunakan email kampus UPN "Veteran" Jakarta.
          </p>

          <button
            type="button"
            onClick={() => setFailed(true)}
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border bg-card px-4 py-3 text-sm font-medium shadow-sm transition hover:bg-muted"
          >
            <GoogleIcon />
            Masuk dengan Google
          </button>

          {failed && (
            <div className="mt-4 flex gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              <div>
                <p className="font-medium text-destructive">Email tidak dapat divalidasi otomatis</p>
                <p className="mt-1 text-muted-foreground">
                  Pola NIM pada email tidak dikenali sebagai mahasiswa Fakultas Kedokteran. Silakan ajukan akun secara manual.
                </p>
                <Link to="/pengajuan-akun" className="mt-2 inline-block font-medium text-primary underline">
                  Ajukan akun
                </Link>
              </div>
            </div>
          )}

          <div className="mt-8 flex gap-3 rounded-xl bg-muted/60 p-4 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
            Login hanya tersedia melalui Google. Kami tidak pernah meminta kata sandi email kampusmu.
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Gagal masuk atau kamu konselor?{" "}
            <Link to="/pengajuan-akun" className="font-medium text-primary hover:underline">
              Ajukan akun
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
