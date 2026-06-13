"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, Loader2, AlertCircle, Lock, ExternalLink } from "lucide-react";
import { fadeUp, staggerContainer, pageEnter } from "@/lib/motion";

type Fab5Result = {
  model: string;
  label: string;
  tier: string;
  answer: string | null;
  ok: boolean;
  error?: string;
};

const SUGGESTIONS = [
  "Who wins Season 8?",
  "Which couple is endgame?",
  "Who gets dumped next?",
];

// Shown as placeholders while the five models think.
const LINEUP = [
  "Haiku 4.5",
  "Sonnet 4.6",
  "Opus 4.6",
  "Opus 4.7",
  "Opus 4.8",
];

export default function Fab5Page() {
  const [input, setInput] = useState("");
  const [question, setQuestion] = useState<string | null>(null);
  const [results, setResults] = useState<Fab5Result[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function ask(q: string) {
    const trimmed = q.trim();
    if (!trimmed || loading) return;
    setError(null);
    setQuestion(trimmed);
    setResults(null);
    setLoading(true);
    setInput("");
    try {
      const res = await fetch("/api/fab5", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Oracle-Token": process.env.NEXT_PUBLIC_ORACLE_TOKEN ?? "",
        },
        body: JSON.stringify({ question: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setResults(data.results as Fab5Result[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The Fab 5 went quiet.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      variants={pageEnter}
      initial="initial"
      animate="animate"
      className="mx-auto max-w-6xl px-6 py-12"
    >
      <span className="label">Week 4 · Multi-Model</span>
      <h1 className="mt-2 font-display text-4xl font-semibold text-cream sm:text-5xl">
        The Fab 5
      </h1>
      <p className="mt-3 max-w-2xl font-body text-base text-muted">
        One question, five Claude models answering at the same time. Same prompt
        for all of them, so the only thing that changes is the brain. Watch five
        levels of AI reasoning agree, disagree, and show their whole personality.
      </p>

      {/* Ask bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="mt-8 flex items-center gap-2 rounded-full border border-white/15 bg-night/80 p-1.5 pl-5 backdrop-blur-md"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask all five..."
          disabled={loading}
          className="flex-1 bg-transparent font-body text-sm text-cream placeholder:text-muted focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gold text-night transition-colors hover:bg-gold/90 disabled:opacity-40"
          aria-label="Ask the Fab 5"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </form>

      {!question && !loading && (
        <div className="mt-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => ask(s)}
              className="rounded-full border border-white/15 px-3 py-1.5 font-body text-xs text-muted transition-colors hover:border-white/30 hover:text-cream"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-6 font-body text-sm text-coral">{error}</p>
      )}

      {question && (
        <p className="mt-8 font-oracle text-lg text-gold">&ldquo;{question}&rdquo;</p>
      )}

      {/* Results grid */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        key={question ?? "empty"}
        className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {loading
          ? LINEUP.map((label) => (
              <div key={label} className="glass flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-display text-lg font-semibold text-cream">
                    {label}
                  </span>
                  <Loader2 size={16} className="animate-spin text-gold" />
                </div>
                <p className="font-body text-sm text-muted">Thinking...</p>
              </div>
            ))
          : results?.map((r) => (
              <motion.div key={r.model} variants={fadeUp} className="glass flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Sparkles size={14} className="text-gold" />
                      <span className="font-display text-lg font-semibold text-cream">
                        {r.label}
                      </span>
                    </div>
                    <span className="label">{r.tier}</span>
                  </div>
                </div>
                {r.ok ? (
                  <p className="font-body text-sm text-cream/90">{r.answer}</p>
                ) : (
                  <p className="flex items-start gap-2 font-body text-sm text-muted">
                    <AlertCircle size={15} className="mt-0.5 shrink-0 text-coral/70" />
                    {r.error}
                  </p>
                )}
              </motion.div>
            ))}
      </motion.div>

      {/* Suspended frontier tier */}
      <div className="glass mt-4 flex flex-col gap-2 border-l-[3px] border-l-coral/60 opacity-80">
        <div className="flex items-center gap-1.5">
          <Lock size={14} className="text-coral/70" />
          <span className="font-display text-lg font-semibold text-cream">Fable 5</span>
          <span className="label">Frontier, suspended</span>
        </div>
        <p className="font-body text-sm text-muted">
          Anthropic&apos;s most capable model is temporarily offline. On June 12, 2026,
          Anthropic suspended access to Fable 5 and Mythos 5 to comply with a US
          government directive. The five models above are unaffected.
        </p>
        <a
          href="https://www.anthropic.com/news/fable-mythos-access"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center gap-1.5 font-body text-xs font-medium text-gold transition-colors hover:text-gold/80"
        >
          Read Anthropic&apos;s statement <ExternalLink size={12} />
        </a>
      </div>
    </motion.div>
  );
}
