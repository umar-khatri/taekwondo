"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  MessageSquare,
  Sparkles,
  BarChart3,
  Shield,
  ArrowLeft,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { ACADEMY_INFO } from "@/lib/types";

const sidebarItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/students", icon: Users, label: "Students" },
  { href: "/dashboard/attendance", icon: ClipboardCheck, label: "Attendance" },
  { href: "/dashboard/trials", icon: Sparkles, label: "Trials" },
  { href: "/dashboard/announcements", icon: MessageSquare, label: "Announcements" },
  { href: "/dashboard/fees", icon: Wallet, label: "Fees" },
  { href: "/dashboard/reports", icon: BarChart3, label: "Reports" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-border/50 bg-card/50">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 px-5 border-b border-border/50">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 overflow-hidden">
          <Image src="/logo.png" alt="Logo" width={32} height={32} className="object-cover" />
        </div>
        <span className="font-bold text-sm tracking-tight">{ACADEMY_INFO.name}</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-gradient-to-r from-red-500/15 to-amber-500/15 text-red-600 dark:text-red-400 border-r-2 border-red-500"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-border/50 p-3 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Website
        </Link>
        <div className="flex items-center justify-between px-3 py-2 mt-2">
          <span className="text-xs font-medium text-muted-foreground">Account</span>
          <UserButton />
        </div>
      </div>
    </aside>
  );
}
