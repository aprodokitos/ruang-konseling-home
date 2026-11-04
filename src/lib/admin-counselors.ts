export type AdminCounselor = {
  id: string;
  name: string;
  category: "Dosen Program Studi" | "Psikolog Ahli";
  expertise: string;
  pending: number;
  acceptedWaiting: number;
  ongoing: number;
  completed: number;
  rejected: number;
  cancelled: number;
};

export const adminCounselors: AdminCounselor[] = [
  { id: "andika", name: "Andika Pratama, M.Psi.", category: "Psikolog Ahli", expertise: "Kesehatan mental mahasiswa, manajemen stres, konseling karier", pending: 5, acceptedWaiting: 3, ongoing: 3, completed: 32, rejected: 4, cancelled: 2 },
  { id: "ratna", name: "dr. Ratna Sari", category: "Dosen Program Studi", expertise: "Akademik dan manajemen waktu", pending: 4, acceptedWaiting: 2, ongoing: 2, completed: 23, rejected: 3, cancelled: 1 },
  { id: "bima", name: "dr. Bima Aditya", category: "Dosen Program Studi", expertise: "Adaptasi perkuliahan dan pengembangan karier", pending: 3, acceptedWaiting: 2, ongoing: 2, completed: 14, rejected: 2, cancelled: 1 },
  { id: "maya", name: "Maya Lestari, M.Psi.", category: "Psikolog Ahli", expertise: "Relasi sosial, keluarga, dan pengelolaan emosi", pending: 2, acceptedWaiting: 1, ongoing: 2, completed: 8, rejected: 1, cancelled: 0 },
];

export function counselorMetrics(counselor: AdminCounselor) {
  const accepted = counselor.acceptedWaiting + counselor.ongoing + counselor.completed + counselor.cancelled;
  const decided = accepted + counselor.rejected;
  const total = decided + counselor.pending;
  return { total, accepted, decided };
}

export function percentage(count: number, total: number) {
  return total === 0 ? 0 : Math.round((count / total) * 1000) / 10;
}