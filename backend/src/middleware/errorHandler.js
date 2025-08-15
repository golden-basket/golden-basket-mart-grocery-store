const logger = require('../utils/logger');

// Custom error classes
class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message, details = []) {
    super(message, 400);
    this.details = details;
    this.name = 'ValidationError';
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
    this.name = 'NotFoundError';
  }
}

class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

class RateLimitError extends AppError {
  constructor(message = 'Too many requests') {
    super(message, 429);
    this.name = 'RateLimitError';
  }
}

// Error response formatter
const formatErrorResponse = (error, req) => {
  const baseResponse = {
    error: true,
    message: error.message,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
  };

  // Add request ID if available
  if (req.id) {
    baseResponse.requestId = req.id;
  }

  // Add validation details if available
  if (error.details && Array.isArray(error.details)) {
    baseResponse.details = error.details;
  }

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    baseResponse.stack = error.stack;
    baseResponse.name = error.name;
  }

  return baseResponse;
};

// Main error handling middleware
const errorHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal server error';

  // Log the error
  logger.error('Error occurred:', {
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
      statusCode: error.statusCode,
    },
    request: {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user?.userId,
    },
  });

  // Handle specific error types
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
  } else if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  } else if (error.name === 'MongoError' && error.code === 11000) {
    statusCode = 409;
    message = 'Duplicate field value';
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  } else if (error.name === 'MulterError') {
    statusCode = 400;
    message = 'File upload error';
  }

  // Handle operational vs programming errors
  if (!error.isOperational) {
    // Programming or unknown errors
    logger.error('Programming error:', error);
    message =
      process.env.NODE_ENV === 'production'
        ? 'Something went wrong'
        : error.message;
  }

  // Send error response
  const errorResponse = formatErrorResponse(
    { ...error, message, statusCode },
    req
  );

  res.status(statusCode).json(errorResponse);
};

// 404 handler for unmatched routes
const notFoundHandler = (req, res) => {
  const error = new NotFoundError('Route');
  const errorResponse = formatErrorResponse(error, req);

  logger.warn('Route not found:', {
    method: req.method,
    url: req.url,
    ip: req.ip,
  });

  res.status(404).json(errorResponse);
};

// Async error wrapper
const asyncHandler = fn => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Request ID middleware for tracking
const requestIdMiddleware = (req, res, next) => {
  req.id =
    req.headers['x-request-id'] ||
    req.headers['x-correlation-id'] ||
    `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  res.setHeader('x-request-id', req.id);
  next();
};

// Global error handler for unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', {
    promise,
    reason,
    stack: reason?.stack,
  });

  // Close server gracefully
  process.exit(1);
});

// Global error handler for uncaught exceptions
process.on('uncaughtException', error => {
  logger.error('Uncaught Exception:', {
    error: error.message,
    stack: error.stack,
  });

  // Close server gracefully
  process.exit(1);
});

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  errorHandler,
  notFoundHandler,
  asyncHandler,
  requestIdMiddleware,
};
