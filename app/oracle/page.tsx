"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import { pageEnter } from "@/lib/motion";
import { OracleBubble } from "@/components/OracleBubble";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  model?: string;
};

const SUGGESTIONS = [
  "Who is winning Season 8?",
  "Which couple is in trouble?",
  "Should I be worried about the new bombshell?",
];

export default function OraclePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed || loading) return;

    setError(null);
    const next: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/oracle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message, model: data.model },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The Oracle went quiet.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      variants={pageEnter}
      initial="initial"
      animate="animate"
      className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-3xl flex-col px-6 py-12"
    >
      <div className="mb-8">
        <span className="label">Week 1 · Claude API</span>
        <h1 className="mt-2 font-display text-4xl font-semibold text-cream sm:text-5xl">
          The Oracle
        </h1>
        <p className="mt-3 font-body text-base text-muted">
          Ask anything about Season 8. The Oracle answers in the voice you already
          hear in your head.
        </p>
      </div>

      {/* Conversation */}
      <div className="flex flex-1 flex-col gap-4">
        {messages.length === 0 && !loading && (
          <div className="glass flex flex-col items-center gap-4 py-12 text-center">
            <Sparkles size={28} className="text-gold" />
            <p className="font-oracle text-lg text-gold">
              Go on then. Ask me who is getting dumped.
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
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
          </div>
        )}

        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-white/8 px-4 py-3">
                <p className="font-body text-sm text-cream">{m.content}</p>
              </div>
            </div>
          ) : (
            <OracleBubble
              key={i}
              message={m.content}
              model={m.model}
              animate={i === messages.length - 1}
            />
          )
        )}

        {loading && (
          <div className="glass border-l-[3px] border-l-gold">
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              className="font-oracle text-lg text-gold"
            >
              The Oracle is consulting the villa...
            </motion.span>
          </div>
        )}

        {error && (
          <p className="font-body text-sm text-coral">{error}</p>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="sticky bottom-4 mt-6 flex items-center gap-2 rounded-full border border-white/15 bg-night/80 p-1.5 pl-5 backdrop-blur-md"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask the Oracle..."
          disabled={loading}
          className="flex-1 bg-transparent font-body text-sm text-cream placeholder:text-muted focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gold text-night transition-colors hover:bg-gold/90 disabled:opacity-40"
          aria-label="Send"
        >
          <Send size={16} />
        </button>
      </form>
    </motion.div>
  );
}
