import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { devLog } from '../utils/devLog';
import AsyncStorage from '@react-native-async-storage/async-storage';
import skyline from '../assets/skyline.png'; // adjust path if needed
import { useContext } from 'react';
import { LanguageContext } from './LanguageContext'; // your context
import AppQuickLinks from '../components/AppQuickLinks';

const languages = [
  { label: 'తెలుగు', code: 'te' },
  { label: 'English', code: 'en' },
];

const LanguageSelectionScreen = ({ navigation }) => {
  const { lang, setLanguage } = useContext(LanguageContext);
 const languageMap = { 'te': 'telugu', 'en': 'english' };
  const handleLanguageSelect = async (code) => {
    try {
      devLog('Selected language:', code);
      await AsyncStorage.setItem('selectedLanguage', code);
      setLanguage(code);
     setTimeout(() => navigation.replace('Onboarding', { language: languageMap[code] })
, 100);
    } catch (error) {
      console.error('Error saving selected language:', error);
    }
  };


  return (
    <View style={s.fill}>
      {/* Top block */}
      <View style={s.top}>
        <Text style={s.heading}>SELECT YOUR</Text>
        <Text style={s.heading}>LANGUAGE</Text>
      </View>

      {/* Skyline divider */}
      <Image source={skyline} style={s.sky} />

      {/* Bottom block with buttons */}
      <View style={s.bottom}>
        <View style={s.buttonContainer}>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={s.langButton}
              onPress={() => handleLanguageSelect(lang.code)}
            >
              <Text style={s.langText}>{lang.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <AppQuickLinks lang={lang || 'en'} />
      </View>
    </View>
  );
};

export default LanguageSelectionScreen;

const s = StyleSheet.create({
  fill: { flex: 1, backgroundColor: '#e2963d' },
  top: { paddingTop: 70,  paddingBottom: 40, alignItems: 'center', backgroundColor: '#faeed1' },
  sky: { width: '100%', height: 180, resizeMode: 'cover', marginTop: -20 },
  bottom: { flex: 1, alignItems: 'center', paddingTop: 40 },
  heading: { fontSize: 32, fontWeight: '700', color: '#002244', lineHeight: 38 },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '80%',
    rowGap: 24,
    columnGap: 24,
  },
  langButton: {
    width: '45%',
    backgroundColor: '#faeed1',
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5b765',
  },
  langText: { fontSize: 20, fontWeight: '700', color: '#002244' },
});
