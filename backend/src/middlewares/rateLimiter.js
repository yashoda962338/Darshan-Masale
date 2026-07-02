const rateLimit = require('express-rate-limit');
const config = require('../config/environment');

const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
    errors: ['RATE_LIMIT_EXCEEDED']
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
    errors: ['AUTH_RATE_LIMIT']
  },
});

module.exports = { limiter, authLimiter };