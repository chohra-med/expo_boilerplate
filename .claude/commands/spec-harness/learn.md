# Command: `learn` — the learning loop (feedback → rules)

> The loop that makes the harness tighten. The **verifier** finds a failure; `learn` turns
> that failure — or any human feedback — into an **enforced rule** so the next run can't repeat
> it. Feedback never evaporates. This is the "loop" pillar, reframed: not a cron schedule, a
> *learning* schedule.

## When to run it
- A human corrected you ("no, the data only lives in the backend", "stop doing X").
- The **verifier returned FAIL** — capture the root cause before fixing, so it becomes a rule.
- A code-review comment, a bug postmortem, a "remember this for next time".
- End of a `build`: harvest what was learned this feature.

## Invocation
```
spec-harness learn "<the feedback / correction / lesson>"          # one-shot
spec-harness learn --from .memory/80-feedback.md                   # drain the inbox
```
Or in Claude Code: `/spec-harness learn` and paste the feedback.

## The loop (6 steps)

### 1 — CAPTURE
Append the raw feedback to `.memory/80-feedback.md` (dated inbox), verbatim, with the context
that triggered it (the file, the wrong behavior, what was expected). Never lose the raw signal.

### 2 — DISTILL
Turn the specific incident into ONE generalizable, imperative, **testable** rule. Bad:
"don't assume tags map." Good: "Verify the data model against the real code before trusting a
spec's data step — a spec can be wrong about where data lives."

### 3 — CLASSIFY (which layer does this rule belong to?)
| Kind of lesson | Goes to | Why |
|---|---|---|
| Hard constraint, never-again | `AGENTS.md` (the ratchet) | only tightens; load-bearing |
| Stack-specific gotcha | `ai_rules/rules/frequent_rules.md` | the per-stack most-violated list |
| Behavioral / process | `ai_rules/rules/core.md` | how the agent works |
| Durable pattern / insight | `.memory/70-knowledge.md` | reusable knowledge, not a guard |

### 4 — INJECT
Write the distilled rule into the chosen file, **dated**, appended (never rewrite history). The
ratchet only grows. If a near-duplicate rule exists, sharpen it instead of adding a second.

### 5 — TEACH (optional, the human side)
If the lesson is worth internalizing (a real technique, not a guard), emit a learner lesson:
- append a one-liner to `learning/NOTES.md`, and/or
- generate a recall lesson (`learning/lessons/NNNN-<slug>.md|html`) with a question + answer.
This is the `teach`-style layer: the machine learns from failures, the human learns from wins.

### 6 — VERIFY THE INJECTION
Confirm the new rule is actually in the **startup load path** (`CLAUDE.md` → `globalRules` →
`frequent_rules`). A rule the next session won't read is not learned. Echo where it landed.

## Output (always report)
```
LEARNED: <one-line rule>
  ├─ captured → .memory/80-feedback.md
  ├─ injected → <file> (dated)
  └─ taught   → learning/lessons/NNNN-<slug>.md   (or: skipped — not a teachable technique)
```

## Hard rules
- One incident → one sharp rule. Don't dump a paragraph into the ratchet.
- Dated, append-only. The ratchet never loosens (constitution art. on the ratchet).
- A FAIL is not "learned" until step 6 confirms it's loadable next session.
- Never inject stack-specific rules into the wrong stack's `frequent_rules.md`.
