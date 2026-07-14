"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ACADEMY_INFO } from "@/lib/types";
import gsap from "gsap";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { checkIsAdmin } from "@/app/auth-callback/actions";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#schedule", label: "Schedule" },
  { href: "#instructor", label: "Instructor" },
  { href: "#location", label: "Location" },
  { href: "#announcements", label: "News" },
  { href: "#trial", label: "Free Trial" },
];

export function Navbar() {
  const pathname = usePathname();
  const isBookTrial = pathname === "/book-trial";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const navItemsRef = useRef<HTMLElement>(null);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      checkIsAdmin().then(setIsAdmin);
    } else {
      setIsAdmin(false);
    }
  }, [isSignedIn]);

  useEffect(() => {
    // Scroll listener for transparent → glass transition
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // Navbar entrance animation
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!prefersReduced && headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.1 }
      );
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "border-b border-border/50 glass shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold text-lg tracking-tight group"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full overflow-hidden transition-transform duration-300 group-hover:scale-110 ring-1 ring-border">
            <Image
              src="/logo.png"
              alt="Logo"
              width={32}
              height={32}
              className="object-cover"
            />
          </div>
          <span
            className={`hidden sm:inline transition-colors duration-300 ${
              scrolled ? "" : "text-foreground"
            }`}
          >
            {ACADEMY_INFO.name}
          </span>
        </Link>

        {/* Desktop Nav */}
        {!isBookTrial && (
          <nav ref={navItemsRef} className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm font-medium transition-all duration-300 rounded-md ${
                  scrolled
                    ? "text-muted-foreground hover:text-foreground hover:bg-accent"
                    : "text-foreground/70 hover:text-foreground hover:bg-accent/50"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}

        {/* Right side */}
        <div className="flex items-center gap-3">
          <a
            href="https://www.instagram.com/mfcc_legends?igsh=MXZ3N2Zlcno0ZzgwOA=="
            target="_blank"
            rel="noreferrer"
            className={`flex items-center justify-center h-9 w-9 rounded-md transition-colors ${
              scrolled
                ? "text-muted-foreground hover:text-foreground hover:bg-accent"
                : "text-foreground/70 hover:text-foreground hover:bg-accent/50"
            }`}
            title="Follow us on Instagram"
          >
            <Instagram className="h-4 w-4" />
          </a>

          {isSignedIn ? (
            <>
              {isAdmin && (
                <Link href="/dashboard" className="hidden md:block">
                  <Button
                    size="sm"
                    variant="outline"
                    className={`cursor-pointer transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] ${
                      scrolled
                        ? ""
                        : "border-border/50 text-foreground hover:bg-accent/50"
                    }`}
                  >
                    Dashboard
                  </Button>
                </Link>
              )}
              <UserButton />
            </>
          ) : (
            <SignInButton mode="modal" forceRedirectUrl="/auth-callback">
              <Button
                size="sm"
                variant="outline"
                className={`cursor-pointer transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] ${
                  scrolled
                    ? ""
                    : "border-border/50 text-foreground hover:bg-accent/50"
                }`}
              >
                Sign In
              </Button>
            </SignInButton>
          )}

          {/* Mobile menu toggle */}
          {!isBookTrial && (
            <Button
              variant="ghost"
              size="icon"
              className={`md:hidden h-9 w-9 cursor-pointer ${
                scrolled ? "" : "text-foreground hover:bg-accent/50"
              }`}
              onClick={() => setOpen(!open)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className={`md:hidden border-t animate-fade-in ${
            scrolled
              ? "border-border/50 bg-background"
              : "border-border/30 bg-background/90 backdrop-blur-xl"
          }`}
        >
          <nav className="flex flex-col px-4 py-3 gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`px-3 py-2.5 text-sm font-medium transition-colors rounded-md ${
                  scrolled
                    ? "text-muted-foreground hover:text-foreground hover:bg-accent"
                    : "text-foreground/70 hover:text-foreground hover:bg-accent/50"
                }`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            {isSignedIn ? (
              isAdmin && (
                <Link
                  href="/dashboard"
                  className="block w-full mt-2"
                  onClick={() => setOpen(false)}
                >
                  <Button size="sm" className="w-full cursor-pointer">
                    Dashboard
                  </Button>
                </Link>
              )
            ) : (
              <SignInButton mode="modal" forceRedirectUrl="/auth-callback">
                <Button size="sm" className="w-full mt-2 cursor-pointer">
                  Sign In
                </Button>
              </SignInButton>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
