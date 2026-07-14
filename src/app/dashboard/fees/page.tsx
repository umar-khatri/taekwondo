"use client";

import { useState, useEffect } from "react";
import { format, parseISO, isBefore, startOfMonth } from "date-fns";
import { supabase } from "@/lib/supabase";
import { Student, FeePayment } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, CheckCircle2, AlertCircle, Clock, Check, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function FeesPage() {
  const [selectedMonth, setSelectedMonth] = useState<string>(
    format(new Date(), "yyyy-MM")
  );
  const [students, setStudents] = useState<Student[]>([]);
  const [payments, setPayments] = useState<FeePayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [undoingId, setUndoingId] = useState<string | null>(null);

  useEffect(() => {
    loadData(selectedMonth);
  }, [selectedMonth]);

  async function loadData(month: string) {
    setLoading(true);
    try {
      // Fetch active students
      const { data: studentsData, error: studentsError } = await supabase
        .from("students")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (studentsError) throw studentsError;
      setStudents(studentsData || []);

      // Fetch payments for this month
      const { data: paymentsData, error: paymentsError } = await supabase
        .from("fee_payments")
        .select("*")
        .eq("month", month);

      if (paymentsError) throw paymentsError;
      setPayments(paymentsData || []);
    } catch (error) {
      toast.error("Failed to load fees data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function markAsPaid(studentId: string) {
    setMarkingId(studentId);
    try {
      const today = format(new Date(), "yyyy-MM-dd");
      const newPayment = {
        student_id: studentId,
        month: selectedMonth,
        paid_date: today,
      };

      const { data, error } = await supabase
        .from("fee_payments")
        .insert([newPayment])
        .select()
        .single();

      if (error) {
        if (error.code === "23505") { // Unique violation
          toast.error("This student is already marked as paid for this month.");
          // Reload to get the existing payment
          loadData(selectedMonth);
        } else {
          throw error;
        }
      } else if (data) {
        setPayments((prev) => [...prev, data]);
        toast.success("Marked as paid");
      }
    } catch (error) {
      toast.error("Failed to mark as paid");
      console.error(error);
    } finally {
      setMarkingId(null);
    }
  }

  async function undoMarkPaid(studentId: string) {
    if (!confirm("Are you sure you want to undo marking this fee as paid?")) return;
    setUndoingId(studentId);
    try {
      const { error } = await supabase
        .from("fee_payments")
        .delete()
        .eq("student_id", studentId)
        .eq("month", selectedMonth);

      if (error) {
        throw error;
      }

      setPayments((prev) => prev.filter((p) => p.student_id !== studentId));
      toast.success("Payment undone");
    } catch (error) {
      toast.error("Failed to undo payment");
      console.error(error);
    } finally {
      setUndoingId(null);
    }
  }

  function getStudentStatus(studentId: string) {
    const payment = payments.find((p) => p.student_id === studentId);
    if (payment) {
      return { status: "paid", date: payment.paid_date };
    }

    const currentMonthStart = startOfMonth(new Date());
    const selectedMonthStart = startOfMonth(parseISO(selectedMonth + "-01"));

    if (isBefore(selectedMonthStart, currentMonthStart)) {
      return { status: "unpaid", date: null };
    } else {
      return { status: "pending", date: null };
    }
  }

  function exportDefaulters() {
    const defaulters = students.filter((s) => {
      const status = getStudentStatus(s.id).status;
      return status === "unpaid" || status === "pending";
    });

    if (defaulters.length === 0) {
      toast.info("No defaulters for this month!");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Fees Defaulters - ${format(parseISO(selectedMonth + "-01"), "MMM yyyy")}`, 14, 22);
    
    doc.setFontSize(11);
    doc.text(`Generated on: ${format(new Date(), "PPpp")}`, 14, 30);

    const tableData = defaulters.map((s) => [
      s.name,
      s.phone,
      s.belt.charAt(0).toUpperCase() + s.belt.slice(1),
      getStudentStatus(s.id).status.toUpperCase(),
      format(parseISO(s.date_joined), "MMM d, yyyy"),
    ]);

    autoTable(doc, {
      startY: 36,
      head: [["Name", "Phone", "Belt", "Status", "Date Joined"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [220, 60, 60] }, // Red theme header
    });

    doc.save(`Defaulters_${format(parseISO(selectedMonth + "-01"), "MMM_yyyy")}.pdf`);
    toast.success("Defaulter list exported as PDF");
  }

  // Calculate stats
  const totalPaid = payments.length;
  const totalStudents = students.length;
  const percentagePaid = totalStudents === 0 ? 0 : Math.round((totalPaid / totalStudents) * 100);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Fees Management</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage monthly fee collections.
          </p>
        </div>
        <Button onClick={exportDefaulters} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Defaulters
        </Button>
      </div>

      <Card className="glass border-border/50">
        <CardHeader className="pb-4 border-b border-border/50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <label htmlFor="month" className="text-sm font-medium">
                Select Month:
              </label>
              <input
                id="month"
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="flex h-10 w-full sm:w-auto rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            {!loading && (
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="text-muted-foreground">Collection Rate:</span>
                <span className={percentagePaid >= 80 ? "text-success" : "text-warning"}>
                  {percentagePaid}% ({totalPaid}/{totalStudents})
                </span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-6 p-0 sm:p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No active students found.
            </div>
          ) : (
            <div className="divide-y divide-border/50 border-y sm:border sm:rounded-lg overflow-hidden">
              {students.map((student) => {
                const { status, date } = getStudentStatus(student.id);
                return (
                  <div
                    key={student.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4 hover:bg-muted/30 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.phone}</p>
                    </div>
                    
                    <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                      {status === "paid" ? (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5 text-success bg-success/10 px-3 py-1 rounded-full text-xs font-medium">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Paid on {date ? format(parseISO(date), "MMM d") : "Unknown"}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => undoMarkPaid(student.id)}
                            disabled={undoingId === student.id}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            title="Undo payment"
                          >
                            <RotateCcw className={`h-4 w-4 ${undoingId === student.id ? 'animate-spin' : ''}`} />
                          </Button>
                        </div>
                      ) : status === "unpaid" ? (
                        <div className="flex items-center gap-1.5 text-destructive bg-destructive/10 px-3 py-1 rounded-full text-xs font-medium">
                          <AlertCircle className="h-3.5 w-3.5" />
                          Unpaid
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-warning bg-warning/10 px-3 py-1 rounded-full text-xs font-medium">
                          <Clock className="h-3.5 w-3.5" />
                          Pending
                        </div>
                      )}

                      {status !== "paid" && (
                        <Button
                          size="sm"
                          onClick={() => markAsPaid(student.id)}
                          disabled={markingId === student.id}
                          className="gap-1.5 h-8 text-xs shrink-0"
                        >
                          <Check className="h-3.5 w-3.5" />
                          {markingId === student.id ? "Marking..." : "Mark as Paid"}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
