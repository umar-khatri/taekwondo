"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

export function SplashIntro({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const lineLeftRef = useRef<HTMLDivElement>(null);
  const lineRightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip splash for reduced motion users
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      onComplete();
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(containerRef.current, {
            opacity: 0,
            scale: 1.02,
            duration: 0.6,
            ease: "power2.inOut",
            onComplete,
          });
        },
      });

      // Fade in background
      tl.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: "power2.out" }
      );

      // Logo scales in with bounce
      tl.fromTo(
        logoRef.current,
        { scale: 0, opacity: 0, rotation: -15 },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 0.7,
          ease: "back.out(1.7)",
        },
        0.3
      );

      // Decorative lines expand outward from center
      tl.fromTo(
        [lineLeftRef.current, lineRightRef.current],
        { scaleX: 0 },
        { scaleX: 1, duration: 0.5, ease: "power3.out" },
        0.8
      );

      // Title fades up
      tl.fromTo(
        titleRef.current,
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
        1.0
      );

      // Tagline fades up
      tl.fromTo(
        taglineRef.current,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" },
        1.2
      );

      // Hold for a beat
      tl.to({}, { duration: 0.7 });
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden splash-gradient"
    >
      {/* Ambient glows */}
      <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-red-900/20 blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-blue-900/15 blur-[80px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-40 w-40 rounded-full bg-amber-700/10 blur-[60px]" />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.05] dark:opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(128,128,128,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(128,128,128,0.15) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center gap-5">
        {/* Logo */}
        <div ref={logoRef} className="opacity-0">
          <div className="h-28 w-28 sm:h-36 sm:w-36 rounded-full overflow-hidden ring-2 ring-red-800/30 shadow-[0_0_80px_rgba(180,40,40,0.25)]">
            <Image
              src="/logo.png"
              alt="Master Farooq's Club"
              width={144}
              height={144}
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Decorative lines */}
        <div className="flex items-center gap-4 w-64">
          <div
            ref={lineLeftRef}
            className="flex-1 h-px bg-gradient-to-l from-red-700/50 to-transparent origin-right"
            style={{ transform: "scaleX(0)" }}
          />
          <div className="h-1.5 w-1.5 rounded-full bg-amber-500/60" />
          <div
            ref={lineRightRef}
            className="flex-1 h-px bg-gradient-to-r from-red-700/50 to-transparent origin-left"
            style={{ transform: "scaleX(0)" }}
          />
        </div>

        {/* Title */}
        <div ref={titleRef} className="opacity-0 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Master Farooq&apos;s{" "}
            <span className="bg-gradient-to-r from-red-500 via-red-400 to-amber-400 bg-clip-text text-transparent">
              Club
            </span>
          </h1>
        </div>

        {/* Tagline */}
        <div ref={taglineRef} className="opacity-0 text-center">
          <p className="text-sm sm:text-base tracking-[0.3em] uppercase text-gray-500 font-light">
            Discipline · Focus · Strength · Victory
          </p>
        </div>
      </div>
    </div>
  );
}
