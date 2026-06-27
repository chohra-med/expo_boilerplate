---
name: spec-harness-build
description: Run the SDD pipeline over tasks.md: implement → test → VERIFY → review, one task at a time, under the ratchet. Use when Malik says 'build it', 'run the pipeline', 'implement the tasks', or 'ship this feature'. Each task gated by the separate verifier; lessons harvested by learn.
---

# spec-harness-build

Execute tasks.md one task at a time. Per task: implementer writes the minimum diff → tester runs the suite → verifier (separate, clean context) checks against goal.md → reviewer checks scope/style. FAIL → fix + route the cause to learn. Never batch tasks past a failing verifier.

## Run it
1. **Load the full procedure** — read the command doc and follow it exactly:
   `.claude/commands/spec-harness/build.md` (this repo) or the spec-harness source `commands/build.md`.
2. **Agents** — spawn from `.claude/agents/`: implementer, tester, verifier, reviewer.
3. **Stay inside the 3 pillars** — UAMOS (memory `.memory/`) · Spec-Driven Development · Harness (ratchet `AGENTS.md` + verifier + learning loop). Read `SPEC-HARNESS.md` for how this repo is wired.

## Non-negotiables
- The ratchet only tightens (rules are append/sharpen, never drop).
- Nothing is "done" until the **separate verifier** returns PASS against `goal.md`.
- Every correction or FAIL cause goes through `spec-harness-learn` → a dated rule.
- Never scaffold the second-brain vault. Never commit a client repo unless asked.
