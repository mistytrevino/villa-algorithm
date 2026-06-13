# Villa Algorithm Core Components

## IslanderCard
Props: islander (Islander type), showRisk?: boolean
- Glassmorphism card
- Islander name in Clash Display 24px cream
- Current partner name in Satoshi 14px muted
- Status badge: "Coupled Up" in teal or "Single" in gold or "Dumped" in coral/50% opacity
- Risk meter if showRisk true
- Entry day label bottom right
- fadeUp animation on mount
- Hover: lift 4px, border brightens to rgba(255,255,255,0.2)
- If islander.status === "dumped": full card opacity 0.4, grayscale filter

## OracleBubble
Props: message: string, model?: string, timestamp?: string
- Glassmorphism card with gold left border (3px solid #FFD166)
- Sparkle icon (Lucide Sparkles) in gold, animates in first
- Message renders in Fraunces italic gold with typewriter effect
- Model badge bottom left if provided: "Sonnet 4.6" in muted
- Timestamp bottom right in muted

## RiskMeter
Props: risk: number (0-100), label?: string
- Full width bar, 8px height, border-radius 4px
- Background: rgba(255,255,255,0.1)
- Fill color: teal below 30, gold 31-60, coral above 60
- Percentage label right aligned above bar
- riskMeterFill animation on mount

## LockedFeature
Props: title: string, description: string, skill: string, unlockDate: string, week: number
- Glassmorphism card, opacity 0.55
- Lock icon (Lucide Lock) top right, gold, lockedPulse animation
- Title in Clash Display 20px cream/60% opacity
- Description in Satoshi 14px muted
- Skill pill: rounded badge, color depends on skill category
- "Unlocking [unlockDate]" label bottom, Satoshi 12px muted

## PredictionBadge
Props: outcome: "pending" | "correct" | "wrong"
- pending: gold background, "Pending" text
- correct: teal background, checkmark icon, "Oracle was right" text
- wrong: coral background, X icon, "Oracle was wrong" text

## Conventions
- All components are typed against `lib/types.ts`.
- Components that use Framer Motion or hooks must start with `"use client"`.
- Pull shared motion variants from `lib/motion.ts`.
