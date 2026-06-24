import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import Video from 'react-native-video';
import AppQuickLinks from '../components/AppQuickLinks';

const SCREEN_WIDTH = Dimensions.get('window').width;

const formatTime = (secs) => {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

const OnboardingScreen = ({ navigation, route }) => {
  const routeLanguage = route?.params?.language;
  const onboardingLabels = {
    english: {
      start: 'Start',
      instructions: 'See Instructions',
      welcome: 'Welcome!',
      closeVideo: 'Close Video',
      playVideo: 'Play Video',
    },
    telugu: {
      start: 'ప్రారంభించండి',
      instructions: 'సూచనలు చూడండి',
      welcome: 'స్వాగతం!',
      closeVideo: 'మూసివేయండి',
      playVideo: 'వీడియో చూడండి',
    },
    tamil: {
      start: 'தொடங்கு',
      instructions: 'வழிமுறைகளை பார்க்கவும்',
      welcome: 'வரவேற்கிறோம்!',
      closeVideo: 'வீடியோ மூடு',
      playVideo: 'வீடியோ இயக்கு',
    },
    hindi: {
      start: 'शुरू करें',
      instructions: 'निर्देश देखें',
      welcome: 'स्वागत है!',
      closeVideo: 'वीडियो बंद करें',
      playVideo: 'वीडियो चलाएं',
    },
  };

  const language =
    routeLanguage === 'telugu'
      ? 'telugu'
      : routeLanguage === 'tamil'
        ? 'tamil'
        : routeLanguage === 'hindi'
          ? 'hindi'
          : 'english';

  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);

  const videoSource = useMemo(() => {
    switch (language) {
      case 'telugu':
        return require('../assets/DD_telugu.mp4');
      case 'english':
        return require('../assets/DD_english.mp4');
      default:
        return require('../assets/DD_english.mp4');
    }
  }, [language]);

  useEffect(() => {
    const bootstrapVideo = async () => {
      try {
        const uid = auth().currentUser?.uid || 'guest';
        const key = `onboardingVideoSeen:${uid}:${language}`;
        const seen = await AsyncStorage.getItem(key);
        const firstTimeForLanguage = !seen;

        if (firstTimeForLanguage) {
          setShowVideoModal(true);
          setIsPlaying(true);
          await AsyncStorage.setItem(key, 'true');
        }
      } catch (error) {
        console.error('Failed to load onboarding video state:', error);
      }
    };

    bootstrapVideo();
  }, [language]);

  const goToTempleFilter = () => {
    navigation.replace('TempleFilter');
  };

  const goToInstructions = () => {
    navigation.replace('Instruction', { language });
  };

  const playVideo = () => {
    setShowVideoModal(true);
    setIsPlaying(true);
  };

  const seekForward = () => {
    const next = Math.min(currentTime + 5, duration);
    videoRef.current?.seek(next);
    setCurrentTime(next);
  };

  const seekBackward = () => {
    const prev = Math.max(currentTime - 5, 0);
    videoRef.current?.seek(prev);
    setCurrentTime(prev);
  };

  const handleProgressBarPress = (e) => {
    if (duration <= 0) return;
    const seekTo = (e.nativeEvent.locationX / SCREEN_WIDTH) * duration;
    videoRef.current?.seek(seekTo);
    setCurrentTime(seekTo);
  };

  const labels = onboardingLabels[language] || onboardingLabels.english;
  const startLabel = labels.start;
  const instructionsLabel = labels.instructions;
  const welcomeText = labels.welcome;
  const closeVideoLabel = labels.closeVideo;
  const playVideoLabel = labels.playVideo;
  const quickLinksLang =
    language === 'telugu' ? 'te' : language === 'tamil' ? 'ta' : language === 'hindi' ? 'hi' : 'en';

  return (
    <View style={styles.fill}>
      <View style={styles.top}>
        <Text style={styles.title}>{welcomeText}</Text>
      </View>

      <TouchableOpacity style={styles.playVideoButton} onPress={playVideo}>
        <View style={styles.playCircle}>
          <Text style={styles.playArrow}>▶</Text>
        </View>
        <Text style={styles.playVideoLabel}>{playVideoLabel}</Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.startButton]}
          onPress={goToTempleFilter}
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

      <AppQuickLinks lang={quickLinksLang} style={{ marginTop: 16 }} />

      <Modal
        visible={showVideoModal}
        animationType="fade"
        presentationStyle="fullScreen"
        statusBarTranslucent
        onRequestClose={() => {
          setIsPlaying(false);
          setShowVideoModal(false);
        }}
      >
        <View style={styles.fullscreenContainer}>
          <Video
            ref={videoRef}
            source={videoSource}
            style={styles.fullscreenVideo}
            resizeMode="contain"
            paused={!isPlaying}
            onProgress={({ currentTime: ct }) => setCurrentTime(ct)}
            onLoad={({ duration: d }) => setDuration(d)}
            onEnd={() => {
              setIsPlaying(false);
              setShowVideoModal(false);
            }}
            onError={(error) => console.error('Video playback error:', error)}
          />

          <TouchableOpacity
            style={styles.closeVideoButton}
            onPress={() => {
              setIsPlaying(false);
              setShowVideoModal(false);
            }}
          >
            <Text style={styles.closeVideoText}>{closeVideoLabel}</Text>
          </TouchableOpacity>

          <View style={styles.controlsBar}>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.progressBarTrack}
              onPress={handleProgressBarPress}
            >
              <View
                style={[
                  styles.progressBarFill,
                  { width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' },
                ]}
              />
            </TouchableOpacity>

            <View style={styles.timeRow}>
              <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
              <Text style={styles.timeText}>{formatTime(duration)}</Text>
            </View>

            <View style={styles.buttonsRow}>
              <TouchableOpacity style={styles.ctrlBtn} onPress={seekBackward}>
                <Text style={styles.ctrlBtnText}>{'⏮ 5s'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.ctrlBtn, styles.playPauseBtn]}
                onPress={() => setIsPlaying((p) => !p)}
              >
                <Text style={styles.playPauseText}>{isPlaying ? '⏸' : '▶'}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.ctrlBtn} onPress={seekForward}>
                <Text style={styles.ctrlBtnText}>{'5s ⏭'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    backgroundColor: '#e5b765',
    alignItems: 'center',
    justifyContent: 'center',
  },
  top: {
    alignItems: 'center',
    marginBottom: 36,
    width: '80%',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#002244',
    marginBottom: 20,
  },
  playVideoButton: {
    alignItems: 'center',
    marginBottom: 40,
  },
  playCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#002244',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#e5b765',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    marginBottom: 8,
  },
  playArrow: {
    fontSize: 24,
    color: '#e5b765',
    marginLeft: 4,
  },
  playVideoLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#002244',
    letterSpacing: 0.8,
  },
  buttonContainer: {
    width: '80%',
    alignItems: 'center',
    gap: 20,
  },
  button: {
    width: '100%',
    backgroundColor: '#FAEED1',
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5b765',
    marginVertical: 6,
    elevation: 3,
    shadowColor: '#e2963d',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  startButton: {},
  instructionButton: {},
  buttonText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#002244',
    letterSpacing: 1,
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  fullscreenVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  closeVideoButton: {
    position: 'absolute',
    top: 44,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  closeVideoText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  controlsBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 110,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    justifyContent: 'space-between',
  },
  progressBarTrack: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#e5b765',
    borderRadius: 2,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  timeText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 11,
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
    marginTop: 6,
  },
  ctrlBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  ctrlBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  playPauseBtn: {
    backgroundColor: '#e5b765',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 24,
  },
  playPauseText: {
    color: '#002244',
    fontSize: 20,
    fontWeight: '700',
  },
});
