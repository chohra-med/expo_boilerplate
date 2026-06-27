# Command: `build` — run the SDD pipeline over tasks.md

> The loop, one task at a time. This is where memory + rules + verify + schedule actually run.

## Invocation
```
spec-harness build --feature <slug> [--task N | --all]
```

## Per-task cycle
```
for task in tasks.md:
  research  → (if needed) facts the implementer will use, cited
  implement → ONE task, code + colocated tests, surgical diff
  test      → tester runs type/lint/test suite — "is it green?"
  VERIFY    → verifier checks the goal end-state — "is it DONE?"  (separate, clean context)
  review    → reviewer checks acceptance criteria + rules — "is it RIGHT?"
  if all pass: mark task done, append .memory/50-progress
  if verify/review fails: append the cause to AGENTS.md (ratchet), re-run implementer
```

## Gates (constitution)
- A task is done **only** when the verifier returns PASS. Green tests are necessary, not
  sufficient.
- The orchestrator — not the implementer — marks tasks done.
- Honor the guardrails in `loop.sh`: run cap, verify-gate before any destructive/merge action.

## Output
Append to `.memory/50-progress.md`: `## <date> — <task> — shipped X, files Y, verifier PASS`.
