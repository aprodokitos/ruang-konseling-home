import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { id as indonesian } from "date-fns/locale";
import { CalendarDays, ChevronRight, Clock3, Plus, X } from "lucide-react";
import { Shell } from "@/components/Shell";
import { Button } from "@/components/ui/button";
import { counselorNavigation } from "@/lib/counselor-navigation";
import { addAvailability, upcomingDates, removeAvailability, scheduleHours, slotId, type AvailabilitySlot } from "@/lib/counselor-schedule";

export const Route = createFileRoute("/konselor_/jadwal")({
  head: () => ({ meta: [
    { title: "Jadwal Konseling Konselor — RuangPulih" },
    { name: "description", content: "Kelola ketersediaan jadwal konseling RuangPulih untuk tujuh hari mendatang." },
    { property: "og:title", content: "Jadwal Konseling Konselor — RuangPulih" },
    { property: "og:description", content: "Kalender mingguan ketersediaan konselor Fakultas Kedokteran UPN Veteran Jakarta." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: CounselorSchedule,
});

function hourLabel(hour: number) { return `${String(hour).padStart(2, "0")}.00`; }
function fullDate(date: Date) { return format(date, "EEEE, d MMMM yyyy", { locale: indonesian }); }

function CounselorSchedule() {
  const [dates, setDates] = useState<Date[]>([]);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const nextDates = upcomingDates(new Date());
    setDates(nextDates);
    const first = nextDates[0];
    const second = nextDates[1];
    if (first && second) setSlots(addAvailability(addAvailability([], first, 9), second, 13));
  }, []);

  function addSlot(date: Date, hour: number) {
    setSlots((current) => addAvailability(current, date, hour));
    setNotice(`Jadwal ${fullDate(date)}, ${hourLabel(hour)}–${hourLabel(hour + 1)} ditambahkan.`);
  }
  function deleteSlot(date: Date, hour: number) {
    setSlots((current) => removeAvailability(current, slotId(date, hour)));
    setNotice(`Jadwal ${fullDate(date)}, ${hourLabel(hour)}–${hourLabel(hour + 1)} dihapus.`);
  }
  const first = dates[0];
  const last = dates[6];

  return (
    <div className="counselor-portal">
      <Shell nav={counselorNavigation.map((item) => item.label)} navigationItems={counselorNavigation}>
        <div className="border-b bg-card px-5 py-4 lg:px-9">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground sm:text-sm">Portal Konselor <ChevronRight className="mx-2 inline size-3" /><span className="font-medium text-foreground">Jadwal Konseling</span></p>
            <div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">AP</span><div><p className="text-xs font-semibold">Andika Pratama, M.Psi.</p><p className="text-xs text-muted-foreground">Psikolog Ahli</p></div></div>
          </div>
        </div>
        <section className="mx-auto max-w-7xl px-5 py-8 lg:px-9">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div><p className="text-xs font-semibold uppercase tracking-widest text-primary">Ketersediaan konselor</p><h1 className="mt-2 text-3xl font-semibold">Jadwal Konseling</h1><p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground"><CalendarDays className="size-4" />{first && last ? `${format(first, "d MMM", { locale: indonesian })} – ${format(last, "d MMM yyyy", { locale: indonesian })}` : "Memuat tanggal…"}</p></div>
            <div className="flex items-center gap-5 text-xs"><span className="flex items-center gap-2"><span className="size-2 rounded-full bg-primary" />{slots.length} slot tersedia</span><span className="flex items-center gap-2 text-muted-foreground"><Clock3 className="size-4" />60 menit / sesi</span></div>
          </div>
          <div role="status" aria-live="polite" className="mt-4 min-h-5 text-xs text-primary">{notice}</div>
          <div className="mt-3 overflow-x-auto rounded-lg border bg-card" aria-label="Kalender ketersediaan tujuh hari mendatang">
            <div className="min-w-[840px]">
              <div className="grid grid-cols-[64px_repeat(7,minmax(0,1fr))] border-b">
                <div className="flex items-center justify-center text-[10px] text-muted-foreground">GMT+7</div>
                {dates.map((date) => <div key={format(date, "yyyy-MM-dd")} className="border-l px-2 py-4 text-center"><p className="text-xs text-muted-foreground">{format(date, "EEE", { locale: indonesian })}</p><p className="mt-1 text-2xl font-semibold tabular-nums">{format(date, "d")}</p></div>)}
              </div>
              {dates.length === 0 ? <div className="h-[630px] animate-pulse bg-muted/30" /> : scheduleHours.map((hour) => (
                <div key={hour} className="grid h-[76px] grid-cols-[64px_repeat(7,minmax(0,1fr))]">
                  <div className="border-b pt-2 text-center text-[11px] tabular-nums text-muted-foreground">{hourLabel(hour)}</div>
                  {dates.map((date) => {
                    const dateLabel = fullDate(date);
                    const available = slots.some((slot) => slot.id === slotId(date, hour));
                    return <div key={slotId(date, hour)} className="relative min-w-0 border-b border-l">
                      {available ? <div className="group absolute inset-1 flex flex-col justify-center rounded-md border border-primary/25 border-l-[3px] border-l-primary bg-secondary px-2 pr-7" tabIndex={0} aria-label={`Tersedia ${dateLabel}, ${hourLabel(hour)}–${hourLabel(hour + 1)}`}>
                        <p className="text-[11px] font-semibold tabular-nums text-secondary-foreground">{hourLabel(hour)}–{hourLabel(hour + 1)}</p><p className="mt-1 text-[10px] text-secondary-foreground">Tersedia</p>
                        <Button variant="ghost" size="icon" title="Hapus jadwal" aria-label={`Hapus jadwal ${dateLabel} ${hourLabel(hour)}`} onClick={() => deleteSlot(date, hour)} className="absolute right-1 top-1 size-6 text-secondary-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive focus-visible:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100"><X /></Button>
                      </div> : <Button variant="ghost" aria-label={`Tambah jadwal ${dateLabel} ${hourLabel(hour)}`} onClick={() => addSlot(date, hour)} className="group h-full w-full rounded-none p-0 text-primary hover:bg-secondary/60"><Plus className="opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" /></Button>}
                    </div>;
                  })}
                </div>
              ))}
              <div className="h-7 pl-4 pt-1 text-[11px] tabular-nums text-muted-foreground">17.00</div>
            </div>
          </div>
        </section>
      </Shell>
    </div>
  );
}