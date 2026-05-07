import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { Server as SocketServer } from 'socket.io';

import authRoutes from './routes/auth.js';
import venueRoutes from './routes/venues.js';
import presenceRoutes from './routes/presence.js';
import chatRoutes from './routes/chats.js';
import reportRoutes from './routes/reports.js';
import adminRoutes from './routes/admin.js';
import { registerChatSocket } from './sockets/chat.js';
import { errorHandler } from './middleware/errorHandler.js';
import { generalLimiter } from './middleware/rateLimit.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// ---------- Middleware ----------
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN?.split(',') || '*',
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('tiny'));
app.use(generalLimiter);

// ---------- Routes ----------
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'coolcliq-api', time: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/presence', presenceRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

// ---------- Socket.IO ----------
const io = new SocketServer(server, {
  cors: { origin: process.env.CLIENT_ORIGIN?.split(',') || '*' },
});
registerChatSocket(io);

// ---------- Start ----------
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 CoolCliq API running on :${PORT}`);
});
