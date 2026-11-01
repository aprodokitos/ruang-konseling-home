import { describe, expect, it } from "vitest";
import { cancelApplication, canReject, decideApplication, rejectionReasons, sampleApplications, type CounselingStatus } from "@/lib/counselor-dashboard";

describe("Counselor application decisions", () => {
  const pending = sampleApplications[0];
  if (!pending) throw new Error("Pending fixture is required");
  it("requires one of the six PRD rejection reasons", () => {
    expect(rejectionReasons).toEqual(["Sedang Rapat", "Cuti", "Sakit", "Mengajar", "Mahasiswa Telah Mengajukan Lebih dari 2 Kali", "Lainnya"]);
    expect(canReject("", "")).toBe(false);
    expect(canReject("Alasan tidak tersedia", "")).toBe(false);
    expect(canReject("Sedang Rapat", "")).toBe(true);
  });
  it("requires an explanation for Lainnya", () => {
    expect(canReject("Lainnya", "   ")).toBe(false);
    expect(canReject("Lainnya", "Kegiatan fakultas")).toBe(true);
  });
  it("accepts a pending application", () => {
    expect(decideApplication(pending, "Diterima").status).toBe("Diterima");
  });
  it("records the selected rejection reason", () => {
    expect(decideApplication(pending, "Ditolak", "Mengajar")).toMatchObject({ status: "Ditolak", reason: "Mengajar" });
  });
  it("does not reject an application without a reason", () => {
    expect(decideApplication(pending, "Ditolak")).toBe(pending);
  });
  it("only changes pending applications", () => {
    const accepted = { ...pending, status: "Diterima" as const };
    expect(decideApplication(accepted, "Ditolak", "Sakit")).toBe(accepted);
  });
  it("allows cancellation of accepted applications with the same six reasons", () => {
    const accepted = { ...pending, status: "Diterima" as const };
    for (const reason of rejectionReasons) {
      expect(cancelApplication(accepted, reason, "Kegiatan fakultas")).toMatchObject({
        status: "Dibatalkan", reason: reason === "Lainnya" ? "Kegiatan fakultas" : reason,
      });
    }
  });
  it("requires a valid cancellation reason and explanation for Lainnya", () => {
    const accepted = { ...pending, status: "Diterima" as const };
    expect(cancelApplication(accepted)).toBe(accepted);
    expect(cancelApplication(accepted, "Tidak valid")).toBe(accepted);
    expect(cancelApplication(accepted, "Lainnya", " ")).toBe(accepted);
  });
  it("cannot cancel sessions that have started or applications not accepted", () => {
    const statuses: CounselingStatus[] = ["Pending", "Berlangsung", "Selesai", "Ditolak", "Dibatalkan"];
    for (const status of statuses) {
      const application = { ...pending, status };
      expect(cancelApplication(application, "Sakit")).toBe(application);
    }
  });
});