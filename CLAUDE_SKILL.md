# CLAUDE_SKILL.md — MobileLauncher LT

This project ships with a Claude Code skill that generates boilerplate-consistent code for this repo.

The skill file lives at: `.claude/skills/mobilelauncher/skill.md`

---

## How to use

From inside this project, run:

```
/mobilelauncher <command>
```

---

## Commands

| Command | What it does |
|---|---|
| `/mobilelauncher orient` | Read the project and output a concise orientation: versions, features, reducers, rules summary |
| `/mobilelauncher feature <name>` | Scaffold a complete new feature with all files (types, slice, selectors, RTK Query endpoints, hooks, screens, barrel exports) |
| `/mobilelauncher screen <feature> <name>` | Add a new screen to an existing feature, typed and wired for navigation |
| `/mobilelauncher component <name>` | Generate a shared Restyle UI component in `src/ui/components/` |
| `/mobilelauncher hook <name>` | Generate a custom hook (feature-scoped or shared) |
| `/mobilelauncher slice <feature>` | Generate a Redux slice + createSelector selectors for an existing feature |
| `/mobilelauncher endpoint <feature> <name>` | Generate an RTK Query endpoint injection for an existing feature |
| `/mobilelauncher schema <name>` | Generate a Zod schema in `src/schemas/` |

---

## What the skill guarantees

Every file the skill generates:

- Follows **feature-first architecture** — no cross-feature imports, proper barrel exports
- Uses **Restyle** for styling — no StyleSheet, no inline styles, no hardcoded values
- Uses **Redux Toolkit** patterns — typed hooks, createSelector, RTK Query injections
- Is **TypeScript strict** — no any, no ts-ignore, explicit types everywhere
- Uses **i18next** for all visible text — no hardcoded strings in JSX
- Uses **FlashList** for lists — never FlatList
- Uses **React.memo + useCallback** — memoized by default
- Includes a post-generation **checklist** (what to register, what to translate, what to test)

---

## Other context files

| File | Purpose |
|---|---|
| `CLAUDE.md` | Rules and constraints Claude Code reads at session start |
| `AGENTS.md` | Same rules in cross-tool format (Cursor, Antigravity, etc.) |
| `boilerplate_content.md` | Full architecture reference: packages, patterns, directory tree |
| `ai_articles/memory-bank/` | Architectural decisions and implementation context |
| `.cursor/rules/app_rules.mdc` | Cursor-specific rule file (alwaysApply) |

---

## Example session

```
> /mobilelauncher orient

## MobileLauncher LT — Orientation
Expo: 55 · React Native: 0.83.6 · React: 19
Features: auth, home, onboarding, settings, todos
...

> /mobilelauncher feature notifications

Generated:
  src/features/notifications/types/index.ts
  src/features/notifications/store/notifications.slice.ts
  src/features/notifications/api/notifications.api.ts
  src/features/notifications/hooks/use-notifications.ts
  src/features/notifications/screens/notifications-list-screen.tsx
  src/features/notifications/index.ts
  ...

Checklist:
[ ] Run yarn lint:fix
[ ] Add notificationsReducer to src/store/reducers.ts
[ ] Add 'Notification' to tagTypes in src/services/api/api.ts
[ ] Register route in src/navigation/routes.ts
...
```
