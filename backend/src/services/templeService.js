import { fetchTemples } from '../adapters/db/firestoreAdapter';

export const getAllTemples = async () => {
  const data = await fetchTemples();
  return data;
};
