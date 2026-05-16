import express from 'express';
import prisma from '../lib/prisma.js';
import { protect, leadOnly } from '../middlewares/auth.middleware.js';

const router = express.Router();
router.use(protect);

router.get('/', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: { owner: { select: { name: true } }, _count: { select: { tasks: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        owner: { select: { name: true, email: true } },
        tasks: { include: { assignee: { select: { id: true, name: true, role: true } } }, orderBy: { createdAt: 'desc' } }
      }
    });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/', leadOnly, async (req, res) => {
  const { name, description } = req.body;
  try {
    const project = await prisma.project.create({ data: { name, description, ownerId: req.user.id } });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.put('/:id', leadOnly, async (req, res) => {
  const { name, description } = req.body;
  try {
    const project = await prisma.project.update({ where: { id: req.params.id }, data: { name, description } });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.delete('/:id', leadOnly, async (req, res) => {
  try {
    await prisma.project.delete({ where: { id: req.params.id } });
    res.json({ message: 'Project removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
