const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redis = require('redis');
const logger = require('../utils/logger');

// Redis client for rate limiting (optional - falls back to memory if not available)
let redisClient = null;
try {
  redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  });
  redisClient.connect().catch(err => {
    logger.warn(
      'Redis connection failed, using memory store for rate limiting:',
      err.message
    );
    redisClient = null;
  });
} catch (error) {
  logger.warn('Redis not available, using memory store for rate limiting');
}

// Create Redis store if available
const createRedisStore = () => {
  if (redisClient) {
    return new RedisStore({
      sendCommand: (...args) => redisClient.sendCommand(args),
    });
  }
  return null;
};

// General API rate limiter
const apiLimiter = rateLimit({
  store: createRedisStore(),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}, Path: ${req.path}`);
    res.status(429).json({
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.ceil((15 * 60) / 60), // minutes
    });
  },
});

// Authentication rate limiter (more strict)
const authLimiter = rateLimit({
  store: createRedisStore(),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  skipSuccessfulRequests: true, // Don't count successful requests
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: '15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(
      `Auth rate limit exceeded for IP: ${req.ip}, Path: ${req.path}`
    );
    res.status(429).json({
      error: 'Too many authentication attempts, please try again later.',
      retryAfter: Math.ceil((15 * 60) / 60),
    });
  },
});

// Login-specific rate limiter (very strict)
const loginLimiter = rateLimit({
  store: createRedisStore(),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 3 login attempts per windowMs
  skipSuccessfulRequests: true,
  message: {
    error: 'Too many login attempts, please try again later.',
    retryAfter: '15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Login rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many login attempts, please try again later.',
      retryAfter: Math.ceil((15 * 60) / 60),
    });
  },
});

// Password reset rate limiter
const passwordResetLimiter = rateLimit({
  store: createRedisStore(),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password reset requests per hour
  skipSuccessfulRequests: true,
  message: {
    error: 'Too many password reset requests, please try again later.',
    retryAfter: '1 hour',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Password reset rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many password reset requests, please try again later.',
      retryAfter: Math.ceil(60 / 60), // 1 hour
    });
  },
});

// Registration rate limiter
const registrationLimiter = rateLimit({
  store: createRedisStore(),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 2, // Limit each IP to 2 registration attempts per hour
  skipSuccessfulRequests: true,
  message: {
    error: 'Too many registration attempts, please try again later.',
    retryAfter: '1 hour',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Registration rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many registration attempts, please try again later.',
      retryAfter: Math.ceil(60 / 60),
    });
  },
});

// Email verification rate limiter
const emailVerificationLimiter = rateLimit({
  store: createRedisStore(),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 email verification requests per hour
  skipSuccessfulRequests: true,
  message: {
    error: 'Too many email verification requests, please try again later.',
    retryAfter: '1 hour',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Email verification rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many email verification requests, please try again later.',
      retryAfter: Math.ceil(60 / 60),
    });
  },
});

// Admin API rate limiter (less strict for admin users)
const adminLimiter = rateLimit({
  store: createRedisStore(),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Higher limit for admin operations
  message: {
    error: 'Too many admin requests, please try again later.',
    retryAfter: '15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(
      `Admin rate limit exceeded for IP: ${req.ip}, User: ${req.user?.email}`
    );
    res.status(429).json({
      error: 'Too many admin requests, please try again later.',
      retryAfter: Math.ceil((15 * 60) / 60),
    });
  },
});

// File upload rate limiter
const uploadLimiter = rateLimit({
  store: createRedisStore(),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 uploads per hour
  message: {
    error: 'Too many file uploads, please try again later.',
    retryAfter: '1 hour',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Upload rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many file uploads, please try again later.',
      retryAfter: Math.ceil(60 / 60),
    });
  },
});

// Dynamic rate limiter based on user role
const dynamicLimiter = (defaultLimit = 100, adminLimit = 200) => {
  return rateLimit({
    store: createRedisStore(),
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: req => {
      // Higher limit for admin users
      if (req.user && req.user.role === 'admin') {
        return adminLimit;
      }
      return defaultLimit;
    },
    message: {
      error: 'Too many requests, please try again later.',
      retryAfter: '15 minutes',
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn(
        `Dynamic rate limit exceeded for IP: ${req.ip}, User: ${
          req.user?.email || 'anonymous'
        }`
      );
      res.status(429).json({
        error: 'Too many requests, please try again later.',
        retryAfter: Math.ceil((15 * 60) / 60),
      });
    },
  });
};

// Whitelist middleware for trusted IPs
const whitelistMiddleware = (req, res, next) => {
  const trustedIPs = process.env.TRUSTED_IPS
    ? process.env.TRUSTED_IPS.split(',')
    : [];
  if (trustedIPs.includes(req.ip)) {
    req.isTrustedIP = true;
  }
  next();
};

// Rate limiter that skips trusted IPs
const createTrustedLimiter = limiter => {
  return (req, res, next) => {
    if (req.isTrustedIP) {
      return next();
    }
    return limiter(req, res, next);
  };
};

module.exports = {
  apiLimiter: createTrustedLimiter(apiLimiter),
  authLimiter: createTrustedLimiter(authLimiter),
  loginLimiter: createTrustedLimiter(loginLimiter),
  passwordResetLimiter: createTrustedLimiter(passwordResetLimiter),
  registrationLimiter: createTrustedLimiter(registrationLimiter),
  emailVerificationLimiter: createTrustedLimiter(emailVerificationLimiter),
  adminLimiter: createTrustedLimiter(adminLimiter),
  uploadLimiter: createTrustedLimiter(uploadLimiter),
  dynamicLimiter,
  whitelistMiddleware,
  createTrustedLimiter,
};
