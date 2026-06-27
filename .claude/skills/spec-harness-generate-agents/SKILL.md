---
name: spec-harness-generate-agents
description: Bind the 6 SDD agents to THIS project's rules — fill each agent's GEN:rules region with its concern's real rules (implementer←Coding, tester←Testing+commands, reviewer←Reviewing, researcher/planner←Architecture, verifier←goal). Use when Malik says 'generate the agents', 'make the agents project-specific', 'bind agents to the rules', or right after rules are created/updated. If no rules exist yet, it routes to rules-generation (3 sources: structure + project best-practice + the internet) first. Idempotent; re-run after learn updates a rule.
---

# spec-harness-generate-agents

Make the generic agents project-specific. Run `bash <spec-harness>/bin/sh-gen-agents.sh <target>` to stage the work order (or get the rules-discovery prompt if no rules exist). Then, for each `.claude/agents/sdd-*.md`, replace the text between `<!-- GEN:rules START -->` and `<!-- GEN:rules END -->` with that agent's concern rules — 4-8 checkable bullets cited to real files; exact commands for tester/verifier; stack-true only; date the block. Overwrite the region, keep the markers.

## Run it
1. **Load the full procedure** — read the command doc and follow it exactly:
   `.claude/commands/spec-harness/generate-agents.md` (this repo) or the spec-harness source `commands/generate-agents.md`.
2. **Agents** — spawn from `.claude/agents/`: researcher.
3. **Stay inside the 3 pillars** — memory bank ( `.memory/`) · Spec-Driven Development · Harness (ratchet `AGENTS.md` + verifier + learning loop). Read `SPEC-HARNESS.md` for how this repo is wired.

## Non-negotiables
- The ratchet only tightens (rules are append/sharpen, never drop).
- Nothing is "done" until the **separate verifier** returns PASS against `goal.md`.
- Every correction or FAIL cause goes through `spec-harness-learn` → a dated rule.
- Never scaffold the second-brain vault. Never commit a client repo unless asked.
