export function errorHandler(err, _req, res, _next) {
  console.error('[error]', err);
  if (err.name === 'ZodError') {
    return res.status(400).json({ error: 'Validation failed', details: err.errors });
  }
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'Resource already exists' });
  }
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
}
