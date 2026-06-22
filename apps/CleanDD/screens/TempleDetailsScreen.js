import React, { useState, useEffect, useRef, useMemo } from 'react';
import { devLog } from '../utils/devLog';
import { 
  View, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
  Animated,
  Text
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import RenderHTML from 'react-native-render-html';
import LanguageText from './LanguageText';
import { LanguageContext } from './LanguageContext';
import { getTempleAudioUrl } from './templeAudioUtils';
import { useTempleAudio } from './TempleAudioContext';

const { width: windowWidth } = Dimensions.get('window');

const TempleDetailsScreen = ({ navigation }) => {
  const route = useRoute();
  const { temple, nearestTemples, audioUrl: paramAudioUrl, autoPlayAudio } = route.params || {};
  const { lang } = React.useContext(LanguageContext);
  const { track, isPlaying, syncTempleAudio, togglePlayback } = useTempleAudio();
  const detailsLabels = {
    en: {
      pause: 'Pause audio',
      play: 'Play audio',
      nearbyHint: 'See nearby temples',
      nearbyTitle: 'Nearby Temples',
      mainDeity: 'Main Deity: ',
      noDetails: 'No additional details available',
    },
    te: {
      pause: 'ఆడియో పాజ్',
      play: 'ఆడియో ప్లే',
      nearbyHint: 'సమీప ఆలయాల జాబితా చూడండి',
      nearbyTitle: 'సమీప ఆలయాలు',
      mainDeity: 'ప్రధాన దేవత: ',
      noDetails: 'అదనపు వివరాలు అందుబాటులో లేవు',
    },
    ta: {
      pause: 'ஆடியோ இடைநிறுத்து',
      play: 'ஆடியோ இயக்கு',
      nearbyHint: 'அருகிலுள்ள கோவில்களை பார்க்கவும்',
      nearbyTitle: 'அருகிலுள்ள கோவில்கள்',
      mainDeity: 'மூலவர்: ',
      noDetails: 'கூடுதல் விவரங்கள் இல்லை',
    },
    hi: {
      pause: 'ऑडियो रोकें',
      play: 'ऑडियो चलाएं',
      nearbyHint: 'आस-पास के मंदिर देखें',
      nearbyTitle: 'निकटतम मंदिर',
      mainDeity: 'मुख्य देवता: ',
      noDetails: 'अतिरिक्त विवरण उपलब्ध नहीं',
    },
  };
  const ui = detailsLabels[lang] || detailsLabels.en;

  const audioUrl = useMemo(() => {
    if (typeof paramAudioUrl === 'string' && paramAudioUrl.trim()) {
      const t = paramAudioUrl.trim();
      if (t.startsWith('http://') || t.startsWith('https://')) return t;
    }
    return getTempleAudioUrl(temple || {}) || null;
  }, [paramAudioUrl, temple]);

  const isCurrentTempleAudioActive = Boolean(
    audioUrl &&
      track?.audioUrl === audioUrl &&
      isPlaying
  );
  
  // ✅ State for nearby temples dropdown
  const [showNearbyDropdown, setShowNearbyDropdown] = useState(false);
  const [showHintText, setShowHintText] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  devLog('🔍 TempleDetailsScreen received:', {
    temple: temple?.name,
    nearestTemplesCount: nearestTemples?.length || 0,
    hasAudio: Boolean(audioUrl),
  });

  useEffect(() => {
    if (!audioUrl) return;
    syncTempleAudio({
      templeId: temple?.firestoreId || null,
      audioUrl,
      autoPlay: Boolean(autoPlayAudio),
    });
  }, [audioUrl, autoPlayAudio, temple?.firestoreId, syncTempleAudio]);

  // ✅ Fade in hint text on mount, then fade out after 4 seconds
  useEffect(() => {
    if (nearestTemples && nearestTemples.length > 0) {
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      // Fade out after 4 seconds
      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }).start(() => {
          setShowHintText(false);
        });
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [nearestTemples]);

  // ✅ Extract and clean the HTML
  let htmlContent = temple?.extendedHtml || '';

  if (htmlContent.length >= 2 && htmlContent.startsWith('"') && htmlContent.endsWith('"')) {
    htmlContent = htmlContent.substring(1, htmlContent.length - 1).trim();
  }

  // ✅ Extract background color from HTML
  const extractBackgroundColor = (html) => {
    if (!html || html.trim() === '') return null;
    
    const bodyBgMatch = html.match(/body\s*{[^}]*background-color:\s*([^;]+);/i);
    if (bodyBgMatch && bodyBgMatch[1]) {
      return bodyBgMatch[1].trim();
    }
    
    const styleBgMatch = html.match(/background-color:\s*([^;]+);/i);
    if (styleBgMatch && styleBgMatch[1]) {
      return styleBgMatch[1].trim();
    }
    
    return null;
  };

  const bgColor = extractBackgroundColor(htmlContent);

  const renderHTML = (htmlString) => {
    if (!htmlString || htmlString.trim() === '') {
      return null;
    }

    let cleanedHTML = htmlString
      .replace(/<!DOCTYPE html>/gi, '')
      .replace(/<html[^>]*>/gi, '')
      .replace(/<\/html>/gi, '')
      .replace(/<head>[\s\S]*?<\/head>/gi, '')
      .replace(/<body[^>]*>/gi, '')
      .replace(/<\/body>/gi, '')
      .replace(/<meta[^>]*>/gi, '')
      .replace(/<style>[\s\S]*?<\/style>/gi, '')
      .trim();

    const fontFamily = lang === 'te' ? 'Gidugu_400Regular' : 'Arial';

    return (
      <View style={[
        styles.htmlContainer,
        { backgroundColor: bgColor || '#e5b765' }
      ]}>
        <RenderHTML
          contentWidth={windowWidth - 60}
          source={{ html: cleanedHTML }}
          tagsStyles={{
            body: {
              fontFamily,
              fontSize: 15,
              color: '#374151',
              lineHeight: 22,
              margin: 0,
              padding: 0,
              backgroundColor: 'transparent',
            },
            div: {
              fontFamily,
              color: '#374151',
              fontSize: 15,
              lineHeight: 22,
              backgroundColor: 'transparent',
              marginBottom: 8,
            },
            p: {
              fontFamily,
              marginTop: 0,
              marginBottom: 8,
              color: '#374151',
              fontSize: 15,
              lineHeight: 22,
            },
            h1: {
              fontFamily,
              fontSize: 22,
              fontWeight: '700',
              color: '#111827',
              marginTop: 0,
              marginBottom: 16,
              textAlign: 'center',
            },
            span: {
              fontFamily,
              fontSize: 15,
              color: '#374151',
              lineHeight: 22,
            },
          }}
          systemFonts={['Gidugu_400Regular', 'Arial']}
          baseStyle={{
            fontFamily,
            margin: 0,
            padding: 0,
            backgroundColor: 'transparent',
          }}
          enableExperimentalBRCollapsing={true}
          enableExperimentalMarginCollapsing={true}
        />
      </View>
    );
  };

  const hasNearby = nearestTemples && nearestTemples.length > 0;

  return (
    <View style={styles.container}>
      {/* ✅ Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <FontAwesome name="chevron-left" size={20} color="#111827" />
      </TouchableOpacity>

      {audioUrl ? (
        <TouchableOpacity
          style={[styles.audioButton, hasNearby && styles.audioButtonWithNearby]}
          onPress={() => {
            syncTempleAudio({
              templeId: temple?.firestoreId || null,
              audioUrl,
              autoPlay: false,
            });
            togglePlayback();
          }}
          activeOpacity={0.85}
          accessibilityLabel={isCurrentTempleAudioActive ? ui.pause : ui.play}
        >
          <FontAwesome name={isCurrentTempleAudioActive ? 'pause' : 'play'} size={18} color="#111827" />
        </TouchableOpacity>
      ) : null}

      {/* ✅ Floating Nearby Temples Icon (top right) */}
      {hasNearby && (
        <View style={styles.nearbyIconContainer}>
          <TouchableOpacity
            style={styles.nearbyIconButton}
            onPress={() => setShowNearbyDropdown(!showNearbyDropdown)}
          >
            <FontAwesome name="location-arrow" size={18} color="#fff" />
            <View style={styles.nearbyBadge}>
              <Text style={styles.nearbyBadgeText}>{nearestTemples.length}</Text>
            </View>
          </TouchableOpacity>

          {/* ✅ Animated hint text */}
          {showHintText && (
            <Animated.View 
              style={[
                styles.hintTextContainer,
                { opacity: fadeAnim }
              ]}
            >
              <LanguageText style={styles.hintText}>
                {ui.nearbyHint}
              </LanguageText>
              <View style={styles.hintArrow} />
            </Animated.View>
          )}
        </View>
      )}

      {/* ✅ Nearby Temples Dropdown */}
      {showNearbyDropdown && nearestTemples && nearestTemples.length > 0 && (
        <View style={styles.nearbyDropdown}>
          <View style={styles.nearbyDropdownHeader}>
            <LanguageText style={styles.nearbyDropdownTitle}>
              {ui.nearbyTitle}
            </LanguageText>
            <TouchableOpacity
              onPress={() => setShowNearbyDropdown(false)}
              style={styles.dropdownCloseBtn}
            >
              <FontAwesome name="close" size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            style={styles.nearbyList}
            showsVerticalScrollIndicator={false}
          >
          {nearestTemples.map((nearbyTemple, idx) => (
  <TouchableOpacity
    key={`nearby-${idx}`}
    style={styles.nearbyListItem}
    onPress={() => {
      setShowNearbyDropdown(false);
      
      // ✅ FIXED: Pass the callback from route params
      const { onNearestTemplePress } = route.params;
      
      if (onNearestTemplePress) {
        // Navigate back to map first
        navigation.goBack();
        
        // Then navigate to the temple marker (without opening cards)
        setTimeout(() => {
          onNearestTemplePress(nearbyTemple);
        }, 100);
      } else {
        // Fallback if callback not provided
        navigation.goBack();
      }
    }}
  >
    <View style={styles.nearbyRankCircle}>
      <Text style={styles.nearbyRankText}>{idx + 1}</Text>
    </View>
    
    <View style={styles.nearbyInfo}>
      <LanguageText 
        style={styles.nearbyNameText} 
        numberOfLines={1}
      >
        {nearbyTemple.name}
      </LanguageText>
      <LanguageText 
        style={styles.nearbyCityText} 
        numberOfLines={1}
      >
        {nearbyTemple.city}
      </LanguageText>
    </View>
    
    <View style={styles.nearbyDistance}>
      <LanguageText style={styles.nearbyDistanceText}>
        {nearbyTemple.distanceToSelected?.toFixed(1) || '0.0'} km
      </LanguageText>
    </View>
    
    <FontAwesome name="chevron-right" size={12} color="#9CA3AF" />
  </TouchableOpacity>
))}
          </ScrollView>
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ✅ Temple header */}
        <View style={styles.header}>
          <LanguageText style={styles.templeName}>{temple.name}</LanguageText>
          <LanguageText style={styles.templeCity}>{temple.city}</LanguageText>
          {temple.mainDeity && (
            <LanguageText style={styles.templeDeity}>
              {ui.mainDeity}{temple.mainDeity}
            </LanguageText>
          )}
        </View>

        {/* ✅ Render HTML content */}
        {htmlContent && htmlContent.trim() !== '' ? (
          renderHTML(htmlContent)
        ) : (
          <View style={styles.noContentContainer}>
            <LanguageText style={styles.noDescriptionText}>
              {ui.noDetails}
            </LanguageText>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 10,
    backgroundColor: '#F3F4F6',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  audioButton: {
    position: 'absolute',
    top: 50,
    right: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F4FD',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  audioButtonWithNearby: {
    right: 72,
  },
  // ✅ Nearby temples icon styles
  nearbyIconContainer: {
    position: 'absolute',
    top: 50,
    right: 16,
    zIndex: 10,
    alignItems: 'flex-end',
  },
  nearbyIconButton: {
    backgroundColor: '#3B82F6',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  nearbyBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  nearbyBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  hintTextContainer: {
    marginTop: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    maxWidth: 160,
  },
  hintText: {
    color: '#fff',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  hintArrow: {
    position: 'absolute',
    top: -6,
    right: 20,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(0, 0, 0, 0.85)',
  },
  // ✅ Nearby dropdown styles
  nearbyDropdown: {
    position: 'absolute',
    top: 110,
    right: 16,
    left: 16,
    backgroundColor: '#fff',
    borderRadius: 14,
    maxHeight: 320,
    zIndex: 9,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  nearbyDropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  nearbyDropdownTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  dropdownCloseBtn: {
    padding: 4,
  },
  nearbyList: {
    paddingVertical: 8,
  },
  nearbyListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  nearbyRankCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  nearbyRankText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  nearbyInfo: {
    flex: 1,
  },
  nearbyNameText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  nearbyCityText: {
    fontSize: 12,
    color: '#6B7280',
  },
  nearbyDistance: {
    marginRight: 10,
    alignItems: 'flex-end',
  },
  nearbyDistanceText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3B82F6',
  },
  scrollView: {
    flex: 1,
    marginTop: 20,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 80,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  templeName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  templeCity: {
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 8,
  },
  templeDeity: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  htmlContainer: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noContentContainer: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDescriptionText: {
    fontSize: 16,
    color: '#9CA3AF',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default TempleDetailsScreen;