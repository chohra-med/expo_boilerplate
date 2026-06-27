# Command: `rules` — per-directory rules (resolve, or generate from real code)

> Different directories have different rules. A monorepo's pure-TS package, its RN app, and its
> Python example each need their own coding / architecture / package / testing / reviewing rules.
> `rules` makes those exist **per directory**, generated from each directory's real code, and the
> SDD agents resolve the nearest set for their concern. This is the per-subagent rules layer.

## Invocation
```
spec-harness rules --generate [<subtree>]   # NO rules yet → derive them from 3 sources (below)
spec-harness rules --scan [<subtree>]       # find rules-boundary dirs, generate missing RULES.md
spec-harness rules --check <path>           # show the resolved rules an agent would see for <path>
```
Or in Claude Code: `/spec-harness:rules`. The `build` flow runs `--scan` on the target subtree
first, so by the time the subagents run, each directory's rules already exist.

## When the repo has NO rules — the discovery prompt (3 sources)
If detection finds no rules library (no `ai_rules/`, no real `RULES.md`, no `.cursor/rules`,
no `copilot-instructions`), don't ship empty agents — **derive** the rules first, from three
sources, and merge them:

**A. Project STRUCTURE** — scan the tree + every manifest (`package.json` / `pyproject.toml` / …).
   Determine the stack, the layout, the packages, the test runner. This is the skeleton.

**B. Project BEST-PRACTICE (observed)** — read a real, representative sample of the code and extract
   how THIS project actually writes it: naming, error handling, layering/architecture, state, test
   patterns, file organisation. **Cite exemplar files.** Never invent; never copy from another stack.

**C. The INTERNET (WebSearch)** — for the detected stack + each significant package, search current
   best practices **and recommended skills/tooling** (e.g. "RTK Query best practices 2026",
   "<package> recommended patterns", "<framework> testing guide"). This corrects A+B toward what's
   *right* for the stack, not just what's *present*.

Merge: **A** says what exists, **B** says how this team does it (wins on house style), **C** says what
the stack recommends (wins on correctness gaps B didn't cover). Write the result into
`ai_rules/rules/frequent_rules.md` (base) + per-dir `RULES.md` sections. Then run `generate-agents`
so the agents bind to them. Conflicts: house style (B) beats generic web advice (C) unless C is a
correctness/security fix.

## What a "rules-boundary" directory is
A directory gets its own `RULES.md` when it has a **distinct stack or convention boundary**:
- it has its own manifest (`package.json` / `pyproject.toml` / `go.mod` / `Cargo.toml`), or
- it's a recognised app/package/service root (a monorepo `packages/*`, `apps/*`, `examples/*`,
  `server/`, `client/`, `mcp-server/`), or
- you mark it explicitly.

The **repo root is always a boundary** (the base rules everything inherits). Don't scatter
`RULES.md` into every leaf folder — only where rules genuinely differ from the parent.

## The five sections (one owner agent each)
| Section | Owner | Generated from |
|---|---|---|
| **Coding** | implementer | the real source files here — style, idioms, patterns, error handling |
| **Architecture** | researcher / planner | the dir's structure — layering, import boundaries, where new code goes |
| **Packages** | researcher | THIS dir's manifest — deps + why, allowed/forbidden, pins |
| **Testing** | tester | THIS dir's test config — runner + exact command, what "green" means |
| **Reviewing** | reviewer | the acceptance bar specific to this subtree |

## Generate (the "create them if they don't exist" path)
For each boundary directory missing a `RULES.md` (or missing a section):
1. **Read the real code** in that directory: its manifest, a sample of its source, its test setup,
   its existing patterns. Never infer from the directory name alone.
2. **Write only what's true for THIS directory.** A Python rule must not land in a TS package. If
   a section is identical to the parent, leave it empty (it inherits) — don't restate.
3. Cite a real exemplar file per section where possible.
4. Stamp the `Stack here:` line only when this subtree's stack differs from its parent.

Idempotent: existing sections are kept; only missing/empty ones are filled. Never overwrite a
human-edited section — sharpen, don't replace.

## Existing repos that already have rules (compose, don't duplicate)
If the repo already has a rules library — e.g. `ai_rules/rules/{testing,state-rtk,design-system,
security,…}.md` (topic-organised but not mapped to directories) — **do not copy that content into
`RULES.md`.** Instead:
1. Keep `ai_rules/` as the base + the library. It stays the authority.
2. Make the **root `RULES.md` a directory→rules map**: a table of `glob → applicable ai_rules
   topic file(s) + owner concern`. One file routes the whole repo (the easy path for a
   single-stack app). Each section just **references** the topic file (`see ai_rules/rules/
   state-rtk.md`) plus any local delta.
3. Add a deeper `RULES.md` only where a subtree genuinely overrides the mapped rules.

This is how a repo like Myelino adopts the layer in one file: the existing topic rules become the
content, the map says where each applies, and the agents follow the references. Zero migration.

## Resolve (what each agent reads)
For a target file `a/b/c/foo.ts`, the resolved rule set for a concern is the **merge of that
concern's section** from `RULES.md` at root, `a/`, `a/b/`, `a/b/c/` — **deepest wins** on conflict,
shallower fills gaps. Each agent reads only the section(s) it owns (see the table). `--check`
prints the resolved set so you can see exactly what an agent would see before it runs.

## Hard rules
- One `RULES.md` per boundary dir, five sections, never copied across stacks (the cardinal rule).
- Deepest-wins cascade; empty section = inherit, not "no rules".
- Generate from real code, cite exemplars; mark `Stack here:` only on a real stack change.
- Don't scatter rules into leaf folders that share the parent's stack.
