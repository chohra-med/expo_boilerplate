# CLAUDE.md — MobileLauncher LT

Context file for Claude Code. This acts as an entrypoint routing to our decoupled rule files.

---

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
