import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, MapPin, CalendarDays, Info } from "lucide-react";
import { Shell, Badge } from "@/components/Shell";

export const Route = createFileRoute("/jadwal")({
  head: () => ({
    meta: [
      { title: "Jadwal Konseling — RuangPulih" },
      { name: "description", content: "Lihat jadwal ketersediaan konselor Fakultas Kedokteran UPN Veteran Jakarta dan pilih slot yang cocok." },
      { property: "og:title", content: "Jadwal Konseling — RuangPulih" },
      { property: "og:description", content: "Jadwal ketersediaan konselor FK UPN Veteran Jakarta." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Jadwal,
});

const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"] as const;
type Day = (typeof days)[number];

const schedule: Record<Day, { name: string; role: string; slots: string[]; room: string }[]> = {
  Senin: [
    { name: "dr. Ratna Sari, M.Pd.Ked", role: "Dosen Program Studi", slots: ["13", "14", "15"], room: "Ruang BK Lt.1" },
  ],
  Selasa: [
    { name: "Andika Pratama, M.Psi., Psikolog", role: "Psikolog Ahli", slots: ["09", "10", "11"], room: "Ruang BK Lt.2" },
  ],
  Rabu: [
    { name: "dr. Ratna Sari, M.Pd.Ked", role: "Dosen Program Studi", slots: ["13", "15"], room: "Ruang BK Lt.1" },
  ],
  Kamis: [
    { name: "Andika Pratama, M.Psi., Psikolog", role: "Psikolog Ahli", slots: ["09", "10", "11"], room: "Ruang BK Lt.2" },
  ],
  Jumat: [
    { name: "dr. Maya Hapsari, Sp.KJ", role: "Dosen Program Studi", slots: ["10", "11", "12", "13"], room: "Ruang BK Lt.1" },
  ],
};

const taken: Record<string, boolean> = {
  "Senin-15": true,
  "Rabu-14": true,
  "Kamis-10": true,
};

function Jadwal() {
  const today = "Kamis" as Day;
  const [day, setDay] = useState<Day>(today);
  const [picked, setPicked] = useState<string | null>(null);

  const entries = schedule[day];

  return (
    <Shell nav={["Beranda", "Jadwal", "Daftar", "Status", "Profil"]}>
      <section className="mx-auto max-w-5xl px-6 py-14">
        <p className="text-sm font-medium text-primary">Jadwal Konseling</p>
        <h1 className="mt-3 text-4xl md:text-5xl">Pilih waktu yang <em className="text-primary">pas</em> untukmu.</h1>
        <p className="mt-4 max-w-lg text-muted-foreground">
          Setiap sesi tatap muka berlangsung maksimal 1 jam. Pilih hari, lalu klik salah satu slot untuk mengajukan konseling.
        </p>

        {/* Pemilih hari */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {days.map((d) => {
            const count = schedule[d].reduce((s, c) => s + c.slots.length, 0);
            const active = d === day;
            return (
              <button
                key={d}
                onClick={() => { setDay(d); setPicked(null); }}
                className={`rounded-2xl border p-4 text-left transition ${
                  active ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-card hover:border-primary/40"
                }`}
              >
                <p className="font-semibold">{d}</p>
                <p className={`mt-1 text-xs ${active ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {count} slot tersedia
                </p>
              </button>
            );
          })}
        </div>

        {/* Slot per konselor */}
        <div className="mt-10 space-y-4">
          {entries.map((c) => (
            <div key={c.name} className="rounded-2xl border bg-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-accent font-serif text-accent-foreground">
                    {c.name.replace(/^dr\. /, "")[0]}
                  </div>
                  <div>
                    <p className="font-semibold">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.role} · {day}</p>
                  </div>
                </div>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> {c.room}</p>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {c.slots.map((s) => {
                  const key = `${day}-${s}`;
                  const isTaken = taken[key];
                  const isPicked = picked === key;
                  return (
                    <button
                      key={s}
                      disabled={isTaken}
                      onClick={() => setPicked(isPicked ? null : key)}
                      className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition ${
                        isTaken
                          ? "cursor-not-allowed bg-muted text-muted-foreground line-through"
                          : isPicked
                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                            : "border bg-background hover:border-primary/50"
                      }`}
                    >
                      <Clock className="h-3.5 w-3.5" /> {s}.00
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Panel ajukan */}
        {picked && (
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-secondary p-6">
            <div>
              <p className="font-semibold">Slot {picked.split("-")[1]}.00 · {day}</p>
              <p className="mt-1 text-sm text-muted-foreground">Lanjutkan dengan mengisi kategori & keluhan singkat.</p>
            </div>
            <button className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20">
              Ajukan Konseling
            </button>
          </div>
        )}

        <p className="mt-10 flex items-start gap-2 rounded-2xl border bg-card p-4 text-xs leading-relaxed text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          Slot yang sudah terisi tidak dapat dipilih. Satu slot hanya untuk satu mahasiswa, dan satu mahasiswa maksimal 2 sesi untuk kategori masalah yang sama.
        </p>
      </section>
    </Shell>
  );
}
