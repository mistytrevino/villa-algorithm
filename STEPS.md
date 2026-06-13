# Steps — the running log

Every step taken to build The Villa Algorithm, in order. This is the plain record: what I did and why it matters. Nothing else.

- Content angles for these steps (hook, teach, receipt) live in **CONTENT.md**.
- The map that ties each step to its content and tracks what is filmed and posted lives in **PRODUCTION.md**.
- This file only records steps that are **done**. New steps get appended at the bottom as they happen.
- Every step includes a **Why**. The why is the point.

---

## 2026-06-12 · Session 1 — Foundation, ship, and content setup

**1. Planned the idea in Claude chat.**
Why: Think before building. The plan is worth more than a fast start.

**2. Turned the plan into a detailed kickoff prompt.**
Why: The prompt is the spec. Detail in equals quality out. This is prompt engineering.

**3. Opened VSCode with Claude Code.**
Why: Claude chat plans, Claude Code builds in the real files. Right tool for the job.

**4. Pasted the kickoff prompt into Claude Code to start the build.**
Why: The handoff. I direct, the agent does the typing.

**5. Had the agent take stock of existing files before building.**
Why: Read before you write. Never build on something you have not looked at.

**6. Caught that the AI's version knowledge was outdated and read the real docs.**
Why: AI is trained on the past. Verify against current docs, do not trust memory.

**7. Wrote the project rule files: CLAUDE.md, DESIGN.md, ANIMATIONS.md, COMPONENTS.md.**
Why: Write the rules once so the AI stays consistent across every future step.

**8. Created the data files (features, islanders, episodes, predictions) and a types file.**
Why: Keep data separate from code. One source of truth, easy to update.

**9. Set up the design system in globals.css: colors, fonts, the glass card style.**
Why: Define the brand once as tokens, use it everywhere, change it from one place.

**10. Built the layout and navigation shell.**
Why: Build the frame once and every page sits inside it automatically.

**11. Built the reusable components (islander card, Oracle bubble, risk meter, locked card, badge).**
Why: Build a piece once, reuse it everywhere, fix it in one place.

**12. Built the pages and the Oracle API route that calls Claude.**
Why: This connects the actual AI. The website sends a message to Claude and shows the reply.

**13. Created the local .env.local file for the secret API key.**
Why: Secrets live outside the code, on the server only, never in public.

**14. Ran the build to confirm everything compiles.**
Why: Looks done and is done are different. The passing build is the proof.

**15. Started the local dev server and previewed the site.**
Why: A private test version on my machine. Break things here, not in front of the world.

**16. Improved the Oracle's offline message for the no key case.**
Why: Good software plans for failure and says something helpful instead of a cryptic error.

**17. Saved the work as a git commit on a branch.**
Why: A commit is a save point. Git is an undo button for the whole project.

**18. Merged the branch into main.**
Why: Build on a branch, then make it official by merging into the main line.

**19. Created a public GitHub repo and pushed the project.**
Why: Backup, build in public, and portfolio. The work stops living on one laptop.

**20. Ran a security audit of the public repo and full git history.**
Why: Public means anyone can read everything. Confirm no keys or secrets ever leaked.

**21. Created CONTENT.md, the content angle playbook.**
Why: Plan the content on purpose. The build is the bait, the teaching is the product.

**22. Created STEPS.md and PRODUCTION.md to track every step as content.**
Why: Document as you go. Each step becomes a video and you never lose the why.

**23. Added the real Anthropic API key to .env.local and woke the Oracle.**
Why: With a real key the AI answers for real. Tested it live and it pulled from the actual cast data in the narrator voice. The before and after, offline to alive, is the proof it works.

**24. Built the Risk Scorer with structured outputs and unlocked the feature.**
Why: A normal AI reply is a paragraph. Useless for a chart. So I handed Claude a strict form (a tool with a schema) and forced it to fill it out: an id, a 0 to 100 risk number, and one reason per islander. The answer comes back as clean data, gets saved into islanders.json, and fills the leaderboard and risk meters. Words became numbers. That is structured output.

**25. Fixed the cast data with real research and verification.**
Why: The seed data was a Day 1 placeholder. People were missing (KC, Bryce, the bombshells), Sean and Beatriz were dumped but still listed. I researched the real Season 8 roster, rebuilt islanders.json to all 16 with accurate ages, hometowns, entry days, couples, and statuses, then had a human verify it. A prediction site is only as good as its data.

**26. Added islander avatars with a graceful fallback.**
Why: Wanted faces on the cards. Official press photos are not legal to republish on a fan site, so I built an Avatar that hotlinks each person's own public Instagram avatar through unavatar.io, and falls back to initials on a brand gradient when there is no handle or the image fails. Discovered unavatar now charges for Instagram, so the cards show clean initials for free. A good fallback means a paid or broken API never breaks your page.

**27. Built the Fab 5: one question, five Claude models in parallel.**
Why: The same prompt goes to five different Claude models at once, so the only thing that changes is the brain answering. They run in parallel, not one after another, so all five answer in about the time one would take. One model failing never sinks the rest. It is the clearest way to feel the difference between a fast small model and a slow smart one. (The frontier model Fable 5 was suspended on June 12 2026 to comply with a US government directive, so the lineup runs three Opus generations plus Sonnet and Haiku, and Fable 5 shows as a suspended tier with a link to Anthropic's statement.)

**28. Added the season timeline to the home page.**
Why: A visual of the whole season, episode one to the finale. Aired episodes are unlocked with a check, future ones stay locked, and key episodes like Casa Amor are flagged. It auto unlocks as real dates pass. Researched the real schedule and clearly marked which dates are confirmed versus estimated, because a prediction site should never fake certainty it does not have.

**29. Hardened the AI API against abuse.**
Why: A public API endpoint that spends money on every call needs guardrails. Added six layers across all three AI routes: a per IP rate limit (5 Oracle calls an hour), a 200 character input cap, graceful handling of Anthropic's own rate limit so the raw error never reaches the user, an origin check so only the real site can call the routes, a shared frontend token, and a 1kb body size cap. Honest caveat taught in the code itself: the origin header and the frontend token can both be seen or forged from a browser, so they are speed bumps. The real protection is the rate limit plus, in production, a firewall or bot protection. Never put a true secret in anything the browser can read.

**30. Built the Anomaly Engine: AI pattern detection over the cast.**
Why: A person watches one couple at a time. An AI reads the whole cast at once and finds patterns no single viewer would catch. Claude scans every field, age, hometown, entry day, risk score, and returns four to six structured findings, each citing the exact data behind it so nothing is made up. First scan surfaced real ones: a Georgia hometown cluster, the day-7 bombshells holding the three highest risk scores, and both dumped islanders being original day-one cast. This is the same structured-output trick as the Risk Scorer pointed at a harder job: finding signal in noise.

---

## Up next (not done yet)
- Live Follower Tracker (web scraping + scheduled runs).
- MCP live data feed, or Beat the Oracle (database + voting).

_(These live here only as a reminder. They move into the log above once they are actually done.)_
