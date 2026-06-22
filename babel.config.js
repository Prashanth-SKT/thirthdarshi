module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@utils': './packages/utils',
            '@auth': './packages/auth',
            '@api': './packages/api-client',
            '@config': './packages/config',
          },
        },
      ],
    ],
  };
};
