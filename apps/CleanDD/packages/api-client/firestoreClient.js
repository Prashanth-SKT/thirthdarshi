import firestore from '@react-native-firebase/firestore';

// Helper function to normalize strings for comparison
const normalizeString = (str) => {
  if (!str) return '';
  return str.toString().trim().toLowerCase();
};

export async function fetchTemples(params = {}) {
  try {
    const templesRef = firestore().collection('temples');
    const lang = params.lang || 'en';

    console.log('📍 Fetching temples with params:', params);

    // Always fetch all temples and filter in JavaScript
    const snapshot = await templesRef.get();
    const allTemples = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    console.log(`📊 Total temples in database: ${allTemples.length}`);

    // Filter based on language and parameters
    let filtered = allTemples.filter(temple => {
      // Get language-specific data
      const langData = temple[lang];
      
      if (!langData) {
        console.warn(`⚠️ No ${lang} data for temple:`, temple.id);
        return false;
      }

      // Check if temple has valid coordinates
      const lat = parseFloat(temple.latitude ?? temple.lat);
      const lon = parseFloat(temple.longitude ?? temple.long);
      if (isNaN(lat) || isNaN(lon)) {
        console.warn(`⚠️ Invalid coordinates for temple:`, temple.id);
        return false;
      }

      // Apply filters
      if (params.city) {
        const templeCity = normalizeString(langData.city);
        const filterCity = normalizeString(params.city);
        if (templeCity !== filterCity) return false;
      }

      if (params.deity) {
        const templeDeity = normalizeString(langData.mainDeity);
        const filterDeity = normalizeString(params.deity);
        if (templeDeity !== filterDeity) return false;
      }

      if (params.type) {
        const templeType = normalizeString(langData.deityType);
        const filterType = normalizeString(params.type);
        if (templeType !== filterType) return false;
      }

      return true;
    });

    console.log(`✅ Filtered temple count: ${filtered.length}`);
    
    if (filtered.length > 0) {
      console.log('Sample filtered temples:', filtered.slice(0, 3).map(t => ({
        id: t.id,
        name: t[lang]?.name,
        city: t[lang]?.city,
        deity: t[lang]?.mainDeity
      })));
    }

    return filtered;
  } catch (error) {
    console.error('🔥 fetchTemples error:', error);
    throw error;
  }
}
