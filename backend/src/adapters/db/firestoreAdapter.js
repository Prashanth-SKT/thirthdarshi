import { db } from '../../../apps/mobile/firebase'; // adjust path
import { collection, getDocs, query, where } from 'firebase/firestore';

export const fetchTemples = async () => {
  const q = query(collection(db, 'temples'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
