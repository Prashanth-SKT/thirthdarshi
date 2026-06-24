module.exports = {
  ...require('react-native/jest-preset'),
  setupFiles: [
    ...require('react-native/jest-preset').setupFiles,
    '<rootDir>/jest.setup.js',
  ],
};
