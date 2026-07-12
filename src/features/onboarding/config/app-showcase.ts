import type { ShowcaseConfig } from "@wireai/activation/showcase";

/**
 * app-showcase.ts — the pre-onboarding "app intro" slides.
 *
 * A small, declarative `ShowcaseConfig` shown ONCE before the Wire AI onboarding
 * starts (see `wire-onboarding-screen.tsx`). The kit maps this onto the
 * `@blazejkustra/react-native-onboarding` package, bakes in the onboarding theme
 * colors, and gates it once through the shared coachmark storage
 * (`wire_showcase_<id>_seen`). Swap the copy + images for your own product story.
 *
 * Images reuse the boilerplate's bundled brand assets so a fresh clone renders
 * something real with zero extra files — replace them with dedicated slide art.
 */
export const APP_SHOWCASE: ShowcaseConfig = {
  id: "boilerplate_app_intro",
  introPanel: {
    title: "Welcome",
    subtitle: "A quick look at what ships in the box.",
    button: "Show me",
  },
  slides: [
    {
      id: "ai_onboarding",
      title: "AI-native onboarding",
      description:
        "Personalized, backend-driven onboarding out of the box — with a static fallback.",
      image: require("../../../../assets/icon-light.png"),
      gesture: "tap",
    },
    {
      id: "batteries_included",
      title: "Batteries included",
      description: "Auth, payments, analytics, i18n, and theming — all wired and fully typed.",
      image: require("../../../../assets/splash-icon-light.png"),
    },
    {
      id: "ship_faster",
      title: "Ship faster",
      description: "A clean, feature-first architecture you extend instead of fight.",
      image: require("../../../../assets/adaptive-icon.png"),
    },
  ],
};
