# /goal — {{FEATURE}}

> The forcing function. A goal you can't phrase as true/false is a goal the verifier can't
> check. Write the end-state FIRST. If you can't, stop — the rest of the loop depends on it.

## Goal
Build {{FEATURE}}.

## End-state (every line must be literally true/false checkable)

- [ ] `{{COMMAND}}` exits 0 and prints `{{EXPECTED}}`
- [ ] `{{ENDPOINT}}` responds `{{STATUS}}` with `{{PAYLOAD_SHAPE}}`
- [ ] `{{TEST_CMD}}` — all tests green, suite count > 0
- [ ] no new entries in `{{ERROR_SOURCE}}` (lint / type-check / log)

## Out of scope (the loop may NOT do these)
- {{OUT_OF_SCOPE}}

---
**Bad end-state:** "the feature works well."
**Good end-state:** "`node --test` exits 0 and `POST /enter-path` returns `{result:4}`."
If it can't be a checkbox, the verifier has nothing to check.
