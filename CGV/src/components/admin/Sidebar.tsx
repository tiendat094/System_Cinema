"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Film, 
  Calendar, 
  Users, 
  Ticket, 
  DollarSign,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { authService } from "@/services/auth.service";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Film, label: "Quản lý phim", href: "/admin/movies" },
  { icon: Calendar, label: "Quản lý lịch chiếu", href: "/admin/schedules" },
  { icon: Users, label: "Quản lý người dùng", href: "/admin/users" },
  { icon: Ticket, label: "Quản lý đặt vé", href: "/admin/bookings" },
  { icon: DollarSign, label: "Báo cáo doanh thu", href: "/admin/revenue" },
  { icon: Settings, label: "Cài đặt", href: "/admin/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    authService.logout();
    window.location.href = "/auth/login";
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-dark-900 border-r border-dark-700 transition-all duration-300 z-40",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-dark-700">
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SC</span>
            </div>
            <span className="font-bold text-lg">Admin</span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-8 h-8 rounded-lg hover:bg-dark-800 flex items-center justify-center transition-colors ml-auto"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-3 flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                    "hover:bg-dark-800",
                    isActive && "bg-primary-500 text-white hover:bg-primary-600",
                    !isActive && "text-gray-400 hover:text-white",
                    collapsed && "justify-center"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span className="font-medium">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-dark-700">
        <button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
            "text-red-500 hover:bg-red-500/10",
            collapsed && "justify-center"
          )}
          title={collapsed ? "Đăng xuất" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="font-medium">Đăng xuất</span>}
        </button>
      </div>
    </aside>
  );
}
