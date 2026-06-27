# Spec Harness — wired into AI Mobile Launcher

This repo runs on [Spec Harness](https://github.com/specharness): a memory bank + a ratchet +
a 6-agent spec-driven pipeline + a verifier + a learning loop. No dependency, just files.

## The loop you run
1. `/spec-harness:tickets`  — pull a ticket (MCP) or define a plan → specs/NNN-*/
2. `/spec-harness:build`    — implement → test → **verify** → review, one task at a time
3. `/spec-harness:learn`    — feed back corrections → injected into the rules (the ratchet)

## Where things live
- `.memory/`              — the bank (00→80; 80-feedback = the learning inbox)
- `ai_rules/`             — the ratchet's rule files (only tighten)
- `AGENTS.md` / `constitution.md` — hard constraints + SDD non-negotiables
- `.claude/agents/`       — the 6 SDD agents (incl. the verifier)
- `.claude/commands/spec-harness/` — the commands as slash-commands
- `goal.md`               — the current verifiable end-state the verifier checks

## Three pillars
**UAMOS** (memory) · **Spec-Driven Development** · **Harness** (ratchet + verifier + learning loop).
