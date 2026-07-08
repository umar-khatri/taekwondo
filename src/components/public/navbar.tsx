"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { ACADEMY_INFO } from "@/lib/types";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#schedule", label: "Schedule" },
  { href: "#instructor", label: "Instructor" },
  { href: "#location", label: "Location" },
  { href: "#announcements", label: "News" },
  { href: "#trial", label: "Free Trial" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 glass">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-lg tracking-tight">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 overflow-hidden">
            <Image src="/logo.png" alt="Logo" width={32} height={32} className="object-cover" />
          </div>
          <span className="hidden sm:inline">{ACADEMY_INFO.name}</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/dashboard" className="hidden md:block">
            <Button size="sm" variant="outline" className="cursor-pointer">
              Dashboard
            </Button>
          </Link>
          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9 cursor-pointer"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border/50 bg-background animate-fade-in">
          <nav className="flex flex-col px-4 py-3 gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Link href="/dashboard" onClick={() => setOpen(false)}>
              <Button size="sm" className="w-full mt-2 cursor-pointer">
                Dashboard
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
