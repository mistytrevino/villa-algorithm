"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Send, Lightbulb } from "lucide-react";
import { fadeUp, staggerContainer, pageEnter } from "@/lib/motion";

type FeatureRequest = { id: string; body: string; created_at: string };

const MAX = 280;

function getVoterId(): string {
  const key = "villa-voter";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export default function RequestsPage() {
  const [voter, setVoter] = useState<string | null>(null);
  const [requests, setRequests] = useState<FeatureRequest[] | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load(voterId: string, body?: string) {
    setError(null);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Oracle-Token": process.env.NEXT_PUBLIC_ORACLE_TOKEN ?? "",
        },
        body: JSON.stringify({ voter: voterId, body }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Something went wrong.");
      setRequests(json.requests as FeatureRequest[]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reach the board.");
      return false;
    }
  }

  useEffect(() => {
    const id = getVoterId();
    setVoter(id);
    load(id).finally(() => setLoading(false));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const body = input.trim();
    if (!body || submitting || !voter) return;
    setSubmitting(true);
    const ok = await load(voter, body);
    if (ok) setInput("");
    setSubmitting(false);
  }

  return (
    <motion.div
      variants={pageEnter}
      initial="initial"
      animate="animate"
      className="mx-auto max-w-2xl px-6 py-12"
    >
      <span className="label">Build in public</span>
      <h1 className="mt-2 font-display text-4xl font-semibold text-cream sm:text-5xl">
        Request a feature
      </h1>
      <p className="mt-3 font-body text-base text-muted">
        What should the Villa Algorithm build next? Drop an idea. The good ones get
        built, on camera.
      </p>

      <form onSubmit={submit} className="glass mt-8 flex flex-col gap-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value.slice(0, MAX))}
          placeholder="I wish the site could..."
          rows={3}
          className="w-full resize-none bg-transparent font-body text-sm text-cream placeholder:text-muted focus:outline-none"
        />
        <div className="flex items-center justify-between">
          <span className="font-body text-xs text-muted">
            {input.length}/{MAX}
          </span>
          <button
            type="submit"
            disabled={submitting || !input.trim()}
            className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 font-body text-sm font-medium text-night transition-colors hover:bg-gold/90 disabled:opacity-50"
          >
            {submitting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
            Send it
          </button>
        </div>
      </form>

      {error && <p className="mt-4 font-body text-sm text-coral">{error}</p>}

      <h2 className="mt-12 font-display text-2xl font-semibold text-cream">
        On the board
      </h2>
      {loading ? (
        <p className="mt-4 flex items-center gap-2 font-body text-sm text-muted">
          <Loader2 size={14} className="animate-spin" /> Loading requests...
        </p>
      ) : requests && requests.length === 0 ? (
        <p className="mt-4 flex items-center gap-2 font-body text-sm text-muted">
          <Lightbulb size={15} className="text-gold" /> No requests yet. Be the first.
        </p>
      ) : (
        <motion.ul
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="mt-4 flex flex-col gap-2"
        >
          {requests?.map((r) => (
            <motion.li key={r.id} variants={fadeUp} className="glass !py-3">
              <p className="font-body text-sm text-cream">{r.body}</p>
              <span className="mt-1 block font-body text-xs text-muted">
                {new Date(r.created_at).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </motion.div>
  );
}
