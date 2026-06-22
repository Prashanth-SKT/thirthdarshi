import firestore from '@react-native-firebase/firestore';

export const addTemple = async (templeData) => {
  const docRef = await firestore().collection('temples').add({
    ...templeData,
    timestamp: new Date().toISOString(),
  });
  return docRef.id;
};

export const getAllTemples = async () => {
  const querySnapshot = await firestore().collection('temples').get();
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateTempleById = async (id, updatedData) => {
  await firestore().collection('temples').doc(id).update(updatedData);
};

export const deleteTempleById = async (id) => {
  await firestore().collection('temples').doc(id).delete();
};

export const uploadCSVToCollection = async (collectionName, data) => {
  await firestore().collection(collectionName).add({
    ...data,
    timestamp: new Date().toISOString(),
  });
};
