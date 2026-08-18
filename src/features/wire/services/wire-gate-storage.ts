import { createMMKV } from "react-native-mmkv";
import { createWireGateStorage, type WireGateStorage } from "#root/services/wire";

/**
 * This app's SYNC gate storage: the shared, app-agnostic semantics bound to MMKV.
 *
 * @description The shared layer owns the FAILURE semantics (fail-closed reads, best-effort
 * writes — see `src/services/wire/wire-gate-storage.ts`); this file owns only the backend
 * choice, because the backend is the one thing the launcher tiers do not agree on. The paid
 * tiers use MMKV (natively synchronous). The public Lite tier cannot: MMKV does not load under
 * Expo Go, so it binds an AsyncStorage-mirroring shim to the same factory instead.
 *
 * One dedicated MMKV instance, kept separate from the redux-persist store and from
 * `wire-onboarding-storage`, so gate bookkeeping can never collide with app state. What lands
 * here is tiny and non-personal: `wire_review_*` and `wire_questionnaire_*` session counters,
 * seen flags and last-shown timestamps.
 *
 * Both gates share ONE instance on purpose. They count the same thing — app-opens on this
 * device — and the kit keys them apart by prefix, so a second instance would just be two
 * counters disagreeing about the same fact.
 */
/**
 * ⚠️ The instance id stays `wire-review-storage`, the name it had when the review gate owned
 * this store privately. Renaming it to match the file would start a KEY ERA: every existing
 * install's `wire_review_*` session counter and once-per-version seen flag lives under the old
 * id, and a rename orphans them all. The blast radius would be small and fail-closed (a delayed
 * prompt, never an ambush) but it would be a silent, avoidable data loss for zero benefit. The
 * id is storage state; the file name is documentation. Do not "tidy" this.
 */
const mmkv = createMMKV({ id: "wire-review-storage" });

export const wireGateStorage: WireGateStorage = createWireGateStorage({
  read: (key: string) => mmkv.getString(key) ?? null,
  write: (key: string, value: string) => mmkv.set(key, value),
});
