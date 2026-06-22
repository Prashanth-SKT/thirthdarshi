import { db } from '../auth/firebaseAuth';
import { collection, getDocs, query, where } from 'firebase/firestore';


export async function fetchTemples(params = {}) {
  try {
    const templesRef = collection(db, 'temples');
    const lang = params.lang || 'en';

    let snapshot;
    // Use Firestore filters only for English
    if (lang === 'en' && (params.city || params.deity || params.type)) {
      const queries = [];
      if (params.city) queries.push(where(`${lang}.city`, '==', params.city));
      if (params.deity) queries.push(where(`${lang}.mainDeity`, '==', params.deity));
      if (params.type) queries.push(where(`${lang}.deityType`, '==', params.type));
      const q = query(templesRef, ...queries);
      snapshot = await getDocs(q);
    } else {
      // For Telugu or no filters, fetch all and filter in JS
      snapshot = await getDocs(templesRef);
    }

    const allTemples = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Filter manually if not English
    let filtered = allTemples;
    if (lang !== 'en') {
      filtered = allTemples.filter(t => {
        const d = t[lang];
        if (!d) return false;
        if (params.city && d.city !== params.city) return false;
        if (params.deity && d.mainDeity !== params.deity) return false;
        if (params.type && d.deityType !== params.type) return false;
        return true;
      });
    }

    console.log(`✅ Final temple count: ${filtered.length}`);
    return filtered;
  } catch (error) {
    console.error('🔥 fetchTemples error:', error);
    throw error;
  }
}


