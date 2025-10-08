const { getDefaultConfig } = require('expo/metro-config');

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

module.exports = config;
