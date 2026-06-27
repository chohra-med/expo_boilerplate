---
description: Read ALL memory bank code rules + best practices, check the files that changed, and APPLY fixes so they adhere. The active counterpart to /scan (which is read-only). Use after an AI session, before commit, to make changed files compliant.
argument-hint: "[scope] — optional: staged | session | file:<path> | branch | all (default: uncommitted + branch diff)"
---

# /review-code — read the rules, fix the changed files

This command **reads every relevant code rule and best practice, finds what changed, and edits those files until they comply.** Unlike `/scan` and `/review-changes` (read-only reports), `/review-code` **applies the fixes**.

Scope: **$ARGUMENTS** (default: uncommitted changes + branch diff vs base).

## Procedure

### 1. Load the rules (read, don't skim)
Read the full enforceable rule set before touching code:
- `ai_rules/rules/frequent_rules.md` ← the most-violated rules + pre-commit checklist (READ FIRST)
- `ai_rules/globalRules.md` (routing) and `ai_rules/rules/best-practices.md`
- Then, **per changed-file category**, load only the matching packs (same mapping as `.claude/skills/best-practices-scan/SKILL.md` §2):
  - screens/components → `design-system.md` (+ Callstack RN: lists, re-renders, animations)
  - hooks → `best-practices.md` (+ Callstack RN: atomic-state, profile-react)
  - store → `state-rtk.md` · services → `best-practices.md` (+ Callstack RN: memory-leaks)
  - theme/tokens → `design-system.md` §10 · tests → `testing.md`
- Best-practices source: Callstack `react-native-best-practices` skill at
  `~/.claude/plugins/marketplaces/callstack-agent-skills/skills/react-native-best-practices/references/`

### 2. Gather scope
Same scoping as the scan skill:
```bash
BASE=$(git remote show origin 2>/dev/null | awk '/HEAD branch/{print $NF}')   # often development or main
git diff --name-only "${BASE:-main}...HEAD"
git status --porcelain | awk '{print $2}'
```
Combine + dedupe. Exclude `node_modules/`, `ios/`, `android/`, `dist/`, `coverage/`, `.expo/`, lock files, generated files.
Overrides: `staged` → `git diff --cached`; `session` → files touched this session; `file:<path>` → one file; `branch` → branch diff only; `all` → full tree (slow, ask first). If scope is empty → say "no changes to review" and stop.

### 3. Detect, then FIX (surgical only)
For each changed file, find violations (static greps from the scan skill §3 + AI-judgment §4) and **edit the file to fix them**. Touch only what the rule requires — do not reformat or refactor unrelated lines. Apply at minimum:

- **No inline functions in JSX props** → wrap in `useCallback`. For handlers built inside `.map()` or `renderItem`/`render*` render-props (e.g. `renderControl={() => <X todo={todo} … />}`), **extract a sub-component** with its own `useCallback` — a parent-level `useCallback` per item is still a new function per render.
- **No inline styles** → convert to Restyle props (`<Box marginTop="xl" backgroundColor="background">`). For text color/alignment, use Restyle props on `Text` (`<Text variant="h3" color="text" textAlign="center">`) instead of `style={{ color: theme.colors.text }}`. If you genuinely need the resolved theme, use the project's theme hook — never a raw inline `style` object built from `theme.colors.*`.
- **No `StyleSheet.create`** → Restyle props (exception: `createThemedStyles` for complex animation only).
- **Emoji / icon glyph clipping** → large emoji/icon `Text` must set an explicit `lineHeight` (≈ `fontSize × 1.3+`) so the glyph isn't cut off (top or bottom). Prefer `lineHeight` over `paddingTop` hacks, and audit sibling icons/emojis in the same file for the same clipping.
- **No hardcoded user-facing text** → `t('key')` + add the key to `src/locales/en.json` and mirror to other locales.
- **No magic numbers** in sizing → `theme.sizes.*` (add to `sizes.ts` if missing).
- **No `any`** → specific type or `unknown`.
- **Relative deep imports** `../../` → `#root/` alias.
- Components > 200 lines → extract.

### 4. Migration discipline
If your fixes touch the shared layer (`src/services/**`, `src/ui/components|hooks|providers/**`, `src/utils/**`, `ai_rules/rules|generators/**`, `babel.config.js`, `jest.setup.js`, `package.json` deps), create a migration file (`ai_rules/generators/migration_generator.md` → `ai_rules/migrations/YYYY-MM-DD-slug.md`) **in the same change**, so it can propagate via `launcher-sync`.

### 5. Verify
Run the app's checks (use the names in `package.json` — `yarn type:check`/`yarn lint`/`yarn test`, or `yarn tsc:check` on older apps). Fix → retry until green. If a check can't be run, say so explicitly.

### 6. Report
List, per file, exactly what was changed and which rule it satisfies. Note any violation you intentionally left (with why), whether a migration file was created, and the verification result. Do **not** `git commit`/`push` — that's the engineer's call.

## /scan vs /review-changes vs /review-code
- `/scan` → read-only audit → writes a review file. (skill: `best-practices-scan`)
- `/review-changes` → read-only diff review (spawns `sdd-reviewer`).
- `/review-code` → **reads the rules and applies the fixes to the changed files.** ← this command.

## Hard rules
- Surgical changes only; every edited line traces to a rule.
- Don't invent rules — fix against the loaded `ai_rules/` + Callstack skill.
- Cross-app: if a fix is in the **shared layer**, make it in `Standard` and propagate via `launcher-sync`; if it's **per-app** (features/navigation/store/theme/locales), apply per app. See the workspace root `CLAUDE.md`.
