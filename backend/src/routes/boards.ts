import express from 'express';
import { prisma } from '../db';

const router = express.Router();

// Get all boards
router.get('/', async (req, res) => {
  const boards = await prisma.board.findMany({
    include: {
      columns: {
        include: { cards: true },
      },
    },
  });
  res.json(boards);
});

// Create a new board
router.post('/', async (req, res) => {
  const { name } = req.body;
  const board = await prisma.board.create({
    data: { name },
  });
  res.json(board);
});

export default router;
