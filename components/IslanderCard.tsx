"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { coupleState, type Islander } from "@/lib/types";
import { RiskMeter } from "@/components/RiskMeter";

const STATUS_LABEL: Record<string, { text: string; className: string }> = {
  coupled: { text: "Coupled Up", className: "bg-teal/15 text-teal" },
  single: { text: "Single", className: "bg-gold/15 text-gold" },
  dumped: { text: "Dumped", className: "bg-coral/15 text-coral/70" },
};

export function IslanderCard({
  islander,
  showRisk = false,
}: {
  islander: Islander;
  showRisk?: boolean;
}) {
  const state = coupleState(islander);
  const status = STATUS_LABEL[state];
  const dumped = state === "dumped";

  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`glass group flex flex-col gap-3 transition-colors hover:border-white/20 ${
        dumped ? "opacity-40 grayscale" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-2xl font-semibold text-cream">
            {islander.name}
          </h3>
          <p className="font-body text-sm text-muted">
            {islander.partner ? `Coupled with ${islander.partner}` : "No partner yet"}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 font-body text-xs font-medium ${status.className}`}
        >
          {status.text}
        </span>
      </div>

      {showRisk && islander.riskScore !== null && (
        <RiskMeter risk={islander.riskScore} />
      )}

      <div className="mt-auto flex items-center justify-between pt-2">
        <span className="label">
          {islander.entryType === "bombshell" ? "Bombshell" : "Original"}
        </span>
        <span className="label">
          {islander.entryDay ? `Day ${islander.entryDay}` : "TBD"}
        </span>
      </div>
    </motion.article>
  );
}
