import { apiClient } from './index';

export const fetchAllTemples = async () => {
  const response = await apiClient.get('/temples');
  return response.data;
};
