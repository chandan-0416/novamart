const rateLimit = require('express-rate-limit');
const env = require('../config/env');

const globalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT.WINDOW_MS,
  max: env.RATE_LIMIT.MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'fail',
    message: 'Too many requests from this IP address, please try again after 15 minutes'
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: env.RATE_LIMIT.AUTH_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'fail',
    message: 'Too many authentication attempts from this IP address, please try again after 15 minutes'
  }
});

module.exports = {
  globalLimiter,
  authLimiter
};
