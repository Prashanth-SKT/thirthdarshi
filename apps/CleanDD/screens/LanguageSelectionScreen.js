import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { devLog } from '../utils/devLog';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import skyline from '../assets/skyline.png'; // adjust path if needed
import { useContext, useEffect, useMemo, useState } from 'react';
import { LanguageContext } from './LanguageContext'; // your context

const ALL_LANGUAGES = [
  { label: 'తెలుగు', code: 'te' },
  { label: 'English', code: 'en' },
  { label: 'தமிழ்', code: 'ta' },
  { label: 'हिन्दी', code: 'hi' },
];

const DEFAULT_LANGUAGE_FLAGS = {
  en: true,
  te: true,
  ta: false,
  hi: false,
};

const LanguageSelectionScreen = ({ navigation }) => {
  const { setLanguage } = useContext(LanguageContext); // ✅ this fixes the error
  const [languageFlags, setLanguageFlags] = useState(DEFAULT_LANGUAGE_FLAGS);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('app_config')
      .doc('language_flags')
      .onSnapshot(
        (snap) => {
          if (!snap.exists) {
            setLanguageFlags(DEFAULT_LANGUAGE_FLAGS);
            return;
          }
          const data = snap.data() || {};
          setLanguageFlags({
            en: typeof data.en === 'boolean' ? data.en : DEFAULT_LANGUAGE_FLAGS.en,
            te: typeof data.te === 'boolean' ? data.te : DEFAULT_LANGUAGE_FLAGS.te,
            ta: typeof data.ta === 'boolean' ? data.ta : DEFAULT_LANGUAGE_FLAGS.ta,
            hi: typeof data.hi === 'boolean' ? data.hi : DEFAULT_LANGUAGE_FLAGS.hi,
          });
        },
        (error) => {
          console.error('Error loading language flags:', error);
          setLanguageFlags(DEFAULT_LANGUAGE_FLAGS);
        }
      );

    return unsubscribe;
  }, []);

  const languages = useMemo(() => {
    const visible = ALL_LANGUAGES.filter((lang) => languageFlags[lang.code]);
    return visible.length > 0 ? visible : ALL_LANGUAGES.filter((lang) => ['en', 'te'].includes(lang.code));
  }, [languageFlags]);

  const languageMap = {
    te: 'telugu',
    en: 'english',
    ta: 'tamil',
    hi: 'hindi',
  };
  const handleLanguageSelect = async (code) => {
    try {
      if (!languageFlags[code]) {
        return;
      }
      devLog('Selected language:', code);
      await AsyncStorage.setItem('selectedLanguage', code);
      setLanguage(code);
      setTimeout(() => navigation.replace('Onboarding', { language: languageMap[code] || 'english' })
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
