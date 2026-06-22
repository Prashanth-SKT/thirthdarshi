const API_BASE = 'http://localhost:3001'; // Replace with your backend URL or ENV var

export const getTemples = async () => {
  try {
    const response = await fetch(`${API_BASE}/temples`);
    if (!response.ok) throw new Error('Failed to fetch temples');
    return await response.json();
  } catch (error) {
    console.error('API Error:', error.message);
    return [];
  }
};
