---
name: spec-harness-verify
description: Run the verifier alone — a separate clean-context agent that returns PASS/FAIL against goal.md (not the agent that wrote the code). Use when Malik says 'verify it', 'is it actually done', 'check against the goal', or 'did this pass'. Tests passing ≠ goal met.
---

# spec-harness-verify

Spawn the sdd-verifier with a clean context. It runs each goal.md end-state check literally (no inference) and emits RESULT: PASS|FAIL + evidence. It must not be the agent that wrote the code.

## Run it
1. **Load the full procedure** — read the command doc and follow it exactly:
   `.claude/commands/spec-harness/verify.md` (this repo) or the spec-harness source `commands/verify.md`.
2. **Agents** — spawn from `.claude/agents/`: verifier.
3. **Stay inside the 3 pillars** — UAMOS (memory `.memory/`) · Spec-Driven Development · Harness (ratchet `AGENTS.md` + verifier + learning loop). Read `SPEC-HARNESS.md` for how this repo is wired.

## Non-negotiables
- The ratchet only tightens (rules are append/sharpen, never drop).
- Nothing is "done" until the **separate verifier** returns PASS against `goal.md`.
- Every correction or FAIL cause goes through `spec-harness-learn` → a dated rule.
- Never scaffold the second-brain vault. Never commit a client repo unless asked.
