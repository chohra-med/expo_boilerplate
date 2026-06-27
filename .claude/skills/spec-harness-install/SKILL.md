---
name: spec-harness-install
description: Add or refresh Spec Harness in a repo — greenfield (new) or existing (integrate), idempotent. Use when Malik says 'install spec harness', 'set this repo up with spec harness', 'integrate spec harness into X', or 'start a new spec-harness project'. Runs the interview (mode, stack, constraints, work-intake source, learning goals, regression guards) and scaffolds the bank + agents + commands + skills without clobbering existing CLAUDE.md/AGENTS.md.
---

# spec-harness-install

Stand the system up in a target repo. Prefer the script: `bash <spec-harness>/bin/sh-install.sh <target> [new|integrate] <name>`. Then run the interview to fill the bank + frequent_rules from the real stack (never copy another stack's rules). Integrate mode: run `index` first to ground in real code.

## Run it
1. **Load the full procedure** — read the command doc and follow it exactly:
   `.claude/commands/spec-harness/init.md` (this repo) or the spec-harness source `commands/init.md`.
2. **Agents** — spawn from `.claude/agents/`: researcher.
3. **Stay inside the 3 pillars** — UAMOS (memory `.memory/`) · Spec-Driven Development · Harness (ratchet `AGENTS.md` + verifier + learning loop). Read `SPEC-HARNESS.md` for how this repo is wired.

## Non-negotiables
- The ratchet only tightens (rules are append/sharpen, never drop).
- Nothing is "done" until the **separate verifier** returns PASS against `goal.md`.
- Every correction or FAIL cause goes through `spec-harness-learn` → a dated rule.
- Never scaffold the second-brain vault. Never commit a client repo unless asked.
