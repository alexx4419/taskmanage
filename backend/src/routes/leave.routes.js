import express from 'express';
import prisma from '../lib/prisma.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();
router.use(protect);

router.post('/', async (req, res) => {
  const { fromDate, toDate, reason } = req.body;
  if (!fromDate || !toDate || !reason)
    return res.status(400).json({ message: 'All fields required' });
  try {
    const leave = await prisma.leaveRequest.create({
      data: { userId: req.user.id, fromDate, toDate, reason }
    });
    res.status(201).json(leave);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/my', async (req, res) => {
  try {
    const leaves = await prisma.leaveRequest.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/', async (req, res) => {
  if (req.user.role !== 'PROJECT_LEAD')
    return res.status(403).json({ message: 'Access denied' });
  try {
    const leaves = await prisma.leaveRequest.findMany({
      include: { user: { select: { id: true, name: true, email: true, role: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  if (req.user.role !== 'PROJECT_LEAD')
    return res.status(403).json({ message: 'Access denied' });
  const { status } = req.body;
  try {
    const updated = await prisma.leaveRequest.update({
      where: { id: req.params.id },
      data: { status },
      include: { user: { select: { id: true, name: true, email: true, role: true } } }
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
