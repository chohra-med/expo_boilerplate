import type { ShowcaseSlide } from "wireai-onboarding/showcase";
import {
  selectAppShowcaseSlideIds,
  selectAppShowcaseSlides,
  selectShowcaseSlides,
} from "./select-showcase-slides";

const deck: ShowcaseSlide[] = [
  { id: "ai_onboarding", title: "a", description: "" },
  { id: "batteries_included", title: "b", description: "" },
  { id: "ship_faster", title: "c", description: "" },
];

describe("selectAppShowcaseSlideIds", () => {
  it("returns undefined when no answer matches a slide signal (→ full deck)", () => {
    expect(selectAppShowcaseSlideIds({ q1: "hello there" })).toBeUndefined();
  });

  it("returns undefined for empty answers (→ full deck)", () => {
    expect(selectAppShowcaseSlideIds({})).toBeUndefined();
  });

  it("maps an answer to the slide it speaks to", () => {
    expect(selectAppShowcaseSlideIds({ goal: "I want to ship an MVP fast" })).toEqual([
      "ship_faster",
    ]);
  });

  it("keeps rule (priority) order and caps at 3", () => {
    const ids = selectAppShowcaseSlideIds({
      a: "guide me to start",
      b: "I need auth and payment features",
      c: "so I can ship fast",
    });
    expect(ids).toEqual(["ai_onboarding", "batteries_included", "ship_faster"]);
  });
});

describe("selectShowcaseSlides (inline mirror of the kit helper)", () => {
  it("returns the catalog unchanged when selection is absent", () => {
    expect(selectShowcaseSlides(deck)).toBe(deck);
  });

  it("filters + orders by the selection, skipping unknown and duplicate ids", () => {
    const out = selectShowcaseSlides(deck, ["ship_faster", "nope", "ai_onboarding", "ship_faster"]);
    expect(out.map((s) => s.id)).toEqual(["ship_faster", "ai_onboarding"]);
  });
});

describe("selectAppShowcaseSlides", () => {
  it("returns the full deck when answers are thin", () => {
    expect(selectAppShowcaseSlides(deck, {})).toEqual(deck);
  });

  it("returns only the personalized subset when answers match", () => {
    const out = selectAppShowcaseSlides(deck, { goal: "guide me through the start" });
    expect(out.map((s) => s.id)).toEqual(["ai_onboarding"]);
  });
});
