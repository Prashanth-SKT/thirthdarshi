import React, { useState } from 'react';
import { devLog } from '../utils/devLog';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import loginImage from '../assets/vishnu_deities.png';
import { isAdminEmail } from '../config/adminConfig';

// Configure Google Signin
GoogleSignin.configure({
  webClientId: '504773176335-3qgua7sjaohgnvhjlu65e3la631skck5.apps.googleusercontent.com',
});

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Validation Error', 'Please enter both email and password.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters.');
      return;
    }

    if (isAdminEmail(email)) {
      Alert.alert(
        'Web admin only',
        'Administrator access is on the web admin panel, not this mobile app. Use a regular user account to log in here.'
      );
      return;
    }
    
    try {
      setLoading(true);
      
      // ✅ JUST SIGN IN - LET APP.JS HANDLE NAVIGATION
      await auth().signInWithEmailAndPassword(email.trim(), password);
      
      // ✅ No manual navigation - App.js will automatically navigate based on auth state
      devLog('✅ Login successful');
    } catch (e) {
      let msg = 'Login failed. Please try again.';
      if (e?.code === 'auth/user-not-found') {
        msg = 'No account found for that email.';
      } else if (e?.code === 'auth/wrong-password') {
        msg = 'Wrong password.';
      } else if (e?.code === 'auth/invalid-email') {
        msg = 'Invalid email format.';
      } else if (e?.code === 'auth/too-many-requests') {
        msg = 'Too many failed login attempts. Try again later.';
      } else if (e?.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password.';
      }
      Alert.alert('Login Error', msg);
      console.error('Login error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices();
      
      // ✅ Get user info
      const userInfo = await GoogleSignin.signIn();
      const userEmail = userInfo.data?.user?.email || userInfo.user?.email;

      if (isAdminEmail(userEmail)) {
        await GoogleSignin.signOut();
        Alert.alert(
          'Web admin only',
          'Administrator access is on the web admin panel, not this mobile app.'
        );
        return;
      }

      const { idToken } = await GoogleSignin.getTokens();
      
      // ✅ USE NEW MODULAR API (no deprecation warning)
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      
      // ✅ JUST SIGN IN - LET APP.JS HANDLE NAVIGATION
      await auth().signInWithCredential(googleCredential);
      
      // ✅ No manual navigation - App.js will automatically navigate based on auth state
      devLog('✅ Google sign-in successful');
    } catch (error) {
      if (error.code === 'SIGN_IN_CANCELLED') {
        devLog('User cancelled the sign-in');
        return;
      }
      console.error('Google Sign-In error:', error);
      Alert.alert('Error', 'Google sign-in failed. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text style={styles.title}>LOGIN</Text>
          <Image source={loginImage} style={styles.image} />

          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              placeholderTextColor="#666"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword(!showPassword)}>
              <Text style={{ fontSize: 20, color: '#667085' }}>{showPassword ? '🔓' : '🔒'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginText}>{loading ? 'LOGGING IN...' : 'LOG IN'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.googleBtn} onPress={handleGoogleSignIn} disabled={loading}>
            <Text style={styles.googleBtnTxt}>Sign in with Google</Text>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', marginTop: 24 }}>
            <Text style={styles.signupPrompt}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.push('SignUp')} disabled={loading}>
              <Text style={styles.signupLink}>Sign up</Text>
            </TouchableOpacity>
          </View>

          {/* Terms and Conditions Link */}
          <TouchableOpacity 
            onPress={() => navigation.navigate('TermsAndConditions')} 
            style={styles.termsContainer}
          >
            <Text style={styles.termsText}>Terms & Conditions</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffaf0',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 24,
    paddingTop: 60,
  },
  image: {
    width: 230,
    height: 230,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#002244',
  },
  input: {
    width: '100%',
    backgroundColor: '#f5f7fa',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d0d5dd',
    fontSize: 16,
    marginBottom: 14,
    color: '#000',
  },
  passwordWrapper: {
    width: '100%',
    position: 'relative',
    marginBottom: 0,
  },
  passwordInput: {
    width: '100%',
    backgroundColor: '#f5f7fa',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d0d5dd',
    fontSize: 16,
    color: '#000',
    paddingRight: 40,
  },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    height: '100%',
  },
  loginBtn: {
    backgroundColor: '#002244',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 40,
    alignItems: 'center',
    marginTop: 28,
  },
  loginBtnDisabled: {
    backgroundColor: '#555',
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  googleBtn: {
    marginTop: 14,
    width: '100%',
    paddingVertical: 16,
    backgroundColor: '#db4437',
    borderRadius: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  googleBtnTxt: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  signupPrompt: {
    fontSize: 14,
    color: '#333',
  },
  signupLink: {
    fontWeight: 'bold',
    color: '#002244',
  },
  termsContainer: {
    marginTop: 20,
    paddingVertical: 8,
  },
  termsText: {
    fontSize: 13,
    color: '#0066cc',
    textDecorationLine: 'underline',
  },
});