"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Sparkles,
  ClipboardCheck,
  MessageSquare,
  Plus,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  pendingTrials: number;
  totalAnnouncements: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    activeStudents: 0,
    pendingTrials: 0,
    totalAnnouncements: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const [studentsRes, activeRes, trialsRes, announcementsRes] = await Promise.all([
        supabase.from("students").select("id", { count: "exact", head: true }),
        supabase.from("students").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("trial_requests").select("id", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("announcements").select("id", { count: "exact", head: true }),
      ]);

      setStats({
        totalStudents: studentsRes.count ?? 0,
        activeStudents: activeRes.count ?? 0,
        pendingTrials: trialsRes.count ?? 0,
        totalAnnouncements: announcementsRes.count ?? 0,
      });
      setLoading(false);
    }
    loadStats();
  }, []);

  const statCards = [
    {
      label: "Total Students",
      value: stats.totalStudents,
      sub: `${stats.activeStudents} active`,
      icon: Users,
      href: "/dashboard/students",
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      label: "Pending Trials",
      value: stats.pendingTrials,
      sub: "awaiting contact",
      icon: Sparkles,
      href: "/dashboard/trials",
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-900/20",
    },
    {
      label: "Announcements",
      value: stats.totalAnnouncements,
      sub: "published",
      icon: MessageSquare,
      href: "/dashboard/announcements",
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-900/20",
    },
  ];

  const quickActions = [
    {
      label: "Mark Attendance",
      icon: ClipboardCheck,
      href: "/dashboard/attendance",
      variant: "default" as const,
    },
    {
      label: "Add Student",
      icon: Plus,
      href: "/dashboard/students?action=add",
      variant: "outline" as const,
    },
    {
      label: "View Trials",
      icon: Sparkles,
      href: "/dashboard/trials",
      variant: "outline" as const,
    },
    {
      label: "New Announcement",
      icon: MessageSquare,
      href: "/dashboard/announcements?action=add",
      variant: "outline" as const,
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back. Here&apos;s your academy overview.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href}>
            <Card className="card-hover border-border/50 bg-card/80 cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{card.label}</p>
                    <p className="text-3xl font-bold mt-1">
                      {loading ? (
                        <span className="inline-block h-8 w-12 animate-pulse bg-muted rounded" />
                      ) : (
                        card.value
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {card.sub}
                    </p>
                  </div>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.bg}`}>
                    <card.icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link key={action.label} href={action.href}>
              <Button
                variant={action.variant}
                className="w-full h-auto py-4 flex flex-col items-center gap-2 cursor-pointer"
              >
                <action.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{action.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* Navigation Cards */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Manage</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { title: "Students", desc: "View, add, and manage your students", href: "/dashboard/students", icon: Users },
            { title: "Attendance", desc: "Mark daily class attendance", href: "/dashboard/attendance", icon: ClipboardCheck },
            { title: "Trial Requests", desc: "Manage trial class registrations", href: "/dashboard/trials", icon: Sparkles },
            { title: "Announcements", desc: "Post and manage announcements", href: "/dashboard/announcements", icon: MessageSquare },
          ].map((item) => (
            <Link key={item.title} href={item.href}>
              <Card className="card-hover border-border/50 bg-card/80 cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{item.title}</h3>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
