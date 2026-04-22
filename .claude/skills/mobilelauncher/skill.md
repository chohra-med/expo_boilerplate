---
name: mobilelauncher
description: MobileLauncher LT project skill. Generates boilerplate-consistent code: new features, screens, components, hooks, Redux slices, RTK Query endpoints, and Zod schemas — all following the feature-first architecture, Restyle styling, and TypeScript strict rules of this repo. Use when adding anything new to this codebase.
user-invocable: true
argument-hint: 'feature <name> | screen <feature> <name> | component <name> | hook <name> | slice <feature> | endpoint <feature> <name> | schema <name> | orient'
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash
---

# MobileLauncher LT — Project Skill

You are an expert React Native engineer who knows this codebase inside-out. Your job is to generate code that is **indistinguishable from existing code in this repo** — same patterns, same conventions, same file structure, zero drift.

Before generating anything, you have already internalized:
- Feature-first architecture: code organized by business feature, never by technical layer
- Restyle for all styling: no StyleSheet, no inline styles, no hardcoded values
- Redux Toolkit + RTK Query: typed hooks, createSelector, endpoint injections
- TypeScript strict: no any, no ts-ignore, explicit types everywhere
- i18next for all visible text: no hardcoded strings in JSX
- FlashList for lists: never FlatList
- MMKV for storage: never AsyncStorage for new code
- Biome for formatting: run lint:fix after generating files

Arguments received: `$ARGUMENTS`

---

## Step 1: Parse Command

Read `$ARGUMENTS` and identify the command:

- `feature <name>` — scaffold a complete new feature directory with all files
- `screen <feature> <name>` — add a screen to an existing feature
- `component <name>` — generate a shared Restyle UI component in `src/ui/components/`
- `hook <name>` — generate a custom hook (ask if feature-scoped or shared)
- `slice <feature>` — generate a Redux slice + selectors for a feature
- `endpoint <feature> <name>` — generate an RTK Query endpoint injection
- `schema <name>` — generate a Zod schema in `src/schemas/`
- `orient` — read the project and give a concise orientation report
- (no args or unrecognized) — show the available commands and ask what to generate

If arguments are ambiguous, ask one clarifying question before proceeding.

---

## Step 2: Read Current State

Before generating any code, always read the relevant existing files to match patterns exactly:

For any generation task, read:
1. `CLAUDE.md` — rules and constraints
2. `boilerplate_content.md` — full architecture reference
3. One existing similar file (e.g., if adding a screen, read an existing screen in the same feature)

For `orient`: additionally read `src/features/` directory listing, `package.json`, and `src/store/store.ts`.

---

## Step 3: Execute Command

### `orient`

Read:
- `CLAUDE.md`
- `boilerplate_content.md`
- `package.json` (versions)
- `src/features/` directory listing
- `src/store/reducers.ts`

Report back in this format:

```
## MobileLauncher LT — Orientation

**Expo:** <version> · **React Native:** <version> · **React:** <version>

**Features:** <list of src/features/ directories>

**Registered reducers:** <list from reducers.ts>

**Path aliases:** #root, #features, #ui, #services, #utils, #config, #navigation, #store

**Key rules (5-second version):**
- Styling: Restyle only — no StyleSheet, no inline styles
- State: useAppSelector / useAppDispatch, createSelector, RTK Query
- Storage: MMKV for app data, SecureStore for sensitive data
- Lists: FlashList, never FlatList
- Text: t() from i18next, no hardcoded strings
- Types: strict, no any

**Memory bank:** ai_articles/memory-bank/ — read systemPatterns.md for architecture decisions

**To generate code, run:** /mobilelauncher feature|screen|component|hook|slice|endpoint|schema
```

---

### `feature <name>`

Scaffold a complete new feature. Use `<name>` in kebab-case for files, PascalCase for types.

**Directories to create:**
```
src/features/<name>/
  api/
  components/
  hooks/
  screens/
  services/
  store/
  types/
```

**Files to create:**

**`src/features/<name>/types/index.ts`**
```typescript
export interface <Name> {
  id: string;
  // add fields relevant to this feature
  createdAt: string;
  updatedAt: string;
}

export interface <Name>State {
  items: <Name>[];
  selectedId: string | null;
  isLoading: boolean;
  error: string | null;
}
```

**`src/features/<name>/store/<name>.slice.ts`**
```typescript
import { createSlice, createSelector, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '#store/store';
import type { <Name>, <Name>State } from '../types';

const initialState: <Name>State = {
  items: [],
  selectedId: null,
  isLoading: false,
  error: null,
};

const <name>Slice = createSlice({
  name: '<name>',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<<Name>[]>) => {
      state.items = action.payload;
    },
    setSelectedId: (state, action: PayloadAction<string | null>) => {
      state.selectedId = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    reset: () => initialState,
  },
});

export const { setItems, setSelectedId, setLoading, setError, reset } = <name>Slice.actions;
export const <name>Reducer = <name>Slice.reducer;

// Selectors
const select<Name>State = (state: RootState) => state.<name>;

export const select<Name>Items = createSelector(select<Name>State, (s) => s.items);
export const select<Name>SelectedId = createSelector(select<Name>State, (s) => s.selectedId);
export const select<Name>IsLoading = createSelector(select<Name>State, (s) => s.isLoading);
export const select<Name>Error = createSelector(select<Name>State, (s) => s.error);
export const select<Name>Selected = createSelector(
  select<Name>Items,
  select<Name>SelectedId,
  (items, id) => items.find((item) => item.id === id) ?? null,
);
```

