const rateLimit = require('express-rate-limit');

// Create rate limiters for different endpoints
const createRateLimiter = (options = {}) => {
  return rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000, // 15 minutes
    max: options.max || 100, // limit each IP to 100 requests per windowMs
    message:
      options.message ||
      'Too many requests from this IP, please try again later.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    keyGenerator: req => {
      // Use IP address for rate limiting
      return req.ip;
    },
    handler: (req, res) => {
      res.status(429).json({
        error: 'Too many requests',
        message:
          options.message || 'Too many requests. Please try again later.',
        retryAfter: Math.ceil(options.windowMs / 1000),
      });
    },
    skip: req => {
      // Skip rate limiting for certain conditions
      return req.path === '/health' || req.path === '/api-docs';
    },
    ...options,
  });
};

// Specific rate limiters for different endpoints
const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per 15 minutes for auth endpoints
  message: 'Too many authentication attempts. Please try again later.',
});

const generalRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes for general endpoints
});

const apiRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 requests per 15 minutes for API endpoints
});

const strictRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per 15 minutes for sensitive endpoints
  message:
    'Too many requests to this sensitive endpoint. Please try again later.',
});

module.exports = {
  authRateLimiter,
  generalRateLimiter,
  apiRateLimiter,
  strictRateLimiter,
  createRateLimiter,
};
