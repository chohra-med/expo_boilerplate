# Boilerplate Fixes & Improvements

## v0.1 (2026-07-08)

### 1. Sync generic fixes from Standard (button)
**Date**: 2026-07-08
**Category**: UI
**Status**: ✅ Complete

#### Problem
A batch of reusable fixes had landed in the Standard boilerplate (the AIM-L source of truth) and needed porting into this LITE fork. Most of that batch does not apply here — this fork is login-only and lacks the surfaces those fixes touched.

#### Solution Implemented
**Files:** `src/ui/components/button.tsx`.

- **Button `destructive` prop** — added `destructive?: boolean`. When true, `primary` fills with `error` (ink stays `textInverse`), `outline` borders with `error`, and the flat variants render `error`-colored text. Adapted to this fork's tokens (`primary`/`textInverse`/`error`).

#### Skipped (feature absent in this LITE fork)
- **Toast safe-area + truncation** — no `swipeable-toast` component (the `toast-provider` here is a plain wrapper with no `SwipeableToast` and no `width` prop).
- **Google sign-in hardening** — no `@react-native-google-signin` dependency and no `signInWithGoogle` in the auth service.
- **`detectSessionInUrl: false`** — no Supabase client in `src` (auth goes through `auth.api.ts` against the backend).
- **`updateProfile` profiles-table sync** — no gamification / leaderboard / `profiles` table.
- **Logout confirmation Dialog** — no `Dialog` component; the settings logout button stays a plain `<Button>`.
- **Avatar usage** — no `Avatar` component.

#### Verification
`npx tsc --noEmit` clean · `npx jest` → 1 suite, 4 passed, 0 failed · `npx biome check --write src/ui/components/button.tsx` (no fixes needed).
