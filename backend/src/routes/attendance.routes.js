import express from 'express';
import prisma from '../lib/prisma.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();
router.use(protect);

const todayStr = () => new Date().toISOString().split('T')[0];

// Get today's attendance status
router.get('/today', async (req, res) => {
  try {
    const record = await prisma.attendance.findUnique({
      where: { userId_date: { userId: req.user.id, date: todayStr() } }
    });
    res.json(record || { punchIn: null, punchOut: null, totalMinutes: 0 });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Punch In
router.post('/punch-in', async (req, res) => {
  try {
    const date = todayStr();
    const existing = await prisma.attendance.findUnique({
      where: { userId_date: { userId: req.user.id, date } }
    });
    if (existing?.punchIn) return res.status(400).json({ message: 'Already punched in today' });

    const record = await prisma.attendance.upsert({
      where: { userId_date: { userId: req.user.id, date } },
      update: { punchIn: new Date() },
      create: { userId: req.user.id, date, punchIn: new Date() }
    });
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Punch Out
router.post('/punch-out', async (req, res) => {
  try {
    const date = todayStr();
    const record = await prisma.attendance.findUnique({
      where: { userId_date: { userId: req.user.id, date } }
    });
    if (!record?.punchIn) return res.status(400).json({ message: 'Not punched in yet' });
    if (record.punchOut) return res.status(400).json({ message: 'Already punched out today' });

    const now = new Date();
    const mins = Math.round((now - new Date(record.punchIn)) / 60000);
    const updated = await prisma.attendance.update({
      where: { userId_date: { userId: req.user.id, date } },
      data: { punchOut: now, totalMinutes: mins }
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all attendance records for user
router.get('/history', async (req, res) => {
  try {
    const records = await prisma.attendance.findMany({
      where: { userId: req.user.id },
      orderBy: { date: 'desc' },
      take: 30
    });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
