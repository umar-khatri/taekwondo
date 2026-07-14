"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { href: "/dashboard/students", icon: Users, label: "Students" },
  { href: "/dashboard/attendance", icon: ClipboardCheck, label: "Attend" },
  { href: "/dashboard/trials", icon: Sparkles, label: "Trials" },
  { href: "/dashboard/fees", icon: Wallet, label: "Fees" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {/* Frosted glass background */}
      <div className="mx-2 mb-2 rounded-2xl border border-border/40 bg-card/85 backdrop-blur-xl shadow-lg shadow-black/10 dark:shadow-black/30">
        <div className="flex items-center justify-around h-[60px] px-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-[3px] px-2 py-1.5 rounded-xl transition-all duration-200 min-w-[3.5rem] relative",
                  isActive
                    ? "bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent"
                    : "text-muted-foreground group-hover:text-foreground"
                )}
              >
                {/* Active indicator dot */}
                {isActive && (
                  <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 h-[3px] w-5 rounded-full bg-primary" />
                )}
                <item.icon
                  className={cn(
                    "h-[22px] w-[22px] transition-all duration-200",
                    isActive ? "text-red-500" : "text-muted-foreground"
                  )}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
                <span
                  className={cn(
                    "text-[10px] leading-tight",
                    isActive ? "font-semibold" : "font-medium"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
