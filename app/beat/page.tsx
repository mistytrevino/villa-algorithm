"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Sparkles, Check, Trophy } from "lucide-react";
import { fadeUp, staggerContainer, pageEnter } from "@/lib/motion";
import { type Islander } from "@/lib/types";
import islandersData from "@/data/islanders.json";

const participating = (islandersData as Islander[]).filter((i) => i.status === "participating");

type Result = { id: string; name: string; count: number; pct: number };
type BeatData = {
  oraclePick: { id: string; name: string; riskScore: number } | null;
  results: Result[];
  total: number;
  yourPick: string | null;
};

function getVoterId(): string {
  const key = "villa-voter";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export default function BeatPage() {
  const [voter, setVoter] = useState<string | null>(null);
  const [data, setData] = useState<BeatData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load(voterId: string, islanderId?: string) {
    setError(null);
    try {
      const res = await fetch("/api/beat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Oracle-Token": process.env.NEXT_PUBLIC_ORACLE_TOKEN ?? "",
        },
        body: JSON.stringify({ voter: voterId, islanderId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Something went wrong.");
      setData(json as BeatData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reach the leaderboard.");
    }
  }

  useEffect(() => {
    const id = getVoterId();
    setVoter(id);
    load(id).finally(() => setLoading(false));
  }, []);

  async function vote(islanderId: string) {
    if (!voter || submitting) return;
    setSubmitting(islanderId);
    await load(voter, islanderId);
    setSubmitting(null);
  }

  const crowdPick = data?.results[0];
  const crowdAgrees =
    crowdPick && data?.oraclePick && crowdPick.id === data.oraclePick.id;

  return (
    <motion.div
      variants={pageEnter}
      initial="initial"
      animate="animate"
      className="mx-auto max-w-3xl px-6 py-12"
    >
      <span className="label">Week 7 · Database + Voting</span>
      <h1 className="mt-2 font-display text-4xl font-semibold text-cream sm:text-5xl">
        Beat the Oracle
      </h1>
      <p className="mt-3 font-body text-base text-muted">
        Who gets dumped next? Lock in your pick, then watch the villa decide.
        Fans versus the machine, live.
      </p>

      {/* The Oracle's pick */}
      {data?.oraclePick && (
        <div className="glass mt-6 flex items-center gap-3 border-l-[3px] border-l-gold">
          <Sparkles size={18} className="shrink-0 text-gold" />
          <p className="font-oracle text-base text-gold">
            The Oracle says {data.oraclePick.name} is most at risk, at{" "}
            {data.oraclePick.riskScore}%. Think you know better?
          </p>
        </div>
      )}

      {/* Pick buttons */}
      <h2 className="mt-10 font-display text-2xl font-semibold text-cream">
        Make your pick
      </h2>
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3"
      >
        {participating.map((isl) => {
          const picked = data?.yourPick === isl.id;
          return (
            <motion.button
              key={isl.id}
              variants={fadeUp}
              onClick={() => vote(isl.id)}
              disabled={!!submitting}
              className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-3 font-body text-sm font-medium transition-colors disabled:opacity-60 ${
                picked
                  ? "border-gold bg-gold/15 text-gold"
                  : "border-white/12 text-cream hover:border-white/30"
              }`}
            >
              {submitting === isl.id ? (
                <Loader2 size={14} className="animate-spin" />
              ) : picked ? (
                <Check size={14} />
              ) : null}
              {isl.name.split(" ")[0]}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Results */}
      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold text-cream">
            The villa has spoken
          </h2>
          <span className="font-body text-xs text-muted">
            {data ? `${data.total} ${data.total === 1 ? "pick" : "picks"}` : ""}
          </span>
        </div>

        {loading ? (
          <p className="flex items-center gap-2 font-body text-sm text-muted">
            <Loader2 size={14} className="animate-spin" /> Loading the leaderboard...
          </p>
        ) : error ? (
          <p className="font-body text-sm text-coral">{error}</p>
        ) : data && data.total === 0 ? (
          <p className="font-body text-sm text-muted">
            No picks yet. Be the first to call it.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {data?.results.map((r) => {
              const isOracle = data.oraclePick?.id === r.id;
              const isYou = data.yourPick === r.id;
              return (
                <div key={r.id} className="glass !py-3">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-2 font-body text-sm text-cream">
                      {r.name.split(" ")[0]}
                      {isOracle && (
                        <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[11px] font-medium text-gold">
                          Oracle&apos;s pick
                        </span>
                      )}
                      {isYou && (
                        <span className="rounded-full bg-teal/15 px-2 py-0.5 text-[11px] font-medium text-teal">
                          You
                        </span>
                      )}
                    </span>
                    <span className="font-body text-sm text-muted">{r.pct}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: isOracle ? "var(--color-gold)" : "var(--color-teal)" }}
                      initial={{ width: "0%" }}
                      animate={{ width: `${r.pct}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {data && data.total > 0 && crowdPick && (
          <p className="mt-4 flex items-center gap-2 font-body text-sm text-muted">
            <Trophy size={15} className="text-gold" />
            {crowdAgrees
              ? `The crowd agrees with the Oracle. ${crowdPick.name.split(" ")[0]} is everyone's pick.`
              : `Fans vs machine: the crowd is backing ${crowdPick.name.split(" ")[0]}, the Oracle says ${data.oraclePick?.name.split(" ")[0]}.`}
          </p>
        )}
      </div>
    </motion.div>
  );
}
