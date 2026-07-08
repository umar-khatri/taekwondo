"use client";

import { useEffect, useState, useCallback } from "react";
import {
  FileSpreadsheet,
  FileText,
  Download,
  CalendarDays,
  Filter,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { Student, AttendanceRecord } from "@/lib/types";
import { format, subDays } from "date-fns";
import { toast } from "sonner";

interface ReportRow {
  studentName: string;
  phone: string;
  totalClasses: number;
  present: number;
  absent: number;
  attendanceRate: number;
}

export default function ReportsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState(
    format(subDays(new Date(), 30), "yyyy-MM-dd")
  );
  const [dateTo, setDateTo] = useState(format(new Date(), "yyyy-MM-dd"));
  const [filterStudent, setFilterStudent] = useState("all");
  const [reportData, setReportData] = useState<ReportRow[]>([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [studentsRes, attendanceRes] = await Promise.all([
      supabase.from("students").select("*").order("name"),
      supabase
        .from("attendance")
        .select("*")
        .gte("date", dateFrom)
        .lte("date", dateTo),
    ]);

    const studentsData = studentsRes.data ?? [];
    const attendanceData = attendanceRes.data ?? [];
    setStudents(studentsData);
    setAttendance(attendanceData);

    // Build report
    const filteredStudents =
      filterStudent === "all"
        ? studentsData
        : studentsData.filter((s) => s.id === filterStudent);

    const rows: ReportRow[] = filteredStudents.map((student) => {
      const records = attendanceData.filter((a) => a.student_id === student.id);
      const present = records.filter((r) => r.status === "present").length;
      const absent = records.filter((r) => r.status === "absent").length;
      const total = present + absent;
      return {
        studentName: student.name,
        phone: student.phone,
        totalClasses: total,
        present,
        absent,
        attendanceRate: total > 0 ? Math.round((present / total) * 100) : 0,
      };
    });

    setReportData(rows);
    setLoading(false);
  }, [dateFrom, dateTo, filterStudent]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function exportPDF() {
    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Attendance Report", 14, 20);
    doc.setFontSize(10);
    doc.text(
      `Period: ${format(new Date(dateFrom), "MMM d, yyyy")} — ${format(new Date(dateTo), "MMM d, yyyy")}`,
      14,
      28
    );
    doc.text(`Master Farooq's Club`, 14, 34);

    autoTable(doc, {
      startY: 42,
      head: [["Student", "Phone", "Classes", "Present", "Absent", "Rate"]],
      body: reportData.map((row) => [
        row.studentName,
        row.phone,
        row.totalClasses.toString(),
        row.present.toString(),
        row.absent.toString(),
        `${row.attendanceRate}%`,
      ]),
      theme: "grid",
      headStyles: { fillColor: [79, 70, 229] },
    });

    doc.save(`attendance_report_${dateFrom}_${dateTo}.pdf`);
    toast.success("PDF exported!");
  }

  async function exportExcel() {
    const XLSX = await import("xlsx");

    const wsData = [
      ["Student", "Phone", "Total Classes", "Present", "Absent", "Rate"],
      ...reportData.map((row) => [
        row.studentName,
        row.phone,
        row.totalClasses,
        row.present,
        row.absent,
        `${row.attendanceRate}%`,
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance Report");

    // Set column widths
    ws["!cols"] = [
      { wch: 20 },
      { wch: 15 },
      { wch: 12 },
      { wch: 10 },
      { wch: 10 },
      { wch: 8 },
    ];

    XLSX.writeFile(wb, `attendance_report_${dateFrom}_${dateTo}.xlsx`);
    toast.success("Excel exported!");
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <p className="text-sm text-muted-foreground">
          Generate and export attendance reports.
        </p>
      </div>

      {/* Filters */}
      <Card className="border-border/50 bg-card/80">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date-from">From</Label>
              <Input
                id="date-from"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date-to">To</Label>
              <Input
                id="date-to"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Student</Label>
              <Select value={filterStudent} onValueChange={(val) => setFilterStudent(val ?? "all")}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="All students" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  {students.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={exportPDF}
          disabled={reportData.length === 0}
          className="gap-2 cursor-pointer"
        >
          <FileText className="h-4 w-4" />
          Export PDF
        </Button>
        <Button
          variant="outline"
          onClick={exportExcel}
          disabled={reportData.length === 0}
          className="gap-2 cursor-pointer"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Export Excel
        </Button>
      </div>

      {/* Report Table */}
      {loading ? (
        <Card className="border-border/50 animate-pulse">
          <CardContent className="pt-6">
            <div className="h-40 bg-muted rounded" />
          </CardContent>
        </Card>
      ) : reportData.length === 0 ? (
        <Card className="border-border/50 bg-card/80">
          <CardContent className="pt-6 text-center py-12">
            <Filter className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground">
              No attendance data found for this period.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/50 bg-card/80 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead className="text-center">Classes</TableHead>
                  <TableHead className="text-center">Present</TableHead>
                  <TableHead className="text-center">Absent</TableHead>
                  <TableHead className="text-center">Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.map((row) => (
                  <TableRow key={row.studentName}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{row.studentName}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{row.totalClasses}</TableCell>
                    <TableCell className="text-center text-green-600 dark:text-green-400">
                      {row.present}
                    </TableCell>
                    <TableCell className="text-center text-red-500 dark:text-red-400">
                      {row.absent}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden hidden sm:block">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${row.attendanceRate}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{row.attendanceRate}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
}
