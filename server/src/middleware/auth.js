import { verifyToken } from '../utils/jwt.js';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing token' });
  }
  try {
    const decoded = verifyToken(header.slice(7));
    if (decoded.role !== 'user') return res.status(403).json({ error: 'Forbidden' });
    req.userId = decoded.sub;
    req.handle = decoded.handle;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

export function requireAdmin(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing token' });
  }
  try {
    const decoded = verifyToken(header.slice(7));
    if (decoded.type !== 'admin') return res.status(403).json({ error: 'Admin only' });
    req.adminId = decoded.sub;
    req.adminRole = decoded.role;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}
