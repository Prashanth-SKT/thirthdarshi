import firestore from '@react-native-firebase/firestore';
import { devLog } from '../utils/devLog';
import storage from '@react-native-firebase/storage';

const SUPPORTED_AUDIO_EXTENSIONS = ['mp3', 'm4a', 'aac', 'wav'];

function normalizeLanguageCode(language) {
  if (typeof language !== 'string') return 'en';
  const lower = language.trim().toLowerCase();
  if (!lower) return 'en';

  const map = {
    en: 'en',
    english: 'en',
    te: 'te',
    telugu: 'te',
    ta: 'ta',
    tamil: 'ta',
    hi: 'hi',
    hindi: 'hi',
  };
  return map[lower] || 'en';
}

/** Matches Firebase Storage path: temple-audio/temples/{langCode}_{templeDocumentId}.{ext} */
export function templeAudioStoragePath(firestoreId, language = 'en', extension = 'mp3') {
  if (!firestoreId || typeof firestoreId !== 'string') return null;
  const langCode = normalizeLanguageCode(language);
  const safeExt =
    typeof extension === 'string' && extension.trim()
      ? extension.trim().toLowerCase()
      : 'mp3';
  return `temple-audio/temples/${langCode}_${firestoreId}.${safeExt}`;
}

/**
 * HTTPS download URL for the default Storage layout (no token in app code; SDK resolves).
 */
export async function getStorageAudioDownloadUrl(firestoreId, language = 'en') {
  if (!firestoreId) return null;
  const langCode = normalizeLanguageCode(language);

  for (const ext of SUPPORTED_AUDIO_EXTENSIONS) {
    const path = templeAudioStoragePath(firestoreId, langCode, ext);
    if (!path) continue;
    try {
      const url = await storage().ref(path).getDownloadURL();
      if (url) return url;
    } catch (e) {
      if (__DEV__) {
        devLog(
          'No Storage audio for',
          `${langCode}_${firestoreId}.${ext}`,
          e?.code || e?.message || e
        );
      }
    }
  }

  try {
    const baseRef = storage().ref('temple-audio/temples');
    const list = await baseRef.listAll();
    const prefix = `${langCode}_${firestoreId}.`;
    const matched = list.items.find((itemRef) =>
      itemRef?.name?.toLowerCase().startsWith(prefix.toLowerCase())
    );
    if (!matched) return null;
    return await matched.getDownloadURL();
  } catch (e) {
    if (__DEV__) {
      devLog(
        'Storage list fallback failed for',
        `${langCode}_${firestoreId}.*`,
        e?.code || e?.message || e
      );
    }
    return null;
  }
}

/**
 * Extract a playable streaming URL from a Firestore document (temples / temple_details / nested).
 * For raw https URLs in Firestore only.
 */
export function getTempleAudioUrl(data) {
  if (!data || typeof data !== 'object') return null;

  const candidates = [
    data.audioUrl,
    data.AudioUrl,
    data.audioURL,
    data.audio_url,
    data.mp3Url,
    data.mp3_url,
    data.audioDownloadUrl,
    data.downloadUrl,
    typeof data.audio === 'string' ? data.audio : null,
  ];

  if (data.audio && typeof data.audio === 'object') {
    candidates.push(
      data.audio.url,
      data.audio.mp3,
      data.audio.src,
      data.audio.downloadUrl
    );
  }

  for (const raw of candidates) {
    if (typeof raw !== 'string' || !raw.trim()) continue;
    const u = raw.trim().replace(/^['"]+|['"]+$/g, '');
    if (u.startsWith('http://') || u.startsWith('https://')) return u;
  }

  return null;
}

/**
 * 1) URL from preloaded / temples / temple_details
 * 2) Default file: `temple-audio/temples/{langCode}_{firestoreId}.{ext}` in the default Storage bucket
 *
 * @param {string} firestoreId - Same as `temples` document ID (e.g. srirangam_1, uraiyur_2)
 * @param {object} [preloadedTempleData] - If you already read `temples/{id}`, pass it to avoid an extra read
 * @param {string} [language] - Selected app language for Storage path resolution
 */
export async function fetchTempleAudioUrlBestEffort(
  firestoreId,
  preloadedTempleData,
  language = 'en'
) {
  if (!firestoreId) return null;
  try {
    if (preloadedTempleData) {
      const u = getTempleAudioUrl(preloadedTempleData);
      if (u) return u;
    } else {
      const tSnap = await firestore().collection('temples').doc(firestoreId).get();
      if (tSnap.exists) {
        const u = getTempleAudioUrl(tSnap.data());
        if (u) return u;
      }
    }

    const dSnap = await firestore().collection('temple_details').doc(firestoreId).get();
    if (dSnap.exists) {
      const d = dSnap.data();
      let u = getTempleAudioUrl(d);
      if (u) return u;
      for (const key of ['en', 'te', 'hi']) {
        const block = d?.[key];
        if (block && typeof block === 'object') {
          u = getTempleAudioUrl(block);
          if (u) return u;
        }
      }
    }

    return await getStorageAudioDownloadUrl(firestoreId, language);
  } catch (e) {
    console.warn('fetchTempleAudioUrlBestEffort', firestoreId, language, e);
  }
  return null;
}
