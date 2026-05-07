import { Router } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../utils/prisma.js';
import { signAdminToken } from '../utils/jwt.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// ---------- LOGIN ----------
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin || !admin.isActive) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    await prisma.admin.update({ where: { id: admin.id }, data: { lastLoginAt: new Date() } });
    res.json({ token: signAdminToken(admin), admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role } });
  } catch (e) { next(e); }
});

// ---------- DASHBOARD STATS ----------
router.get('/stats', requireAdmin, async (_req, res, next) => {
  try {
    const todayStart = new Date(); todayStart.setHours(0,0,0,0);
    const [activeNow, dau, totalUsers, openReports, chatsToday, revealedToday] = await Promise.all([
      prisma.presence.count({ where: { status: 'ACTIVE', expiresAt: { gt: new Date() } } }),
      prisma.user.count({ where: { lastSeenAt: { gte: todayStart } } }),
      prisma.user.count(),
      prisma.report.count({ where: { status: 'OPEN' } }),
      prisma.chat.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.chat.count({ where: { revealedAt: { gte: todayStart } } }),
    ]);
    const revealRate = chatsToday === 0 ? 0 : Math.round((revealedToday / chatsToday) * 100);
    res.json({ activeNow, dau, totalUsers, openReports, chatsToday, revealedToday, revealRate });
  } catch (e) { next(e); }
});

// ---------- VENUES ----------
const venueSchema = z.object({
  name: z.string(),
  address: z.string(),
  city: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  geoRadiusMeters: z.number().int().min(20).max(500).default(80),
  totalTables: z.number().int().default(20),
  coverImageUrl: z.string().url().optional(),
});

router.post('/venues', requireAdmin, async (req, res, next) => {
  try {
    const data = venueSchema.parse(req.body);
    const venue = await prisma.venue.create({
      data: { ...data, qrSecret: crypto.randomBytes(32).toString('hex') },
    });
    res.json({ venue });
  } catch (e) { next(e); }
});

router.get('/venues', requireAdmin, async (_req, res, next) => {
  try {
    const venues = await prisma.venue.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { presences: true } } },
    });
    res.json({ venues });
  } catch (e) { next(e); }
});

// Generate a printable QR token for a venue (returns the JWT — embed in QR image)
router.post('/venues/:id/qr', requireAdmin, async (req, res, next) => {
  try {
    const venue = await prisma.venue.findUnique({ where: { id: req.params.id } });
    if (!venue) return res.status(404).json({ error: 'Not found' });
    const token = jwt.sign(
      { vid: venue.id, v: venue.qrVersion, jti: crypto.randomUUID() },
      venue.qrSecret,
      { expiresIn: '365d' }
    );
    res.json({ token, qrPayload: token });
  } catch (e) { next(e); }
});

// Rotate QR (invalidates all printed QRs)
router.post('/venues/:id/rotate-qr', requireAdmin, async (req, res, next) => {
  try {
    const venue = await prisma.venue.update({
      where: { id: req.params.id },
      data: {
        qrVersion: { increment: 1 },
        qrSecret: crypto.randomBytes(32).toString('hex'),
      },
    });
    res.json({ venue });
  } catch (e) { next(e); }
});

// ---------- MODERATION QUEUE ----------
router.get('/reports', requireAdmin, async (req, res, next) => {
  try {
    const status = req.query.status || 'OPEN';
    const reports = await prisma.report.findMany({
      where: { status },
      include: {
        reporter: { select: { id: true, handle: true } },
        reported: { select: { id: true, handle: true, status: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    res.json({ reports });
  } catch (e) { next(e); }
});

router.post('/reports/:id/resolve', requireAdmin, async (req, res, next) => {
  try {
    const { actionTaken, dismiss } = req.body;
    const report = await prisma.report.update({
      where: { id: req.params.id },
      data: {
        status: dismiss ? 'DISMISSED' : 'RESOLVED',
        reviewedById: req.adminId,
        reviewedAt: new Date(),
        actionTaken,
      },
    });
    res.json({ report });
  } catch (e) { next(e); }
});

// ---------- USER MANAGEMENT ----------
router.get('/users', requireAdmin, async (req, res, next) => {
  try {
    const q = String(req.query.q || '');
    const users = await prisma.user.findMany({
      where: q ? { OR: [{ handle: { contains: q, mode: 'insensitive' } }, { phone: { contains: q } }] } : {},
      take: 50,
      orderBy: { createdAt: 'desc' },
    });
    res.json({ users });
  } catch (e) { next(e); }
});

router.post('/users/:id/action', requireAdmin, async (req, res, next) => {
  try {
    const { action } = req.body; // SUSPEND | BAN | RESTORE
    const map = { SUSPEND: 'SUSPENDED', BAN: 'BANNED', RESTORE: 'ACTIVE' };
    if (!map[action]) return res.status(400).json({ error: 'Bad action' });
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { status: map[action] },
    });
    await prisma.auditLog.create({
      data: { adminId: req.adminId, action: `USER_${action}`, targetType: 'User', targetId: user.id },
    });
    res.json({ user });
  } catch (e) { next(e); }
});

// ---------- CSV EXPORT ----------
router.get('/export/users.csv', requireAdmin, async (_req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, handle: true, age: true, gender: true, status: true, createdAt: true },
    });
    const header = 'id,handle,age,gender,status,createdAt\n';
    const rows = users.map(u => [u.id, u.handle, u.age, u.gender, u.status, u.createdAt.toISOString()].join(','));
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="users.csv"');
    res.send(header + rows.join('\n'));
  } catch (e) { next(e); }
});

export default router;
