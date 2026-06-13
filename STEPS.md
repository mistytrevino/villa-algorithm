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

---

## Up next (not done yet)
- Build the Risk Scorer with structured outputs.
- Add a new Claude skill and show what it unlocks.

_(These live here only as a reminder. They move into the log above once they are actually done.)_
