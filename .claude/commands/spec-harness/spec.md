# Command: `spec` — brief → structured spec (the WHAT)

> Intent is the source of truth. Turn a rough brief into a testable one-pager the rest of the
> pipeline feeds on. Stable "what", no "how".

## Invocation
```
spec-harness spec --feature <slug> --from "<brief or path>"
```
Writes `specs/<NNN>-<slug>/spec.md`.

## The spec must contain
- **Problem** — one paragraph. What's broken / needed and for whom.
- **User stories / requests** — the concrete asks, each phrased so it's checkable.
- **Acceptance criteria** — bullet list, every item literally true/false. This is what the
  `goal.md` end-state is derived from.
- **Out of scope** — name what you are deliberately NOT building. (Senior signal: the scary
  part that *isn't* in scope.)
- **Constraints** — perf bounds, deps policy, "runs on a clean machine", deadline.

## Rules
- No implementation detail. If you're naming files or functions, you've drifted into `design`.
- If an acceptance criterion can't be phrased as a check, rewrite it until it can — or move it
  to out-of-scope. The verifier can only check checkable things.
