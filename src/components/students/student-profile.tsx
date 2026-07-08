"use client";

import { useEffect, useState } from "react";
import { Edit, Phone, Calendar, AlertTriangle, FileText, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Student, AttendanceRecord } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

interface StudentProfileProps {
  student: Student;
  onEdit: () => void;
  onClose: () => void;
}

export function StudentProfile({ student, onEdit, onClose }: StudentProfileProps) {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loadingAttendance, setLoadingAttendance] = useState(true);

  useEffect(() => {
    async function loadAttendance() {
      const { data } = await supabase
        .from("attendance")
        .select("*")
        .eq("student_id", student.id)
        .order("date", { ascending: false })
        .limit(20);
      if (data) setAttendance(data);
      setLoadingAttendance(false);
    }
    loadAttendance();
  }, [student.id]);

  const presentCount = attendance.filter((a) => a.status === "present").length;
  const totalCount = attendance.length;
  const attendanceRate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold bg-primary/10 text-primary">
          {student.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="text-lg font-bold">{student.name}</h3>
          <div className="flex items-center gap-2">
            <Badge variant={student.is_active ? "default" : "secondary"} className="text-xs">
              {student.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
      </div>

      <Separator />

      {/* Details */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
          <span>{student.phone}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
          <span>Joined {format(new Date(student.date_joined), "MMMM d, yyyy")}</span>
        </div>
        {student.emergency_contact && (
          <div className="flex items-center gap-3 text-sm">
            <AlertTriangle className="h-4 w-4 text-muted-foreground shrink-0" />
            <span>Emergency: {student.emergency_contact}</span>
          </div>
        )}
        {student.notes && (
          <div className="flex items-start gap-3 text-sm">
            <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <span className="text-muted-foreground">{student.notes}</span>
          </div>
        )}
      </div>

      <Separator />

      {/* Attendance Summary */}
      <div>
        <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Attendance History
        </h4>
        {loadingAttendance ? (
          <div className="h-8 bg-muted rounded animate-pulse" />
        ) : totalCount === 0 ? (
          <p className="text-sm text-muted-foreground">No attendance records yet.</p>
        ) : (
          <>
            {/* Stats bar */}
            <div className="flex items-center gap-4 mb-3">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${attendanceRate}%` }}
                />
              </div>
              <span className="text-sm font-semibold">{attendanceRate}%</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              {presentCount} present out of {totalCount} classes
            </p>
            {/* Recent records */}
            <div className="space-y-1 max-h-40 overflow-y-auto scrollbar-hide">
              {attendance.slice(0, 10).map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between text-xs py-1.5 px-2 rounded-md bg-muted/50"
                >
                  <span>{format(new Date(record.date), "MMM d, yyyy")}</span>
                  <Badge
                    variant={record.status === "present" ? "default" : "secondary"}
                    className="text-[10px]"
                  >
                    {record.status === "present" ? "Present" : "Absent"}
                  </Badge>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button variant="outline" onClick={onClose} className="flex-1 cursor-pointer">
          Close
        </Button>
        <Button onClick={onEdit} className="flex-1 gap-2 cursor-pointer">
          <Edit className="h-4 w-4" />
          Edit
        </Button>
      </div>
    </div>
  );
}
