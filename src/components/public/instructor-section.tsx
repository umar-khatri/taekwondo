import { Award, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ACADEMY_INFO } from "@/lib/types";

export function InstructorSection() {
  return (
    <section id="instructor" className="py-16 sm:py-24 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
            Meet Your Instructor
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Learn From the Best
          </h2>
        </div>

        <Card className="max-w-2xl mx-auto border-border/50 bg-card/80 card-hover overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar placeholder */}
              <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10">
                <Award className="h-12 w-12 text-primary" />
              </div>

              <div className="text-center sm:text-left">
                <h3 className="text-xl font-bold">{ACADEMY_INFO.instructor.name}</h3>
                <p className="text-sm font-medium text-primary mb-3">
                  {ACADEMY_INFO.instructor.title}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {ACADEMY_INFO.instructor.bio}
                </p>

                {/* Credentials */}
                <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
                  {["5th Dan Black Belt", "WTF Certified", "15+ Years"].map((cred) => (
                    <span
                      key={cred}
                      className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background px-3 py-1 text-xs font-medium text-muted-foreground"
                    >
                      <Star className="h-3 w-3 text-primary" />
                      {cred}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
