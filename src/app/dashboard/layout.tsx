import { Sidebar } from "@/components/dashboard/sidebar";
import { BottomNav } from "@/components/dashboard/bottom-nav";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const { data: roleData } = await getSupabaseAdmin()
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .single();

  if (roleData?.role !== "admin") {
    redirect("/book-trial");
  }

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
