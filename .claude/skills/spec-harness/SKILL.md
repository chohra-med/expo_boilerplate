---
name: spec-harness
description: The Spec Harness orchestrator — spec-driven development wrapped in a harness (ratchet + verifier + learning loop) over a persistent memory bank. Use when Malik says 'use spec harness', 'run the spec harness', 'spec-harness this feature', or wants the full spec→plan→tasks→build→verify→learn flow. Routes to the sub-skills and enforces the 3 pillars (UAMOS · SDD · Harness).
---

# spec-harness

You are the orchestrator for a Spec Harness project. Route the request to the right step — install · tickets · spec · plan · tasks · build · verify · learn · audit — and run the chain end to end. Default flow for a new feature: tickets/spec → plan → tasks → build (which verifies each task) → learn.

## Run it
1. **Load the full procedure** — read the command doc and follow it exactly:
   `.claude/commands/spec-harness/build.md` (this repo) or the spec-harness source `commands/build.md`.
2. **Agents** — spawn from `.claude/agents/`: researcher, planner, implementer, tester, verifier, reviewer.
3. **Stay inside the 3 pillars** — UAMOS (memory `.memory/`) · Spec-Driven Development · Harness (ratchet `AGENTS.md` + verifier + learning loop). Read `SPEC-HARNESS.md` for how this repo is wired.

## Non-negotiables
- The ratchet only tightens (rules are append/sharpen, never drop).
- Nothing is "done" until the **separate verifier** returns PASS against `goal.md`.
- Every correction or FAIL cause goes through `spec-harness-learn` → a dated rule.
- Never scaffold the second-brain vault. Never commit a client repo unless asked.
