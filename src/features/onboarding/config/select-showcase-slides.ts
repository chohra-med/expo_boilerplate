import type { ShowcaseSlide } from "wireai-onboarding/showcase";

/**
 * select-showcase-slides — turn the user's onboarding answers into the 2-3 showcase
 * slides shown as a PERSONALIZED VALUE BRIDGE right after onboarding completes.
 *
 * ┌─ THE PATTERN (this is the part worth copying) ────────────────────────────────┐
 * │ The user just told you what they want. The moment onboarding ends is the       │
 * │ highest-intent moment in the whole app, so instead of a generic pre-onboarding │
 * │ intro, show only the slides that answer what they asked for, most-relevant     │
 * │ first: "you said you want X → here's how the app does X" (the Duolingo /        │
 * │ Headspace pattern). Keep it to 2-3 slides — a value BRIDGE, not a second        │
 * │ onboarding.                                                                     │
 * └────────────────────────────────────────────────────────────────────────────────┘
 *
 * THIS FILE IS AN EXAMPLE. The mapping below is deliberately simple and matches the
 * three demo slides in `app-showcase.ts`. To adapt it to YOUR app:
 *   1. Replace the `if` signals with YOUR questionnaire's answer keys/values.
 *   2. Replace the pushed ids with YOUR slide ids.
 *   3. Order the rules by priority — the first ids pushed show first.
 * Everything else (the full-deck default, the de-dupe, the cap) you can keep as-is.
 *
 * Answers arrive from the kit as `result.answers`, a `{ questionKey: value }` map
 * where values are natural-language strings the AI captured. This example doesn't
 * depend on any exact question key: it flattens every answer into one lowercase blob
 * and matches on keywords, which is the most forgiving thing to ship in a template.
 * A real app with a fixed questionnaire would usually switch on a known key instead
 * (e.g. `if (answers.goal === "lose_weight") ids.push("tracking")`).
 */
export const selectAppShowcaseSlideIds = (
  answers: Record<string, unknown>
): string[] | undefined => {
  // Everything the user said, lowercased, as one string to keyword-match against.
  const said = Object.values(answers).join(" ").toLowerCase();

  // Push ids in PRIORITY order — the first pushed is shown first.
  const ids: string[] = [];

  // "You want a fast, guided start" → lead with the AI-onboarding slide.
  if (said.includes("onboard") || said.includes("guide") || said.includes("start")) {
    ids.push("ai_onboarding");
  }
  // "You want a lot built for you already" → the batteries-included slide.
  if (said.includes("auth") || said.includes("payment") || said.includes("feature")) {
    ids.push("batteries_included");
  }
  // "You want to move fast / ship an MVP" → the ship-faster slide.
  if (said.includes("fast") || said.includes("ship") || said.includes("mvp")) {
    ids.push("ship_faster");
  }

  // Nothing matched → return undefined so the caller shows the FULL deck. This is the
  // safe default whenever answers are thin, or you're on the no-AI / static fallback
  // path where there are no answers to personalize from.
  if (ids.length === 0) return undefined;

  // De-dupe (preserving order) and cap at 3 — a bridge, not a re-onboarding.
  return [...new Set(ids)].slice(0, 3);
};

/**
 * Filter + order a slide catalog by a list of ids. Same contract as the kit's
 * `selectTourSteps` / `selectShowcaseSlides`: no selection → catalog unchanged;
 * with a selection → only the listed ids, in that order, unknown ids skipped and
 * duplicates ignored.
 *
 * TODO: swap this for `selectShowcaseSlides` imported from `wireai-onboarding/showcase`
 * on the next kit bump — the helper ships in the kit but the pinned 0.2.1 here doesn't
 * export it yet, so we inline the identical body to teach the pattern today.
 */
export const selectShowcaseSlides = <T extends { id: string }>(
  catalog: T[],
  selection?: string[]
): T[] => {
  if (!selection) return catalog;

  const byId = new Map(catalog.map((item) => [item.id, item]));
  const seen = new Set<string>();
  const ordered: T[] = [];
  for (const id of selection) {
    if (seen.has(id)) continue;
    seen.add(id);
    const item = byId.get(id);
    if (item) ordered.push(item);
  }
  return ordered;
};

/**
 * Convenience the screen actually calls: given the full showcase slides and the
 * onboarding answers, return the personalized subset (full deck when answers are thin).
 */
export const selectAppShowcaseSlides = (
  slides: ShowcaseSlide[],
  answers: Record<string, unknown>
): ShowcaseSlide[] => selectShowcaseSlides(slides, selectAppShowcaseSlideIds(answers));
