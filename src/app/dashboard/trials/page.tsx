"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Sparkles,
  Phone,
  Calendar,
  MoreHorizontal,
  UserPlus,
  CheckCircle2,
  Trash2,
  Clock,
  XCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { TrialRequest } from "@/lib/types";
import { StudentForm } from "@/components/students/student-form";
import { format } from "date-fns";
import { toast } from "sonner";
import { getTrials, deleteTrial as deleteTrialAction } from "./actions";

export default function TrialsPage() {
  const [trials, setTrials] = useState<TrialRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [convertingTrial, setConvertingTrial] = useState<TrialRequest | null>(null);

  const loadTrials = useCallback(async () => {
    setLoading(true);
    const data = await getTrials();
    setTrials(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadTrials();
  }, [loadTrials]);

  async function updateStatus(id: string, status: "approved" | "rejected") {
    const res = await fetch(`/api/trials/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    
    if (!res.ok) {
      toast.error("Failed to update status.");
    } else {
      toast.success(`Trial request ${status}.`);
      loadTrials();
    }
  }

  async function deleteTrial(id: string) {
    if (!confirm("Delete this trial request?")) return;
    const result = await deleteTrialAction(id);
    if (result.error) {
      toast.error("Failed to delete.");
    } else {
      toast.success("Trial request deleted.");
      loadTrials();
    }
  }

  async function handleConvertSuccess() {
    if (convertingTrial) {
      // Delete the trial request after converting
      await deleteTrialAction(convertingTrial.id);
      setConvertingTrial(null);
      loadTrials();
    }
  }

  const newCount = trials.filter((t) => t.status === "pending").length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Trial Requests</h1>
        <p className="text-sm text-muted-foreground">
          {trials.length} total · {newCount} pending
        </p>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-border/50 animate-pulse">
              <CardContent className="pt-4 pb-4">
                <div className="h-12 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : trials.length === 0 ? (
        <Card className="border-border/50 bg-card/80">
          <CardContent className="pt-6 text-center py-12">
            <Sparkles className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground">No trial requests yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {trials.map((trial) => (
            <Card
              key={trial.id}
              className="border-border/50 bg-card/80 card-hover"
            >
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm truncate">{trial.name}</p>
                          <Badge
                          variant={trial.status === "pending" ? "default" : trial.status === "approved" ? "outline" : "secondary"}
                          className={`text-[10px] px-1.5 py-0 shrink-0 ${trial.status === 'approved' ? 'text-green-500 border-green-500/20 bg-green-500/10' : trial.status === 'rejected' ? 'text-red-500 border-red-500/20 bg-red-500/10' : ''}`}
                        >
                          {trial.status === "pending" ? (
                            <span className="flex items-center gap-1">
                              <Clock className="h-2.5 w-2.5" /> Pending
                            </span>
                          ) : trial.status === "approved" ? (
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="h-2.5 w-2.5" /> Approved
                            </span>
                          ) : trial.status === "rejected" ? (
                            <span className="flex items-center gap-1">
                              <XCircle className="h-2.5 w-2.5" /> Rejected
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="h-2.5 w-2.5" /> Contacted
                            </span>
                          )}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {trial.phone}
                        </span>
                        {trial.age && <span>Age: {trial.age}</span>}
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(trial.created_at), "MMM d")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 shrink-0 cursor-pointer rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {trial.status === "pending" && (
                        <>
                          <DropdownMenuItem onClick={() => updateStatus(trial.id, "approved")}>
                            <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(trial.id, "rejected")}>
                            <XCircle className="h-4 w-4 mr-2 text-red-500" />
                            Reject
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuItem onClick={() => setConvertingTrial(trial)}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Convert to Student
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => deleteTrial(trial.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Convert to Student Dialog */}
      <Dialog open={!!convertingTrial} onOpenChange={(open) => !open && setConvertingTrial(null)}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Convert to Student</DialogTitle>
          </DialogHeader>
          {convertingTrial && (
            <StudentForm
              defaultValues={{
                name: convertingTrial.name,
                phone: convertingTrial.phone,
              }}
              onSuccess={handleConvertSuccess}
              onCancel={() => setConvertingTrial(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
