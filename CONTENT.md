# The Villa Algorithm — Social Content Playbook

This file holds the deeper content scripts: the hook, the teach, and the receipt for each feature. The site is the hook. The teaching is the payoff.

The format is always the same: grab attention with the show, then sneak in how AI actually works. People came for Love Island. They leave knowing what an API is.

## How this fits with the other files
- **STEPS.md** is the running log of every single step I take, in order. The raw record.
- **PRODUCTION.md** is the board that maps each step to a content angle, format, and status. Work from there when you batch record.
- **CONTENT.md** (this file) holds the full scripts for the bigger pieces.

The features below are grouped by build milestone, not by calendar. There is no weekly schedule. Film in any order, batch record as many as you want in a day.

## Brand voice (matches CLAUDE.md)
- Hype machine with receipts. Never negative about islanders.
- Plain spoken. Present tense. No corporate jargon.
- No em dashes. Use commas or periods instead.
- Talk to one person, not an audience.
- Every post teaches one thing. Not three. One.

## The content loop (run this every week)
1. **Ship** a feature on the site.
2. **Film the build** in scrappy clips as you go. The mess is the content.
3. **Post the hook** the day the feature goes live.
4. **Teach the skill** behind it in a follow up.
5. **Show the receipts** when a prediction hits or misses.
6. **CTA** back to the site and to next week's unlock.

## The 8 week arc (the whole story)
| Week | Feature | AI skill you teach | The one line hook |
|------|---------|--------------------|-------------------|
| 1 | The Oracle + Islander Profiles | Talking to an AI through an API | "I gave an AI the Love Island cast and asked who gets dumped." |
| 2 | Risk Scorer | Structured outputs (JSON) | "I made the AI stop rambling and just hand me a number." |
| 3 | Live Follower Tracker | Web scraping + scheduled jobs | "The fan favorite is decided before the public votes. Here is the data." |
| 4 | Fab 5 | Multiple AI models at once | "I asked 5 AIs the same question. They disagreed. Loudly." |
| 5 | MCP Live Data Feed | Giving AI live tools (MCP) | "New bombshell drops and my AI researches them before the episode ends." |
| 6 | Anomaly Engine | Pattern detection across seasons | "The AI found a pattern in 7 seasons that nobody noticed." |
| 7 | Beat the Oracle | Database + live voting | "Fans vs the machine. Live leaderboard. Place your bets." |
| 8 | The Build | Documenting it all | "Everything I built, open sourced. This fan site is secretly a portfolio." |

Each week below follows the same template so you can film fast.

---

# WEEK 1 — The Oracle (LIVE, this is real)

**What you actually built:** A chat page where you type a question about Season 8 and an AI answers in the Love Island narrator voice. The answer comes from Claude through a server side API route.

**The AI skill:** Calling an LLM API. Sending a system prompt. Keeping your key secret on the server.

### The Hook (post this first, 15 to 30 sec)
> Open on the Oracle typing out a prediction.
>
> "I built a website that predicts who gets dumped from Love Island. It talks like the narrator. And it is powered by the same AI a lot of companies pay thousands for. I am going to teach you how to build the whole thing for free. Follow along, this is week one."

On screen text: "AI + reality TV = unfair advantage"

### The Hot Take (the bait)
> "An AI just called the first dumping of the season. If it is right, I am never watching live again. If it is wrong, you get to roast me. Either way we both win."

### The 60 second teach (the payoff)
> "Here is the trick. The AI is not in my website. My website sends a message to Anthropic's computers, the message says here is who you are and here is the question, and it sends back an answer.
>
> That message is called an API call. The here is who you are part is called a system prompt. Mine tells the AI to talk like Iain Stirling and never be mean to the islanders.
>
> The most important rule. The password that unlocks the AI never touches the website. It lives on my server only. If you put it in your website code, anyone can steal it and run up your bill. Keep the key on the server. That is the whole lesson."

### Carousel outline (6 slides)
1. "I gave an AI the entire Love Island cast." (screenshot of the Oracle)
2. "It predicts dumpings in the narrator's voice."
3. "Here is how it actually works." (diagram: You to Website to AI to Website to You)
4. "The magic words are the system prompt. Mine: talk like the narrator, never be mean."
5. "The one rule beginners get wrong: never put your API key in the website. Server only."
6. "Week 1 of 8. Each week I add a new AI skill. Follow to build it with me. Link in bio."

### Thread / caption outline
- Line 1: the hook, who gets dumped.
- Line 2: what an API call is, in one sentence.
- Line 3: what a system prompt is, in one sentence.
- Line 4: the keep your key secret rule.
- Line 5: what unlocks next week.

### Receipts (post after the episode)
> Screen record the prediction next to what actually happened. "The Oracle said Friday. It was Thursday. Half credit. The machine is learning."

### CTA
"Try the Oracle yourself, link in bio. Week 2 the AI stops talking and starts scoring. Follow so you do not miss it."

### Hashtags / discovery
#LoveIslandUSA #buildinpublic #AI #learnAI #codingforbeginners #claudeai

---

# WEEK 2 — Risk Scorer (next build)

**What you will build:** The AI returns a dumping risk number from 0 to 100 for every islander, plus one reason. The leaderboard fills in. The risk bars animate.

