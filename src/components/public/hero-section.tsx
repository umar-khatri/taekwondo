"use client";

import { Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ACADEMY_INFO } from "@/lib/types";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/10" />
      <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-10 left-10 h-56 w-56 rounded-full bg-primary/8 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28 md:py-36">
        <div className="flex flex-col items-center text-center gap-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-sm animate-fade-in">
            <Shield className="h-3.5 w-3.5 text-primary" />
            World Taekwondo Federation Certified
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight animate-slide-up">
            <span className="gradient-text">{ACADEMY_INFO.name}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl font-medium text-muted-foreground animate-slide-up max-w-2xl" style={{ animationDelay: "0.1s" }}>
            {ACADEMY_INFO.tagline}
          </p>

          {/* Description */}
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl animate-slide-up" style={{ animationDelay: "0.2s" }}>
            Train with the best. Build confidence, discipline, and strength through the art of Taekwondo.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <a href="#trial">
              <Button size="lg" className="gap-2 text-base px-8 cursor-pointer">
                Book a Free Trial
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
            <a href="#schedule">
              <Button size="lg" variant="outline" className="text-base px-8 cursor-pointer">
                View Schedule
              </Button>
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 sm:gap-16 pt-8 animate-slide-up" style={{ animationDelay: "0.4s" }}>
            {[
              { value: "15+", label: "Years Experience" },
              { value: "200+", label: "Students Trained" },
              { value: "5th", label: "Dan Black Belt" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
