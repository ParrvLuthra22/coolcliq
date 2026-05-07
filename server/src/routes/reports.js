import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const reportSchema = z.object({
  reportedId: z.string(),
  chatId: z.string().optional(),
  reason: z.enum(['HARASSMENT','SPAM','INAPPROPRIATE_CONTENT','FAKE_PROFILE','UNDERAGE','OTHER']),
  details: z.string().max(500).optional(),
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const data = reportSchema.parse(req.body);
    if (data.reportedId === req.userId) return res.status(400).json({ error: 'Cannot report self' });
    const report = await prisma.report.create({
      data: { ...data, reporterId: req.userId },
    });
    res.json({ report });
  } catch (e) { next(e); }
});

export default router;
