---
name: spec-harness-rules
description: Per-directory rules — resolve the nearest RULES.md for a path (coding/architecture/packages/testing/reviewing), or generate it from a directory's real code when missing. Use when Malik says 'different directories have different rules', 'add rules per directory', 'each package needs its own rules', 'what rules apply here', or when working in a monorepo with mixed stacks. Each section is owned by one SDD agent; deepest-wins cascade.
---

# spec-harness-rules

Make per-directory rules exist and resolve them. `--scan`: at each rules-boundary dir (own manifest/stack) generate a RULES.md with the 5 concern sections from that dir's real code, never copied across stacks. `--check <path>`: print the merged rules an agent would see (root→…→dir, deepest wins). The build flow scans first so subagents resolve, not invent.

## Run it
1. **Load the full procedure** — read the command doc and follow it exactly:
   `.claude/commands/spec-harness/rules.md` (this repo) or the spec-harness source `commands/rules.md`.
2. **Agents** — spawn from `.claude/agents/`: researcher, implementer.
3. **Stay inside the 3 pillars** — memory bank ( `.memory/`) · Spec-Driven Development · Harness (ratchet `AGENTS.md` + verifier + learning loop). Read `SPEC-HARNESS.md` for how this repo is wired.

## Non-negotiables
- The ratchet only tightens (rules are append/sharpen, never drop).
- Nothing is "done" until the **separate verifier** returns PASS against `goal.md`.
- Every correction or FAIL cause goes through `spec-harness-learn` → a dated rule.
- Never scaffold the second-brain vault. Never commit a client repo unless asked.
