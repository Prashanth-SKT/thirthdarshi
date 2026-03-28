import React, { useState } from 'react';
import {
  Text, TextInput, TouchableOpacity, View, Image,
  KeyboardAvoidingView, Platform, StyleSheet, Alert, ScrollView,
} from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useSignupFlow } from '../App';

import deity from '../assets/supreme_deity.png';
import GoogleSignInButton from './GoogleSignInButton';

const ADMIN_EMAIL = 'admin@example.com';

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPass] = useState('');
  const [loading, setLoad] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const { setShowSuccessScreen } = useSignupFlow();

  const isValidEmail = (e) => /\S+@\S+\.\S+/.test(e);
  const isStrongPass = (p) => p.length >= 6;

  const handleEmailSignUp = async () => {
    if (!name.trim() || !email.trim() || !password) {
      return Alert.alert('Validation', 'Please fill in every field.');
    }
    if (!isValidEmail(email)) return Alert.alert('Validation', 'Enter a valid e-mail.');
    if (!isStrongPass(password)) return Alert.alert('Validation', 'Password must be at least 6 characters.');
    
    if (!acceptedTerms) {
      return Alert.alert('Terms & Conditions', 'Please accept the Terms & Conditions to continue.');
    }

    try {
      setLoad(true);
      
      // ✅ SET FLAG BEFORE CREATING USER (this is the key fix!)
      if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
        setShowSuccessScreen(true);
      }

      const userCredential = await auth().createUserWithEmailAndPassword(
        email.trim(),
        password
      );

      await firestore()
        .collection('users')
        .doc(userCredential.user.uid)
        .set({
          name: name.trim(),
          email: email.trim(),
          createdAt: firestore.FieldValue.serverTimestamp(),
        });

      console.log('✅ User created:', userCredential.user.uid);
      // Flag is already set - App.js will handle navigation automatically
    } catch (e) {
      console.error('Sign up error:', e);
      
      // ❌ RESET FLAG ON ERROR
      setShowSuccessScreen(false);
      
      if (e.code === 'auth/email-already-in-use') {
        Alert.alert('Error', 'Account exists – log in instead.');
      } else if (e.code === 'auth/invalid-email') {
        Alert.alert('Error', 'Invalid e-mail.');
      } else if (e.code === 'auth/weak-password') {
        Alert.alert('Error', 'Password is too weak.');
      } else {
        Alert.alert('Error', 'Sign-up failed. Please try again.');
      }
    } finally {
      setLoad(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!acceptedTerms) {
      return Alert.alert('Terms & Conditions', 'Please accept the Terms & Conditions to continue.');
    }

    try {
      await GoogleSignin.signOut();
      console.log('🔐 Prompting user for account selection...');
      
      // ✅ CORRECT: userInfo.data contains user details
      const userInfo = await GoogleSignin.signIn();
      console.log('✅ User selected account');

      // ✅ Access email from the correct path
      const userEmail = userInfo.data?.user?.email || userInfo.user?.email;
      
      if (!userEmail) {
        throw new Error('Unable to retrieve email from Google account');
      }

      // ✅ SET FLAG BEFORE SIGNIN (check email first)
      if (userEmail.toLowerCase() !== ADMIN_EMAIL) {
        setShowSuccessScreen(true);
      }

      const { idToken } = await GoogleSignin.getTokens();
      // ✅ USE NEW MODULAR API
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(googleCredential);

      const userRef = firestore().collection('users').doc(userCredential.user.uid);
      const docSnap = await userRef.get();

      const isNewUser = !docSnap.exists;

      if (isNewUser) {
        console.log('📦 Storing new user in Firestore...');
        await userRef.set({
          name: userCredential.user.displayName || 'Google User',
          email: userCredential.user.email,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
      } else {
        console.log('🧠 User already exists in Firestore');
      }

      // Flag is already set - App.js will handle navigation automatically
    } catch (error) {
      // ❌ RESET FLAG ON ERROR
      setShowSuccessScreen(false);
      
      if (error.code === 'SIGN_IN_CANCELLED') {
        console.log('User cancelled the sign-in');
        return;
      }
      
      console.error('❌ Google Sign-In error:', error);
      Alert.alert('Error', 'Google sign-in failed. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">
        <Image source={deity} style={s.deity} />
        <Text style={s.title}>Sign Up</Text>

        {/* Name */}
        <View style={s.row}>
          <Text style={s.icon}>👤</Text>
          <TextInput
            style={s.input}
            placeholder="Name"
            placeholderTextColor="#666"
            value={name}
            onChangeText={setName}
            editable={!loading}
          />
        </View>

        {/* Email */}
        <View style={s.row}>
          <Text style={s.icon}>📧</Text>
          <TextInput
            style={s.input}
            placeholder="Email"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
          />
        </View>

        {/* Password with toggle */}
        <View style={s.row}>
          <TextInput
            style={s.input}
            placeholder="Password"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPass}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            editable={!loading}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text style={{ fontSize: 20, color: '#002a4d' }}>
              {showPassword ? '🔓' : '🔒'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Terms and Conditions Checkbox */}
        <TouchableOpacity 
          style={s.termsCheckbox}
          onPress={() => setAcceptedTerms(!acceptedTerms)}
          activeOpacity={0.7}
        >
          <View style={s.checkbox}>
            {acceptedTerms && <Text style={s.checkmark}>✓</Text>}
          </View>
          <Text style={s.termsCheckboxText}>
            I agree to the{' '}
            <Text 
              style={s.termsLink}
              onPress={(e) => {
                e.stopPropagation();
                navigation.navigate('TermsAndConditions');
              }}
            >
              Terms & Conditions
            </Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.btn} onPress={handleEmailSignUp} disabled={loading}>
          <Text style={s.btnTxt}>{loading ? 'PLEASE WAIT…' : 'SIGN UP'}</Text>
        </TouchableOpacity>

        <GoogleSignInButton
          webClientId="504773176335-3qgua7sjaohgnvhjlu65e3la631skck5.apps.googleusercontent.com"
          onSignIn={handleGoogleSignIn}
          style={s.googleBtn}
          textStyle={s.googleBtnTxt}
        />

        <Text style={s.prompt}>
          Already have an account?{' '}
          <Text style={s.link} onPress={() => navigation.navigate('Login')}>
            Log in
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;

/* ----------------- styles ----------------- */
const s = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#f3d6a3',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  deity: {
    position: 'absolute',
    top: 15,
    width: 330,
    height: 330,
    opacity: 0.55,
  },
  title: {
    marginTop: 260,
    fontSize: 34,
    fontWeight: '700',
    color: '#002a4d',
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 60,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#c8a76c',
    borderRadius: 14,
    backgroundColor: '#f9e7c8',
    paddingHorizontal: 16,
  },
  icon: { fontSize: 22, color: '#002a4d', marginRight: 10 },
  input: { flex: 1, fontSize: 17, color: '#002a4d' },
  termsCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 12,
    marginBottom: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#002a4d',
    borderRadius: 4,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9e7c8',
  },
  checkmark: {
    fontSize: 16,
    color: '#002a4d',
    fontWeight: 'bold',
  },
  termsCheckboxText: {
    fontSize: 14,
    color: '#002a4d',
    flex: 1,
  },
  termsLink: {
    color: '#0066cc',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  btn: {
    marginTop: 14,
    width: '100%',
    paddingVertical: 16,
    backgroundColor: '#002a4d',
    borderRadius: 40,
    alignItems: 'center',
  },
  btnTxt: { color: '#fff', fontSize: 17, fontWeight: '700' },
  googleBtn: {
    marginTop: 14,
    width: '100%',
    paddingVertical: 16,
    backgroundColor: '#db4437',
    borderRadius: 40,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  googleBtnTxt: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    marginLeft: 8,
  },
  prompt: {
    marginTop: 20,
    fontSize: 15,
    color: '#002a4d',
  },
  link: {
    color: '#0066cc',
    fontWeight: '600',
  },
});