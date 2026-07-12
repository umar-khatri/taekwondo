"use client";

import { useEffect, useRef, useState } from "react";
import { Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ACADEMY_INFO } from "@/lib/types";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // Hero content entrance animations
      const tl = gsap.timeline({ delay: 0.2 });

      tl.fromTo(
        badgeRef.current,
        { y: 20, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" }
      );

      tl.fromTo(
        titleRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
        "-=0.3"
      );

      tl.fromTo(
        subtitleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
        "-=0.4"
      );

      tl.fromTo(
        descRef.current,
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
        "-=0.35"
      );

      tl.fromTo(
        ctaRef.current,
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
        "-=0.3"
      );

      // Stats stagger in
      if (statsRef.current) {
        const statItems = statsRef.current.children;
        tl.fromTo(
          statItems,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.2"
        );
      }

      // Floating particles
      if (particlesRef.current) {
        const particles = particlesRef.current.children;
        Array.from(particles).forEach((particle) => {
          gsap.set(particle, {
            x: gsap.utils.random(-30, 30),
            y: gsap.utils.random(-20, 20),
          });
          gsap.to(particle, {
            y: `+=${gsap.utils.random(-60, -20)}`,
            x: `+=${gsap.utils.random(-30, 30)}`,
            opacity: gsap.utils.random(0.15, 0.45),
            duration: gsap.utils.random(4, 8),
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: gsap.utils.random(0, 3),
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Fixed background */}
      <div className="fixed inset-0 -z-10 hero-gradient" />

      {/* Animated ambient glow orbs */}
      <div className="fixed top-[15%] left-[10%] h-80 w-80 rounded-full bg-red-900/15 blur-[120px] animate-pulse -z-10" />
      <div
        className="fixed top-[40%] right-[10%] h-64 w-64 rounded-full bg-blue-900/10 blur-[100px] animate-pulse -z-10"
        style={{ animationDelay: "2s", animationDuration: "4s" }}
      />
      <div
        className="fixed bottom-[20%] left-[30%] h-56 w-56 rounded-full bg-amber-800/8 blur-[90px] animate-pulse -z-10"
        style={{ animationDelay: "3.5s", animationDuration: "5s" }}
      />

      {/* Subtle grid pattern */}
      <div
        className="fixed inset-0 opacity-[0.05] dark:opacity-[0.02] -z-10 bg-[linear-gradient(rgba(0,0,0,0.1)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(0,0,0,0.1)_1px,_transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.08)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.08)_1px,_transparent_1px)]"
        style={{ backgroundSize: "60px 60px" }}
      />

      {/* Floating particles */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none">
        {mounted && Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-0"
            style={{
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              background:
                i % 4 === 0
                  ? "rgba(220,60,60,0.5)"
                  : i % 4 === 1
                  ? "rgba(60,80,180,0.4)"
                  : i % 4 === 2
                  ? "rgba(230,190,70,0.45)"
                  : "rgba(255,255,255,0.25)",
              left: `${8 + Math.random() * 84}%`,
              top: `${8 + Math.random() * 84}%`,
            }}
          />
        ))}
      </div>

      {/* Hero content */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-28 sm:py-36 md:py-44 w-full">
        <div className="flex flex-col items-center text-center gap-6">
          {/* Badge */}
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/50 backdrop-blur-md px-4 py-1.5 text-xs font-medium text-foreground/70 shadow-lg opacity-0"
          >
            <Shield className="h-3.5 w-3.5 text-amber-500" />
            Taekwondo · Kickboxing · MMA
          </div>

          {/* Title */}
          <h1
            ref={titleRef}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground opacity-0"
          >
            {ACADEMY_INFO.name}
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-lg sm:text-xl md:text-2xl font-medium text-muted-foreground max-w-2xl opacity-0"
          >
            {ACADEMY_INFO.tagline}
          </p>

          {/* Description */}
          <p
            ref={descRef}
            className="text-sm sm:text-base text-muted-foreground/80 max-w-xl opacity-0"
          >
            Train with the best. Build confidence, discipline, and strength
            through the art of martial arts.
          </p>

          {/* CTAs */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-3 opacity-0">
            <a href="#trial">
              <Button
                size="lg"
                className="gap-2 text-base px-8 cursor-pointer bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-400 hover:to-amber-400 text-white border-0 shadow-lg shadow-amber-900/20 transition-all duration-300 hover:shadow-amber-700/30 hover:scale-[1.02] active:scale-[0.98]"
              >
                Book a Free Trial
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
            <a href="#schedule">
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 cursor-pointer border-border/60 text-foreground hover:bg-accent backdrop-blur-sm transition-all duration-300 hover:border-border hover:scale-[1.02] active:scale-[0.98]"
              >
                View Schedule
              </Button>
            </a>
          </div>

          {/* Stats */}
          <div
            ref={statsRef}
            className="grid grid-cols-3 gap-8 sm:gap-16 pt-10"
          >
            {[
              { value: "15+", label: "Years Experience" },
              { value: "200+", label: "Students Trained" },
              { value: "5th", label: "Dan Black Belt" },
            ].map((stat) => (
              <div key={stat.label} className="text-center opacity-0">
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
