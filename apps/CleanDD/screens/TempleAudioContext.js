import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import Video from 'react-native-video';

const TempleAudioContext = createContext(null);

export const TempleAudioProvider = ({ children }) => {
  const [track, setTrack] = useState(null); // { templeId, audioUrl }
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [playerVersion, setPlayerVersion] = useState(0);

  const setTrackIfNeeded = useCallback((templeId, audioUrl) => {
    if (typeof audioUrl !== 'string' || !audioUrl.trim()) return false;
    const normalizedUrl = audioUrl.trim();
    setTrack((prev) => {
      if (prev?.audioUrl === normalizedUrl && prev?.templeId === templeId) {
        return prev;
      }
      return { templeId: templeId || null, audioUrl: normalizedUrl };
    });
    return true;
  }, []);

  const playTempleAudio = useCallback(
    ({ templeId, audioUrl }) => {
      const normalizedTempleId = templeId || null;
      const normalizedUrl =
        typeof audioUrl === 'string' && audioUrl.trim() ? audioUrl.trim() : null;
      const isSameTrack =
        normalizedUrl &&
        track?.audioUrl === normalizedUrl &&
        track?.templeId === normalizedTempleId;

      const ok = setTrackIfNeeded(templeId || null, audioUrl);
      if (!ok) return false;
      if (isSameTrack && hasEnded) {
        setPlayerVersion((v) => v + 1);
      }
      setHasEnded(false);
      setIsPlaying(true);
      return true;
    },
    [setTrackIfNeeded, track, hasEnded]
  );

  const syncTempleAudio = useCallback(
    ({ templeId, audioUrl, autoPlay = false }) => {
      const ok = setTrackIfNeeded(templeId || null, audioUrl);
      if (!ok) return false;
      if (autoPlay) {
        setHasEnded(false);
        setIsPlaying(true);
      }
      return true;
    },
    [setTrackIfNeeded]
  );

  const togglePlayback = useCallback(() => {
    if (!track?.audioUrl) return;
    if (hasEnded) {
      setPlayerVersion((v) => v + 1);
      setHasEnded(false);
      setIsPlaying(true);
      return;
    }
    setIsPlaying((prev) => !prev);
  }, [track, hasEnded]);

  const pause = useCallback(() => setIsPlaying(false), []);
  const resume = useCallback(() => {
    if (!track?.audioUrl) return;
    if (hasEnded) {
      setPlayerVersion((v) => v + 1);
      setHasEnded(false);
    }
    setIsPlaying(true);
  }, [track, hasEnded]);

  const stop = useCallback(() => {
    setIsPlaying(false);
    setHasEnded(false);
    setTrack(null);
  }, []);

  const contextValue = useMemo(
    () => ({
      track,
      isPlaying,
      playTempleAudio,
      syncTempleAudio,
      togglePlayback,
      pause,
      resume,
      stop,
    }),
    [track, isPlaying, playTempleAudio, syncTempleAudio, togglePlayback, pause, resume, stop]
  );

  return (
    <TempleAudioContext.Provider value={contextValue}>
      {children}
      {track?.audioUrl ? (
        <Video
          key={`${track.audioUrl}:${track.templeId || 'unknown'}:${playerVersion}`}
          source={{ uri: track.audioUrl }}
          style={{ position: 'absolute', width: 0, height: 0, opacity: 0 }}
          audioOnly
          volume={1}
          paused={!isPlaying}
          playInBackground
          ignoreSilentSwitch="ignore"
          mixWithOthers="duck"
          onEnd={() => {
            setIsPlaying(false);
            setHasEnded(true);
          }}
          onError={(e) => console.warn('Temple audio error:', e?.error ?? e)}
        />
      ) : null}
    </TempleAudioContext.Provider>
  );
};

export const useTempleAudio = () => {
  const ctx = useContext(TempleAudioContext);
  if (!ctx) {
    return {
      track: null,
      isPlaying: false,
      playTempleAudio: () => false,
      syncTempleAudio: () => false,
      togglePlayback: () => {},
      pause: () => {},
      resume: () => {},
      stop: () => {},
    };
  }
  return ctx;
};
