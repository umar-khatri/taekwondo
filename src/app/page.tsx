import { Navbar } from "@/components/public/navbar";
import { HeroSection } from "@/components/public/hero-section";
import { AboutSection } from "@/components/public/about-section";
import { ScheduleSection } from "@/components/public/schedule-section";
import { InstructorSection } from "@/components/public/instructor-section";
import { LocationSection } from "@/components/public/location-section";
import { AnnouncementsSection } from "@/components/public/announcements-section";
import { TrialForm } from "@/components/public/trial-form";
import { Footer } from "@/components/public/footer";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
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
  );
}
