"use client";

import Link from "next/link";
import Image from "next/image";
import { Shield } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { ACADEMY_INFO } from "@/lib/types";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/50 glass md:hidden">
      <div className="flex h-14 items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-sm">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 overflow-hidden">
            <Image src="/logo.png" alt="Logo" width={28} height={28} className="object-cover" />
          </div>
          {ACADEMY_INFO.name}
        </Link>
        <UserButton />
      </div>
    </header>
  );
}
