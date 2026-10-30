import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, MapPin, Info } from "lucide-react";
import { Shell } from "@/components/Shell";

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

const filters = ["Semua", "Dosen", "Psikolog Klinis"] as const;
type Filter = (typeof filters)[number];

const schedule: {
  name: string;
  role: string;
  room: string;
  days: { day: Day; slots: string[] }[];
}[] = [
  {
    name: "dr. Ratna Sari, M.Pd.Ked",
    role: "Dosen Program Studi",
    room: "Ruang BK Lt.1",
    days: [
      { day: "Senin", slots: ["13", "14", "15"] },
      { day: "Rabu", slots: ["13", "15"] },
    ],
  },
  {
    name: "Andika Pratama, M.Psi., Psikolog",
    role: "Psikolog Klinis",
    room: "Ruang BK Lt.2",
    days: [
      { day: "Selasa", slots: ["09", "10", "11"] },
      { day: "Kamis", slots: ["09", "10", "11"] },
    ],
  },
  {
    name: "dr. Maya Hapsari, Sp.KJ",
    role: "Dosen Program Studi",
    room: "Ruang BK Lt.1",
    days: [{ day: "Jumat", slots: ["10", "11", "12", "13"] }],
  },
];

const taken: Record<string, boolean> = {
  "Senin-15": true,
  "Kamis-10": true,
};

function categoryOf(role: string): Filter {
  return role.toLowerCase().includes("psikolog") ? "Psikolog Klinis" : "Dosen";
}

function Jadwal() {
  const [filter, setFilter] = useState<Filter>("Semua");
  const [picked, setPicked] = useState<{ key: string; name: string; day: string; slot: string } | null>(null);

  const entries = schedule.filter((c) => filter === "Semua" || categoryOf(c.role) === filter);

  return (
    <Shell nav={["Beranda", "Jadwal", "Daftar", "Status", "Profil"]}>
      <section className="mx-auto max-w-5xl px-6 py-14">
        <p className="text-sm font-medium text-primary">Jadwal Konseling</p>
        <h1 className="mt-3 text-4xl md:text-5xl">Pilih waktu yang <em className="text-primary">pas</em> untukmu.</h1>
        <p className="mt-4 max-w-lg text-muted-foreground">
          Setiap sesi tatap muka berlangsung maksimal 1 jam. Pilih konselor, lalu klik salah satu slot untuk mengajukan konseling.
        </p>

        {/* Filter kategori */}
        <div className="mt-10 flex flex-wrap gap-2">
          {filters.map((f) => {
            const active = f === filter;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>

        {/* Jadwal per konselor */}
        <div className="mt-8 space-y-4">
          {entries.map((c) => (
            <div key={c.name} className="rounded-2xl border bg-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-accent font-serif text-accent-foreground">
                    {c.name.replace(/^dr\. /, "")[0]}
                  </div>
                  <div>
                    <p className="font-semibold">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.role}</p>
                  </div>
                </div>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> {c.room}</p>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {c.days.map(({ day, slots }) => (
                  <div key={day}>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{day}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {slots.map((s) => {
                        const key = `${day}-${s}`;
                        const isTaken = taken[key];
                        const isPicked = picked?.key === key && picked.name === c.name;
                        return (
                          <button
                            key={s}
                            disabled={isTaken}
                            onClick={() =>
                              setPicked(isPicked ? null : { key, name: c.name, day, slot: s })
                            }
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

              {/* Panel ajukan — muncul di bawah konselor yang dipilih */}
              {picked?.name === c.name && (
                <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-secondary p-5">
                  <div>
                    <p className="font-semibold">Slot {picked.slot}.00 · {picked.day} · {picked.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">Lanjutkan dengan mengisi kategori & keluhan singkat.</p>
                  </div>
                  <button className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20">
                    Ajukan Konseling
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="mt-10 flex items-start gap-2 rounded-2xl border bg-card p-4 text-xs leading-relaxed text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          Slot yang sudah terisi tidak dapat dipilih. Satu slot hanya untuk satu mahasiswa, dan satu mahasiswa maksimal 2 sesi untuk kategori masalah yang sama.
        </p>
      </section>
    </Shell>
  );
}
