import { CalendarDays, ClipboardList, LayoutDashboard, User } from "lucide-react";
import type { NavItem } from "@/components/Shell";

export const counselorNavigation: NavItem[] = [
  { label: "Dashboard", to: "/konselor", icon: LayoutDashboard },
  { label: "Jadwal Konseling", to: "/konselor/jadwal", icon: CalendarDays },
  { label: "Sesi Konseling", icon: ClipboardList },
  { label: "Profil", icon: User },
];