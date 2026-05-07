import { verifyToken } from '../utils/jwt.js';
import { prisma } from '../utils/prisma.js';

export function registerChatSocket(io) {
  // Auth middleware on the socket handshake
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('No token'));
      const decoded = verifyToken(token);
      socket.userId = decoded.sub;
      socket.handle = decoded.handle;
      next();
    } catch {
      next(new Error('Bad token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`socket connected: ${socket.handle}`);

    // Join a chat room (must be a participant)
    socket.on('chat:join', async ({ chatId }, ack) => {
      const chat = await prisma.chat.findUnique({ where: { id: chatId } });
      if (!chat) return ack?.({ ok: false, error: 'Chat not found' });
      if (chat.initiatorId !== socket.userId && chat.recipientId !== socket.userId) {
        return ack?.({ ok: false, error: 'Forbidden' });
      }
      socket.join(`chat:${chatId}`);
      ack?.({ ok: true });
    });

    // Send a message
    socket.on('chat:message', async ({ chatId, content }, ack) => {
      try {
        if (!content || content.length > 1000) return ack?.({ ok: false, error: 'Bad content' });
        const chat = await prisma.chat.findUnique({ where: { id: chatId } });
        if (!chat || chat.status === 'ENDED') return ack?.({ ok: false, error: 'Chat closed' });
        if (chat.initiatorId !== socket.userId && chat.recipientId !== socket.userId) {
          return ack?.({ ok: false, error: 'Forbidden' });
        }
        const msg = await prisma.message.create({
          data: { chatId, senderId: socket.userId, content },
        });
        await prisma.chat.update({ where: { id: chatId }, data: { updatedAt: new Date() } });
        io.to(`chat:${chatId}`).emit('chat:message', msg);
        ack?.({ ok: true, message: msg });
      } catch (e) {
        ack?.({ ok: false, error: e.message });
      }
    });

    // Typing indicator
    socket.on('chat:typing', ({ chatId, isTyping }) => {
      socket.to(`chat:${chatId}`).emit('chat:typing', { userId: socket.userId, isTyping });
    });

    // Reveal request notification
    socket.on('chat:reveal-request', ({ chatId }) => {
      socket.to(`chat:${chatId}`).emit('chat:reveal-request', { from: socket.userId });
    });

    socket.on('disconnect', () => {
      // optionally update lastSeenAt
      prisma.user.update({ where: { id: socket.userId }, data: { lastSeenAt: new Date() } }).catch(() => {});
    });
  });
}
