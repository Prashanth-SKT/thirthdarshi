/**
 * @format
 */

import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

jest.mock('../screens/InstructionScreen', () => {
  const React = require('react');
  return () => React.createElement(React.Fragment, null, null);
});
jest.mock('../screens/OnboardingScreen', () => {
  const React = require('react');
  return () => React.createElement(React.Fragment, null, null);
});
jest.mock('../screens/LanguageContext', () => ({
  LanguageProvider: ({ children }) => children,
}));
jest.mock('../screens/LoginScreen', () => {
  const React = require('react');
  return () => React.createElement(React.Fragment, null, null);
});
jest.mock('../screens/SignUpScreen', () => {
  const React = require('react');
  return () => React.createElement(React.Fragment, null, null);
});
jest.mock('../screens/SuccessScreen', () => {
  const React = require('react');
  return () => React.createElement(React.Fragment, null, null);
});
jest.mock('../screens/LanguageSelectionScreen', () => {
  const React = require('react');
  return () => React.createElement(React.Fragment, null, null);
});
jest.mock('../screens/TempleSearchScreen', () => {
  const React = require('react');
  return () => React.createElement(React.Fragment, null, null);
});
jest.mock('../screens/TempleFilterScreen', () => {
  const React = require('react');
  return () => React.createElement(React.Fragment, null, null);
});
jest.mock('../screens/NavigationScreen', () => {
  const React = require('react');
  return () => React.createElement(React.Fragment, null, null);
});
jest.mock('../screens/TeluguDisplayScreen', () => {
  const React = require('react');
  return () => React.createElement(React.Fragment, null, null);
});
jest.mock('../screens/TempleDetailsScreen', () => {
  const React = require('react');
  return () => React.createElement(React.Fragment, null, null);
});
jest.mock('../screens/TermsAndConditionsScreen', () => {
  const React = require('react');
  return () => React.createElement(React.Fragment, null, null);
});
jest.mock('../screens/NetworkCheck', () => {
  const React = require('react');
  return ({ children }) => React.createElement(React.Fragment, null, children);
});
jest.mock('../screens/TempleAudioContext', () => {
  const React = require('react');
  return {
    TempleAudioProvider: ({ children }) =>
      React.createElement(React.Fragment, null, children),
  };
});

import App from '../App';

it('renders correctly', () => {
  renderer.create(<App />);
});
