# MobileLauncher LT — Boilerplate Reference

Complete reference for architecture, rules, packages, and patterns. This is the source of truth for understanding the codebase.

---

## Stack Overview

| Layer | Technology | Version |
|---|---|---|
| Framework | React Native + Expo | Expo 55, RN 0.83.6 |
| Language | TypeScript (strict) | ~5.9.2 |
| UI/Styling | Restyle (Shopify) | ^2.4.0 |
| State | Redux Toolkit | ^2.0.1 |
| Data fetching | RTK Query | (bundled with RTK) |
| Forms | React Hook Form + Zod | ^7.48.2 / ^3.22.4 |
| Navigation | React Navigation v6 | Stack + Bottom Tabs + Drawer |
| i18n | i18next + react-i18next | ^23.7.6 |
| Storage (secure) | Expo Secure Store | ~55.0.13 |
| Storage (fast) | react-native-mmkv | ^3.3.3 |
| Persistence | redux-persist (MMKV adapter) | ^6.0.0 |
| Lists | @shopify/flash-list | 2.0.2 |
| Animations | react-native-reanimated | 4.2.1 |
| Gestures | react-native-gesture-handler | ~2.30.0 |
| Linting | Biome | ^2.2.4 |
| Testing | Jest + React Native Testing Library | ^29.7.0 |
| Icons | @expo/vector-icons | ^15.0.3 |
| Error UI | react-native-error-boundary | ^2.0.0 |
| Toast | react-native-toast-message | ^2.3.3 |

---

## Path Aliases

Defined in `tsconfig.json`. Always use these — never relative imports that go up more than one level.

```typescript
#root/*       → ./src/*
#features/*   → ./src/features/*
#ui/*         → ./src/ui/*
#services/*   → ./src/services/*
#utils/*      → ./src/utils/*
#config/*     → ./src/config/*
#navigation/* → ./src/navigation/*
#store/*      → ./src/store/*
```

---

## Project Structure

```
mobileLauncherLt/
├── src/
│   ├── features/              # All business features (self-contained)
│   │   ├── auth/
│   │   ├── onboarding/
│   │   ├── home/
│   │   ├── settings/
│   │   └── todos/
│   ├── navigation/
│   │   ├── navigators/        # Stack, Tab, Drawer navigators
│   │   ├── routes.ts          # Route name constants
│   │   └── routes.types.ts    # TypeScript nav types
│   ├── services/              # Global services (not feature-specific)
│   │   ├── api/               # RTK Query base API config
│   │   ├── storage/           # MMKV + SecureStore wrappers
│   │   ├── logging/           # Logger service
│   │   ├── analytics/         # Analytics service
│   │   ├── network/           # Network status
│   │   ├── sync/              # Data sync
│   │   └── speech/            # Speech service
│   ├── store/
│   │   ├── store.ts           # Redux store + persistor
│   │   ├── reducers.ts        # Root reducer
│   │   └── app.slice.ts       # App-level state
│   ├── ui/
│   │   ├── components/        # Reusable UI components
│   │   ├── hooks/             # Shared UI hooks
│   │   ├── style/             # Theme + ThemeProvider
│   │   │   ├── theme.ts
│   │   │   ├── colors-theme.ts
│   │   │   ├── theme-provider.tsx
│   │   │   └── variants/
│   │   └── tokens/            # Raw design tokens
│   │       ├── colors.ts
│   │       ├── spacing.ts
│   │       ├── fonts.ts
│   │       ├── border-radius.ts
│   │       ├── shadows.ts
│   │       ├── opacity.ts
│   │       └── z-indices.ts
│   ├── utils/
│   ├── schemas/               # Zod schemas
│   ├── config/
│   ├── constants/
│   ├── providers/
│   ├── locales/               # i18n translation files (en, fr)
│   └── entrypoints/
├── ai_articles/               # Architecture docs + memory bank
│   ├── app_rules.md
│   ├── memory-bank/
│   │   ├── projectbrief.md
│   │   ├── productContext.md
│   │   ├── systemPatterns.md
│   │   └── implementationDetails.md
│   └── article_generated/
├── .cursor/rules/
│   ├── app_rules.mdc          # Development rules (alwaysApply)
│   └── app_feature_first_architecture.mdc
├── CLAUDE.md                  # Claude Code context file
├── AGENTS.md                  # Cross-tool AI agent context
└── boilerplate_content.md     # This file
```

---

## Feature Structure (per feature)

Every feature follows this exact structure. No exceptions.

```
src/features/<feature-name>/
├── api/           # RTK Query endpoint injections
├── components/    # Feature-specific UI components
├── hooks/         # Custom hooks (business logic)
├── screens/       # Screen components
├── services/      # Business logic / data transformations
├── store/         # Redux slice + selectors
├── types/         # TypeScript types/interfaces
└── index.ts       # Barrel exports (public API of the feature)
```

**Hard rules:**
- No cross-feature imports. Features never import from each other directly.
- If two features need the same logic → move it to `src/services/` or `src/utils/`.
- Each feature exposes only what's in its `index.ts`.

---

## State Management

### Store setup (`src/store/store.ts`)
- Redux Toolkit with `configureStore`
- Redux Persist using **MMKV** as storage adapter (not AsyncStorage)
- Persisted slices: `app`, `auth`, `onboarding`
- RTK Query cache is **not** persisted (blacklisted)

### Typed hooks
```typescript
import { useAppDispatch, useAppSelector } from '#store/store';
// Never use raw useSelector/useDispatch — always use the typed versions
```

### RTK Query
- Base API defined in `src/services/api/api.ts`
- Each feature injects its endpoints: `api.injectEndpoints({ overrideExisting: true, endpoints: ... })`
- Tag types: `User`, `Auth`, `Onboarding`, `Todos`
- Auth token automatically attached via `prepareHeaders`

