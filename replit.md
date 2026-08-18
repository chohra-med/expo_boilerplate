# replit.md: context for the Replit Agent

The Replit analogue of `CLAUDE.md` and `AGENTS.md`. Those two are the source. This file repeats
only what an agent working inside a Replit container needs, plus the constraints that are specific
to running this repo on Replit.

## What this project is

AI-first React Native + Expo boilerplate. Feature-first architecture, built so that AI coding tools
produce consistent, predictable code instead of a new idiom every session. Lite (MIT) version of
[AI Mobile Launcher](https://www.aimobilelauncher.com/).

Stack: Expo 55, React Native 0.83.6, React 19, TypeScript strict, Redux Toolkit + RTK Query,
Restyle, MMKV, Reanimated 4, FlashList, Biome, i18next, Zod.

## Read the rules before you write code

The single source of truth for architecture and conventions is `.cursor/rules/`. Those files are
tracked in git, so they are already in your container.

| Topic | File |
|---|---|
| Architecture, feature-first directory structure | `.cursor/rules/app_feature_first_architecture.mdc` |
| Code standards, UI, navigation, Redux, state, testing | `.cursor/rules/app_rules.mdc` |
| Error handling, env vars, accessibility | `.cursor/rules/best_practices.mdc` |
| The non-negotiable principles | `constitution.md` |

Reading them is not optional. Code that skips them looks plausible and still breaks the
architecture the rest of the repo is built on.

## What a Replit container can and cannot do here

It can edit code, run the type-checker, run Biome, run the Jest suite, and start Metro.

It cannot run the app. Replit's Expo path ends in "scan the QR code with Expo Go", and this
boilerplate cannot load in Expo Go. `app.json` declares Expo config plugins, which only take effect
during a native prebuild, and the dependency list carries native modules Expo Go does not bundle:
`@react-native-firebase/app`, `@react-native-firebase/analytics`,
`@react-native-firebase/crashlytics`, `react-native-mmkv`, `react-native-nitro-modules`,
`react-native-purchases`, `react-native-keyboard-controller`. Metro will start. The bundle will
then fail on the phone. Building this app needs a development build, meaning `yarn ios` or
`yarn android` on a machine with Xcode or Android Studio, or an EAS build. A Linux container has
neither.

⛔ Do not "fix" that by ripping the native modules out. Crashlytics, RevenueCat and MMKV are
features people use, not obstacles. The README documents the trade for anyone who wants to make it
on purpose.

## Commands

| Command | What it does |
|---|---|
| `yarn install --frozen-lockfile` | Install from the lockfile |
| `yarn start` | Start the Expo dev server (Metro). This is what the Run button runs |
| `yarn type:check` | `tsc --noEmit`, strict |
| `yarn lint:check` | Biome |
| `yarn test:ci` | Jest with coverage |
| `yarn validate` | type:check, lint:check and test:ci together. Run it before you call anything done |

## House rules

Yarn, never npm. `yarn.lock` is the committed lockfile, and an `npm install` here leaves a second
lockfile and a different tree behind.

Biome, not ESLint and not Prettier. The config is `biome.jsonc`. Do not add a competing formatter.

TypeScript is strict and `any` is not an escape hatch. The signature is the contract.

Every dependency needs a one-line justification. If you cannot write that line, do not add the
package. Prefer what is already installed.

Keep the diff surgical. Touch what the task requires, and leave anything else as a noted follow-up
rather than an unrequested cleanup.

Non-trivial logic gets a failing test first. Tests live next to the code they cover.

This repo is public and MIT. No API key, no tenant id, no customer name, no internal URL in
anything you write. Placeholders only.

## Secrets

Replit copies Secrets into a remix as names only. Values never travel, which is the behavior you
want here. Set your own values in the Secrets pane.

Every variable below is optional. With none of them set the app still boots: onboarding renders the
built-in static questionnaire and the paywall degrades gracefully.

| Name | Read by |
|---|---|
| `EXPO_PUBLIC_WIREAI_API_KEY` | `@wireai/activation`, turns on backend-driven onboarding |
| `EXPO_PUBLIC_WIREAI_APP_ID` | `@wireai/activation` |
| `EXPO_PUBLIC_WIREAI_SERVER_URL` | `@wireai/activation` |
| `EXPO_PUBLIC_REVENUECAT_IOS_API_KEY` | the RevenueCat service |
| `EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY` | the RevenueCat service |
| `EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID` | the RevenueCat service, defaults to `premium` |

⛔ Never commit a value. `.gitignore` excludes `.env*` and tracks only `.env.example`. Firebase is
the odd one out and it is not an env var at all: it needs `google-services.json` and
`GoogleService-Info.plist`, two files that have no business in a public repo.