**`src/features/<name>/store/index.ts`**
```typescript
export * from './<name>.slice';
```

**`src/features/<name>/api/<name>.api.ts`**
```typescript
import { api } from '#services/api/api';
import type { <Name> } from '../types';

const <name>Api = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    get<Name>s: builder.query<<Name>[], void>({
      query: () => '/<name>s',
      providesTags: ['<Name>'],
    }),
    get<Name>ById: builder.query<<Name>, string>({
      query: (id) => `/<name>s/${id}`,
      providesTags: (_result, _error, id) => [{ type: '<Name>', id }],
    }),
    create<Name>: builder.mutation<Omit<<Name>, 'id' | 'createdAt' | 'updatedAt'>, <Name>>({
      query: (body) => ({ url: '/<name>s', method: 'POST', body }),
      invalidatesTags: ['<Name>'],
    }),
    update<Name>: builder.mutation<Partial<Omit<<Name>, 'id' | 'createdAt' | 'updatedAt'>>, { id: string } & <Name>>({
      query: ({ id, ...body }) => ({ url: `/<name>s/${id}`, method: 'PATCH', body }),
      invalidatesTags: (_result, _error, { id }) => [{ type: '<Name>', id }],
    }),
    delete<Name>: builder.mutation<void, string>({
      query: (id) => ({ url: `/<name>s/${id}`, method: 'DELETE' }),
      invalidatesTags: ['<Name>'],
    }),
  }),
});

export const {
  useGet<Name>sQuery,
  useGet<Name>ByIdQuery,
  useCreate<Name>Mutation,
  useUpdate<Name>Mutation,
  useDelete<Name>Mutation,
} = <name>Api;
```

**`src/features/<name>/api/index.ts`**
```typescript
export * from './<name>.api';
```

**`src/features/<name>/hooks/use-<name>.ts`**
```typescript
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '#store/store';
import {
  select<Name>Items,
  select<Name>IsLoading,
  select<Name>Error,
  select<Name>Selected,
  setSelectedId,
  reset,
} from '../store';
import { useGet<Name>sQuery } from '../api';

export const use<Name> = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(select<Name>Items);
  const selectedItem = useAppSelector(select<Name>Selected);
  const isLoading = useAppSelector(select<Name>IsLoading);
  const error = useAppSelector(select<Name>Error);
  const { isFetching } = useGet<Name>sQuery();

  const selectItem = useCallback(
    (id: string | null) => {
      dispatch(setSelectedId(id));
    },
    [dispatch],
  );

  const resetFeature = useCallback(() => {
    dispatch(reset());
  }, [dispatch]);

  return {
    items,
    selectedItem,
    isLoading: isLoading || isFetching,
    error,
    selectItem,
    resetFeature,
  };
};
```

**`src/features/<name>/hooks/index.ts`**
```typescript
export * from './use-<name>';
```

**`src/features/<name>/screens/<name>-list-screen.tsx`**
```typescript
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FlashList } from '@shopify/flash-list';
import { Box, Text } from '#ui/components';
import { use<Name> } from '../hooks';
import type { <Name> } from '../types';

const <Name>ListScreen = () => {
  const { t } = useTranslation();
  const { items, isLoading } = use<Name>();

  const renderItem = useCallback(
    ({ item }: { item: <Name> }) => (
      <Box
        padding="md"
        marginBottom="sm"
        backgroundColor="surface"
        borderRadius="md"
      >
        <Text variant="body">{item.id}</Text>
      </Box>
    ),
    [],
  );

  if (isLoading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Text variant="body">{t('common.loading')}</Text>
      </Box>
    );
  }

  return (
    <Box flex={1} backgroundColor="background">
      <FlashList
        data={items}
        renderItem={renderItem}
        estimatedItemSize={80}
        contentContainerStyle={{ padding: 16 }}
      />
    </Box>
  );
};

export default React.memo(<Name>ListScreen);
```

**`src/features/<name>/screens/index.ts`**
```typescript
export { default as <Name>ListScreen } from './<name>-list-screen';
```

**`src/features/<name>/components/index.ts`**
```typescript
// Feature-specific components export here
```

**`src/features/<name>/services/index.ts`**
```typescript
// Feature business logic and data transforms export here
```

**`src/features/<name>/index.ts`**
```typescript
export * from './api';
export * from './hooks';
export * from './screens';
export * from './store';
export type * from './types';
```

After creating all files, remind the user to:
1. Add `<name>Reducer` to `src/store/reducers.ts`
2. Add `'<Name>'` to `tagTypes` in `src/services/api/api.ts` if new tag type needed
3. Add routes to `src/navigation/routes.ts` and `src/navigation/routes.types.ts`
4. Add translation keys to `src/locales/en.json` and `src/locales/fr.json`

