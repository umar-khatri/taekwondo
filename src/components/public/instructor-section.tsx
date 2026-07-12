"use client";

import { Award, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ACADEMY_INFO } from "@/lib/types";
import { useScrollReveal } from "@/lib/animations";

export function InstructorSection() {
  const headingRef = useScrollReveal<HTMLDivElement>({ y: 30, duration: 0.7 });
  const cardRef = useScrollReveal<HTMLDivElement>({
    y: 40,
    scale: 0.97,
    duration: 0.7,
    delay: 0.15,
  });

  return (
    <section id="instructor" className="py-16 sm:py-24 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4">
        <div ref={headingRef} className="text-center mb-12">
          <p className="text-sm font-semibold bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent uppercase tracking-wider mb-2">
            Meet Your Instructor
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Learn From the Best
          </h2>
        </div>

        <div ref={cardRef}>
          <Card className="max-w-2xl mx-auto border-border/50 bg-card/80 card-hover overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Avatar placeholder */}
                <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500/15 to-amber-500/15 border border-red-500/10">
                  <Award className="h-12 w-12 text-red-500" />
                </div>

                <div className="text-center sm:text-left">
                  <h3 className="text-xl font-bold">
                    {ACADEMY_INFO.instructor.name}
                  </h3>
                  <p className="text-sm font-medium text-red-500 mb-3">
                    {ACADEMY_INFO.instructor.title}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {ACADEMY_INFO.instructor.bio}
                  </p>

                  {/* Credentials */}
                  <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
                    {["5th Dan Black Belt", "WTF Certified", "15+ Years"].map(
                      (cred) => (
                        <span
                          key={cred}
                          className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background px-3 py-1 text-xs font-medium text-muted-foreground transition-colors duration-300 hover:border-primary/30 hover:text-primary"
                        >
                          <Star className="h-3 w-3 text-primary" />
                          {cred}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
