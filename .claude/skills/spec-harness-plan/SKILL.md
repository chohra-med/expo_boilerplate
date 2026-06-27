---
name: spec-harness-plan
description: Turn a spec into a design.md (the 'how' — architecture decisions). Use when Malik says 'plan the implementation', 'how should we build this', or 'design this'. Second SDD step.
---

# spec-harness-plan

Produce the 'how': architecture decisions in design.md, honoring constitution.md and the existing system (no rebuilding what the index shows already exists).

## Run it
1. **Load the full procedure** — read the command doc and follow it exactly:
   `.claude/commands/spec-harness/plan.md` (this repo) or the spec-harness source `commands/plan.md`.
2. **Agents** — spawn from `.claude/agents/`: planner.
3. **Stay inside the 3 pillars** — UAMOS (memory `.memory/`) · Spec-Driven Development · Harness (ratchet `AGENTS.md` + verifier + learning loop). Read `SPEC-HARNESS.md` for how this repo is wired.

## Non-negotiables
- The ratchet only tightens (rules are append/sharpen, never drop).
- Nothing is "done" until the **separate verifier** returns PASS against `goal.md`.
- Every correction or FAIL cause goes through `spec-harness-learn` → a dated rule.
- Never scaffold the second-brain vault. Never commit a client repo unless asked.
