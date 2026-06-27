# Command: `plan` — spec → design (the HOW)

> The flexible "how" on top of the stable "what". Architecture decisions live here, not in the
> spec. Run the researcher first so the design references real, existing code.

## Invocation
```
spec-harness plan --feature <slug>
```
Reads `spec.md` (+ optional `research.md`), writes `specs/<slug>/design.md`.

## The design must contain
- **Architecture map** — the layers/modules and how data flows between them (a diagram).
- **Key decisions** — each as: context → options → choice → reason. These double as the
  interview talking track and seed `.memory/60-decisions.md`.
- **The one hard part** — most case studies hinge on a single tricky thing (an algorithm, a
  streaming contract). Name it, and the approach, explicitly.
- **Reuse** — which existing symbols (from research.md) get used instead of rebuilt.
- **File structure** — the target tree.

## Rule
Decisions must be *justifiable out loud*. If AI usage gets grilled (it will), every choice in
this file is something the human reads back and defends without notes.
