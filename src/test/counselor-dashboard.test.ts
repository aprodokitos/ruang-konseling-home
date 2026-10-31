import { describe, expect, it } from "vitest";
import { canReject, decideApplication, rejectionReasons, sampleApplications } from "@/lib/counselor-dashboard";

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
});