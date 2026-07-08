import { Shield } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ACADEMY_INFO } from "@/lib/types";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Shield className="h-4 w-4" />
            </div>
            <span className="font-bold text-sm">{ACADEMY_INFO.name}</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#about" className="hover:text-foreground transition-colors">
              About
            </a>
            <a href="#schedule" className="hover:text-foreground transition-colors">
              Schedule
            </a>
            <a href="#trial" className="hover:text-foreground transition-colors">
              Free Trial
            </a>
          </div>
        </div>

        <Separator className="my-6" />

        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {ACADEMY_INFO.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
