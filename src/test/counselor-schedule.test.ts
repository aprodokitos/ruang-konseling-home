import { describe, expect, it } from "vitest";
import { format } from "date-fns";
import { addAvailability, upcomingDates, removeAvailability } from "@/lib/counselor-schedule";

describe("Counselor weekly availability", () => {
  const today = new Date(2026, 10, 1, 13, 52);
  const chosen = new Date(2026, 10, 2);

  it("shows exactly seven upcoming dates", () => {
    expect(upcomingDates(today).map((date) => format(date, "yyyy-MM-dd"))).toEqual([
      "2026-11-02", "2026-11-03", "2026-11-04", "2026-11-05", "2026-11-06", "2026-11-07", "2026-11-08",
    ]);
  });
  it("adds availability at the selected date and hour without duplicates", () => {
    const slots = addAvailability([], chosen, 10);
    expect(slots).toEqual([{ id: "2026-11-02-10", date: "2026-11-02", hour: 10 }]);
    expect(addAvailability(slots, chosen, 10)).toHaveLength(1);
  });
  it("deletes only the selected availability", () => {
    const slots = addAvailability(addAvailability([], chosen, 10), chosen, 13);
    expect(removeAvailability(slots, "2026-11-02-10")).toEqual([
      { id: "2026-11-02-13", date: "2026-11-02", hour: 13 },
    ]);
  });
});