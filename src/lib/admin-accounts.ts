export type Role = "Admin" | "Konselor" | "Mahasiswa";
export type AccountStatus = "Aktif" | "Nonaktif";
export type Account = { id: string; name: string; email: string; role: Role; status: AccountStatus; source: "Developer" | "Ditambahkan Admin" | "Pengajuan Akun" };
export type AccountRequest = { id: string; name: string; email: string; role: "Mahasiswa" | "Konselor"; detail: string; submitted: string };

export const MAX_ACTIVE_ADMINS = 2;
export const CURRENT_ADMIN_ID = "u1";

export const sampleAccounts: Account[] = [
  { id: "u1", name: "dr. Erna Harfiani", email: "erna@upnvj.ac.id", role: "Admin", status: "Aktif", source: "Developer" },
  { id: "u2", name: "Dimas Prasetyo, S.Kom.", email: "dimas.staf@upnvj.ac.id", role: "Admin", status: "Aktif", source: "Ditambahkan Admin" },
  { id: "u3", name: "dr. Ratna Wulandari, M.Pd.Ked.", email: "ratna@upnvj.ac.id", role: "Konselor", status: "Aktif", source: "Pengajuan Akun" },
  { id: "u4", name: "Sari Anggraini, M.Psi., Psikolog", email: "sari.psikolog@gmail.com", role: "Konselor", status: "Aktif", source: "Ditambahkan Admin" },
  { id: "u5", name: "dr. Hendra Kusuma", email: "hendra@upnvj.ac.id", role: "Konselor", status: "Nonaktif", source: "Pengajuan Akun" },
  { id: "u6", name: "Alya Rahmadani", email: "2310211045@mahasiswa.upnvj.ac.id", role: "Mahasiswa", status: "Aktif", source: "Pengajuan Akun" },
  { id: "u7", name: "Rizky Maulana", email: "2210212018@mahasiswa.upnvj.ac.id", role: "Mahasiswa", status: "Aktif", source: "Ditambahkan Admin" },
];

export const sampleRequests: AccountRequest[] = [
  { id: "r1", name: "Nabila Putri", email: "2410213007@mahasiswa.upnvj.ac.id", role: "Mahasiswa", detail: "NIM 2410213007 · Sarjana Farmasi", submitted: "3 Nov 2026" },
  { id: "r2", name: "Fikri Ramadhan, M.Psi., Psikolog", email: "fikri.konseling@gmail.com", role: "Konselor", detail: "Psikolog Ahli · Kecemasan, keluarga", submitted: "4 Nov 2026" },
];

const activeAdmins = (list: Account[]) => list.filter((a) => a.role === "Admin" && a.status === "Aktif").length;
const normalize = (email: string) => email.trim().toLowerCase();

export function validateNewUser(list: Account[], requests: AccountRequest[], input: { name: string; email: string; role: Role | "" }): string | null {
  if (!input.name.trim() || !input.email.trim() || !input.role) return "Semua isian wajib diisi.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) return "Format email tidak valid.";
  if (list.some((a) => normalize(a.email) === normalize(input.email))) return "Email sudah dimiliki akun lain.";
  if (requests.some((r) => normalize(r.email) === normalize(input.email))) return "Email ini masih punya pengajuan yang menunggu. Proses lewat daftar pengajuan.";
  if (input.role === "Admin" && activeAdmins(list) >= MAX_ACTIVE_ADMINS) return `Admin aktif sudah ${MAX_ACTIVE_ADMINS} orang.`;
  return null;
}

export function changeRole(list: Account[], id: string, role: Role, actorId = CURRENT_ADMIN_ID): Account[] {
  if (id === actorId) throw new Error("Admin tidak dapat mengubah role dirinya sendiri.");
  const target = list.find((a) => a.id === id);
  if (target && role === "Admin" && target.role !== "Admin" && target.status === "Aktif" && activeAdmins(list) >= MAX_ACTIVE_ADMINS) throw new Error(`Admin aktif sudah ${MAX_ACTIVE_ADMINS} orang.`);
  return list.map((a) => (a.id === id ? { ...a, role } : a));
}

export function toggleStatus(list: Account[], id: string, actorId = CURRENT_ADMIN_ID): Account[] {
  if (id === actorId) throw new Error("Admin tidak dapat menonaktifkan dirinya sendiri.");
  const target = list.find((a) => a.id === id);
  if (target && target.role === "Admin" && target.status === "Nonaktif" && activeAdmins(list) >= MAX_ACTIVE_ADMINS) throw new Error(`Admin aktif sudah ${MAX_ACTIVE_ADMINS} orang.`);
  return list.map((a) => (a.id === id ? { ...a, status: a.status === "Aktif" ? "Nonaktif" : "Aktif" } : a));
}
