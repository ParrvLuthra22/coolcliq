import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Helper — check the other user is not blocked
async function isBlockedBetween(a, b) {
  const block = await prisma.block.findFirst({
    where: {
      OR: [
        { blockerId: a, blockedId: b },
        { blockerId: b, blockedId: a },
      ],
    },
  });
  return !!block;
}

// ----- POST /api/chats/start -----
const startSchema = z.object({ recipientId: z.string(), venueId: z.string() });

router.post('/start', requireAuth, async (req, res, next) => {
  try {
    const { recipientId, venueId } = startSchema.parse(req.body);
    if (recipientId === req.userId) return res.status(400).json({ error: 'Cannot chat with yourself' });

    if (await isBlockedBetween(req.userId, recipientId)) {
      return res.status(403).json({ error: 'Chat unavailable' });
    }

    const [myPresence, theirPresence] = await Promise.all([
      prisma.presence.findFirst({
        where: { userId: req.userId, venueId, status: 'ACTIVE', expiresAt: { gt: new Date() } },
      }),
      prisma.presence.findFirst({
        where: { userId: recipientId, venueId, status: 'ACTIVE', expiresAt: { gt: new Date() } },
      }),
    ]);
    if (!myPresence || !theirPresence) {
      return res.status(400).json({ error: 'Both users must be active at the venue' });
    }

    const chat = await prisma.chat.upsert({
      where: {
        initiatorId_recipientId_venueId: {
          initiatorId: req.userId,
          recipientId,
          venueId,
        },
      },
      update: { status: 'ACTIVE' },
      create: {
        initiatorId: req.userId,
        recipientId,
        venueId,
        status: 'ACTIVE',
        initiatorTable: myPresence.tableNumber,
        recipientTable: theirPresence.tableNumber,
      },
    });
    res.json({ chat });
  } catch (e) { next(e); }
});

// ----- GET /api/chats -----
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const chats = await prisma.chat.findMany({
      where: {
        OR: [{ initiatorId: req.userId }, { recipientId: req.userId }],
        status: { not: 'ENDED' },
      },
      include: {
        initiator: { select: { id: true, handle: true, photoUrl: true } },
        recipient: { select: { id: true, handle: true, photoUrl: true } },
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
        venue: { select: { name: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
    res.json({ chats: chats.map(c => sanitizeChat(c, req.userId)) });
  } catch (e) { next(e); }
});

// ----- GET /api/chats/:id/messages -----
router.get('/:id/messages', requireAuth, async (req, res, next) => {
  try {
    const chat = await prisma.chat.findUnique({ where: { id: req.params.id } });
    if (!chat) return res.status(404).json({ error: 'Not found' });
    if (chat.initiatorId !== req.userId && chat.recipientId !== req.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const messages = await prisma.message.findMany({
      where: { chatId: chat.id },
      orderBy: { createdAt: 'asc' },
    });
    res.json({ chat: sanitizeChat(chat, req.userId), messages });
  } catch (e) { next(e); }
});

// ----- POST /api/chats/:id/reveal/request -----
router.post('/:id/reveal/request', requireAuth, async (req, res, next) => {
  try {
    const chat = await prisma.chat.findUnique({ where: { id: req.params.id } });
    if (!chat || (chat.initiatorId !== req.userId && chat.recipientId !== req.userId)) {
      return res.status(404).json({ error: 'Not found' });
    }
    if (chat.revealStatus === 'CONFIRMED') return res.json({ chat });
    const updated = await prisma.chat.update({
      where: { id: chat.id },
      data: { revealStatus: 'REQUESTED', revealRequestedById: req.userId },
    });
    res.json({ chat: sanitizeChat(updated, req.userId) });
  } catch (e) { next(e); }
});

// ----- POST /api/chats/:id/reveal/respond -----
const respondSchema = z.object({ accept: z.boolean() });

router.post('/:id/reveal/respond', requireAuth, async (req, res, next) => {
  try {
    const { accept } = respondSchema.parse(req.body);
    const chat = await prisma.chat.findUnique({ where: { id: req.params.id } });
    if (!chat || (chat.initiatorId !== req.userId && chat.recipientId !== req.userId)) {
      return res.status(404).json({ error: 'Not found' });
    }
    if (chat.revealStatus !== 'REQUESTED') return res.status(400).json({ error: 'No reveal pending' });
    if (chat.revealRequestedById === req.userId) return res.status(400).json({ error: 'You requested this' });

    const updated = await prisma.chat.update({
      where: { id: chat.id },
      data: accept
        ? { revealStatus: 'CONFIRMED', status: 'REVEALED', revealedAt: new Date() }
        : { revealStatus: 'DECLINED' },
    });
    res.json({ chat: sanitizeChat(updated, req.userId) });
  } catch (e) { next(e); }
});

// ----- POST /api/chats/:id/end -----
router.post('/:id/end', requireAuth, async (req, res, next) => {
  try {
    const chat = await prisma.chat.findUnique({ where: { id: req.params.id } });
    if (!chat || (chat.initiatorId !== req.userId && chat.recipientId !== req.userId)) {
      return res.status(404).json({ error: 'Not found' });
    }
    await prisma.chat.update({
      where: { id: chat.id },
      data: { status: 'ENDED', endedAt: new Date(), endedReason: 'USER_LEFT' },
    });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// ----- POST /api/chats/block -----
router.post('/block', requireAuth, async (req, res, next) => {
  try {
    const { userId } = req.body;
    if (!userId || userId === req.userId) return res.status(400).json({ error: 'Bad request' });
    await prisma.block.upsert({
      where: { blockerId_blockedId: { blockerId: req.userId, blockedId: userId } },
      update: {},
      create: { blockerId: req.userId, blockedId: userId },
    });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// Hide the other party's table number until reveal is CONFIRMED
function sanitizeChat(chat, viewerId) {
  const isInitiator = chat.initiatorId === viewerId;
  const myTable = isInitiator ? chat.initiatorTable : chat.recipientTable;
  const theirTable = chat.revealStatus === 'CONFIRMED'
    ? (isInitiator ? chat.recipientTable : chat.initiatorTable)
    : null;
  return { ...chat, myTable, theirTable, initiatorTable: undefined, recipientTable: undefined };
}

export default router;
