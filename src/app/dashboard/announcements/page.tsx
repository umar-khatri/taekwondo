"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  MessageSquare,
  Calendar,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Announcement } from "@/lib/types";
import { format } from "date-fns";
import { toast } from "sonner";

function AnnouncementsPageContent() {
  const searchParams = useSearchParams();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [saving, setSaving] = useState(false);

  const loadAnnouncements = useCallback(async () => {
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setAnnouncements(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAnnouncements();
  }, [loadAnnouncements]);

  useEffect(() => {
    if (searchParams.get("action") === "add") {
      setShowForm(true);
    }
  }, [searchParams]);

  function openForm(announcement?: Announcement) {
    if (announcement) {
      setEditingAnnouncement(announcement);
      setTitle(announcement.title);
      setContent(announcement.content);
      setEventDate(announcement.event_date || "");
    } else {
      setEditingAnnouncement(null);
      setTitle("");
      setContent("");
      setEventDate("");
    }
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !eventDate) {
      toast.error("Title, content, and event date are required.");
      return;
    }

    setSaving(true);

    if (editingAnnouncement) {
      const { error } = await supabase
        .from("announcements")
        .update({
          title: title.trim(),
          content: content.trim(),
          event_date: eventDate,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingAnnouncement.id);
      if (error) {
        toast.error("Failed to update.");
      } else {
        toast.success("Announcement updated!");
      }
    } else {
      const { error } = await supabase.from("announcements").insert({
        title: title.trim(),
        content: content.trim(),
        event_date: eventDate,
      });
      if (error) {
        toast.error("Failed to create.");
      } else {
        toast.success("Announcement published!");
      }
    }

    setSaving(false);
    setShowForm(false);
    setEditingAnnouncement(null);
    setTitle("");
    setContent("");
    setEventDate("");
    loadAnnouncements();
  }

  async function deleteAnnouncement(id: string) {
    if (!confirm("Delete this announcement?")) return;
    const { error } = await supabase.from("announcements").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete.");
    } else {
      toast.success("Announcement deleted.");
      loadAnnouncements();
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Announcements</h1>
          <p className="text-sm text-muted-foreground">{announcements.length} published</p>
        </div>
        <Button onClick={() => openForm()} className="gap-2 cursor-pointer">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Announcement</span>
        </Button>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-border/50 animate-pulse">
              <CardContent className="pt-6">
                <div className="h-4 bg-muted rounded w-1/3 mb-3" />
                <div className="h-3 bg-muted rounded w-full mb-2" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : announcements.length === 0 ? (
        <Card className="border-border/50 bg-card/80">
          <CardContent className="pt-6 text-center py-12">
            <MessageSquare className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground">No announcements yet.</p>
            <Button onClick={() => openForm()} className="mt-4 gap-2 cursor-pointer">
              <Plus className="h-4 w-4" />
              Create First Announcement
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className="border-border/50 bg-card/80 card-hover">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm mb-1">{announcement.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {announcement.content}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Posted: {format(new Date(announcement.created_at), "MMM d, yyyy")}
                      </div>
                      {announcement.event_date && (
                        <div className="flex items-center gap-1 text-primary">
                          <Calendar className="h-3 w-3" />
                          Event: {format(new Date(announcement.event_date), "MMM d, yyyy")}
                        </div>
                      )}
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 shrink-0 cursor-pointer rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openForm(announcement)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => deleteAnnouncement(announcement.id)}
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

      {/* Create/Edit Dialog */}
      <Dialog
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open);
          if (!open) {
            setEditingAnnouncement(null);
            setTitle("");
            setContent("");
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingAnnouncement ? "Edit Announcement" : "New Announcement"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ann-title">Title *</Label>
              <Input
                id="ann-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Announcement title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ann-content">Content *</Label>
              <Textarea
                id="ann-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your announcement..."
                rows={4}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ann-date">Event Date (Expires after this date) *</Label>
              <Input
                id="ann-date"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
                className="flex-1 cursor-pointer"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="flex-1 cursor-pointer">
                {saving ? "Saving..." : editingAnnouncement ? "Update" : "Publish"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AnnouncementsPage() {
  return (
    <Suspense fallback={<div className="animate-pulse p-8 text-muted-foreground">Loading...</div>}>
      <AnnouncementsPageContent />
    </Suspense>
  );
}
