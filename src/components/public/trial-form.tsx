"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export function TrialForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error("Please fill in your name and phone number.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("trial_requests").insert({
      name: name.trim(),
      phone: phone.trim(),
      age: age ? parseInt(age) : null,
      status: "new",
    });

    if (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    } else {
      setSubmitted(true);
      toast.success("Trial request submitted successfully!");
    }
    setLoading(false);
  }

  if (submitted) {
    return (
      <section id="trial" className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <Card className="max-w-md mx-auto border-border/50 bg-card/80">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">You&apos;re All Set!</h3>
              <p className="text-muted-foreground text-sm">
                Thank you for your interest! Our instructor will contact you shortly to confirm your trial class.
              </p>
              <Button
                variant="outline"
                className="mt-6 cursor-pointer"
                onClick={() => {
                  setSubmitted(false);
                  setName("");
                  setPhone("");
                  setAge("");
                }}
              >
                Submit Another
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="trial" className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
            Get Started
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Book a Free Trial Class
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Experience a class before committing. No obligations, just show up and train!
          </p>
        </div>

        <Card className="max-w-md mx-auto border-border/50 bg-card/80 card-hover">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="trial-name">Full Name *</Label>
                <Input
                  id="trial-name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="trial-phone">Phone Number *</Label>
                <Input
                  id="trial-phone"
                  placeholder="+971 50 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="trial-age">
                  Age <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="trial-age"
                  type="number"
                  placeholder="e.g. 12"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  min={3}
                  max={99}
                />
              </div>

              <Button
                type="submit"
                className="w-full gap-2 cursor-pointer"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Submitting...
                  </span>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Request Free Trial
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
