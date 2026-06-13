"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2, Radar } from "lucide-react";
import { fadeUp, staggerContainer, pageEnter } from "@/lib/motion";

type Anomaly = { title: string; finding: string; signal: "low" | "medium" | "high" };

const SIGNAL: Record<Anomaly["signal"], { label: string; className: string }> = {
  low: { label: "Faint signal", className: "bg-teal/15 text-teal" },
  medium: { label: "Strong signal", className: "bg-gold/15 text-gold" },
  high: { label: "Loud signal", className: "bg-coral/15 text-coral" },
};

export default function AnomalyPage() {
  const [anomalies, setAnomalies] = useState<Anomaly[] | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runScan() {
    if (scanning) return;
    setError(null);
    setScanning(true);
    try {
      const res = await fetch("/api/anomaly", {
        method: "POST",
        headers: { "X-Oracle-Token": process.env.NEXT_PUBLIC_ORACLE_TOKEN ?? "" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "The scan failed.");
      setAnomalies(data.anomalies as Anomaly[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The scan failed.");
    } finally {
      setScanning(false);
    }
  }

  return (
    <motion.div
      variants={pageEnter}
      initial="initial"
      animate="animate"
      className="mx-auto max-w-4xl px-6 py-12"
    >
      <span className="label">Week 6 · Pattern Detection</span>
      <h1 className="mt-2 font-display text-4xl font-semibold text-cream sm:text-5xl">
        The Anomaly Engine
      </h1>
      <p className="mt-3 max-w-2xl font-body text-base text-muted">
        What the AI found that you missed. Claude reads the entire cast at once and
        surfaces the patterns hiding in the data. Hometown clusters, age effects,
        entry-day edges. The things no single viewer would ever catch.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          onClick={runScan}
          disabled={scanning}
          className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 font-body text-sm font-medium text-night transition-colors hover:bg-gold/90 disabled:opacity-60"
        >
          {scanning ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Scanning the data...
            </>
          ) : (
            <>
              <Radar size={16} />
              {anomalies ? "Re-run anomaly scan" : "Run the anomaly scan"}
            </>
          )}
        </button>
        {anomalies && !scanning && (
          <span className="font-body text-xs text-muted">
            Found by Claude Sonnet 4.6 from the current cast data.
          </span>
        )}
        {error && <span className="font-body text-xs text-coral">{error}</span>}
      </div>

      {!anomalies && !scanning && (
        <div className="glass mt-8 flex flex-col items-center gap-3 py-12 text-center">
          <Sparkles size={28} className="text-gold" />
          <p className="font-oracle text-lg text-gold">
            Run the scan. Let me show you what the villa is hiding.
          </p>
        </div>
      )}

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        key={anomalies ? "results" : "empty"}
        className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        {anomalies?.map((a, i) => {
          const sig = SIGNAL[a.signal];
          return (
            <motion.article key={i} variants={fadeUp} className="glass flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-lg font-semibold text-cream">
                  {a.title}
                </h3>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 font-body text-xs font-medium ${sig.className}`}
                >
                  {sig.label}
                </span>
              </div>
              <p className="font-body text-sm text-muted">{a.finding}</p>
            </motion.article>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
