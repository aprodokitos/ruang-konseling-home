import { BarChart3, User, UserCog, Users } from "lucide-react";
import type { NavItem } from "@/components/Shell";

export const adminNavigation: NavItem[] = [
  { label: "Dashboard Mahasiswa", to: "/admin", icon: BarChart3 },
  { label: "Dashboard Konselor", to: "/admin/konselor", icon: Users },
  { label: "Kelola Akun & Role", icon: UserCog },
  { label: "Profil", icon: User },
];
