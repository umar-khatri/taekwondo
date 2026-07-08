"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/lib/supabase";
import { Student, BELT_COLORS, Belt } from "@/lib/types";
import { StudentForm } from "@/components/students/student-form";
import { StudentProfile } from "@/components/students/student-profile";
import { format } from "date-fns";
import { toast } from "sonner";

function StudentsPageContent() {
  const searchParams = useSearchParams();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

  const loadStudents = useCallback(async () => {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setStudents(data);
    if (error) console.error(error);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  useEffect(() => {
    if (searchParams.get("action") === "add") {
      setShowForm(true);
    }
  }, [searchParams]);

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search)
  );

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this student?")) return;
    const { error } = await supabase.from("students").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete student.");
    } else {
      toast.success("Student deleted.");
      loadStudents();
    }
  }

  async function toggleActive(student: Student) {
    const { error } = await supabase
      .from("students")
      .update({ is_active: !student.is_active })
      .eq("id", student.id);
    if (error) {
      toast.error("Failed to update status.");
    } else {
      toast.success(student.is_active ? "Student marked inactive." : "Student marked active.");
      loadStudents();
    }
  }

  function handleFormSuccess() {
    setShowForm(false);
    setEditingStudent(null);
    loadStudents();
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Students</h1>
          <p className="text-sm text-muted-foreground">
            {students.length} total · {students.filter((s) => s.is_active).length} active
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2 cursor-pointer">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Student</span>
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Student List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-border/50 animate-pulse">
              <CardContent className="pt-6">
                <div className="h-5 bg-muted rounded w-1/3 mb-2" />
                <div className="h-4 bg-muted rounded w-1/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-border/50 bg-card/80">
          <CardContent className="pt-6 text-center py-12">
            <p className="text-muted-foreground">
              {search ? "No students match your search." : "No students yet. Add your first student!"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((student) => {
            const belt = BELT_COLORS[student.belt as Belt];
            return (
              <Card
                key={student.id}
                className="border-border/50 bg-card/80 card-hover cursor-pointer"
                onClick={() => setViewingStudent(student)}
              >
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Belt indicator */}
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${belt.bg} ${belt.text}`}
                      >
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm truncate">{student.name}</p>
                          {!student.is_active && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                              Inactive
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{student.phone}</span>
                          <span>·</span>
                          <Badge className={`text-[10px] px-1.5 py-0 ${belt.bg} ${belt.text} border-0`}>
                            {belt.label} Belt
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className="inline-flex items-center justify-center h-8 w-8 shrink-0 cursor-pointer rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewingStudent(student);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingStudent(student);
                            setShowForm(true);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleActive(student);
                          }}
                        >
                          {student.is_active ? (
                            <>
                              <UserX className="h-4 w-4 mr-2" />
                              Mark Inactive
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-4 w-4 mr-2" />
                              Mark Active
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(student.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open);
          if (!open) setEditingStudent(null);
        }}
      >
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingStudent ? "Edit Student" : "Add Student"}</DialogTitle>
          </DialogHeader>
          <StudentForm
            student={editingStudent}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false);
              setEditingStudent(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* View Profile Dialog */}
      <Dialog open={!!viewingStudent} onOpenChange={(open) => !open && setViewingStudent(null)}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Student Profile</DialogTitle>
          </DialogHeader>
          {viewingStudent && (
            <StudentProfile
              student={viewingStudent}
              onEdit={() => {
                setEditingStudent(viewingStudent);
                setViewingStudent(null);
                setShowForm(true);
              }}
              onClose={() => setViewingStudent(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function StudentsPage() {
  return (
    <Suspense fallback={<div className="animate-pulse p-8 text-muted-foreground">Loading...</div>}>
      <StudentsPageContent />
    </Suspense>
  );
}
