import { addDays, format, startOfDay } from "date-fns";

export type AvailabilitySlot = { id: string; date: string; hour: number };
export const scheduleHours = Array.from({ length: 9 }, (_, index) => index + 8);

export function upcomingDates(today: Date): Date[] {
  return Array.from({ length: 7 }, (_, index) => addDays(startOfDay(today), index + 1));
}

export function slotId(date: Date, hour: number): string {
  return `${format(date, "yyyy-MM-dd")}-${hour}`;
}

export function addAvailability(slots: AvailabilitySlot[], date: Date, hour: number): AvailabilitySlot[] {
  const id = slotId(date, hour);
  if (!scheduleHours.includes(hour) || slots.some((slot) => slot.id === id)) return slots;
  return [...slots, { id, date: format(date, "yyyy-MM-dd"), hour }];
}

export function removeAvailability(slots: AvailabilitySlot[], id: string): AvailabilitySlot[] {
  return slots.filter((slot) => slot.id !== id);
}