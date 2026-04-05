import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const OnboardingScreen = ({ navigation, route }) => {
  const { language } = route.params;

  const goToTempleSearch = () => {
    navigation.replace('TempleSearch');
  };

  const goToInstructions = () => {
    navigation.navigate('Instruction', { language });
  };

  // Conditional button labels based on selected language
  const startLabel = language === 'telugu' ? "ప్రారంభించండి" : "Start";
  const instructionsLabel = language === 'telugu' ? "సూచనలు చూడండి" : "See Instructions";
  const welcomeText = language === 'telugu' ? "స్వాగతం!" : "Welcome!";

  return (
    <View style={styles.fill}>
      <View style={styles.top}>
        <Text style={styles.title}>{welcomeText}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.startButton]}
          onPress={goToTempleSearch}
        >
          <Text style={styles.buttonText}>{startLabel}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.instructionButton]}
          onPress={goToInstructions}
        >
          <Text style={styles.buttonText}>{instructionsLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    backgroundColor: '#e5b765', // light sand background
    alignItems: 'center',
    justifyContent: 'center',
  },
  top: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#002244',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '80%',
    alignItems: 'center',
    gap: 20,
  },
  button: {
    width: '100%',
    backgroundColor: '#FAEED1', // the same sand shade as language selection
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5b765', // golden border color
    marginVertical: 6,
    elevation: 3,
    shadowColor: '#e2963d', // shadow in orange hue
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  startButton: {},
  instructionButton: {},
  buttonText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#002244', // dark blue text for high contrast
    letterSpacing: 1,
  },
});
