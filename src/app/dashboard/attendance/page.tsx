"use client";

import { useEffect, useState, useCallback } from "react";
import {
  CheckCircle2,
  XCircle,
  Save,
  CalendarDays,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase";
import { Student, AttendanceRecord } from "@/lib/types";
import { format, addDays, subDays, isToday } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AttendancePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, "present" | "absent">>({});
  const [existingRecords, setExistingRecords] = useState<AttendanceRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const dateStr = format(selectedDate, "yyyy-MM-dd");

  const loadData = useCallback(async () => {
    setLoading(true);

    // Load active students
    const { data: studentsData } = await supabase
      .from("students")
      .select("*")
      .eq("is_active", true)
      .order("name");

    // Load attendance for selected date
    const { data: attendanceData } = await supabase
      .from("attendance")
      .select("*")
      .eq("date", dateStr);

    if (studentsData) setStudents(studentsData);

    // Build attendance map from existing records
    const map: Record<string, "present" | "absent"> = {};
    if (attendanceData) {
      setExistingRecords(attendanceData);
      attendanceData.forEach((record) => {
        map[record.student_id] = record.status as "present" | "absent";
      });
    }
    setAttendance(map);
    setLoading(false);
  }, [dateStr]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function toggleAttendance(studentId: string) {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === "present" ? "absent" : "present",
    }));
  }

  function markAll(status: "present" | "absent") {
    const map: Record<string, "present" | "absent"> = {};
    students.forEach((s) => {
      map[s.id] = status;
    });
    setAttendance(map);
  }

  async function saveAttendance() {
    setSaving(true);

    // Delete existing records for this date
    if (existingRecords.length > 0) {
      await supabase.from("attendance").delete().eq("date", dateStr);
    }

    // Insert new records
    const records = Object.entries(attendance).map(([student_id, status]) => ({
      student_id,
      date: dateStr,
      status,
    }));

    if (records.length === 0) {
      toast.error("Please mark attendance for at least one student.");
      setSaving(false);
      return;
    }

    const { error } = await supabase.from("attendance").insert(records);
    if (error) {
      toast.error("Failed to save attendance.");
      console.error(error);
    } else {
      toast.success(`Attendance saved for ${format(selectedDate, "MMM d, yyyy")}!`);
      loadData();
    }
    setSaving(false);
  }

  const presentCount = Object.values(attendance).filter((s) => s === "present").length;
  const markedCount = Object.keys(attendance).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Attendance</h1>
        <p className="text-sm text-muted-foreground">
          Mark daily class attendance for your students.
        </p>
      </div>

      {/* Date Picker */}
      <Card className="border-border/50 bg-card/80">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedDate(subDays(selectedDate, 1))}
              className="cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="text-center">
              <div className="flex items-center gap-2 justify-center">
                <CalendarDays className="h-4 w-4 text-primary" />
                <span className="font-semibold">
                  {format(selectedDate, "EEEE, MMM d, yyyy")}
                </span>
              </div>
              {isToday(selectedDate) && (
                <Badge variant="secondary" className="mt-1 text-[10px]">
                  Today
                </Badge>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedDate(addDays(selectedDate, 1))}
              className="cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats & Bulk Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>
            {presentCount}/{markedCount} present · {students.length} active students
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAll("present")}
            className="text-xs cursor-pointer"
          >
            All Present
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAll("absent")}
            className="text-xs cursor-pointer"
          >
            All Absent
          </Button>
        </div>
      </div>

      {/* Student List */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-border/50 animate-pulse">
              <CardContent className="pt-4 pb-4">
                <div className="h-10 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : students.length === 0 ? (
        <Card className="border-border/50 bg-card/80">
          <CardContent className="pt-6 text-center py-12">
            <p className="text-muted-foreground">No active students. Add students first.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-1.5">
          {students.map((student) => {
            const status = attendance[student.id];

            return (
              <Card
                key={student.id}
                className={cn(
                  "border-border/50 cursor-pointer transition-all duration-200",
                  status === "present" && "bg-green-50/50 dark:bg-green-900/10 border-green-200/50 dark:border-green-800/30",
                  status === "absent" && "bg-red-50/50 dark:bg-red-900/10 border-red-200/50 dark:border-red-800/30",
                  !status && "bg-card/80"
                )}
                onClick={() => toggleAttendance(student.id)}
              >
                <CardContent className="pt-3 pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold bg-gradient-to-br from-red-500/15 to-amber-500/15 text-red-600 dark:text-red-400 border border-red-500/10">
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{student.name}</p>
                        <p className="text-xs text-muted-foreground">{student.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {status === "present" ? (
                        <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                          <CheckCircle2 className="h-5 w-5" />
                          <span className="text-xs font-medium">Present</span>
                        </div>
                      ) : status === "absent" ? (
                        <div className="flex items-center gap-1.5 text-red-500 dark:text-red-400">
                          <XCircle className="h-5 w-5" />
                          <span className="text-xs font-medium">Absent</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Tap to mark</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Save Button */}
      {students.length > 0 && (
        <>
          <Separator />
          <Button
            onClick={saveAttendance}
            disabled={saving || markedCount === 0}
            className="w-full gap-2 cursor-pointer"
            size="lg"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Saving...
              </span>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Attendance
              </>
            )}
          </Button>
        </>
      )}
    </div>
  );
}
