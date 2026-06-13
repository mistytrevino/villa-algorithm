"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { ORACLE_CHAR_MS } from "@/lib/motion";

export function OracleBubble({
  message,
  model,
  timestamp,
  animate = true,
}: {
  message: string;
  model?: string;
  timestamp?: string;
  animate?: boolean;
}) {
  const [shown, setShown] = useState(animate ? "" : message);

  useEffect(() => {
    if (!animate) {
      setShown(message);
      return;
    }
    setShown("");
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setShown(message.slice(0, i));
      if (i >= message.length) clearInterval(id);
    }, ORACLE_CHAR_MS);
    return () => clearInterval(id);
  }, [message, animate]);

  return (
    <div className="glass border-l-[3px] border-l-gold">
      <motion.span
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="mb-2 inline-flex"
      >
        <Sparkles size={18} className="text-gold" />
      </motion.span>

      <p className="font-oracle text-lg text-gold">
        {shown}
        {animate && shown.length < message.length && (
          <span className="ml-0.5 animate-pulse text-gold/60">|</span>
        )}
      </p>

      {(model || timestamp) && (
        <div className="mt-3 flex items-center justify-between">
          <span className="label">{model ?? ""}</span>
          <span className="label">{timestamp ?? ""}</span>
        </div>
      )}
    </div>
  );
}
