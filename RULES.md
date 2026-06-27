# Directory rules — AI Mobile Launcher (repo root — base rules)

> **Per-directory rules.** Resolved nearest-up-the-tree: an agent working on a file collects every
> `RULES.md` from the repo root down to the file's directory; **this file overrides its ancestors
> on conflict**, and an empty section inherits the parent's. Each section is owned by one SDD
> agent. Rules here are generated from **this directory's real code** — never copied from another
> directory's stack.

**Stack here:** _<language/runtime + framework for THIS subtree, only if it differs from the parent; else "inherits root">_

## Coding            <!-- owner: implementer -->
_<coding conventions specific to this dir: style, idioms, patterns to follow / avoid, error handling, naming. Cite a real file in this dir as the exemplar.>_

## Architecture      <!-- owner: researcher / planner -->
_<how code here is structured: layering, module boundaries, what may import what, where new code goes. The shape a plan must respect.>_

## Packages          <!-- owner: researcher -->
_<the deps THIS subtree uses + why; allowed vs forbidden; version pins that matter; "prefer X over Y here". Read from this dir's manifest, not the root's.>_

## Testing           <!-- owner: tester -->
_<the test runner + exact command for THIS subtree (a monorepo package may differ from root); what "green" means here; what must have a test.>_

## Reviewing         <!-- owner: reviewer -->
_<what a reviewer blocks on in this dir; the acceptance bar specific to this subtree (e.g. "no RN imports in the pure-core package").>_
