"use client";

import { Target, Heart, Users, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ACADEMY_INFO } from "@/lib/types";
import { useScrollReveal, useScrollStagger } from "@/lib/animations";

const values = [
  {
    icon: Target,
    title: "Discipline",
    description:
      "Build mental strength and self-control through structured training and practice.",
  },
  {
    icon: Heart,
    title: "Respect",
    description:
      "Learn the values of respect for yourself, your peers, and your instructors.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "Join a supportive community that motivates and uplifts each other.",
  },
  {
    icon: Trophy,
    title: "Excellence",
    description:
      "Strive for personal excellence in every kick, form, and sparring session.",
  },
];

export function AboutSection() {
  const headingRef = useScrollReveal<HTMLDivElement>({ y: 30, duration: 0.7 });
  const cardsRef = useScrollStagger<HTMLDivElement>("[data-card]", {
    y: 40,
    scale: 0.95,
    stagger: 0.12,
    duration: 0.6,
  });

  return (
    <section id="about" className="py-16 sm:py-24 bg-background/60 backdrop-blur-sm relative z-10 border-t border-border/20">
      <div className="mx-auto max-w-6xl px-4">
        <div ref={headingRef} className="text-center mb-12">
          <p className="text-sm font-semibold bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent uppercase tracking-wider mb-2">
            About Us
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            More Than Just a Martial Arts Class
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            {ACADEMY_INFO.description}
          </p>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {values.map((item) => (
            <Card
              key={item.title}
              data-card
              className="card-hover border-border/50 bg-card/80 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
            >
              <CardContent className="pt-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500/15 to-amber-500/15 text-red-500 transition-transform duration-300 group-hover:scale-110 border border-red-500/10">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-base mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
