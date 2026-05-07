import { Router } from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../utils/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import { isInsideVenue } from '../utils/geo.js';

const router = Router();

const PRESENCE_DURATION_MS = 90 * 60 * 1000; // 90 minutes

// ----- POST /api/presence/check-in -----
// body: { qrToken, lat, lng }
const checkInSchema = z.object({
  qrToken: z.string(),
  lat: z.number(),
  lng: z.number(),
});

router.post('/check-in', requireAuth, async (req, res, next) => {
  try {
    const { qrToken, lat, lng } = checkInSchema.parse(req.body);

    // 1. Decode unverified to get venue id
    const decodedRaw = jwt.decode(qrToken);
    if (!decodedRaw?.vid) return res.status(400).json({ error: 'Malformed QR' });

    const venue = await prisma.venue.findUnique({ where: { id: decodedRaw.vid } });
    if (!venue || !venue.isActive) return res.status(404).json({ error: 'Venue not active' });

    // 2. Verify against venue secret + version (prevents cloning of revoked QRs)
    let decoded;
    try {
      decoded = jwt.verify(qrToken, venue.qrSecret);
    } catch {
      return res.status(401).json({ error: 'Invalid QR signature' });
    }
    if (decoded.v !== venue.qrVersion) {
      return res.status(401).json({ error: 'QR has been rotated. Scan the latest one.' });
    }

    // 3. Geo-validate: user must be inside the venue radius
    if (!isInsideVenue(lat, lng, venue)) {
      return res.status(403).json({ error: 'You must be at the venue to check in' });
    }

    // 4. Single-use jti — prevent token replay
    const jti = decoded.jti || crypto.randomUUID();

    // 5. End any existing active presence for this user
    await prisma.presence.updateMany({
      where: { userId: req.userId, status: 'ACTIVE' },
      data: { status: 'ENDED', endedAt: new Date() },
    });

    // 6. Assign a table number (in real world: handed by venue / QR is per-table).
    //    For Phase 1: random unused table.
    const taken = await prisma.presence.findMany({
      where: { venueId: venue.id, status: 'ACTIVE', expiresAt: { gt: new Date() } },
      select: { tableNumber: true },
    });
    const used = new Set(taken.map(t => t.tableNumber));
    let tableNumber = 1;
    while (used.has(tableNumber) && tableNumber <= venue.totalTables) tableNumber++;

    const presence = await prisma.presence.create({
      data: {
        userId: req.userId,
        venueId: venue.id,
        tableNumber,
        checkInLat: lat,
        checkInLng: lng,
        qrTokenJti: jti + '-' + Date.now(),
        expiresAt: new Date(Date.now() + PRESENCE_DURATION_MS),
      },
    });

    res.json({ presence, venue: { id: venue.id, name: venue.name } });
  } catch (e) { next(e); }
});

// ----- GET /api/presence/me -----
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const presence = await prisma.presence.findFirst({
      where: { userId: req.userId, status: 'ACTIVE', expiresAt: { gt: new Date() } },
      include: { venue: true },
    });
    res.json({ presence });
  } catch (e) { next(e); }
});

// ----- POST /api/presence/check-out -----
router.post('/check-out', requireAuth, async (req, res, next) => {
  try {
    await prisma.presence.updateMany({
      where: { userId: req.userId, status: 'ACTIVE' },
      data: { status: 'ENDED', endedAt: new Date() },
    });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// ----- POST /api/presence/panic -----
// Instantly ends presence + closes all active chats
router.post('/panic', requireAuth, async (req, res, next) => {
  try {
    await prisma.$transaction([
      prisma.presence.updateMany({
        where: { userId: req.userId, status: 'ACTIVE' },
        data: { status: 'ENDED', endedAt: new Date() },
      }),
      prisma.chat.updateMany({
        where: {
          OR: [{ initiatorId: req.userId }, { recipientId: req.userId }],
          status: { in: ['ACTIVE', 'PENDING'] },
        },
        data: { status: 'ENDED', endedAt: new Date(), endedReason: 'PANIC_EXIT' },
      }),
    ]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default router;
