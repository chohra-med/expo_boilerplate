// `src/config/coachmarks.ts` imports the kit's `@wireai/activation/coachmarks`
// subpath, whose entry eagerly loads the native overlay stack (reanimated +
// expo-blur) — not loadable under the node test env. We're unit-testing the
// APP-owned pieces (the feature-map catalog + the `buildHomeTourSteps` seam), so
// we mock the kit boundary with a faithful `selectTourSteps` mirroring its
// documented contract. The kit's own package tests cover the real implementation.
jest.mock("@wireai/activation/coachmarks", () => ({
  selectTourSteps: <T extends { id: string }>(catalog: T[], selection?: string[]): T[] => {
    if (!selection) return catalog;
    const byId = new Map(catalog.map((step) => [step.id, step]));
    const seen = new Set<string>();
    const out: T[] = [];
    for (const id of selection) {
      if (seen.has(id)) continue;
      seen.add(id);
      const step = byId.get(id);
      if (step) out.push(step);
    }
    return out;
  },
}));

import { buildHomeTourSteps, HOME_COACHMARKS, HOME_TOUR_ID } from "./coachmarks";

describe("HOME_COACHMARKS catalog", () => {
  it("declares a stable, unique id for every feature", () => {
    const ids = HOME_COACHMARKS.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => id.length > 0)).toBe(true);
  });

  it("gives every entry a non-empty message and an owning screen", () => {
    for (const feature of HOME_COACHMARKS) {
      expect(feature.message.length).toBeGreaterThan(0);
      expect(feature.screen.length).toBeGreaterThan(0);
    }
  });

  it("exposes the home tour id used as the gate key + analytics prefix", () => {
    expect(HOME_TOUR_ID).toBe("boilerplate_home_tour");
  });
});

describe("buildHomeTourSteps", () => {
  it("returns the full catalog in declared order when no selection is passed", () => {
    const steps = buildHomeTourSteps();
    expect(steps.map((s) => s.id)).toEqual(HOME_COACHMARKS.map((f) => f.id));
  });

  it("returns only the selected ids, in the selection order (the AI-selection seam)", () => {
    const steps = buildHomeTourSteps(["home_settings", "home_view_todos"]);
    expect(steps.map((s) => s.id)).toEqual(["home_settings", "home_view_todos"]);
  });

  it("skips selection ids that are not in the catalog", () => {
    const steps = buildHomeTourSteps(["home_settings", "does_not_exist"]);
    expect(steps.map((s) => s.id)).toEqual(["home_settings"]);
  });
});
