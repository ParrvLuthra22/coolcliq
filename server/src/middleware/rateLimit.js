import rateLimit from 'express-rate-limit';

export const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

export const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many OTP requests. Try again in 15 minutes.' },
});

export const chatLimiter = rateLimit({
  windowMs: 10 * 1000,
  max: 8,
  message: { error: 'Slow down — sending messages too fast.' },
});
