module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '#root': './src',
            '#features': './src/features',
            '#ui': './src/ui',
            '#services': './src/services',
            '#utils': './src/utils',
            '#config': './src/config',
            '#navigation': './src/navigation',
            '#store': './src/store',
          },
        },
      ],
      'react-native-worklets/plugin',
    ],
  };
};
