// components/GoogleSignInButton.js
import React, { useEffect } from 'react';
import { devLog } from '../utils/devLog';
import { TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

const GoogleSignInButton = ({ webClientId, onSignIn, onError, style, textStyle }) => {
  useEffect(() => {
    devLog('✅ GoogleSignin configured with:', webClientId);
    GoogleSignin.configure({
      webClientId,
      offlineAccess: true,
    });
  }, [webClientId]);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      onSignIn(userInfo);
    } catch (error) {
      console.error('❌ Google Sign-In Full Error:', JSON.stringify(error, null, 2));

      let message = error.message;
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        message = 'User cancelled login.';
      } else if (error.code === statusCodes.IN_PROGRESS) {
        message = 'Login already in progress.';
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        message = 'Play Services not available.';
      }

      onError ? onError(message) : Alert.alert('Google Sign-In Error', message);
    }
  };

  return (
    <TouchableOpacity style={[styles.button, style]} onPress={signIn} activeOpacity={0.85}>
      <Text style={[styles.label, textStyle]}>Sign Up with Google</Text>
    </TouchableOpacity>
  );
};

export default GoogleSignInButton;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#db4437', // default Google red (can be overridden by style prop)
  },
  label: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
});
