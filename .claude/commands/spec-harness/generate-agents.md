# Command: `generate-agents` — bind the 6 SDD agents to this project's rules

> The keystone of the generative pipeline. The agents ship **generic**; this makes them **bound** to
> THIS project's rules. After it runs, the `sdd-implementer` literally contains this project's coding
> rules, the `sdd-tester` contains its real test command, the `sdd-reviewer` contains its review bar —
> not a pointer, the actual rules. Feedback that updates the rules re-runs this so the agents track them.

## Invocation
```
spec-harness generate-agents [<target>]        # stage the work order (bin/sh-gen-agents.sh)
```
Or the `spec-harness-generate-agents` skill in Claude Code (it executes the work order end-to-end).
`install`/`init` call this as the **final step**, so a freshly-installed repo already has bound agents
(or, if it has no rules yet, a clear instruction to generate rules first).

## How it works
1. `bin/sh-gen-agents.sh` checks the repo has rules.
   - **No rules** → it prints the rules-DISCOVERY prompt (3 sources — see `rules.md`) and stops.
     Generate rules first (`spec-harness rules --generate`), then come back.
   - **Rules exist** → it writes a work order to `.claude/agents/.generate-agents.prompt.md`.
2. You (the agent/skill) execute the work order: for each of the 6 agent files, **replace the text
   between `<!-- GEN:rules START -->` and `<!-- GEN:rules END -->`** with that agent's concern rules,
   synthesized from this project's real rules. Keep the markers.

## The concern each agent gets (one per agent)
| Agent | Inject | Synthesized from |
|---|---|---|
| `sdd-implementer` | **Coding + Packages** | `RULES.md` (Coding,Packages) · `frequent_rules.md` · real source files |
| `sdd-researcher` | **Architecture + Packages** | `RULES.md` (Architecture,Packages) · `30-tech.md` · `context_map.md` |
| `sdd-planner` | **Architecture** | `RULES.md` (Architecture) · `context_map.md` · `20-system.md` |
| `sdd-tester` | **Testing** | `RULES.md` (Testing) · `30-tech.md` `## Commands` · the test config |
| `sdd-reviewer` | **Reviewing + Coding** | `RULES.md` (Reviewing,Coding) · `frequent_rules.md` |
| `sdd-verifier` | **Goal end-state + verify command** | `goal.md` · `RULES.md` (Testing) · `30-tech.md` `## Commands` |

## Rules for the injected block (every agent)
- **4–8 concrete, checkable bullets** — the rules an agent would actually violate in THIS repo.
- **Cite a real exemplar file** per rule where possible (`src/store/api/baseApi.ts`).
- For `tester`/`verifier`: include the **EXACT commands** (type-check / lint / test), verbatim — no guessing.
- **Stack-true only:** a Python rule must never land in a TS agent (the cardinal rule).
- Overwrite the region (don't append). End it with `<!-- bound: YYYY-MM-DD from <sources> -->`.

## Idempotent + the loop
Re-runnable any time. When `learn` injects a rule into a concern an agent is bound to, it marks that
agent stale and re-runs this so the next build uses the improved agent. That closes the loop:
`feedback → rules → regenerated agents → better generation`.

## Proof it worked
After binding, `grep -L 'No project-specific rules generated yet' .claude/agents/sdd-*.md` lists the
bound agents. A bound `sdd-tester` shows this repo's real test command; a bound `sdd-implementer`
shows its real coding rules — visibly different from the generic template.
