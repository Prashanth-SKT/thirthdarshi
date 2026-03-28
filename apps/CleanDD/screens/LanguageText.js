import React, { useContext } from 'react';
import { Text } from 'react-native';
import { LanguageContext } from './LanguageContext';

// Helper to detect if text contains Telugu characters
const hasTeluguChars = (text) => {
  if (!text) return false;
  const teluguRange = /[\u0C00-\u0C7F]/;
  return teluguRange.test(text);
};

// Smart text component that picks the right font
export const LanguageText = ({ children, style, ...props }) => {
  const { lang } = useContext(LanguageContext);
  
  // Determine font based on language or content
  let fontFamily = 'Arial'; // Default English font
  
  if (lang === 'te' || hasTeluguChars(String(children))) {
    fontFamily = 'Gidugu_400Regular'; // Use Telugu font
  } else if (lang === 'hi') {
    fontFamily = 'NotoSansTelugu_400Regular'; // Use Hindi/Devanagari font
  }
  
  return (
    <Text style={[{ fontFamily }, style]} {...props}>
      {children}
    </Text>
  );
};

export default LanguageText;