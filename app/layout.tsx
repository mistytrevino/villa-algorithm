import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { SiteNav } from "@/components/SiteNav";

export const metadata: Metadata = {
  title: "The Villa Algorithm",
  description:
    "AI-powered Love Island USA Season 8 predictions. Built in public to teach Claude AI skills week by week.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="flex min-h-full flex-col bg-night text-cream">
        <SiteNav />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-white/10 px-6 py-8">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-3">
            <Link
              href="/requests"
              className="font-body text-xs font-medium text-gold transition-colors hover:text-gold/80"
            >
              Request a feature →
            </Link>
            <p className="text-center text-xs text-muted">
              The Villa Algorithm is an independent fan project. Not affiliated with
              Love Island USA, Peacock, or ITV Studios.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
