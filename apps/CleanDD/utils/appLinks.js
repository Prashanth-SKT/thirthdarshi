import { Alert, Linking } from 'react-native';

export const FEEDBACK_URL = 'https://thirthdarshi.in';

export const FEEDBACK_LABELS = {
  en: 'Send Feedback',
  te: 'అభిప్రాయం పంపండి',
  ta: 'பின்னூட்டம் அனுப்பவும்',
  hi: 'प्रतिक्रिया भेजें',
};

export async function openFeedback(lang = 'en') {
  try {
    await Linking.openURL(FEEDBACK_URL);
  } catch (e) {
    Alert.alert(
      FEEDBACK_LABELS[lang] || FEEDBACK_LABELS.en,
      'Could not open the feedback page. Please try again.',
    );
  }
}
