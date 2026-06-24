const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const config = {
  project: {
    ios: {},
    android: {},
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  watchman: false,
  resolver: {
    sourceExts: ['jsx', 'js', 'ts', 'tsx', 'json'],
    blacklistRE: /node_modules\/.*\/build\/.*/,
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
