import express from 'express';
import prisma from '../lib/prisma.js';
import { protect, leadOnly, leadOrReviewer } from '../middlewares/auth.middleware.js';

const router = express.Router();
router.use(protect);

router.get('/', async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'PROJECT_LEAD' || req.user.role === 'QUALITY_REVIEWER') {
      tasks = await prisma.task.findMany({
        include: { project: { select: { name: true } }, assignee: { select: { name: true, role: true } } },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      tasks = await prisma.task.findMany({
        where: { assigneeId: req.user.id },
        include: { project: { select: { name: true } }, assignee: { select: { name: true, role: true } } },
        orderBy: { createdAt: 'desc' }
      });
    }
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { title, description, projectId, assigneeId, dueDate, priority } = req.body;
  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        projectId,
        assigneeId: assigneeId ? assigneeId : null,
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null
      },
      include: { project: { select: { name: true } }, assignee: { select: { name: true } } }
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { status, title, description, assigneeId, dueDate, priority } = req.body;
  try {
    const task = await prisma.task.findUnique({ where: { id: req.params.id } });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.user.role === 'TASKER') {
      if (task.assigneeId !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
      const updated = await prisma.task.update({ where: { id: req.params.id }, data: { status } });
      return res.json(updated);
    }

    const updated = await prisma.task.update({
      where: { id: req.params.id },
      data: {
        status: status ?? task.status,
        title: title ?? task.title,
        description: description ?? task.description,
        assigneeId: assigneeId !== undefined ? (assigneeId ? assigneeId : null) : task.assigneeId,
        priority: priority ?? task.priority,
        dueDate: dueDate ? new Date(dueDate) : task.dueDate
      },
      include: { project: { select: { name: true } }, assignee: { select: { name: true } } }
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.delete('/:id', leadOnly, async (req, res) => {
  try {
    await prisma.task.delete({ where: { id: req.params.id } });
    res.json({ message: 'Task removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Task Logs
router.post('/:id/log/start', async (req, res) => {
  try {
    const log = await prisma.taskLog.create({
      data: { taskId: req.params.id, userId: req.user.id, startTime: new Date() }
    });
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.put('/log/:logId/stop', async (req, res) => {
  const { note } = req.body;
  try {
    const log = await prisma.taskLog.findUnique({ where: { id: req.params.logId } });
    if (!log) return res.status(404).json({ message: 'Log not found' });
    const end = new Date();
    const duration = Math.round((end - new Date(log.startTime)) / 60000);
    const updated = await prisma.taskLog.update({
      where: { id: req.params.logId },
      data: { endTime: end, durationMin: duration, note }
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
