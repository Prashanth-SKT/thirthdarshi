// firebase.config.js - MANUAL INITIALIZATION (Last Resort)
import { initializeApp, getApps, getApp } from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';

// YOUR Firebase configuration from Firebase Console
export const firebaseConfig = {

  apiKey: "AIzaSyAfteiR3zdsOAQa9Rzw-R1B-Bwt3JpPNok",
  authDomain: "divyadesams-d6fb6.firebaseapp.com",
  projectId: "divyadesams-d6fb6",
  storageBucket: "divyadesams-d6fb6.firebasestorage.app",
  messagingSenderId: "504773176335",
  appId: "1:504773176335:web:9b18bafb3e38703e51877a",
  measurementId: "G-67ZRG66CZ0"

};



const initFirebase = async () => {
  try {
    const apps = getApps();
    
    if (apps.length === 0) {
      console.log('Manually initializing Firebase...');
      await initializeApp(firebaseConfig);
      console.log('✅ Firebase manually initialized');
    } else {
      console.log('✅ Firebase already initialized');
      const app = getApp();
      console.log('App name:', app.name);
    }
  } catch (error) {
    console.error('❌ Firebase init error:', error.message);
  }
};

// Initialize immediately
initFirebase();

export { getApp, getApps };