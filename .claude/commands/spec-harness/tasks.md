# Command: `tasks` — design → atomic task list

> The executable bridge between intent and code. Each task: atomic, ordered, testable,
> reuse-aware. The implementer does them 1 → N with no backtracking.

## Invocation
```
spec-harness tasks --feature <slug>
```
Reads `spec.md` + `design.md` (+ `research.md`), writes `specs/<slug>/tasks.md`.

## Each task
- Title
- Files to create/edit (paths from repo root)
- Acceptance criteria (checkable)
- Test plan (which command verifies it)
- Dependencies (earlier task numbers)

## Standard ordering (drop what's irrelevant)
1. Types & contracts → 2. Pure core logic **+ its tests (TDD)** → 3. Persistence →
4. Service/API → 5. Wiring → 6. One integration happy-path → 7. Docs + `LEARNING.md`.

Put the **hard part second** (right after types) and TDD it before anything depends on it.
