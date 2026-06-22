import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LanguageContext = createContext();

const translations = {
  en: {
    selectFilter: 'Select Filter Type',
    selectCity: 'Select City',
    selectDeity: 'Select Deity',
    selectType: 'Select Type',
    selectRadius: 'Select Radius',
    city: 'City',
    deity: 'Deity',
    type: 'Type',
    radius: 'Radius',
    startNavigation: 'Start Navigation',
    navigationSteps: 'Navigation Steps',
    loading: 'Loading Map...',
    header: '108 Divya Desams',
  },
  te: {
    selectFilter: 'ఫిల్టర్ ఎంచుకోండి',
    selectCity: 'నగరం ఎంచుకోండి',
    selectDeity: 'దేవత ఎంచుకోండి',
    selectType: 'రకం ఎంచుకోండి',
    selectRadius: 'ప్రాంతం ఎంచుకోండి',
    city: 'నగరం',
    deity: 'దేవత',
    type: 'రకం',
    radius: 'ప్రాంతం',
    startNavigation: 'నావిగేషన్ ప్రారంభించండి',
    navigationSteps: 'దిశ సూచనలు',
    loading: 'పటం లోడ్ అవుతోంది...',
    header: '108 దివ్యదేశాలు',
  },
  ta: {
    selectFilter: 'வடிகட்டி வகையைத் தேர்ந்தெடுக்கவும்',
    selectCity: 'நகரத்தைத் தேர்ந்தெடுக்கவும்',
    selectDeity: 'தெய்வத்தைத் தேர்ந்தெடுக்கவும்',
    selectType: 'வகையைத் தேர்ந்தெடுக்கவும்',
    selectRadius: 'அரையைத் தேர்ந்தெடுக்கவும்',
    city: 'நகரம்',
    deity: 'தெய்வம்',
    type: 'வகை',
    radius: 'அரை',
    startNavigation: 'வழிசெலுத்தலை தொடங்கு',
    navigationSteps: 'வழிகாட்டி படிகள்',
    loading: 'வரைபடம் ஏற்றப்படுகிறது...',
    header: '108 திவ்யதேசங்கள்',
  },
  hi: {
    selectFilter: 'फ़िल्टर प्रकार चुनें',
    selectCity: 'शहर चुनें',
    selectDeity: 'देवता चुनें',
    selectType: 'प्रकार चुनें',
    selectRadius: 'त्रिज्या चुनें',
    city: 'शहर',
    deity: 'देवता',
    type: 'प्रकार',
    radius: 'त्रिज्या',
    startNavigation: 'नेविगेशन शुरू करें',
    navigationSteps: 'दिशा निर्देश',
    loading: 'मानचित्र लोड हो रहा है...',
    header: '१०८ दिव्य देशम',
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(null); // null initially
  const [strings, setStrings] = useState(translations['en']); // default to English

  useEffect(() => {
    const loadLanguage = async () => {
      const storedLang = await AsyncStorage.getItem('selectedLanguage');
      const langCode = storedLang || 'en';
      setLanguage(langCode);
      setStrings(translations[langCode] || translations.en); // load strings for saved language
    };
    loadLanguage();
  }, []);

  const changeLanguage = (code) => {
    setLanguage(code);
    setStrings(translations[code] || translations.en);
    AsyncStorage.setItem('selectedLanguage', code); // persist new language
  };

  return (
    language ? (
      <LanguageContext.Provider value={{ lang: language, strings, setLanguage: changeLanguage }}>
        {children}
      </LanguageContext.Provider>
    ) : null // don’t render children until lang is loaded
  );
};
