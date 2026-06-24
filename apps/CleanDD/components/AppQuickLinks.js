import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { openFeedback, FEEDBACK_LABELS } from '../utils/appLinks';

const AppQuickLinks = ({ lang = 'en', variant = 'inline', style }) => {
  const label = FEEDBACK_LABELS[lang] || FEEDBACK_LABELS.en;
  const compact = variant === 'floating';

  return (
    <TouchableOpacity
      style={[
        variant === 'floating' ? styles.floating : styles.inline,
        style,
      ]}
      onPress={() => openFeedback(lang)}
      activeOpacity={0.75}
      accessibilityRole="link"
      accessibilityLabel={label}
    >
      <FontAwesome name="commenting-o" size={compact ? 13 : 14} color="#002244" />
      <Text style={[styles.linkText, compact && styles.linkTextCompact]}>{label}</Text>
    </TouchableOpacity>
  );
};

export default AppQuickLinks;

const styles = StyleSheet.create({
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  floating: {
    position: 'absolute',
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.97)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 400,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#002244',
    textDecorationLine: 'underline',
  },
  linkTextCompact: {
    fontSize: 11,
    fontWeight: '700',
    textDecorationLine: 'none',
  },
});
