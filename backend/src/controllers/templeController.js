import { getAllTemples } from '../services/templeService';

export const templeController = {
  listTemples: async (req, res) => {
    try {
      const temples = await getAllTemples();
      res.json(temples);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch temples' });
    }
  },
};
