---
name: spec-harness-audit
description: Health-check the memory bank, rules, and index — flag stale, contradictory, or redundant entries and spec↔code drift. Use when Malik says 'audit the bank', 'is the memory stale', 'check spec harness health', or 'clean up the rules'.
---

# spec-harness-audit

Cross-check the bank, ai_rules, and index for staleness, contradiction, redundancy, and drift from the real code. Report fixes; promote durable learnings up into the curated bank.

## Run it
1. **Load the full procedure** — read the command doc and follow it exactly:
   `.claude/commands/spec-harness/audit.md` (this repo) or the spec-harness source `commands/audit.md`.
2. **Agents** — spawn from `.claude/agents/`: researcher.
3. **Stay inside the 3 pillars** — UAMOS (memory `.memory/`) · Spec-Driven Development · Harness (ratchet `AGENTS.md` + verifier + learning loop). Read `SPEC-HARNESS.md` for how this repo is wired.

## Non-negotiables
- The ratchet only tightens (rules are append/sharpen, never drop).
- Nothing is "done" until the **separate verifier** returns PASS against `goal.md`.
- Every correction or FAIL cause goes through `spec-harness-learn` → a dated rule.
- Never scaffold the second-brain vault. Never commit a client repo unless asked.
