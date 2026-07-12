import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { ACADEMY_INFO } from "@/lib/types";

export function Footer() {
  return (
    <footer className="bg-background/80 backdrop-blur-md relative z-10 border-t border-border/20 py-12">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 overflow-hidden">
              <Image src="/logo.png" alt="Logo" width={32} height={32} className="object-cover" />
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
