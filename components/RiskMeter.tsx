"use client";

import { motion } from "framer-motion";

function riskColor(risk: number): string {
  if (risk <= 30) return "var(--color-teal)";
  if (risk <= 60) return "var(--color-gold)";
  return "var(--color-coral)";
}

export function RiskMeter({ risk, label }: { risk: number; label?: string }) {
  const clamped = Math.max(0, Math.min(100, risk));

  return (
    <div className="w-full">
      <div className="mb-1 flex items-center justify-between">
        <span className="label">{label ?? "Dumping risk"}</span>
        <span className="font-body text-sm font-medium text-cream">{clamped}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: riskColor(clamped) }}
          initial={{ width: "0%" }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        />
      </div>
    </div>
  );
}
