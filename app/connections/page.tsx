"use client";

import { motion } from "framer-motion";
import { pageEnter } from "@/lib/motion";
import { ConnectionWeb } from "@/components/ConnectionWeb";
import { HometownMap } from "@/components/HometownMap";

export default function ConnectionsPage() {
  return (
    <motion.div
      variants={pageEnter}
      initial="initial"
      animate="animate"
      className="mx-auto max-w-4xl px-6 py-12"
    >
      <span className="label">The villa, mapped</span>
      <h1 className="mt-2 font-display text-4xl font-semibold text-cream sm:text-5xl">
        Connections
      </h1>
      <p className="mt-3 max-w-2xl font-body text-base text-muted">
        Every islander, every link, on one board. Gold lines are couples. Teal
        lines connect islanders from the same home state. Hover a name to trace
        who they are tied to.
      </p>

      <div className="mt-8">
        <ConnectionWeb />
      </div>

      {/* Hometown map */}
      <h2 className="mt-16 font-display text-3xl font-semibold text-cream">
        Where they&apos;re from
      </h2>
      <p className="mb-6 mt-2 font-body text-sm text-muted">
        Every islander&apos;s hometown on the map. The clusters tell their own
        story. Two islanders are joining from abroad.
      </p>
      <HometownMap />

      <p className="mt-12 font-body text-xs text-muted">
        Coming next: a toggle to compare this cast against past seasons.
      </p>
    </motion.div>
  );
}
