# Wire AI — shared integration layer

## Overview

The app-agnostic half of the `@wireai/activation` integration. Everything here imports
`@wireai/activation` **and nothing else** — no MMKV, no `expo-constants`, no
`expo-notifications`, no `react-native-purchases`.

That constraint is not stylistic. This folder is part of the layer `launcher-sync` pushes from
Standard (the source of truth) into the other launcher tiers, and the tiers do not ship the same
native modules. The public Lite tier in particular has no MMKV (it must load under Expo Go), no
notifications module and no purchase SDK. A single native import here would break it on copy.

**Anything native is injected by the per-app mount** (`src/features/wire/` in this repo).

## How it works

### The one env read

`wire-config.ts` is the only place in the app that reads `EXPO_PUBLIC_WIREAI_*`. It resolves the
transport **once per process** and memoizes it, including the `null` case.

That memo is load-bearing. The kit's `wireConfigFromEnv()` emits a dev-only `console.warn`
naming the missing variable on **every call**, with no once-latch of its own — and
`isOnboardingEnabled()` calls it a second time internally. Before this module, three call sites
ran that pair on every render, so a fresh clone with no keys paid a growing pile of identical
warnings. One read bounds it to one honest line.

⚠️ Never read `process.env.EXPO_PUBLIC_*` through an alias or computed access. Expo's
`inline-env-vars` babel plugin only inlines **static** member expressions, so an aliased read
works in Jest (real Node env) and is `undefined` on a real device.

### The files

| File | What it owns |
|---|---|
| `wire-config.ts` | The single env read + every derived config (`getWireConfig`, `isWireEnabled`, `getWireTarget`, `getWireFeaturesConfig`). |
| `wire-gate-storage.ts` | `createWireGateStorage(backend)` — hardens any **sync** KV backend into the store the review + questionnaire gates count with. Fail-closed reads, best-effort writes. |
| `wire-purchase-funnel.ts` | `createWirePurchaseFunnel(...)` — the RevenueCat → Wire bridge, **report-only**, or a structural no-op when Wire is off. |
| `wire-permission-screens.ts` | `buildWirePermissionScreens(...)` — mid-flow OS-permission priming screens, from host-injected handlers. |

The React half lives next door, for the same shared-layer reason:
`src/ui/providers/wire-provider.tsx` and `src/ui/hooks/use-wire-questionnaire-gate.ts`.

### Two failure semantics that look inconsistent and are not

- `wire-gate-storage.ts` **swallows** failures. It feeds a session counter behind a fail-closed
  `minSessions` floor, so a failed read keeps the gate **shut** — the worst case is a prompt
  that never fires.
- `src/features/onboarding/services/wire-onboarding-storage.ts` **rejects** on failure. It feeds
  the kit's device-key durability check, and a swallowed write there tells the kit an id was
  persisted when it was not — which makes the kit mint a fresh device key every launch, cap the
  server's per-device session count at 1, and inflate distinct devices at the same time.

Do not "harmonize" them.

## Usage

```tsx
// Root (src/entrypoints/app.tsx)
const wireFeaturesConfig = getWireFeaturesConfig(wireOnboardingStorage);

<WireProvider featuresConfig={wireFeaturesConfig}>
  <AppContent />
</WireProvider>
```

```ts
// Purchase funnel (src/features/paywall/screens/paywall-screen.tsx)
const wirePurchases = createWirePurchaseFunnel({
  entitlementId: 'pro',
  storage: wireOnboardingStorage,
});
wirePurchases.paywallShown(offering, { variant });
```

## Configuration

| Variable | Required | Effect |
|---|---|---|
| `EXPO_PUBLIC_WIREAI_API_KEY` | yes | Tenant key. Missing → the whole integration is off. |
| `EXPO_PUBLIC_WIREAI_SERVER_URL` | yes | Wire server base URL. Missing → the whole integration is off. |
| `EXPO_PUBLIC_WIREAI_APP_ID` | no | Namespaces storage + the flags cache. Defaults to `"default"`. |

**With none of them set, every capability degrades to a clean no-op.** That is the state a fresh
clone of this boilerplate ships in, and it is covered by
`src/services/wire/__tests__/wire-no-env-inert.test.tsx`.

## Troubleshooting

**"The review / questionnaire gate never fires."** Most likely correct: both floors are
fail-closed and count app-opens, and an app-open is a foreground after 30+ minutes backgrounded,
not a JS process start. Check the counter in the `wire-review-storage` MMKV instance. If the kit
logged "the gate has no sync storage", the `storage` prop was dropped.

**"Nothing reaches the server."** `getWireConfig()` is `null`. The kit prints which variable is
missing, once, at startup in a dev build.

**"A dashboard kill switch did nothing."** The flags fail **open** by design and are cached. A
surface with no `WireFeaturesProvider` above it lazily fetches its own copy; make sure the
provider is mounted above it.