---

### `screen <feature> <name>`

Read the existing feature's `screens/` directory first to match patterns.

Create `src/features/<feature>/screens/<name>-screen.tsx`:

```typescript
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { Box, Text } from '#ui/components';
import type { RootStackParamList } from '#navigation/routes.types';

type <Name>ScreenNavigationProp = StackNavigationProp<RootStackParamList, '<Name>'>;

const <Name>Screen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<<Name>ScreenNavigationProp>();

  return (
    <Box flex={1} backgroundColor="background" padding="md">
      <Text variant="h1">{t('<feature>.<name>.title')}</Text>
    </Box>
  );
};

export default React.memo(<Name>Screen);
```

Export from `src/features/<feature>/screens/index.ts`.
Remind user to register the route in `routes.ts` and `routes.types.ts`.

---

### `component <name>`

Read `src/ui/components/` for existing component patterns first.

Create `src/ui/components/<name>.tsx`:

```typescript
import React, { useCallback } from 'react';
import { createBox, createText, useTheme } from '@shopify/restyle';
import type { Theme } from '#ui/style/theme';

const Box = createBox<Theme>();
const TextComponent = createText<Theme>();

export interface <Name>Props {
  // define props
  onPress?: () => void;
  disabled?: boolean;
}

const _<Name> = ({ onPress, disabled = false }: <Name>Props) => {
  const theme = useTheme<Theme>();

  const handlePress = useCallback(() => {
    if (!disabled && onPress) {
      onPress();
    }
  }, [onPress, disabled]);

  return (
    <Box
      backgroundColor="surface"
      padding="md"
      borderRadius="md"
      opacity={disabled ? 0.5 : 1}
    >
      <TextComponent variant="body" color="textPrimary">
        {/* content */}
      </TextComponent>
    </Box>
  );
};

export const <Name> = React.memo(_<Name>);
```

Export from `src/ui/components/index.ts` (add the named export).

---

### `hook <name>`

Ask: "Is this hook feature-scoped or shared across features?"

**Feature-scoped** → `src/features/<feature>/hooks/use-<name>.ts`
**Shared** → `src/ui/hooks/use-<name>.ts`

Template:
```typescript
import { useState, useCallback, useEffect } from 'react';

export interface Use<Name>Options {
  // options
}

export interface Use<Name>Return {
  // return shape
  isLoading: boolean;
  error: string | null;
}

export const use<Name> = (options?: Use<Name>Options): Use<Name>Return => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return {
    isLoading,
    error,
  };
};
```

---

### `slice <feature>`

Read the existing feature's `types/index.ts` first to know the state shape.

Create `src/features/<feature>/store/<feature>.slice.ts` — follow the same template as in `feature` command above, adapted to the existing types.

Remind user to register the reducer in `src/store/reducers.ts`.

---

### `endpoint <feature> <name>`

Read `src/features/<feature>/types/index.ts` first.

Create or append to `src/features/<feature>/api/<feature>.api.ts`:

```typescript
// Inject into existing api variable, or create new injectEndpoints call
const <feature>Api = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    <name>: builder.query<ResponseType, RequestType>({
      query: (arg) => `/endpoint/${arg}`,
      providesTags: ['<TagType>'],
    }),
  }),
});

export const { use<Name>Query } = <feature>Api;
```

---

### `schema <name>`

Create `src/schemas/<name>.schema.ts`:

```typescript
import { z } from 'zod';

export const <name>Schema = z.object({
  id: z.string().uuid(),
  // add fields
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type <Name> = z.infer<typeof <name>Schema>;

export const create<Name>Schema = <name>Schema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Create<Name> = z.infer<typeof create<Name>Schema>;
```

---

## Step 4: Post-generation checklist

After generating any code, output this checklist with only the items relevant to what was generated:

```
Generated: <list of files created/modified>

Checklist:
[ ] Run `yarn lint:fix` to auto-format generated files
[ ] Add reducer to src/store/reducers.ts (if new slice)
[ ] Add tag type to src/services/api/api.ts tagTypes (if new entity)
[ ] Register route in src/navigation/routes.ts (if new screen)
[ ] Add route type to src/navigation/routes.types.ts (if new screen)
[ ] Add translation keys to src/locales/en.json (if new screen/component)
[ ] Add translation keys to src/locales/fr.json
[ ] Write tests in __tests__/ next to the new file
```

---

## Hard constraints (never violate)

- No `StyleSheet.create()` — Restyle only
- No inline styles: `style={{ ... }}` — use Restyle Box props
- No hardcoded values: `padding={16}`, `backgroundColor="#fff"` — use theme tokens
- No `AsyncStorage` — use MMKV or SecureStore
- No `useSelector` / `useDispatch` — use `useAppSelector` / `useAppDispatch`
- No `FlatList` — use `FlashList` with `estimatedItemSize`
- No cross-feature imports — features only import from `#services/`, `#ui/`, `#utils/`, `#store/`
- No `any` in TypeScript — explicit types always
- No hardcoded strings in JSX — `t('key')` always
- No missing barrel exports — every generated file gets exported from the feature's `index.ts`