### Selectors
- Always use `createSelector` for derived state
- Never access `state.xxx.yyy` directly in components — always via a selector
- Export selectors from the feature's `index.ts`

---

## Theming System (Restyle)

### Design tokens (`src/ui/tokens/`)
Raw values — never import these directly into components.

```typescript
// colors.ts — full palette: gray, primary, secondary, success, warning, error, info (50–900 scale)
// spacing.ts — spacing scale
// border-radius.ts — radius values: none, xs, sm, md, lg, xl, 2xl, 3xl, full
// fonts.ts — font families and sizes
// shadows.ts — elevation system
// opacity.ts — opacity scale
// z-indices.ts — z-index scale
```

### Theme (`src/ui/style/theme.ts`)
Maps tokens to semantic names used by Restyle. Use semantic names in components, not raw values.

### In components
```typescript
// Always use Restyle Box/Text/etc, never StyleSheet
import { Box, Text } from '#ui/components';

<Box backgroundColor="primary" padding="md" borderRadius="md" />
<Text variant="body" color="textPrimary" />

// For circles: use borderRadius="full" — never calculate half-width
// Never hardcode: backgroundColor="#3B82F6", padding={16}
```

---

## Navigation

- **Stack navigator** wraps everything
- **Bottom tab navigator** for authenticated users
- **Auth guard** in root navigator: unauthenticated → auth screens, authenticated → app tabs
- Type-safe navigation: all routes defined in `routes.ts` and `routes.types.ts`
- Never use `as any` or `as never` for navigation params

```typescript
type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;
const navigation = useNavigation<ProfileScreenNavigationProp>();
navigation.navigate('Profile', { userId: 123 }); // fully typed
```

---

## Storage

| Use case | Solution |
|---|---|
| Auth tokens, credentials | Expo Secure Store |
| App data, preferences, settings | MMKV |
| Redux state persistence | redux-persist with MMKV adapter |

```typescript
import { secureStorage } from '#services/storage/secure-storage';
import { mmkv } from '#services/storage/mmkv-storage';

// Secure
await secureStorage.setItem('auth_token', token);

// Fast
mmkv.set('user_preferences', JSON.stringify(prefs));
```

Never use AsyncStorage for new code.

---

## Internationalization

- All visible text must use `t()` — no hardcoded strings in JSX
- Translation files: `src/locales/en.json`, `src/locales/fr.json`
- Keys organized by feature: `auth.login.title`, `todos.empty.message`

```typescript
const { t } = useTranslation();
<Text>{t('auth.login.title')}</Text>
```

---

## Forms

React Hook Form + Zod for all forms.

```typescript
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const { control, handleSubmit } = useForm({
  resolver: zodResolver(schema),
});
```

---

## Lists

Always use `FlashList` for lists of 10+ items. Never `FlatList` for new code.

```typescript
import { FlashList } from '@shopify/flash-list';
<FlashList data={items} renderItem={renderItem} estimatedItemSize={80} />
```

---

## Performance Rules

- `React.memo` for components that receive stable props
- `useCallback` for every function passed as prop or used in dependency arrays
- `useMemo` for expensive computations
- Extract render functions outside JSX: `const renderItem = useCallback(...)`
- No inline functions in JSX: `onPress={() => fn()}` → extract to `handlePress`
- No inline styles: `style={{ padding: 16 }}` → use Restyle theme values

---

## Testing

```bash
yarn test            # run all
yarn test:watch      # watch mode
yarn test:coverage   # with coverage (70%+ required)
```

- Test all custom hooks with `renderHook`
- Test Redux slices in isolation
- Test RTK Query endpoints
- Follow AAA pattern (Arrange, Act, Assert)
- Mock external services (SecureStore, MMKV, API)
- Test files live in `__tests__/` next to the file being tested

---

## Linting and Formatting

```bash
yarn lint         # Biome check
yarn lint:fix     # auto-fix
yarn format       # format check
yarn format:fix   # auto-format
```

Biome handles: TypeScript linting, code formatting, import sorting. No ESLint, no Prettier.

---

## Code Conventions

| Pattern | Convention |
|---|---|
| Files | `kebab-case.tsx` |
| Components | `PascalCase` |
| Functions/hooks | `camelCase` |
| Constants | `UPPER_CASE` |
| Types/Interfaces | `PascalCase` |

### Import order
1. React
2. React Native
3. Third-party libraries
4. Internal absolute imports (`#root/`, `#ui/`, etc.)
5. Relative imports (`./`)
6. Type imports (last)

### TypeScript
- Strict mode — no `any`, no `ts-ignore`, no `as any`
- All function params and return types explicit
- Prefer `interface` for objects, `type` for unions/aliases

---

## Commit Convention

```
feat(scope): description
fix(scope): description
docs(scope): description
refactor(scope): description
test(scope): description
chore(scope): description
```

---

## Memory Bank (`ai_articles/memory-bank/`)

Structured context files that AI coding tools read for codebase understanding:

- `projectbrief.md` — what the project is and its goals
- `productContext.md` — user-facing product context
- `systemPatterns.md` — architectural patterns and decisions
- `implementationDetails.md` — implementation specifics, gotchas

Update these files when making architectural decisions.

---

## What's in the Paid Version (AI Mobile Launcher)

This is the Lite version. The paid tier at [aimobilelauncher.com](https://www.aimobilelauncher.com/) adds:

- RevenueCat integration (in-app purchases)
- Firebase (Auth, Firestore, Analytics, Crashlytics)
- U-AMOS 2.0 — full 9-file memory bank system with global AI rules
- AI Pro features and generators
- Supabase integration
- Advanced analytics setup
