# Command: `audit` — health-check the system (the /analyze gate)

> A harness rots. Maintaining it is the job. This is the cross-artifact consistency gate
> (Spec Kit's `/analyze`) plus the Spec Harness memory/index health check.

## Invocation
```
spec-harness audit [--target <path>]
```

## Checks
| Area | Flag if |
|---|---|
| **Missing files** | a layer's required file is absent |
| **Stale Hot tier** | `40-active.md` / `50-progress.md` not touched in 7 days |
| **Contradictions** | `updated_rules.md` overrides a core rule that changed; spec ↔ design ↔ tasks disagree |
| **Index drift** | file count in a dir ≠ entries in its `README.md` |
| **Token weight** | Hot tier > 3K tokens — trim to headlines |
| **Temporal redundancy** | claude-mem injection just echoes the bank — you're double-paying |
| **Stale rules** | rules in `AGENTS.md` for code that no longer exists |
| **Unverifiable goals** | a `goal.md` end-state that isn't checkable |

## Output
One table, `🟢/🟡/🔴` per area, + a punch list of concrete fixes. Run it weekly (it's a
natural `/loop` job) and on the 17th as part of the monthly refresh.
