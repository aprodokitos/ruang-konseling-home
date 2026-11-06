import { describe, expect, it } from "vitest";
import { activeAdminCount, adminProfile, changeRole, sampleAccounts, sampleRequests, removeAccount, validateNewUser, MAX_ACTIVE_ADMINS } from "@/lib/admin-accounts";

describe("Profil admin", () => {
  it("fills the admin profile from the account table", () => {
    const profile = adminProfile(sampleAccounts);
    expect(profile.name).toBe("dr. Erna Harfiani");
    expect(profile.email).toBe("erna@upnvj.ac.id");
    expect(profile.role).toBe("Admin");
    expect(profile.status).toBe("Aktif");
  });
  it("allows up to five active admins", () => {
    expect(MAX_ACTIVE_ADMINS).toBe(5);
    expect(activeAdminCount(sampleAccounts)).toBe(2);
    expect(activeAdminCount(removeAccount(sampleAccounts, "u2"))).toBe(1);
  });
  it("refuses to open a profile for a non-admin account", () => {
    expect(() => adminProfile(sampleAccounts, "u3")).toThrow(/Admin/);
    expect(() => adminProfile(sampleAccounts, "nope")).toThrow(/tidak ditemukan/);
  });
});

describe("Kelola akun & role", () => {
  it("allows a third admin but rejects a sixth", () => {
    expect(validateNewUser(sampleAccounts, [], { name: "X", email: "x@upnvj.ac.id", role: "Admin" })).toBeNull();
    const five = [3, 4, 5].reduce((l, n) => [...l, { ...l[0]!, id: `a${n}`, email: `a${n}@upnvj.ac.id` }], sampleAccounts);
    expect(validateNewUser(five, [], { name: "X", email: "x@upnvj.ac.id", role: "Admin" })).toMatch(/5 orang/);
    expect(() => changeRole(five, "u3", "Admin")).toThrow();
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
