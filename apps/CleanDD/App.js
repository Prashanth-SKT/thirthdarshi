import React, { useEffect, useState, createContext, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  Text,
  StyleSheet,
  Platform,
  View,
  ActivityIndicator,
} from 'react-native';

import auth from '@react-native-firebase/auth';

import InstructionScreen from './screens/InstructionScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import { LanguageProvider } from './screens/LanguageContext';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import SuccessScreen from './screens/SuccessScreen';
import LanguageSelectionScreen from './screens/LanguageSelectionScreen';
import TempleSearchScreen from './screens/TempleSearchScreen';
import TempleFilterScreen from './screens/TempleFilterScreen';
import NavigationScreen from './screens/NavigationScreen';
import TeluguDisplayScreen from './screens/TeluguDisplayScreen';
import TempleDetailsScreen from './screens/TempleDetailsScreen';
import TermsAndConditionsScreen from './screens/TermsAndConditionsScreen';
import NetworkCheck from './screens/NetworkCheck';
import { TempleAudioProvider } from './screens/TempleAudioContext';
import {
  NavigationProvider,
  TaskRemovedBehavior,
} from '@googlemaps/react-native-navigation-sdk';

const termsAndConditionsDialogOptions = {
  title: 'TirthDarshi Navigation',
  companyName: 'Sukusala Technologies',
  showOnlyDisclaimer: true,
};

const Stack = createNativeStackNavigator();

// ✅ Create a Context for managing signup success state
const SignupFlowContext = createContext();

export const useSignupFlow = () => {
  const context = useContext(SignupFlowContext);
  if (!context) {
    throw new Error('useSignupFlow must be used within SignupFlowProvider');
  }
  return context;
};

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  // Show loading screen while checking auth state
  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#002a4d" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const shouldShowSuccess = user && showSuccessScreen;

  return (
    <NetworkCheck>
    <NavigationProvider
      termsAndConditionsDialogOptions={termsAndConditionsDialogOptions}
      taskRemovedBehavior={TaskRemovedBehavior.QUIT_SERVICE}
    >
      <SignupFlowContext.Provider value={{ setShowSuccessScreen }}>
        <LanguageProvider>
          <TempleAudioProvider>
            <NavigationContainer>
              <Stack.Navigator
              screenOptions={{
                headerShown: false,
                headerBackTitleVisible: false,
                headerTintColor: '#000',
                headerTitleStyle: { fontFamily: 'Arial' },
                headerBackTitleStyle: { fontFamily: 'Arial' },
              }}
            >
              {!user ? (
                // 🔓 UNAUTHENTICATED STACK
                <>
                  <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                  />
                  <Stack.Screen
                    name="SignUp"
                    component={SignUpScreen}
                  />
                  {/* ✅ Add Terms & Conditions to unauthenticated stack */}
                  <Stack.Screen
                    name="TermsAndConditions"
                    component={TermsAndConditionsScreen}
                  />
                </>
              ) : shouldShowSuccess ? (
                // 🎉 SUCCESS SCREEN (shown after signup before main app)
                <Stack.Screen
                  name="Success"
                  component={SuccessScreen}
                />
              ) : (
                // 🔐 AUTHENTICATED STACK
                <>
                  <Stack.Screen
                    name="LanguageSelection"
                    component={LanguageSelectionScreen}
                  />
                  <Stack.Screen
                    name="Onboarding"
                    component={OnboardingScreen}
                  />

                  {/* Shared authenticated screens */}
                  <Stack.Screen
                    name="Instruction"
                    component={InstructionScreen}
                  />
                  <Stack.Screen
                    name="TempleFilter"
                    component={TempleFilterScreen}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="TempleSearch"
                    component={TempleSearchScreen}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="Navigation"
                    component={NavigationScreen}
                  />
                  <Stack.Screen
                    name="TempleDetails"
                    component={TempleDetailsScreen}
                  />
                  <Stack.Screen
                    name="TeluguDisplay"
                    component={TeluguDisplayScreen}
                  />
                </>
              )}
              </Stack.Navigator>
            </NavigationContainer>
          </TempleAudioProvider>
        </LanguageProvider>
      </SignupFlowContext.Provider>
    </NavigationProvider>
    </NetworkCheck>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fffaf0',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#002a4d',
    fontFamily: 'Arial',
  },
  headerChip: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    borderWidth: Platform.OS === 'android' ? 0 : StyleSheet.hairlineWidth,
    borderColor: '#E5E7EB',
  },
  headerChipText: {
    fontFamily: 'Arial',
    fontSize: 15,
    color: 'blue',
  },
  TemplesText: {
    fontSize: 20,
    fontFamily: 'Arial',
    fontWeight: '600',
  },
  logoutText: {
    fontFamily: 'Arial',
    color: 'red',
    fontSize: 15,
    fontWeight: '600',
  },
});
