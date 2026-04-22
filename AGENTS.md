# AGENTS.md — MobileLauncher LT

Cross-tool context file. Read by Cursor, Antigravity, Claude Code, and any other AI coding tools connected to this repository.

## Project

AI-first React Native + Expo 55 boilerplate. Feature-first architecture. TypeScript strict. Lite version of [AI Mobile Launcher](https://www.aimobilelauncher.com/).

**Core tech:** Expo 55 · React Native 0.83.6 · React 19 · TypeScript strict · Redux Toolkit · RTK Query · Restyle · MMKV · Reanimated 4 · FlashList · Biome

---

## 🎯 The Master Rules Location

**CRITICAL INSTRUCTION:** To prevent drift and inconsistency, the full, single-source-of-truth rules for this project reside in `.cursor/rules/`.

Before writing any new code, components, or making architectural decisions, you **MUST** read the contents of the following files based on the task context:

| Topic | Look in |
|---|---|
| Full Architecture & Feature-First Directory Structure | `.cursor/rules/app_feature_first_architecture.mdc` |
| Code Standards, UI, Navigation, Redux, State & Testing | `.cursor/rules/app_rules.mdc` |
| Advanced Best Practices (Error Handling, Env Vars, A11y) | `.cursor/rules/best_practices.mdc` |
| Base Architecture Explanations | `ai_articles/memory-bank/` |

**If you fail to observe these files, you risk producing legacy or hallucinated code that violates the stringent requirements of this architecture.** Please use your ability to read local files to ingest these rules prior to generating code.
