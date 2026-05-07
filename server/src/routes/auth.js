import { Router } from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { prisma } from '../utils/prisma.js';
import { signUserToken } from '../utils/jwt.js';
import { otpLimiter } from '../middleware/rateLimit.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// ----- POST /api/auth/otp/request -----
const otpRequestSchema = z.object({
  phone: z.string().regex(/^\+?\d{10,15}$/),
});

router.post('/otp/request', otpLimiter, async (req, res, next) => {
  try {
    const { phone } = otpRequestSchema.parse(req.body);
    // In production: integrate Twilio / MSG91 / Firebase Auth here.
    // For Phase 1 dev: generate, hash, store.
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const codeHash = await bcrypt.hash(code, 8);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.otpCode.create({ data: { phone, codeHash, expiresAt } });

    // 🔐 In dev only — return code so the tester can use it.
    const devEcho = process.env.NODE_ENV === 'development' ? { devCode: code } : {};
    res.json({ ok: true, expiresAt, ...devEcho });
  } catch (e) { next(e); }
});

// ----- POST /api/auth/otp/verify -----
const otpVerifySchema = z.object({
  phone: z.string(),
  code: z.string().length(6),
  // optional first-time-signup payload
  handle: z.string().min(3).max(20).optional(),
  age: z.number().int().min(18).max(99).optional(),
  gender: z.enum(['MALE','FEMALE','NON_BINARY','PREFER_NOT_TO_SAY']).optional(),
});

router.post('/otp/verify', async (req, res, next) => {
  try {
    const { phone, code, handle, age, gender } = otpVerifySchema.parse(req.body);

    const otp = await prisma.otpCode.findFirst({
      where: { phone, consumed: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });
    if (!otp) return res.status(400).json({ error: 'OTP expired or not found' });

    const ok = await bcrypt.compare(code, otp.codeHash);
    if (!ok) {
      await prisma.otpCode.update({ where: { id: otp.id }, data: { attempts: { increment: 1 } } });
      return res.status(400).json({ error: 'Invalid OTP' });
    }
    await prisma.otpCode.update({ where: { id: otp.id }, data: { consumed: true } });

    let user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      if (!handle || !age || !gender) {
        return res.status(200).json({ needsProfile: true });
      }
      user = await prisma.user.create({
        data: { phone, handle, age, gender, ageGateAccepted: true, termsAcceptedAt: new Date() },
      });
    }
    if (user.status === 'BANNED' || user.status === 'SUSPENDED') {
      return res.status(403).json({ error: `Account ${user.status.toLowerCase()}` });
    }
    res.json({ token: signUserToken(user), user });
  } catch (e) { next(e); }
});

// ----- GET /api/auth/me -----
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    res.json({ user });
  } catch (e) { next(e); }
});

// ----- DELETE /api/auth/me -----
router.delete('/me', requireAuth, async (req, res, next) => {
  try {
    await prisma.user.update({
      where: { id: req.userId },
      data: { status: 'DELETED', deletedAt: new Date() },
    });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default router;
