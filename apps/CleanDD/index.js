// index.js
import { AppRegistry } from 'react-native';

// Import Firebase config FIRST to initialize it
import './firebase.config';

// Then import your App
import App from './App';
import { name as appName } from './app.json';

// Register the main application component
AppRegistry.registerComponent(appName, () => App);