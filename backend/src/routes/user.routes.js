import express from 'express';
import prisma from '../lib/prisma.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();
router.use(protect);

// Get all users (for task assignment). Returns id, name, role only.
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true },
      orderBy: { name: 'asc' }
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
