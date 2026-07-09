"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
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
  const bgRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // Ken Burns - slow zoom on background image
      gsap.fromTo(
        bgRef.current,
        { scale: 1 },
        {
          scale: 1.15,
          duration: 25,
          ease: "none",
          repeat: -1,
          yoyo: true,
        }
      );

      // Parallax on scroll
      gsap.to(bgRef.current, {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });

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
            opacity: gsap.utils.random(0.15, 0.5),
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
      className="relative overflow-hidden min-h-screen flex items-center"
    >
      {/* Full-screen background image with Ken Burns */}
      <div ref={bgRef} className="absolute inset-0 -inset-x-4 -inset-y-8">
        <Image
          src="/hero-dojo.jpg"
          alt="Taekwondo Dojo"
          fill
          className="object-cover"
          priority
          quality={85}
        />
      </div>

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30" />

      {/* Subtle vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      {/* Animated ambient glow */}
      <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-red-600/10 blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/3 right-1/4 h-48 w-48 rounded-full bg-blue-700/8 blur-[80px] animate-pulse" style={{ animationDelay: "2s" }} />

      {/* Floating particles */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-0"
            style={{
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              background:
                i % 4 === 0
                  ? "rgba(220,60,60,0.6)"
                  : i % 4 === 1
                  ? "rgba(60,100,180,0.5)"
                  : i % 4 === 2
                  ? "rgba(240,200,80,0.5)"
                  : "rgba(255,255,255,0.3)",
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
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
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-md px-4 py-1.5 text-xs font-medium text-white/80 shadow-lg opacity-0"
          >
            <Shield className="h-3.5 w-3.5 text-red-400" />
            Taekwondo · Kickboxing · MMA
          </div>

          {/* Title */}
          <h1
            ref={titleRef}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white opacity-0"
          >
            <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
              {ACADEMY_INFO.name}
            </span>
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-lg sm:text-xl md:text-2xl font-medium text-white/70 max-w-2xl opacity-0"
          >
            {ACADEMY_INFO.tagline}
          </p>

          {/* Description */}
          <p
            ref={descRef}
            className="text-sm sm:text-base text-white/50 max-w-xl opacity-0"
          >
            Train with the best. Build confidence, discipline, and strength
            through the art of martial arts.
          </p>

          {/* CTAs */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-3 opacity-0">
            <a href="#trial">
              <Button
                size="lg"
                className="gap-2 text-base px-8 cursor-pointer bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white border-0 shadow-lg shadow-red-900/30 transition-all duration-300 hover:shadow-red-800/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                Book a Free Trial
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
            <a href="#schedule">
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 cursor-pointer border-white/20 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:scale-[1.02] active:scale-[0.98]"
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
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-red-400 to-amber-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-white/40 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade to page background */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
