import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { useSignupFlow } from '../App';
import tick from '../assets/tick.png';

const SuccessScreen = ({ navigation }) => {
  const { setShowSuccessScreen } = useSignupFlow();

  const handleContinue = () => {
    // ✅ Simply reset the flag - App.js will automatically navigate to LanguageSelection
    setShowSuccessScreen(false);
  };

  return (
    <View style={styles.container}>
      <Image source={tick} style={styles.image} />
      <Text style={styles.successTitle}>Successfully</Text>
      <Text style={styles.successTitle}>Signed Up</Text>
      <Text style={styles.subtitle}>Thank you for signing up!</Text>
      <Text style={styles.welcomeText}>Welcome to the Temple Guide App 🙏</Text>

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.buttonText}>CONTINUE</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SuccessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3f2fd',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 28,
    resizeMode: 'contain',
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#002244',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: '#002244',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});