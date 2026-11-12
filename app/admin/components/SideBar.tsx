"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Music,
  UploadCloud,
  Users,
  CalendarDays,
  BarChart3,
  Settings,
  LogOut,
  Radio,
} from "lucide-react";

const navigationItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "My Music", href: "/admin/music", icon: Music },
  { name: "Upload", href: "/admin/upload", icon: UploadCloud },
  { name: "Artists", href: "/admin/artists", icon: Users },
  { name: "Events", href: "/admin/events", icon: CalendarDays },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-zinc-950/90 border-r border-zinc-800/60 flex flex-col h-screen sticky top-0 z-40 select-none">
      {/* Brand Header */}
      <div className="h-20 p-2 flex items-center gap-3 border-b border-zinc-800/40">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
          <Radio className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-sm font-bold tracking-wider text-white">
            CITY LIGHTS
          </h2>
          <p className="text-[10px] uppercase tracking-widest text-pink-400 font-semibold">
            Entertainment
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-white border border-purple-500/30 shadow-lg shadow-purple-950/50"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/60"
              }`}
            >
              <Icon
                className={`w-5 h-5 ${isActive ? "text-pink-400" : "text-zinc-500"}`}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Action */}
      <div className="p-4 border-t border-zinc-800/40">
        <button className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors">
          <LogOut className="w-5 h-5 text-zinc-500" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
