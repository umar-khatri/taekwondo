import { Target, Heart, Users, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ACADEMY_INFO } from "@/lib/types";

const values = [
  {
    icon: Target,
    title: "Discipline",
    description: "Build mental strength and self-control through structured training and practice.",
  },
  {
    icon: Heart,
    title: "Respect",
    description: "Learn the values of respect for yourself, your peers, and your instructors.",
  },
  {
    icon: Users,
    title: "Community",
    description: "Join a supportive community that motivates and uplifts each other.",
  },
  {
    icon: Trophy,
    title: "Excellence",
    description: "Strive for personal excellence in every kick, form, and sparring session.",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="py-16 sm:py-24 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">About Us</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            More Than Just a Martial Arts Class
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            {ACADEMY_INFO.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {values.map((item) => (
            <Card key={item.title} className="card-hover border-border/50 bg-card/80">
              <CardContent className="pt-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-base mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
