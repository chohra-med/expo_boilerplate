---
name: spec-harness-tickets
description: Intake work into the SDD pipeline — pull tickets from a connected ticket MCP (Linear/GitHub/Jira) or define an inline plan. Use when Malik says 'pull my tickets', 'grab the Linear issues', 'turn this into specs', 'plan this work', or 'what should I build next'. Produces specs/NNN-*/ ready for build.
---

# spec-harness-tickets

Convert work items into verifiable specs. Source A: discover a ticket MCP via ToolSearch and convert chosen tickets to specs/NNN-<id>-<slug>/. Source B: write an inline plan → spec.md + plan.md + tasks.md. Each spec needs checkable acceptance criteria (the verifier's target).

## Run it
1. **Load the full procedure** — read the command doc and follow it exactly:
   `.claude/commands/spec-harness/tickets.md` (this repo) or the spec-harness source `commands/tickets.md`.
2. **Agents** — spawn from `.claude/agents/`: researcher, planner.
3. **Stay inside the 3 pillars** — memory bank ( `.memory/`) · Spec-Driven Development · Harness (ratchet `AGENTS.md` + verifier + learning loop). Read `SPEC-HARNESS.md` for how this repo is wired.

## Non-negotiables
- The ratchet only tightens (rules are append/sharpen, never drop).
- Nothing is "done" until the **separate verifier** returns PASS against `goal.md`.
- Every correction or FAIL cause goes through `spec-harness-learn` → a dated rule.
- Never scaffold the second-brain vault. Never commit a client repo unless asked.
