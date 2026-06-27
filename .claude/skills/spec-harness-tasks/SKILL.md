---
name: spec-harness-tasks
description: Break a design into atomic, ordered, testable tasks.md. Use when Malik says 'break this into tasks', 'task it out', or 'what are the steps'. Third SDD step.
---

# spec-harness-tasks

Produce tasks.md: atomic, ordered, independently testable units — the executable bridge from design to code.

## Run it
1. **Load the full procedure** — read the command doc and follow it exactly:
   `.claude/commands/spec-harness/tasks.md` (this repo) or the spec-harness source `commands/tasks.md`.
2. **Agents** — spawn from `.claude/agents/`: planner.
3. **Stay inside the 3 pillars** — UAMOS (memory `.memory/`) · Spec-Driven Development · Harness (ratchet `AGENTS.md` + verifier + learning loop). Read `SPEC-HARNESS.md` for how this repo is wired.

## Non-negotiables
- The ratchet only tightens (rules are append/sharpen, never drop).
- Nothing is "done" until the **separate verifier** returns PASS against `goal.md`.
- Every correction or FAIL cause goes through `spec-harness-learn` → a dated rule.
- Never scaffold the second-brain vault. Never commit a client repo unless asked.
