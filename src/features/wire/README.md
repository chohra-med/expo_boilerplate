# Wire AI — per-app mounts

The thin, app-specific half of the `@wireai/activation` integration. The app-agnostic half — the
one env read, the gate-storage factory, the permission-screen builder, the purchase funnel and the
`WireProvider` — lives in `#root/services/wire` and `#root/ui/providers/wire-provider`. This folder
only holds the pieces that need THIS app's native modules, screens or copy.

**Everything here is env-gated OFF by default.** With no `EXPO_PUBLIC_WIREAI_*` set (a fresh clone
of this template), every surface below is inert: no crash, no network, no console noise. Add a Wire
key to turn the same surfaces on. See `.env.example`.

## Files

| File | What it owns |
|---|---|
| `services/wire-gate-storage.ts` | Binds the shared gate-storage factory to MMKV. The sync counter the questionnaire gate reads during render. |
| `config/wire-permission-screens.ts` | Mid-flow OS-permission priming screens. Ships EMPTY here — this template bundles no permissions module — with a documented injection point. |
| `components/wire-questionnaire-gate.tsx` | The in-app feedback popup, fail-closed behind four gates. |
| `components/wire-demo-onboarding.tsx` | `__DEV__`-only trigger to re-run the onboarding flow for QA. |

## Where each one is mounted

- **Feature flags + icon registry** — `WireProvider` in `src/entrypoints/app.tsx`, outermost of the
  Wire surfaces so the kill switches gate everything below.
- **Questionnaire gate** — `<WireQuestionnaireGate />` on the home screen
  (`src/features/home/screens/home-screen.tsx`).
- **Permission screens** — `getWirePermissionScreens()` passed to `<WireOnboarding>` in
  `src/features/onboarding/screens/wire-onboarding-screen.tsx`.
- **Dev QA trigger** — `<WireDemoOnboarding />` behind `__DEV__` in
  `src/features/settings/screens/main-settings-screen.tsx`.
- **Purchase funnel** — `createWirePurchaseFunnel(...)` in
  `src/features/paywall/screens/paywall-screen.tsx`, reporting the five purchase moments
  (shown → checkout → completed / failed / restored). Report-only: it never decides entitlement.

## Expo Go note

The gate storage here binds MMKV, matching how this repo already does synchronous storage
(`src/services/storage/coachmark-storage.ts`). MMKV does not load under Expo Go — an Expo-Go build
swaps the backend for an AsyncStorage mirror or the shared in-memory store
(`createInMemoryGateStorage`), the one seam that has to change.
