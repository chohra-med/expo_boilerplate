---
name: spec-harness-learn
description: The learning loop — turn feedback, a correction, or a verifier-FAIL root cause into one enforced rule injected into the ratchet (AGENTS.md/ai_rules), dated. Use when Malik says 'learn this', 'remember not to do X', 'capture this lesson', 'don't do that again', or right after he corrects you. Closes the loop the verifier opens; emits an optional human lesson too.
---

# spec-harness-learn

Run the 6-step learning loop: capture (→ .memory/80-feedback) → distill to one imperative rule → classify (AGENTS.md / frequent_rules / core / 70-knowledge) → inject dated → optional human lesson (learning/lessons/) → verify the rule is in the startup load path. The harness just tightened.

## Run it
1. **Load the full procedure** — read the command doc and follow it exactly:
   `.claude/commands/spec-harness/learn.md` (this repo) or the spec-harness source `commands/learn.md`.
2. **Agents** — spawn from `.claude/agents/`: reviewer.
3. **Stay inside the 3 pillars** — UAMOS (memory `.memory/`) · Spec-Driven Development · Harness (ratchet `AGENTS.md` + verifier + learning loop). Read `SPEC-HARNESS.md` for how this repo is wired.

## Non-negotiables
- The ratchet only tightens (rules are append/sharpen, never drop).
- Nothing is "done" until the **separate verifier** returns PASS against `goal.md`.
- Every correction or FAIL cause goes through `spec-harness-learn` → a dated rule.
- Never scaffold the second-brain vault. Never commit a client repo unless asked.
