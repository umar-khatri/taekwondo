"use client";

import Link from "next/link";
import { Shield } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { ACADEMY_INFO } from "@/lib/types";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/50 glass md:hidden">
      <div className="flex h-14 items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-sm">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Shield className="h-3.5 w-3.5" />
          </div>
          {ACADEMY_INFO.name}
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
