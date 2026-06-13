# Villa Algorithm Design System

## Color Tokens
--night: #0A0E1A        /* page backgrounds */
--night-2: #111827      /* elevated surfaces */
--coral: #FF5757        /* primary action, danger, eliminations */
--gold: #FFD166         /* Oracle, highlights, winner predictions */
--teal: #06D6A0         /* safe couples, positive signals */
--cream: #FFF8F0        /* primary text on dark */
--muted: rgba(255,255,255,0.5)   /* secondary text */
--glass: rgba(255,255,255,0.06)  /* card backgrounds */
--glass-border: 1px solid rgba(255,255,255,0.1)  /* card borders */

## Typography
Display font: Clash Display (Fontshare)
Body font: Satoshi (Fontshare)
Oracle voice only: Fraunces italic (Google Fonts)

Add to globals.css:
@import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=satoshi@400,500,700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@1,400;1,500&display=swap');

Font scale:
- Hero: Clash Display 64px / 700 / cream
- Section title: Clash Display 36px / 600 / cream
- Card title: Clash Display 24px / 600 / cream
- Body: Satoshi 16px / 400 / muted
- Oracle text: Fraunces italic 18px / 400 / gold
- Label: Satoshi 12px / 500 / uppercase / letter-spacing 0.1em / muted

## Glassmorphism Card (use for ALL cards)
background: rgba(255,255,255,0.06)
backdrop-filter: blur(12px)
-webkit-backdrop-filter: blur(12px)
border: 1px solid rgba(255,255,255,0.1)
border-radius: 16px
padding: 24px

## Risk Meter Colors
0-30%: teal (#06D6A0)
31-60%: gold (#FFD166)
61-100%: coral (#FF5757)

## Page Background Treatment
Every page: background-color: #0A0E1A
If hero image exists: overlay with linear-gradient(to bottom, rgba(10,14,26,0.7) 0%, #0A0E1A 100%)

## Locked Feature Card
Same glassmorphism card but opacity: 0.5
Add a lock icon (Lucide Lock) in gold top right
Add "Unlocking [date]" badge in muted color
Subtle pulse animation on lock icon

## Signature Element
The Oracle response appears with a slow character-by-character typewriter effect in Fraunces italic gold.
Every Oracle response is preceded by a single gold sparkle icon animation.

## Tailwind v4 Note
Tokens are exposed as Tailwind utilities via `@theme` in globals.css.
Use `bg-night`, `text-cream`, `text-gold`, `text-teal`, `text-coral`, `text-muted` etc.
The `.glass` utility class applies the full glassmorphism card style.
