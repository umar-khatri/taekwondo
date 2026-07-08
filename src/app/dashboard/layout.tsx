import { Sidebar } from "@/components/dashboard/sidebar";
import { BottomNav } from "@/components/dashboard/bottom-nav";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <DashboardHeader />
      <main className="md:pl-64">
        <div className="mx-auto max-w-5xl px-4 py-6 pb-24 md:py-8 md:pb-8">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
