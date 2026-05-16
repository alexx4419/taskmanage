import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, name: true, email: true, role: true }
      });
      if (!req.user) return res.status(401).json({ message: 'User not found' });
      next();
    } catch {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const leadOnly = (req, res, next) => {
  if (req.user?.role === 'PROJECT_LEAD') return next();
  res.status(403).json({ message: 'Project Lead access required' });
};

export const leadOrReviewer = (req, res, next) => {
  if (['PROJECT_LEAD', 'QUALITY_REVIEWER'].includes(req.user?.role)) return next();
  res.status(403).json({ message: 'Project Lead or Reviewer access required' });
};
