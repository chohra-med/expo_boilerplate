# CLAUDE.md — MobileLauncher LT

Context file for Claude Code. This acts as an entrypoint routing to our decoupled rule files.

---

## 🌿 Branches — the trunk is `development`, there is NO `main`

⛔ **This repo's trunk is `development`.** It is the GitHub default branch and the base for every PR.

⛔ **`main` does not exist here.** `gh api repos/chohra-med/expo_boilerplate/branches/main` returns **404**. Do not
create it, do not target it, and do not assume it from habit. A PR opened against `main` cannot be
merged because there is nothing to merge into.

⚠️ **The estate is split by family — this is where the confusion comes from:**

| Family | Trunk |
|---|---|
| The AI Mobile Launcher variants (Standard · AI · openSource), Morrow Self, Mane | **`development`** |
| The getwireai repos (`getwireai_website`, `wireai-onboarding-server`, `wireai-activation`) | **`main`** |

So "merge to main" is correct advice **for the getwireai repos and wrong for this one.** Read the
default branch rather than carrying a habit across families:

```bash
gh repo view --json defaultBranchRef -q .defaultBranchRef.name
```

⛔ **A merge to `development` here is NOT a release.** This is a React Native / Expo app: shipping to
users requires a **new native build**, not a merge. Never report a merged PR as shipped.

⛔ **A checkout is not its trunk.** Local `development` drifts behind `origin/development` routinely.
Base branches on `origin/development` and read trunk content with
`git show origin/development:<path>`, never from the working tree.

## Project skill

This repo ships a Claude Code skill for code generation. To use it: `/mobilelauncher <command>`

Available commands: `orient` · `feature <name>` · `screen <feature> <name>` · `component <name>` · `hook <name>` · `slice <feature>` · `endpoint <feature> <name>` · `schema <name>`

See `CLAUDE_SKILL.md` for full documentation. Skill file: `.claude/skills/mobilelauncher/skill.md`

---

## What this project is

AI-first React Native + Expo boilerplate. Feature-first architecture designed to produce consistent, predictable code with AI coding tools. Lite version of [AI Mobile Launcher](https://www.aimobilelauncher.com/).

**Stack:** Expo 55 · React Native 0.83.6 · React 19 · TypeScript strict · Redux Toolkit + RTK Query · Restyle · MMKV · Reanimated 4 · FlashList · Biome · i18next · Zod

---

## The Master Rules

**CRITICAL:** To prevent drift and redundancy, all AI development rules reside in the `.cursor/rules/` directory.

Before performing complex tasks, reading or creating files, you **MUST** review the relevant rule files:

| Topic | Look in |
|---|---|
| Full Architecture & Feature-First Directory Structure | `.cursor/rules/app_feature_first_architecture.mdc` |
| Code Standards, UI, Navigation, Redux, State & Testing | `.cursor/rules/app_rules.mdc` |
| Advanced Best Practices (Error Handling, Env Vars, A11y) | `.cursor/rules/best_practices.mdc` |
| Base Architecture Explanations | `ai_articles/memory-bank/` |

**Please proactively read these files as necessary to maintain consistency.**
