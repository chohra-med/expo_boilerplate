---
name: spec-harness-spec
description: Turn a rough brief into a structured, testable spec.md (the 'what'). Use when Malik says 'spec this', 'write the spec for X', or 'what are the requirements'. First SDD step.
---

# spec-harness-spec

Produce the 'what': a spec.md with testable acceptance criteria, grounded in the memory bank + index so it references real components and reuses what exists.

## Run it
1. **Load the full procedure** — read the command doc and follow it exactly:
   `.claude/commands/spec-harness/spec.md` (this repo) or the spec-harness source `commands/spec.md`.
2. **Agents** — spawn from `.claude/agents/`: researcher.
3. **Stay inside the 3 pillars** — memory bank ( `.memory/`) · Spec-Driven Development · Harness (ratchet `AGENTS.md` + verifier + learning loop). Read `SPEC-HARNESS.md` for how this repo is wired.

## Non-negotiables
- The ratchet only tightens (rules are append/sharpen, never drop).
- Nothing is "done" until the **separate verifier** returns PASS against `goal.md`.
- Every correction or FAIL cause goes through `spec-harness-learn` → a dated rule.
- Never scaffold the second-brain vault. Never commit a client repo unless asked.
