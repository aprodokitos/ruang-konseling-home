import { describe, expect, it } from "vitest";
import { canFinishSession, finishSession, hasCompleteRecord, isClosingTime, remainingSeconds, sampleSessions, startSession, type Session } from "@/lib/counselor-sessions";

const accepted = sampleSessions.find((item) => item.status === "Diterima");
if (!accepted) throw new Error("Missing accepted session fixture");
const active: Session = { ...accepted, status: "Berlangsung", startedAt: 0, conclusion: "Ringkasan", recommendation: "Tindak lanjut", photo: "blob:photo", saved: true };
describe("Counselor session rules", () => {
  it("starts a 60-minute timer only for accepted sessions", () => {
    const started = startSession(accepted, 1000);
    expect(started.status).toBe("Berlangsung");
    expect(remainingSeconds(started.startedAt ?? -1, 1000)).toBe(3600);
    expect(startSession(active, 1000)).toBe(active);
  });
  it("shows the closing warning exactly five minutes before the end", () => {
    expect(isClosingTime(301)).toBe(false);
    expect(isClosingTime(300)).toBe(true);
    expect(isClosingTime(0)).toBe(false);
  });
  it("does not allow ending before the one-hour timer expires", () => {
    expect(canFinishSession(active, 3599999)).toBe(false);
    expect(canFinishSession(active, 3600000)).toBe(true);
    expect(remainingSeconds(0, 3601000)).toBe(0);
  });
  it.each(["conclusion", "recommendation", "photo"] as const)("requires %s before completion", (field) => {
    const incomplete = { ...active, [field]: "" };
    expect(hasCompleteRecord(incomplete)).toBe(false);
    expect(finishSession(incomplete, 3600000)).toBe(incomplete);
  });
  it("requires saved records before ending the session", () => {
    expect(canFinishSession({ ...active, saved: false }, 3600000)).toBe(false);
    expect(finishSession(active, 3600000).status).toBe("Selesai");
  });
});