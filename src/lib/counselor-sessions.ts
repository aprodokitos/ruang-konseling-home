import { sampleApplications, type Application } from "./counselor-dashboard";

export const SESSION_SECONDS = 60 * 60;
export const CLOSING_WARNING_SECONDS = 5 * 60;
export type Session = Application & {
  startedAt?: number;
  conclusion: string;
  recommendation: string;
  photo: string;
  saved: boolean;
};

export const sampleSessions: Session[] = sampleApplications
  .filter((item) => item.status === "Diterima" || item.status === "Berlangsung" || item.status === "Selesai")
  .map((item) => ({ ...item, conclusion: item.status === "Selesai" ? "Mahasiswa telah mengidentifikasi faktor yang memengaruhi kesehariannya dan menyusun langkah perbaikan yang realistis." : "", recommendation: item.status === "Selesai" ? "Terapkan langkah yang disepakati secara bertahap dan evaluasi perkembangannya. Jadwalkan sesi lanjutan bila diperlukan." : "", photo: "", saved: item.status === "Selesai" }));

export function remainingSeconds(startedAt: number, now: number) {
  return Math.max(0, Math.min(SESSION_SECONDS, Math.ceil((startedAt + SESSION_SECONDS * 1000 - now) / 1000)));
}
export function isClosingTime(seconds: number) {
  return seconds > 0 && seconds <= CLOSING_WARNING_SECONDS;
}
export function hasCompleteRecord(session: Pick<Session, "conclusion" | "recommendation" | "photo">) {
  return Boolean(session.conclusion.trim() && session.recommendation.trim() && session.photo);
}
export function canFinishSession(session: Session, now: number) {
  return session.status === "Berlangsung" && session.startedAt !== undefined && remainingSeconds(session.startedAt, now) === 0 && session.saved && hasCompleteRecord(session);
}
export function startSession(session: Session, now: number): Session {
  return session.status === "Diterima" ? { ...session, status: "Berlangsung", startedAt: now } : session;
}
export function finishSession(session: Session, now: number): Session {
  return canFinishSession(session, now) ? { ...session, status: "Selesai" } : session;
}