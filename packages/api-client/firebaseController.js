import {
  collection,
  addDoc,
  setDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../auth/firebaseAuth';

export const addTemple = async (templeData) => {
  const docRef = await addDoc(collection(db, 'temples'), {
    ...templeData,
    timestamp: new Date().toISOString(),
  });
  return docRef.id;
};

export const getAllTemples = async () => {
  const querySnapshot = await getDocs(collection(db, 'temples'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateTempleById = async (id, updatedData) => {
  const ref = doc(db, 'temples', id);
  await updateDoc(ref, updatedData);
};

export const deleteTempleById = async (id) => {
  await deleteDoc(doc(db, 'temples', id));
};

export const uploadCSVToCollection = async (collectionName, data) => {
  await addDoc(collection(db, collectionName), {
    ...data,
    timestamp: new Date().toISOString(),
  });
};
