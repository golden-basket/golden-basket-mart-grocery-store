const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const logger = require('./utils/logger');
const {
  performanceMiddleware,
  performanceMonitor,
} = require('./utils/performance');

// Import new improvements
const {
  requestIdMiddleware,
  errorHandler,
  notFoundHandler,
} = require('./middleware/errorHandler');
const {
  generalRateLimiter,
  apiRateLimiter,
} = require('./middleware/enhancedRateLimiter');
const databaseOptimizer = require('./utils/databaseOptimizer');
const tokenManager = require('./utils/tokenManager');

const app = express();

// Request ID middleware for tracking
app.use(requestIdMiddleware);

// Performance monitoring middleware
app.use(performanceMiddleware);

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable CSP for development
    crossOriginEmbedderPolicy: false,
  })
);
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(xss()); // Prevent XSS attacks
app.use(hpp()); // Prevent HTTP Parameter Pollution

// Performance middleware - optimize compression
app.use(
  compression({
    level: 6, // Balanced compression level
    threshold: 1024, // Only compress responses > 1KB
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    },
  })
);

// CORS configuration
const corsOrigins =
  process.env.NODE_ENV === 'production'
    ? [process.env.CORS_ORIGIN].filter(Boolean)
    : [
        process.env.CORS_ORIGIN,
        'http://localhost:5173', // Vite dev server
        'http://localhost:3000', // Backend server
        'http://127.0.0.1:5173', // Alternative localhost
        'http://127.0.0.1:3000', // Alternative localhost
      ].filter(Boolean);

app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'Cache-Control',
      'X-File-Name',
    ],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 86400, // 24 hours
  })
);

// Handle preflight requests
app.options('*', cors());

// Body parsing middleware with optimized limits
app.use(
  express.json({
    limit: '10mb',
    strict: true,
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb',
    parameterLimit: 1000,
  })
);

// Apply rate limiting
app.use('/api', apiRateLimiter);
app.use('/', generalRateLimiter);

// Swagger API documentation
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Golden Basket Mart API',
      version: '1.0.0',
      description: 'API documentation for Golden Basket Mart grocery store',
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === 'production'
            ? `${process.env.CORS_ORIGIN}/api`
            : 'http://localhost:3000/api',
        description:
          process.env.NODE_ENV === 'production'
            ? 'Production server'
            : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    requestId: req.id,
  });
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'The server is running. Welcome to Golden Basket Mart API',
    version: '2.1.0',
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

// Performance metrics endpoint (admin only in production)
app.get('/api/performance', (req, res) => {
  const stats = performanceMonitor.getStats();
  res.json({
    message: 'Performance metrics',
    timestamp: new Date().toISOString(),
    stats,
  });
});

// Token management stats endpoint (admin only)
app.get('/api/admin/token-stats', (req, res) => {
  const stats = tokenManager.getStats();
  res.json({
    message: 'Token management statistics',
    timestamp: new Date().toISOString(),
    stats,
  });
});

// Database stats endpoint (admin only)
app.get('/api/admin/database-stats', async (req, res) => {
  try {
    const stats = await databaseOptimizer.getDatabaseStats();
    res.json({
      message: 'Database statistics',
      timestamp: new Date().toISOString(),
      stats,
    });
  } catch (error) {
    logger.error('Failed to get database stats:', error);
    res.status(500).json({
      error: 'Failed to get database statistics',
      message: error.message,
    });
  }
});

const routes = require('./routes/routes');
app.use('/api', routes);

// 404 handler
app.use(notFoundHandler);

// Global error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;
