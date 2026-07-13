"use client";

import { useScrollReveal } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function TrialForm() {
  const headingRef = useScrollReveal<HTMLDivElement>({ y: 30, duration: 0.7 });
  const ctaRef = useScrollReveal<HTMLDivElement>({
    y: 40,
    scale: 0.97,
    duration: 0.7,
    delay: 0.15,
  });

  return (
    <section id="trial" className="py-16 sm:py-24 relative z-10">
      <div className="mx-auto max-w-6xl px-4">
        <div ref={headingRef} className="text-center mb-12">
          <p className="text-sm font-semibold text-amber-500 uppercase tracking-wider mb-2">
            Get Started
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Book a Free Trial Class
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Experience a class before committing. No obligations, just show up and train!
          </p>
        </div>

        <div ref={ctaRef}>
          <Card className="max-w-md mx-auto border-border/50 bg-card/80 card-hover transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
            <CardContent className="pt-8 pb-8 text-center">
              <p className="mb-6 text-muted-foreground">
                Sign in with your Google account to book your free trial and track its status.
              </p>
              <Link href="/book-trial">
                <Button size="lg" className="w-full gap-2">
                  Continue with Google
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
