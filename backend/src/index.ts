import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import boardRoutes from './routes/boards';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/boards', boardRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


/*
GET    /api/boards                  → list of boards  
GET    /api/boards/:id             → board with columns/cards  
POST   /api/boards                 → create new board  
POST   /api/boards/:id/columns     → add column to board  
POST   /api/cards/:id/autofill     → ask GPT for a task  
PUT    /api/cards/:id              → update card text  
*/