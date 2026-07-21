const { getDefaultConfig } = require('expo/metro-config');
const { withWireOnboarding } = require('@wireai/activation/metro');

const config = getDefaultConfig(__dirname);

// Add support for path mapping
config.resolver.alias = {
  '#root': './src',
  '#features': './src/features',
  '#ui': './src/ui',
  '#services': './src/services',
  '#utils': './src/utils',
  '#config': './src/config',
  '#navigation': './src/navigation',
  '#store': './src/store',
};

// ── @wireai/activation (closed-source kit, consumed from npm) ─────────────────
// The kit's `withWireOnboarding` Metro helper (npm mode) non-destructively pins
// single-instance deps (react / react-native / wireai-rn / zod) to THIS app's
// node_modules — two React instances crash RN. The kit's package.json `exports`
// `react-native` condition points Metro at the kit's shipped `src`, so Metro
// still transforms it. This app's `config.resolver.alias` (above) and all other
// defaults are preserved.
module.exports = withWireOnboarding(config);
