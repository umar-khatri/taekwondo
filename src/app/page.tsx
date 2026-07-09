"use client";

import { useState } from "react";
import { Navbar } from "@/components/public/navbar";
import { HeroSection } from "@/components/public/hero-section";
import { AboutSection } from "@/components/public/about-section";
import { ScheduleSection } from "@/components/public/schedule-section";
import { InstructorSection } from "@/components/public/instructor-section";
import { LocationSection } from "@/components/public/location-section";
import { AnnouncementsSection } from "@/components/public/announcements-section";
import { TrialForm } from "@/components/public/trial-form";
import { Footer } from "@/components/public/footer";
import { SplashIntro } from "@/components/public/splash-intro";

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && <SplashIntro onComplete={() => setShowSplash(false)} />}
      <div
        className="flex min-h-screen flex-col"
        style={{
          opacity: showSplash ? 0 : 1,
          transition: "opacity 0.5s ease-in-out",
        }}
      >
        <Navbar />
        <main className="flex-1">
          <HeroSection />
          <AboutSection />
          <ScheduleSection />
          <InstructorSection />
          <LocationSection />
          <AnnouncementsSection />
          <TrialForm />
        </main>
        <Footer />
      </div>
    </>
  );
}
