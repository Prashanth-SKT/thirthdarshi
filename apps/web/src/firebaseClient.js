import firestore from '@react-native-firebase/firestore';

// 🛠️ Field names in Firestore:
// - city: "Hyderabad"
// - mainDeity: "Vishnu"
// - deityType: "Divya Desam"

export const fetchTemples = async (filters = {}) => {
  try {
    const templesRef = collection(db, 'temples');
    const constraints = [];

    if (filters.city && filters.city.trim()) {
      constraints.push(where('city', '==', filters.city.trim()));
    }

    if (filters.deity && filters.deity.trim()) {
      constraints.push(where('mainDeity', '==', filters.deity.trim()));
    }

    if (filters.type && filters.type.trim()) {
      constraints.push(where('deityType', '==', filters.type.trim()));
    }

    const q = constraints.length > 0 ? query(templesRef, ...constraints) : templesRef;
    const snapshot = await getDocs(q);

    const data = snapshot.docs.map(doc => ({
      firestoreId: doc.id,
      ...doc.data(),
    }));

    console.log('✅ Fetched temples from Firestore:', data.length, 'records');
    return data;
  } catch (error) {
    console.error('❌ Error fetching temples from Firestore:', error.message);
    return [];
  }
};
