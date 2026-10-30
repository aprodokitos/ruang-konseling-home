import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/survei")({
  head: () => ({
    meta: [
      { title: "Survei Kepuasan — RuangPulih" },
      { name: "description", content: "Isi survei kepuasan layanan konseling RuangPulih FK UPN Veteran Jakarta." },
      { property: "og:title", content: "Survei Kepuasan — RuangPulih" },
      { property: "og:description", content: "Bantu kami meningkatkan layanan konseling RuangPulih." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Survei,
});

const questions = [
  { d: "Keandalan", q: "Apakah informasi konselor dan jadwal konseling yang ditampilkan pada RuangPulih sudah sesuai dengan ketersediaan sebenarnya?" },
  { d: "Keandalan", q: "Apakah RuangPulih menampilkan status pengajuan konseling secara jelas dan akurat?" },
  { d: "Responsivitas", q: "Apakah proses pengajuan konseling melalui RuangPulih mudah dilakukan?" },
  { d: "Responsivitas", q: "Apakah konselor memberikan tanggapan terhadap pengajuan konseling dengan baik?" },
  { d: "Jaminan", q: "Apakah informasi mengenai prosedur dan ketentuan konseling disampaikan dengan jelas?" },
  { d: "Jaminan", q: "Apakah merasa yakin bahwa informasi pribadi yang diberikan melalui RuangPulih terjaga kerahasiaannya?" },
  { d: "Empati", q: "Apakah konselor memberikan perhatian dan memahami permasalahan selama sesi konseling?" },
  { d: "Bukti Fisik", q: "Apakah tampilan dan navigasi RuangPulih mudah dipahami dan digunakan?" },
];
const scale = [
  { l: "Sangat Baik", v: 4 },
  { l: "Baik", v: 3 },
  { l: "Cukup", v: 2 },
  { l: "Kurang", v: 1 },
];
const overall = ["Sangat Puas", "Puas", "Cukup Puas", "Tidak Puas"];

function Choice({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={"rounded-full border px-4 py-2 text-sm transition " + (active ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted")}
    >
      {label}
    </button>
  );
}

function Survei() {
  const [ans, setAns] = useState<Record<number, number>>({});
  const [puas, setPuas] = useState("");
  const [kendala, setKendala] = useState("");
  const [saran, setSaran] = useState("");
  const [done, setDone] = useState(false);
  const complete = Object.keys(ans).length === questions.length && puas && kendala.trim() && saran.trim();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <Link to="/status" className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium hover:bg-muted">
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Link>

        {done ? (
          <div className="mt-16 rounded-3xl border bg-card p-10 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
            <h1 className="mt-4 text-3xl">Terima kasih!</h1>
            <p className="mt-2 text-muted-foreground">Jawabanmu membantu kami meningkatkan layanan RuangPulih.</p>
            <Link to="/status" className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">Kembali ke Status</Link>
          </div>
        ) : (
          <>
            <p className="mt-10 text-sm font-medium text-primary">Survei Kepuasan</p>
            <h1 className="mt-3 text-4xl">Bagaimana <em className="text-primary">pengalamanmu</em>?</h1>
            <p className="mt-3 text-muted-foreground">Semua pertanyaan wajib diisi. Jawabanmu bersifat rahasia.</p>

            <div className="mt-8 space-y-4">
              {questions.map((x, i) => (
                <div key={i} className="rounded-2xl border bg-card p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">{x.d}</p>
                  <p className="mt-1 font-medium">{i + 1}. {x.q}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {scale.map((s) => (
                      <Choice key={s.v} label={s.l} active={ans[i] === s.v} onClick={() => setAns({ ...ans, [i]: s.v })} />
                    ))}
                  </div>
                </div>
              ))}

              <div className="rounded-2xl border bg-card p-5">
                <p className="font-medium">9. Secara keseluruhan, bagaimana tingkat kepuasan terhadap layanan RuangPulih?</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {overall.map((o) => <Choice key={o} label={o} active={puas === o} onClick={() => setPuas(o)} />)}
                </div>
              </div>

              <div className="rounded-2xl border bg-card p-5">
                <label htmlFor="kendala" className="font-medium">10. Apakah terdapat kendala selama menggunakan RuangPulih?</label>
                <textarea id="kendala" rows={3} value={kendala} onChange={(e) => setKendala(e.target.value)}
                  className="mt-3 w-full rounded-xl border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Tulis jawabanmu…" />
              </div>

              <div className="rounded-2xl border bg-card p-5">
                <label htmlFor="saran" className="font-medium">11. Apa saran atau masukan untuk meningkatkan kualitas RuangPulih?</label>
                <textarea id="saran" rows={4} value={saran} onChange={(e) => setSaran(e.target.value)}
                  className="mt-3 w-full rounded-xl border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Tulis saran atau masukanmu…" />
              </div>
            </div>

            <button
              disabled={!complete}
              onClick={() => setDone(true)}
              className="mt-8 w-full rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition disabled:cursor-not-allowed disabled:opacity-40"
            >
              Kirim Survei
            </button>
          </>
        )}
      </div>
    </div>
  );
}
