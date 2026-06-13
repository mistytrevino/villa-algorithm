"use client";

import { motion } from "framer-motion";
import { Lock, Check } from "lucide-react";
import { fadeUp, staggerContainer, lockedPulse } from "@/lib/motion";
import { hasAired, type TimelineEvent } from "@/lib/types";
import timelineData from "@/data/timeline.json";

const timeline = timelineData as TimelineEvent[];

export function EpisodeTimeline() {
  return (
    <motion.ol
      variants={staggerContainer}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      className="relative flex flex-col gap-5 border-l border-white/10 pl-8"
    >
      {timeline.map((event) => {
        const aired = hasAired(event);
        return (
          <motion.li key={event.id} variants={fadeUp} className="relative">
            {/* Node on the rail */}
            <span className="absolute -left-[41px] top-0.5 flex h-6 w-6 items-center justify-center">
              {aired ? (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal/20">
                  <Check size={13} className="text-teal" strokeWidth={3} />
                </span>
              ) : (
                <motion.span
                  variants={event.key ? lockedPulse : undefined}
                  animate={event.key ? "animate" : undefined}
                  className="flex h-6 w-6 items-center justify-center rounded-full border border-white/15 bg-night"
                >
                  <Lock size={12} className={event.key ? "text-gold" : "text-muted"} />
                </motion.span>
              )}
            </span>

            <div className={aired ? "" : "opacity-60"}>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display text-lg font-semibold text-cream">
                  {event.title}
                </h3>
                {event.key && (
                  <span className="rounded-full bg-gold/15 px-2 py-0.5 font-body text-[11px] font-medium uppercase tracking-wide text-gold">
                    Key episode
                  </span>
                )}
                <span className="label">{event.displayDate}</span>
              </div>
              <p className="mt-1 font-body text-sm text-muted">{event.note}</p>
            </div>
          </motion.li>
        );
      })}
    </motion.ol>
  );
}
