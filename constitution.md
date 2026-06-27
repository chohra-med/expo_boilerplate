# Constitution — AI Mobile Launcher

> Borrowed from GitHub Spec Kit. The non-negotiable principles every agent respects on every
> task. The spec says *what*; the design says *how*; the constitution says *what is never up
> for debate*. Keep it short — a constitution nobody can recite isn't one.

## Articles

1. **TDD is law.** Non-trivial logic gets a failing test first, then the implementation. A
   task is not done because it runs — it's done when the verifier confirms the end-state.

2. **Minimum code that solves the problem.** No speculative abstractions, no design patterns
   for requirements that don't exist yet. Over-engineering is a defect, not diligence.

3. **Type-safety throughout.** No `any` (TS) / full type hints (Python). The signature is
   the contract.

4. **Intelligence in the leaves, control flow deterministic.** LLMs classify and generate;
   they do not sit in the control path holding state. Routing is code, not vibes.

5. **Every dependency is justified.** A non-stdlib package needs a one-line reason in the
   README. If you can't justify it, you don't add it.

6. **The diff is surgical.** Touch only what the task requires. Out-of-scope improvements get
   noted as follow-ups, never acted on mid-task.

7. **The harness stays around the dev, not in the product.** Spec Harness scaffolding (`.memory/`,
   `ai_rules/`, `.claude/`) is development tooling. The shipped artifact stays clean — and
   for graded/anonymized deliverables, the scaffolding is excluded from the submission.

8. **Surface uncertainty first.** If scope or intent is ambiguous, state the assumption and
   the tradeoff before writing code. A wrong guess costs more than a question.

## Amendment rule

This file changes only by explicit human decision, logged in `.memory/60-decisions.md`. The
*rules* ratchet automatically (`AGENTS.md`); the *constitution* does not.
