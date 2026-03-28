import express from 'express';
import { templeController } from './controllers/templeController';

const app = express();
const port = 3001;

app.get('/temples', templeController.listTemples);

app.listen(port, () => {
  console.log(`Backend API running on http://localhost:${port}`);
});
