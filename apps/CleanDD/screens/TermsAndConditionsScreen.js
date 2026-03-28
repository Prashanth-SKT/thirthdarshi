import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

const TermsAndConditionsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Terms and Conditions</Text>
        <Text style={styles.lastUpdated}>Last Updated: January 2026</Text>

        <Text style={styles.intro}>
          Welcome to our Temple Navigation App. By using this application, you agree to the
          following terms and conditions:
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Account Registration</Text>
          <Text style={styles.sectionText}>
            Users must sign in to access the app. You can create an account using your email
            address or sign in with Google. By registering, you agree to provide accurate
            information and maintain the security of your account credentials.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Location Access</Text>
          <Text style={styles.sectionText}>
            To provide temple navigation, nearby temple discovery, and route guidance features,
            you must allow the app to access your device's location services. Location data is
            used solely for providing navigation services and enhancing your experience with
            the app.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Data Privacy & Security</Text>
          <Text style={styles.sectionText}>
            We take your privacy seriously. Your personal data, including your name, email,
            and location information, will be kept secure and confidential. We do not sell or
            share your personal information with third parties without your consent.
          </Text>
          <Text style={styles.sectionText}>
            Your data is stored securely using industry-standard security measures and is used
            only to improve your app experience.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. User Responsibilities</Text>
          <Text style={styles.sectionText}>
            You agree to use the app in accordance with all applicable laws and regulations.
            You are responsible for maintaining the confidentiality of your account credentials.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Service Availability</Text>
          <Text style={styles.sectionText}>
            While we strive to provide continuous service, we do not guarantee that the app
            will be available at all times. Navigation accuracy depends on your device's GPS
            and internet connectivity.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Changes to Terms</Text>
          <Text style={styles.sectionText}>
            We reserve the right to modify these terms at any time. Continued use of the app
            after changes constitutes acceptance of the modified terms.
          </Text>
        </View>

        <Text style={styles.footer}>
          By signing up or logging in, you acknowledge that you have read, understood, and
          agree to these Terms and Conditions.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsAndConditionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:15,
    backgroundColor: '#fffaf0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#002244',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002244',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#002244',
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  intro: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002244',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 10,
  },
  footer: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginTop: 10,
    fontStyle: 'italic',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
});