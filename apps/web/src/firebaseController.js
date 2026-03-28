import {
  collection,
  addDoc,
  setDoc,
  doc,
  getDocs,
  deleteDoc,
} from 'firebase/firestore';
import { db } from './firebaseAuth';

// Add a temple (auto-generated Firestore ID)
export const addTemple = async (data) => {
  await addDoc(collection(db, "temples"), data);
};

// Get all temples and include document IDs
export const getAllTemples = async () => {
  const querySnapshot = await getDocs(collection(db, "temples"));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,   // Include Firestore document ID
    ...doc.data()
  }));
};

// Update an existing temple by ID
export const updateTempleById = async (id, data) => {
  const docRef = doc(db, "temples", id);
  await setDoc(docRef, data, { merge: true }); // Merge updates into existing doc
};

// Delete a temple by ID
export const deleteTempleById = async (id) => {
  await deleteDoc(doc(db, 'temples', id));
};

// Upload CSV data to any collection
export const uploadCSVToCollection = async (collectionName, data) => {
  await addDoc(collection(db, collectionName), {
    ...data,
    timestamp: new Date().toISOString(),
  });
};
