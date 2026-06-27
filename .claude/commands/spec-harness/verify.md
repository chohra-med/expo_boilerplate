# Command: `verify` — run the verifier alone

> The floor everyone skips, on demand. PASS/FAIL against a `/goal` end-state, by a separate
> agent with a clean context and no stake in the result.

## Invocation
```
spec-harness verify --goal goal.md [--scope <files>]
```
Runs the `sdd-verifier` agent.

## What it does
1. Reads `goal.md`. If any end-state line isn't literally checkable → FAIL (unverifiable goal).
2. Runs each end-state check **literally** — real command, real endpoint, real file. No inference.
3. ANY fail → FAIL + the exact failing assertion + evidence. ALL pass → PASS.

## Why a separate command
So you can gate a commit, a merge, a deploy, or a loop iteration on it from anywhere:
```bash
spec-harness verify --goal goal.md && git commit -m "feature: verified"
```
The worker never grades its own homework. "It ran" is a claim; the verifier turns it into proof.
