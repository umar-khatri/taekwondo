"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/lib/supabase";
import { Student, Belt, BELT_COLORS } from "@/lib/types";
import { toast } from "sonner";

interface StudentFormProps {
  student?: Student | null;
  onSuccess: () => void;
  onCancel: () => void;
  defaultValues?: {
    name?: string;
    phone?: string;
  };
}

export function StudentForm({ student, onSuccess, onCancel, defaultValues }: StudentFormProps) {
  const [name, setName] = useState(student?.name ?? defaultValues?.name ?? "");
  const [phone, setPhone] = useState(student?.phone ?? defaultValues?.phone ?? "");
  const [belt, setBelt] = useState<Belt>((student?.belt as Belt) ?? "white");
  const [dateJoined, setDateJoined] = useState(
    student?.date_joined ?? new Date().toISOString().split("T")[0]
  );
  const [emergencyContact, setEmergencyContact] = useState(student?.emergency_contact ?? "");
  const [notes, setNotes] = useState(student?.notes ?? "");
  const [isActive, setIsActive] = useState(student?.is_active ?? true);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error("Name and phone are required.");
      return;
    }

    setLoading(true);

    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      belt,
      date_joined: dateJoined,
      emergency_contact: emergencyContact.trim(),
      notes: notes.trim(),
      is_active: isActive,
    };

    if (student) {
      const { error } = await supabase.from("students").update(payload).eq("id", student.id);
      if (error) {
        toast.error("Failed to update student.");
        console.error(error);
      } else {
        toast.success("Student updated!");
        onSuccess();
      }
    } else {
      const { error } = await supabase.from("students").insert(payload);
      if (error) {
        toast.error("Failed to add student.");
        console.error(error);
      } else {
        toast.success("Student added!");
        onSuccess();
      }
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="student-name">Name *</Label>
        <Input
          id="student-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Student name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="student-phone">Phone *</Label>
        <Input
          id="student-phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+971 50 123 4567"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Belt</Label>
          <Select value={belt} onValueChange={(val) => setBelt(val as Belt)}>
            <SelectTrigger className="cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(BELT_COLORS) as Belt[]).map((b) => (
                <SelectItem key={b} value={b} className="cursor-pointer">
                  {BELT_COLORS[b].label} Belt
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="student-date">Date Joined</Label>
          <Input
            id="student-date"
            type="date"
            value={dateJoined}
            onChange={(e) => setDateJoined(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="student-emergency">Emergency Contact</Label>
        <Input
          id="student-emergency"
          value={emergencyContact}
          onChange={(e) => setEmergencyContact(e.target.value)}
          placeholder="Parent/guardian phone"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="student-notes">Notes</Label>
        <Textarea
          id="student-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any notes about this student..."
          rows={3}
        />
      </div>

      <div className="flex items-center justify-between py-2">
        <Label htmlFor="student-active" className="cursor-pointer">Active Student</Label>
        <Switch
          id="student-active"
          checked={isActive}
          onCheckedChange={setIsActive}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 cursor-pointer"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="flex-1 cursor-pointer">
          {loading ? "Saving..." : student ? "Update" : "Add Student"}
        </Button>
      </div>
    </form>
  );
}
