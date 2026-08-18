/**
 * Wire AI per-app mounts.
 *
 * @description The thin, NOT-synced half of the Wire integration: everything that needs this
 * app's native modules, screens or copy. The app-agnostic half lives in `#root/services/wire`
 * and `#root/ui/providers/wire-provider`, and is the layer shared across the launcher tiers.
 *
 * See the feature README for the mount map.
 */
export { WireDemoOnboarding } from "./components/wire-demo-onboarding";
export { WireQuestionnaireGate } from "./components/wire-questionnaire-gate";
export { getWirePermissionScreens } from "./config/wire-permission-screens";
export { wireGateStorage } from "./services/wire-gate-storage";
