# Command: `migrate` — adopt Spec Harness into an EXISTING codebase

> Same as `init`, but the code already exists. The order flips: index first, so the memory bank
> and rules describe what's really there, not a blank template. This is capability 3, "if the
> project already exists, index it into a memory bank."

## Invocation
```
spec-harness index <target>          # 1. build the structural index (fast, scripted)
spec-harness init <target> <name>    # 2. lay down bank + rules + agents (preserve any existing entry point)
# 3. run the sdd-researcher to enrich the index + fill the bank from real code (agent step)
```

## Steps

1. **Index (scripted).** `bin/sh-index.sh` walks the source roots (`src/ app/ lib/ packages/
   service/ ...`), inventories every source file with its exported symbols, and writes
   `ai_rules/context_map.md` + per-root `README.inventory.md`. This is the skeleton the agents
   navigate by instead of grepping.

2. **Scaffold (scripted).** `sh-init.sh` lays down the bank, rules, agents, loop. If a
   `CLAUDE.md` / `AGENTS.md` / `.cursorrules` already exists, **merge** — append the Spec Harness startup
   block, preserve the project's rules under a `## Pre-existing project rules` heading. Never
   overwrite blind.

3. **Enrich (agent).** Run the `sdd-researcher` to turn the raw inventory into real understanding:
   what each module does, which symbols are reusable, the patterns already in use. It fills
   `.memory/00/10/20/30` from the actual code, and writes stack-correct `frequent_rules.md` from
   the conventions it observes plus researched best practices. Fill, don't leave `[TBD]`.

4. **Verify.** Diff the inventory file count against the source dirs (the `audit` command does
   this as "index drift"). Confirm the bank references real symbols. Confirm `frequent_rules.md`
   is stack-correct, not copied from another project.

## Rule
Skipping the index step on an existing codebase is refused. The index is the layer that prevents
hallucination and makes reuse automatic. Without it you have a decorative bank, which is the
exact failure mode of every SDD tool that hand-writes its standards.