**The AI skill:** Structured outputs. Forcing the AI to answer in a strict format (JSON) instead of a paragraph, so a computer can use it.

### The Hook
> "Last week my AI talked. This week I made it shut up and give me a number. Every islander now has a dumping risk score. Here is who is in danger."

### The Hot Take
> "The AI says [islander] is at 80 percent risk. I disagree. Screenshot this. We settle it Thursday."

### The 60 second teach
> "Normally an AI talks in paragraphs. Useless if you want to put a number in a chart. So you tell it: do not write a story, fill out this exact form. Name, risk number, one reason. Nothing else.
>
> That is called structured output. You hand the AI a template and it has to color inside the lines. Now my website can take that number and draw a bar with it automatically. Words become data. Data becomes the leaderboard."

### Carousel outline (6 slides)
1. "I asked the AI: who is getting dumped, as a number."
2. "Paragraphs are pretty. Numbers are useful."
3. "The trick: give the AI a form to fill out, not a blank page."
4. "Here is the form." (show the JSON shape: name, risk, reason)
5. "Now the website turns every number into a bar automatically."
6. "Week 2 of 8. Follow to keep building."

### Receipts
> "The AI's highest risk pick this week was [name]. Outcome: [hit/miss]. Season record so far: X for Y."

### CTA
"See every score on the leaderboard, link in bio. Next week the AI starts collecting its own data while I sleep."

### Hashtags
#LoveIslandUSA #buildinpublic #AI #dataviz #learntocode #claudeai

---

# WEEK 3 — Live Follower Tracker

**Skill:** Web scraping + scheduled jobs (the computer collects data on a timer, no human needed).

- **Hook:** "The fan favorite is already decided. Not by the vote. By this." (show follower growth chart)
- **Teach:** What scraping is (a robot reading public web pages for you) and what a scheduled job is (it runs every night at 2am while you sleep). Always note: scrape public data, respect the rules.
- **Receipt angle:** Follower velocity vs who actually wins the public vote.
- **CTA:** "The numbers update nightly. Watch them move."

---

# WEEK 4 — Fab 5

**Skill:** Multi model. Asking several AI models the same question at the same time.

- **Hook:** "I asked 5 different AIs who wins Love Island. They could not agree. Watch them fight."
- **Teach:** Different models have different strengths and costs. Small and fast vs big and smart. Sometimes the cheap one nails it.
- **Receipt angle:** Which model called it right. Track a model leaderboard.
- **CTA:** "Pick your model. See who you trust."

---

# WEEK 5 — MCP Live Data Feed

**Skill:** MCP. Giving the AI live tools so it can fetch fresh info instead of guessing from memory.

- **Hook:** "A new bombshell entered the villa tonight. My AI already wrote their full profile. Before the episode ended."
- **Teach:** An AI only knows what it was trained on, which is the past. MCP gives it a phone to call out for live info. That is the difference between guessing and knowing.
- **Receipt angle:** Time from bombshell reveal to full AI profile on the site.
- **CTA:** "New islanders auto researched. Refresh and watch."

---

# WEEK 6 — Anomaly Engine

**Skill:** Pattern detection across many seasons of data.

- **Hook:** "I fed the AI 7 seasons of Love Island. It found a pattern that predicts winners. Nobody talks about it."
- **Teach:** AI is great at finding faint patterns hiding in huge piles of data that a human would never sit and count.
- **Receipt angle:** Does the historical pattern hold this season.
- **CTA:** "See what the AI found that you missed."

---

# WEEK 7 — Beat the Oracle

**Skill:** Database + live voting. Saving everyone's picks and updating a leaderboard in real time.

- **Hook:** "You think you know Love Island better than my AI. Prove it. Submit your picks. Live scoreboard. Fans vs machine."
- **Teach:** What a database is (a giant spreadsheet the website reads and writes) and why you need one the moment more than one person uses your app.
- **Receipt angle:** Weekly fans vs machine score.
- **CTA:** "Beat the Oracle. Top of the leaderboard gets bragging rights."

---

# WEEK 8 — The Build

**Skill:** Documenting and open sourcing everything.

- **Hook:** "This was never just a fan site. It is a full AI portfolio in disguise. Here is everything I built, free, open sourced."
- **Teach:** Recap the 8 skills in one post. The whole journey from API call to live app.
- **Receipt angle:** Final season scorecard. How right was the Oracle, all season.
- **CTA:** "Star the repo. Steal the code. Go build your own. Link in bio."

---

## Repeatable template (copy this for any new step)
```
# WEEK X — [Feature]
What you built: [one plain sentence]
The AI skill: [the one concept, in beginner words]

Hook (15-30s): [the show angle that grabs them]
Hot take: [a bold claim people want to argue with]
60s teach: [explain the one concept with a real world metaphor]
Carousel (6 slides): hook, problem, the trick, show it, the payoff, follow CTA
Receipts: [film prediction vs reality]
CTA: [back to site + tease next unlock]
Hashtags: [show tag + build in public + the skill]
```

## Content principles to not forget
- The show is the hook. The skill is the lesson. Never lead with the lesson.
- One concept per post. Confused people scroll.
- Always use a real world metaphor before the technical word.
- Receipts build trust. Post the misses too, people respect it.
- Every post ends pointing somewhere: the site, or next week.
- Film the boring middle. The struggle is more relatable than the win.
