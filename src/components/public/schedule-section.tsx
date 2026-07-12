"use client";

import { Clock, CalendarDays } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ACADEMY_INFO } from "@/lib/types";
import { useScrollReveal } from "@/lib/animations";

export function ScheduleSection() {
  const days = ["Monday", "Wednesday", "Friday"];
  const headingRef = useScrollReveal<HTMLDivElement>({ y: 30, duration: 0.7 });
  const cardRef = useScrollReveal<HTMLDivElement>({
    y: 40,
    scale: 0.97,
    duration: 0.7,
    delay: 0.15,
  });

  return (
    <section id="schedule" className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div ref={headingRef} className="text-center mb-12">
          <p className="text-sm font-semibold bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent uppercase tracking-wider mb-2">
            Class Schedule
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Train With Us
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Join our regular classes and take your skills to the next level.
          </p>
        </div>

        <div ref={cardRef}>
          <Card className="max-w-lg mx-auto border-border/50 bg-card/80 card-hover overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
            {/* Header */}
            <div className="bg-primary/5 border-b border-border/50 px-6 py-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-red-500" />
                Regular Training
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                All ages & skill levels welcome
              </p>
            </div>

            <CardContent className="pt-6">
              {/* Days */}
              <div className="flex flex-wrap gap-2 mb-6">
                {days.map((day) => (
                  <span
                    key={day}
                    className="inline-flex items-center rounded-full bg-gradient-to-r from-red-500/15 to-amber-500/15 text-red-600 dark:text-red-400 border border-red-500/10 px-4 py-1.5 text-sm font-medium transition-colors duration-300 hover:from-red-500/20 hover:to-amber-500/20"
                  >
                    {day}
                  </span>
                ))}
              </div>

              {/* Time */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-amber-500 text-white shrink-0 shadow-sm shadow-amber-900/20">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-lg">
                    {ACADEMY_INFO.schedule.time}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Duration: 1 hour
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
