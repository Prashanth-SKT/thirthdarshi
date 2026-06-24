jest.mock('@react-native-firebase/app', () => ({}));

jest.mock('@react-native-firebase/auth', () => {
  const authFn = () => ({
    onAuthStateChanged: jest.fn((callback) => {
      callback(null);
      return jest.fn();
    }),
  });
  authFn.GoogleAuthProvider = { credential: jest.fn() };
  return authFn;
});

jest.mock('@react-native-firebase/firestore', () => () => ({
  collection: jest.fn(),
}));

jest.mock('@googlemaps/react-native-navigation-sdk', () => ({
  NavigationProvider: ({ children }) => children,
  TaskRemovedBehavior: { QUIT_SERVICE: 'QUIT_SERVICE' },
}));

jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(() => jest.fn()),
}));

jest.mock('@react-navigation/native', () => {
  const React = require('react');
  return {
    NavigationContainer: ({ children }) =>
      React.createElement(React.Fragment, null, children),
  };
});

jest.mock('@react-navigation/native-stack', () => {
  const React = require('react');
  return {
    createNativeStackNavigator: () => ({
      Navigator: ({ children }) =>
        React.createElement(React.Fragment, null, children),
      Screen: () => null,
    }),
  };
});
