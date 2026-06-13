// Shared Framer Motion variants. See ANIMATIONS.md.
// All animations use Framer Motion. No CSS transitions except color.

import type { Variants } from "framer-motion";

export const fadeUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export const staggerContainer: Variants = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export const lockedPulse: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
};

export const unlockReveal: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

export const pageEnter: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

// Oracle typewriter speed, ms per character. See ANIMATIONS.md.
export const ORACLE_CHAR_MS = 30;
