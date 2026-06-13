"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, pageEnter } from "@/lib/motion";
import { coupleState, type CoupleState, type Islander } from "@/lib/types";
import { IslanderCard } from "@/components/IslanderCard";
import islandersData from "@/data/islanders.json";

const islanders = islandersData as Islander[];

const FILTERS = [
  { key: "all", label: "All" },
  { key: "coupled", label: "Coupled Up" },
  { key: "single", label: "Single" },
  { key: "dumped", label: "Dumped" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

export default function IslandersPage() {
  const [filter, setFilter] = useState<FilterKey>("all");

  const visible = islanders.filter((islander) => {
    if (filter === "all") return true;
    return coupleState(islander) === (filter as CoupleState);
  });

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
        Every original and bombshell, with live couple status. Risk scores unlock
        in Week 2.
      </p>

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
        key={filter}
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {visible.map((islander) => (
          <IslanderCard key={islander.id} islander={islander} />
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
