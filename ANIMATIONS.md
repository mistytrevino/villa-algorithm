# Villa Algorithm Animation System

All animations use Framer Motion. No CSS transitions except for color changes.

## Timing Standards
- Page enter: 400ms ease-out
- Card reveal: 500ms ease-out, staggered 0.1s between cards
- Oracle typewriter: 30ms per character
- Risk meter fill: 800ms ease-out on mount
- Locked card pulse: 3s infinite, scale 1 to 1.05
- Hover lift: 200ms, translateY -4px

## Standard Variants

### fadeUp (use for all cards entering view)
initial: { opacity: 0, y: 20 }
animate: { opacity: 1, y: 0 }
transition: { duration: 0.5, ease: "easeOut" }

### staggerContainer (use for card grids)
animate: { transition: { staggerChildren: 0.1 } }

### oracleReveal (use for Oracle response)
Stream text character by character at 30ms delay
Wrap in Fraunces italic gold
Fade in the sparkle icon first, then begin typewriter

### riskMeterFill (use for dumping risk bars)
initial: { width: "0%" }
animate: { width: "{risk}%" }
transition: { duration: 0.8, ease: "easeOut", delay: 0.3 }

### lockedPulse (use for lock icons on locked features)
animate: { scale: [1, 1.05, 1] }
transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }

### unlockReveal (use when a feature unlocks)
initial: { opacity: 0, scale: 0.95 }
animate: { opacity: 1, scale: 1 }
transition: { duration: 0.6, ease: "easeOut" }

## Implementation Note
Shared variants live in `lib/motion.ts`. Import from there rather than redefining inline,
so timing stays consistent across the site.
