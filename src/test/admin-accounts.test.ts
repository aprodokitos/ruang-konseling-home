import { describe, expect, it } from "vitest";
import { changeRole, sampleAccounts, sampleRequests, removeAccount, validateNewUser } from "@/lib/admin-accounts";

describe("Kelola akun & role", () => {
  it("rejects a third active admin", () => {
    expect(validateNewUser(sampleAccounts, [], { name: "X", email: "x@upnvj.ac.id", role: "Admin" })).toMatch(/2 orang/);
    expect(() => changeRole(sampleAccounts, "u3", "Admin")).toThrow();
  });
  it("rejects duplicate emails and pending-request emails", () => {
    expect(validateNewUser(sampleAccounts, [], { name: "X", email: "ERNA@upnvj.ac.id", role: "Konselor" })).toMatch(/sudah dimiliki/);
    expect(validateNewUser(sampleAccounts, sampleRequests, { name: "X", email: sampleRequests[0]!.email, role: "Mahasiswa" })).toMatch(/pengajuan/);
  });
  it("requires all fields", () => {
    expect(validateNewUser(sampleAccounts, [], { name: "", email: "a@b.id", role: "Mahasiswa" })).not.toBeNull();
    expect(validateNewUser(sampleAccounts, [], { name: "A", email: "a@b.id", role: "Mahasiswa" })).toBeNull();
  });
  it("blocks admins from changing or deleting themselves", () => {
    expect(() => changeRole(sampleAccounts, "u1", "Konselor")).toThrow();
    expect(() => removeAccount(sampleAccounts, "u1")).toThrow();
    expect(removeAccount(sampleAccounts, "u3").some((a) => a.id === "u3")).toBe(false);
  });
});
