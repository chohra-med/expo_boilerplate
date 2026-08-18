/**
 * Wire Provider
 *
 * @description The single Wire AI provider composition, mounted ONCE near the app root. It
 * layers the kit's always-on capabilities in the order they gate each other:
 *
 *   WireFeaturesProvider   ← outermost: the per-module kill switches every surface below reads
 *     └ IconRegistryProvider  ← the host's icon overrides for kit-rendered cards
 *         └ children
 *
 * Both layers are inert without configuration. `WireFeaturesProvider` with NO config never
 * fetches, and `useResolvedFeatures` falls back to the all-on defaults, so the kill switches
 * fail OPEN — a control-plane outage can never dark the app. `IconRegistryProvider` with no
 * registry serves one shared empty object and every icon falls through to `@expo/vector-icons`,
 * then to no icon at all.
 *
 * ⚠️ Why "one fetch for the whole tree" matters: without this provider, EVERY gated surface
 * (coachmarks / showcase / review / questionnaire) lazily fetches its own copy of the flags.
 * Mounting it here collapses that to one request per app open.
 *
 * @inventory See src/ui/README.md for full inventory
 *
 * @example
 * ```tsx
 * import { WireProvider } from '#root/ui/providers/wire-provider';
 *
 * <WireProvider featuresConfig={getWireFeaturesConfig(storage)} icons={{ logo: <Brand /> }}>
 *   <AppContent />
 * </WireProvider>
 * ```
 */
import {
  IconRegistryProvider,
  type WireFeaturesConfig,
  WireFeaturesProvider,
  type WireIconRegistry,
} from "@wireai/activation";
import React from "react";

export interface WireProviderProps {
  /**
   * Tenant creds for the kill switches. Pass `undefined` (the value the shared config helper
   * returns with no Wire env) and the provider NEVER fetches — flags resolve to the all-on
   * defaults and every gated surface behaves exactly as it does with no Wire integration.
   */
  featuresConfig?: WireFeaturesConfig;
  /**
   * Host icon overrides: name → node. Lets an app ship brand artwork the kit never imports, and
   * lets it render kit icons WITHOUT `@expo/vector-icons` installed at all.
   */
  icons?: WireIconRegistry;
  children: React.ReactNode;
}

const _WireProvider: React.FC<WireProviderProps> = ({ featuresConfig, icons, children }) => {
  return (
    <WireFeaturesProvider config={featuresConfig}>
      <IconRegistryProvider registry={icons}>{children}</IconRegistryProvider>
    </WireFeaturesProvider>
  );
};

export const WireProvider = React.memo(_WireProvider);
