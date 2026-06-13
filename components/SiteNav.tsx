"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock } from "lucide-react";
import features from "@/data/features.json";
import type { Feature } from "@/lib/types";

const PRIMARY = [
  { label: "Home", href: "/" },
  { label: "Islanders", href: "/islanders" },
  { label: "Oracle", href: "/oracle" },
];

export function SiteNav() {
  const pathname = usePathname();
  const locked = (features as Feature[]).filter((f) => !f.unlocked);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-night/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-lg font-semibold text-cream">
          The Villa <span className="text-gold">Algorithm</span>
        </Link>

        <div className="flex items-center gap-5">
          {PRIMARY.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`font-body text-sm transition-colors hover:text-cream ${
                  active ? "text-gold" : "text-muted"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <span className="hidden items-center gap-1 sm:flex" aria-label="Locked features coming soon">
            {locked.map((f) => (
              <span
                key={f.id}
                title={`${f.title} — unlocking ${f.unlockDate}`}
                className="text-muted/60"
              >
                <Lock size={14} className="text-gold/50" />
              </span>
            ))}
          </span>
        </div>
      </nav>
    </header>
  );
}
