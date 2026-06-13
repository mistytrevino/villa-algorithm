"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { fadeUp, lockedPulse } from "@/lib/motion";
import type { SkillCategory } from "@/lib/types";

const SKILL_PILL: Record<SkillCategory, string> = {
  api: "bg-gold/15 text-gold",
  structured: "bg-teal/15 text-teal",
  scraping: "bg-coral/15 text-coral",
  multimodel: "bg-gold/15 text-gold",
  mcp: "bg-teal/15 text-teal",
  analysis: "bg-coral/15 text-coral",
  database: "bg-teal/15 text-teal",
  education: "bg-gold/15 text-gold",
};

export function LockedFeature({
  title,
  description,
  skill,
  skillCategory,
  unlockDate,
  week,
}: {
  title: string;
  description: string;
  skill: string;
  skillCategory: SkillCategory;
  unlockDate: string;
  week: number;
}) {
  return (
    <motion.article
      variants={fadeUp}
      className="glass relative flex flex-col gap-3 opacity-55"
    >
      <motion.span
        variants={lockedPulse}
        animate="animate"
        className="absolute right-5 top-5"
      >
        <Lock size={18} className="text-gold" />
      </motion.span>

      <div className="pr-8">
        <span className="label">Week {week}</span>
        <h3 className="mt-1 font-display text-xl font-semibold text-cream/60">
          {title}
        </h3>
      </div>

      <p className="font-body text-sm text-muted">{description}</p>

      <span
        className={`w-fit rounded-full px-2.5 py-1 font-body text-xs font-medium ${SKILL_PILL[skillCategory]}`}
      >
        {skill}
      </span>

      <span className="mt-auto pt-1 font-body text-xs text-muted">
        Unlocking {unlockDate}
      </span>
    </motion.article>
  );
}
