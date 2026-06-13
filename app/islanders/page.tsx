"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import { staggerContainer, pageEnter } from "@/lib/motion";
import { coupleState, type CoupleState, type Islander } from "@/lib/types";
import { IslanderCard } from "@/components/IslanderCard";
import islandersData from "@/data/islanders.json";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "coupled", label: "Coupled Up" },
  { key: "single", label: "Single" },
  { key: "dumped", label: "Dumped" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

export default function IslandersPage() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [islanders, setIslanders] = useState<Islander[]>(islandersData as Islander[]);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scored = islanders.some((i) => i.riskScore !== null);

  async function runScan() {
    if (scanning) return;
    setError(null);
    setScanning(true);
    try {
      const res = await fetch("/api/risk-scorer", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "The scan failed.");
      setIslanders(data.islanders as Islander[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The scan failed.");
    } finally {
      setScanning(false);
    }
  }

  const visible = islanders
    .filter((islander) => {
      if (filter === "all") return true;
      return coupleState(islander) === (filter as CoupleState);
    })
    // Once scored, surface the most at risk first.
    .sort((a, b) => (b.riskScore ?? -1) - (a.riskScore ?? -1));

  return (
    <motion.div
      variants={pageEnter}
      initial="initial"
      animate="animate"
      className="mx-auto max-w-6xl px-6 py-12"
    >
      <span className="label">The cast</span>
      <h1 className="mt-2 font-display text-4xl font-semibold text-cream sm:text-5xl">
        Islander Profiles
      </h1>
      <p className="mt-3 max-w-xl font-body text-base text-muted">
        Every original and bombshell, with live couple status. Run the risk scan
        to have Claude score every islander&apos;s dumping odds.
      </p>

      {/* Scan control */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          onClick={runScan}
          disabled={scanning}
          className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 font-body text-sm font-medium text-night transition-colors hover:bg-gold/90 disabled:opacity-60"
        >
          {scanning ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Scanning the villa...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              {scored ? "Re-run risk scan" : "Run the risk scan"}
            </>
          )}
        </button>
        {scored && !scanning && (
          <span className="font-body text-xs text-muted">
            Scored by Claude Sonnet 4.6, sorted most at risk first.
          </span>
        )}
        {error && <span className="font-body text-xs text-coral">{error}</span>}
      </div>

      {/* Filter bar */}
      <div className="mt-8 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-4 py-2 font-body text-sm font-medium transition-colors ${
                active
                  ? "bg-gold text-night"
                  : "border border-white/15 text-muted hover:border-white/30 hover:text-cream"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <motion.div
        key={`${filter}-${scored}`}
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {visible.map((islander) => (
          <IslanderCard key={islander.id} islander={islander} showRisk={scored} />
        ))}
      </motion.div>

      {visible.length === 0 && (
        <p className="mt-12 text-center font-body text-sm text-muted">
          No islanders in this group yet.
        </p>
      )}
    </motion.div>
  );
}
