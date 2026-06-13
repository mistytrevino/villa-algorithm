@AGENTS.md

# The Villa Algorithm

AI-powered Love Island USA Season 8 prediction site.
Built in public to teach Claude AI skills week by week.

## Stack
Next.js 16 (App Router) / React 19 / TypeScript / Tailwind CSS v4 / Framer Motion / Anthropic SDK

> Note: This project runs Next.js 16 and Tailwind v4, not the Next 14 / Tailwind v3 some guides assume.
> There is no `tailwind.config.js` — design tokens live in `app/globals.css` via `@theme`.
> Read `node_modules/next/dist/docs/` before writing any Next.js page or route code.

## Design
Always reference DESIGN.md before writing any UI code.
Always reference ANIMATIONS.md before adding any motion.
Always reference COMPONENTS.md before building any component.

## Brand Voice
- Hype machine with receipts. Never negative about islanders.
- Oracle roots FOR people, never against them.
- Plain spoken. Present tense. No corporate jargon.
- No em dashes. Use commas or periods instead.

## Rules
- All backgrounds dark (--night: #0A0E1A) unless explicitly stated otherwise.
- Never use white backgrounds on any page.
- All components use glassmorphism card style from DESIGN.md.
- Framer Motion for all animations, no CSS transitions except color.
- Data always comes from /data/ JSON files, never hardcoded in components.
- Feature flags always checked against /data/features.json before rendering.
- API calls to Anthropic go through /app/api/ route handlers only, never client side.
