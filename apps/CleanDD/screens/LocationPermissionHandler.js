// screens/LocationPermissionHandler.js
// THIS IS A NEW FILE - CREATE IT IN YOUR screens FOLDER

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const LocationPermissionHandler = ({ lang, onRetry }) => {
  const isEnglish = lang === 'en';

  const openSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <FontAwesome name="map-marker" size={48} color="#EF4444" />
        </View>

        {/* Title */}
        <Text style={styles.title}>
          {isEnglish 
            ? 'Location Access Required' 
            : 'స్థానం యాక్సెస్ అవసరం'}
        </Text>

        {/* Description */}
        <Text style={styles.description}>
          {isEnglish
            ? 'This app needs your location to show nearby temples and provide navigation directions.'
            : 'సమీప ఆలయాలను చూపించడానికి మరియు నావిగేషన్ దిశలను అందించడానికి ఈ యాప్‌కు మీ స్థానం అవసరం.'}
        </Text>

        {/* Feature list */}
        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <FontAwesome name="check-circle" size={20} color="#10B981" />
            <Text style={styles.featureText}>
              {isEnglish 
                ? 'Find temples near you' 
                : 'మీకు సమీపంలో ఆలయాలను కనుగొనండి'}
            </Text>
          </View>

          <View style={styles.featureItem}>
            <FontAwesome name="check-circle" size={20} color="#10B981" />
            <Text style={styles.featureText}>
              {isEnglish 
                ? 'Get accurate directions' 
                : 'ఖచ్చితమైన దిశలను పొందండి'}
            </Text>
          </View>

          <View style={styles.featureItem}>
            <FontAwesome name="check-circle" size={20} color="#10B981" />
            <Text style={styles.featureText}>
              {isEnglish 
                ? 'View distances to temples' 
                : 'ఆలయాలకు దూరాలను చూడండి'}
            </Text>
          </View>
        </View>

        {/* Privacy note */}
        <View style={styles.privacyNote}>
          <FontAwesome name="lock" size={16} color="#6B7280" />
          <Text style={styles.privacyText}>
            {isEnglish
              ? 'Your location is only used while the app is open and is never shared with third parties.'
              : 'యాప్ తెరిచి ఉన్నప్పుడు మాత్రమే మీ స్థానం ఉపయోగించబడుతుంది మరియు మూడవ పక్షాలతో ఎప్పుడూ భాగస్వామ్యం చేయబడదు.'}
          </Text>
        </View>

        {/* Buttons */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={onRetry}
          activeOpacity={0.8}
        >
          <FontAwesome name="location-arrow" size={16} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.primaryButtonText}>
            {isEnglish 
              ? 'Enable Location Access' 
              : 'స్థానం యాక్సెస్ ఎనేబుల్ చేయండి'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={openSettings}
          activeOpacity={0.8}
        >
          <FontAwesome name="cog" size={16} color="#3B82F6" style={{ marginRight: 8 }} />
          <Text style={styles.secondaryButtonText}>
            {isEnglish 
              ? 'Open Settings' 
              : 'సెట్టింగ్స్ తెరవండి'}
          </Text>
        </TouchableOpacity>

        {/* Help text */}
        <Text style={styles.helpText}>
          {isEnglish
            ? 'If you denied permission, you can enable it in your device settings.'
            : 'మీరు అనుమతిని తిరస్కరించినట్లయితే, మీ పరికర సెట్టింగ్‌లలో దీన్ని ఎనేబుల్ చేయవచ్చు.'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 10,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'Arial',
  },
  description: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
    fontFamily: 'Arial',
  },
  featureList: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 12,
    flex: 1,
    fontFamily: 'Arial',
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  privacyText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
    fontFamily: 'Arial',
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#3B82F6',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Arial',
  },
  secondaryButton: {
    backgroundColor: '#F3F4F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  secondaryButtonText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Arial',
  },
  helpText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: 'Arial',
  },
});

export default LocationPermissionHandler;