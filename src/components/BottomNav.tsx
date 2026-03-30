"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PackagePlus, History, Building2, Ruler, Truck } from "lucide-react";

const navItems = [
  { label: "首頁", icon: Home, href: "/" },
  { label: "進貨", icon: PackagePlus, href: "/restock" },
  { label: "出貨", icon: Truck, href: "/ship" },
  { label: "紀錄", icon: History, href: "/history" },
  { label: "資料", icon: Building2, href: "/management" }, // Unified "Management" entry
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe-area-inset-bottom z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      <div className="flex justify-around items-center h-20 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full transition-all active:bg-slate-50 ${
                isActive ? "text-primary scale-110" : "text-slate-400"
              }`}
            >
              <item.icon size={28} strokeWidth={isActive ? 3 : 2} />
              <span className={`text-[10px] font-black mt-1.5 ${isActive ? "text-primary" : "text-slate-400"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
