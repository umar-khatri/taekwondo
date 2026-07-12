"use client";

import { useEffect, useState, useRef } from "react";
import { Megaphone, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Announcement } from "@/lib/types";
import { format } from "date-fns";
import { useScrollReveal, useScrollStagger } from "@/lib/animations";

export function AnnouncementsSection() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const headingRef = useScrollReveal<HTMLDivElement>({ y: 30, duration: 0.7 });
  const cardsRef = useScrollStagger<HTMLDivElement>("[data-announcement]", {
    y: 30,
    stagger: 0.12,
    duration: 0.5,
  });

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);
      if (data) setAnnouncements(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <section id="announcements" className="py-16 sm:py-24 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4">
        <div ref={headingRef} className="text-center mb-12">
          <p className="text-sm font-semibold bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent uppercase tracking-wider mb-2">
            Latest News
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Announcements
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Stay updated with the latest news from the academy.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-border/50 animate-pulse">
                <CardContent className="pt-6">
                  <div className="h-4 bg-muted rounded w-3/4 mb-3" />
                  <div className="h-3 bg-muted rounded w-full mb-2" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : announcements.length === 0 ? (
          <Card className="max-w-md mx-auto border-border/50 bg-card/80">
            <CardContent className="pt-6 text-center">
              <Megaphone className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground">No announcements yet. Check back soon!</p>
            </CardContent>
          </Card>
        ) : (
          <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {announcements.map((item) => (
              <Card key={item.id} data-announcement className="border-border/50 bg-card/80 card-hover transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <Calendar className="h-3.5 w-3.5" />
                    {format(new Date(item.created_at), "MMM d, yyyy")}
                  </div>
                  <h3 className="font-semibold mb-2 line-clamp-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">{item.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
