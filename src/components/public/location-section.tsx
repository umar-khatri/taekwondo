"use client";

import { MapPin, Phone, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ACADEMY_INFO } from "@/lib/types";
import { useScrollReveal, useScrollStagger } from "@/lib/animations";

export function LocationSection() {
  const headingRef = useScrollReveal<HTMLDivElement>({ y: 30, duration: 0.7 });
  const mapRef = useScrollReveal<HTMLDivElement>({
    x: -30,
    y: 0,
    scale: 0.97,
    duration: 0.7,
    delay: 0.1,
  });
  const contactRef = useScrollStagger<HTMLDivElement>("[data-contact]", {
    y: 25,
    stagger: 0.1,
    duration: 0.5,
  });

  return (
    <section id="location" className="py-16 sm:py-24 bg-background/50 backdrop-blur-sm relative z-10 border-t border-border/20">
      <div className="mx-auto max-w-6xl px-4">
        <div ref={headingRef} className="text-center mb-12">
          <p className="text-sm font-semibold bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent uppercase tracking-wider mb-2">
            Find Us
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Visit Our Academy
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Map */}
          <div ref={mapRef}>
            <Card className="border-border/50 overflow-hidden">
              <div className="aspect-[4/3] w-full">
                <iframe
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(ACADEMY_INFO.mapQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Academy Location"
                />
              </div>
            </Card>
          </div>

          {/* Contact info */}
          <div ref={contactRef} className="flex flex-col gap-4">
            <Card
              data-contact
              className="border-border/50 bg-card/80 card-hover transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-red-500/15 to-amber-500/15 text-red-600 dark:text-red-400 border border-red-500/10">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Address</h3>
                    <p className="text-sm text-muted-foreground">
                      {ACADEMY_INFO.address}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              data-contact
              className="border-border/50 bg-card/80 card-hover transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-red-500/15 to-amber-500/15 text-red-600 dark:text-red-400 border border-red-500/10">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <p className="text-sm text-muted-foreground">
                      {ACADEMY_INFO.phone}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              data-contact
              className="border-border/50 bg-card/80 card-hover transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-red-500/15 to-amber-500/15 text-red-600 dark:text-red-400 border border-red-500/10">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-sm text-muted-foreground">
                      {ACADEMY_INFO.email}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
