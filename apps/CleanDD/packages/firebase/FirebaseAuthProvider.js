import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';

export const initializeFirebaseAuth = async () => {
  try {
    const user = auth().currentUser;
    
    if (user) {
      console.log('✅ User already authenticated:', user.uid);
      return user;
    }

    // Sign in anonymously
    const userCredential = await auth().signInAnonymously();
    console.log('✅ Anonymous sign-in successful:', userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error('❌ Authentication error:', error);
    Alert.alert('Auth Error', 'Failed to initialize app.');
    throw error;
  }
};

export const getCurrentUser = () => {
  return auth().currentUser;
};

export const onAuthStateChanged = (callback) => {
  return auth().onAuthStateChanged(callback);
};
