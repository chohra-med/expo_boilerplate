# Running AI Mobile Launcher (Lite) on Emergent

[Emergent](https://emergent.sh) ships a **Mobile Agent** that builds Expo (React Native) apps. This
template is Expo, so it imports cleanly. What follows is the exact path in, plus a prompt that wires
Wire AI onboarding and analytics into whatever the agent builds on top.

> Verified 2026-08-19 against Emergent's own docs and a live Wire AI signup. Emergent moves fast; if a
> step below has drifted, the code in this repo is the source of truth, not this file.

## 1. Get this repo into Emergent

There is **no deep link** (Replit has `replit.com/github/<url>`, Emergent does not). It is UI only:

1. Profile icon → **Connect GitHub** → authorize and grant repo access
2. Start a new task → the **GitHub button in chat** → **Pull from GitHub**
3. Select this repository and branch
4. Push your work back with **Save to GitHub**

⚠️ The Mobile Agent is **paid plans only**, not on the free tier. Its default stack is Expo on the
front end with FastAPI and MongoDB behind it, so let it own the backend and let this template own the
app. Do not ask it to move the app onto a different backend just to match a tutorial.

## 2. Get a Wire AI key (about a minute, no account, no card)

```bash
curl -X POST https://getwireai.com/api/signup \
  -H 'Content-Type: application/json' \
  -d '{"app_name":"my-app"}'
```

You get back `app_id`, `api_key` and `server_url`. Keep them; the prompt in step 3 needs all three.

**What that key actually gives you, stated honestly:** a live, scripted onboarding flow that renders
real cards, plus analytics, costing zero model calls. It works the moment you wire it in.
**AI-generated adaptive onboarding is switched on per tenant and is not automatic on signup.** If you
want the AI loop (four variants per stage, run live, winner kept), email malik@getwireai.com and ask
for it on your `app_id`.

## 3. Paste this into Emergent's chat

Emergent has no `AGENTS.md` or `.cursorrules` convention to read, so everything the agent needs has to
be in the prompt. Fill in the three values at the top first, then paste the whole block.

```
You are adding Wire AI onboarding and analytics to THIS Expo (React Native) app. Do it end to end,
match the app's existing conventions, and leave it type-checking green.

MY VALUES:
- WIREAI_SERVER_URL: <server_url from the signup response>
- WIREAI_API_KEY:    <api_key from the signup response>
- APP_ID:            <app_id from the signup response>

CONTEXT YOU MUST RESPECT:
- The app front end is Expo. Keep it that way.
- If this project has a FastAPI + MongoDB backend, that backend is where ONBOARDING ANSWERS GET
  PERSISTED. Wire AI is NOT a datastore and must NOT be wired into the Mongo layer. It runs the
  onboarding conversation and emits analytics; your backend keeps the user's profile.
- Read the package docs before writing code: README.md, llms.txt and AGENTS.md inside
  node_modules/@wireai/activation after install.

STEPS, in order. Stop and ask if one of my conventions is ambiguous:
1. Detect conventions: navigation library, where first-run/signup lives, env-var typing, the
   profile-update path, theme tokens, path aliases.
2. Install `@wireai/activation` and `wireai-rn` with this project's package manager. react and
   react-native are already peers.
3. metro.config.js: `module.exports = withWireOnboarding(getDefaultConfig(__dirname))` from
   `@wireai/activation/metro`, preserving any existing config. This pins ONE copy of
   react/react-native/wireai-rn/zod. Do NOT skip it, and run `expo start -c` once afterwards.
4. Env: add EXPO_PUBLIC_WIREAI_API_KEY, EXPO_PUBLIC_WIREAI_SERVER_URL and EXPO_PUBLIC_WIREAI_APP_ID
   to the env files and the env typing.
5. Theme: `themeFromBrand({ primary: "<brand color>" })`, matching existing dark/light.
6. Screen: render
   `<WireOnboarding config={wireConfigFromEnv({ appId: APP_ID })} theme={...}
      onComplete={persist} fallbackFlow={<TheExistingStaticOnboarding/>} onEvent={logEvent} />`
   - `persist` writes ALL of `result.answers` through the normal profile-update path (use
     `deriveAnswers(result.raw)` to fill gaps). Do not re-ask anything a dedicated screen owns.
   - `fallbackFlow` MUST be the existing static onboarding, so a backend error or timeout degrades
     instead of dead-ending. This template already ships one. Use it.
7. Lifecycle, do NOT skip: mount `useLifecycleEvents(config, { deviceKey, sessionCount, userId })`
   ONCE at the app root, above the navigator, before anything else touches analytics, and pass
   `config.storage`. It is the only path that emits `app.first_open`, and it registers the per-open
   session id every other surface correlates against.
8. The join key: pass `userContext={activationJoinContext(deviceKey)}`. If the app owns no stable
   device id, pass a working `storage` and leave `userContext` alone so the kit injects the same id
   the analytics side stamps. Do NOT hand-build it. Leaving both out makes the activation funnel read
   zero forever and reports no error.
9. Verify: type-check, then test the backend-error path. Behind an `if (__DEV__)` guard call
   `wireDoctor({ target: { serverUrl: WIREAI_SERVER_URL, apiKey: WIREAI_API_KEY }, storage })` from
   `@wireai/activation/analytics` once at the app root and log the report. Every check must come back
   `ok`, because `/v1/events` answers 200 for a batch it discards. Remove or keep it dev-gated once
   green.

Report back: files changed with path:line, the type-check result, and anything you could not infer.
```

## 4. Gotchas worth knowing before you start

- **Emergent has a 200k-token context limit** and its "forking" feature exists to continue a chat past
  it. Wire the onboarding in its own task rather than at the end of a long build session.
- **Kit 0.14.3 or newer matters here.** Older versions statically imported optional peers such as
  `react-native-reanimated` and `expo-blur`, which fails to resolve in a constrained sandbox and looks
  like a broken package. 0.14.3 made every optional peer a guarded lazy require.
- **`.emergent/emergent.yml` and `.emergent/summary.txt`** are files Emergent generates into your repo.
  Treat them as its output, not as configuration you author.
