export const rejectionReasons = [
  "Sedang Rapat", "Cuti", "Sakit", "Mengajar",
  "Mahasiswa Telah Mengajukan Lebih dari 2 Kali", "Lainnya",
] as const;

export type CounselingStatus = "Pending" | "Diterima" | "Berlangsung" | "Selesai" | "Ditolak";
export type Application = {
  id: string; name: string; nim: string; program: string; contact: string;
  category: string; schedule: string; order: number; status: CounselingStatus; reason?: string;
};

export const sampleApplications: Application[] = [
  { id: "1", name: "Nadia Putri", nim: "2210211042", program: "Sarjana Kedokteran", contact: "0812-0000-0101", category: "Masalah Akademik", schedule: "Senin, 2 Nov 2026 · 09.00–10.00", order: 1, status: "Pending" },
  { id: "2", name: "Rizky Ramadhan", nim: "2310211017", program: "Sarjana Farmasi", contact: "0812-0000-0102", category: "Masalah Keluarga", schedule: "Senin, 2 Nov 2026 · 10.00–11.00", order: 2, status: "Pending" },
  { id: "3", name: "Alya Maharani", nim: "2410211031", program: "Sarjana Biologi", contact: "0812-0000-0103", category: "Manajemen Waktu", schedule: "Selasa, 3 Nov 2026 · 13.00–14.00", order: 1, status: "Pending" },
  { id: "4", name: "Dimas Pratama", nim: "2210211056", program: "Profesi Kedokteran", contact: "0812-0000-0104", category: "Masalah Pribadi", schedule: "Rabu, 4 Nov 2026 · 09.00–10.00", order: 1, status: "Diterima" },
  { id: "5", name: "Salsa Amalia", nim: "2110211088", program: "Sarjana Kedokteran", contact: "0812-0000-0105", category: "Masalah Karier", schedule: "Sabtu, 31 Okt 2026 · 12.00–13.00", order: 2, status: "Berlangsung" },
  { id: "6", name: "Fajar Hidayat", nim: "2310211024", program: "Sarjana Farmasi", contact: "0812-0000-0106", category: "Masalah Sosial", schedule: "Jumat, 30 Okt 2026 · 10.00–11.00", order: 1, status: "Selesai" },
  { id: "7", name: "Intan Permata", nim: "2210211072", program: "Sarjana Biologi", contact: "0812-0000-0107", category: "Masalah Finansial", schedule: "Kamis, 29 Okt 2026 · 13.00–14.00", order: 1, status: "Selesai" },
];

export function canReject(reason: string, other: string) {
  return rejectionReasons.some((item) => item === reason) && (reason !== "Lainnya" || other.trim().length > 0);
}

export function decideApplication(application: Application, decision: "Diterima" | "Ditolak", reason = "", other = ""): Application {
  if (application.status !== "Pending") return application;
  if (decision === "Ditolak" && !canReject(reason, other)) return application;
  if (decision === "Diterima") return { ...application, status: decision };
  return { ...application, status: decision, reason: reason === "Lainnya" ? other.trim() : reason };
}