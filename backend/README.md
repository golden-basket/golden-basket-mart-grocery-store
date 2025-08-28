# Golden Basket Mart - Backend API

A robust Node.js/Express backend API for the Golden Basket Mart grocery store application. This backend provides a comprehensive REST API with authentication, product management, order processing, and more, built with modern security practices and performance optimization.

## 🚀 Features

- **RESTful API** with comprehensive endpoints and Swagger documentation
- **JWT Authentication** with role-based access control (user/admin)
- **MongoDB Integration** with Mongoose ODM and optimized indexing
- **Security Middleware** (Helmet, CORS, XSS protection, NoSQL injection prevention)
- **API Documentation** with Swagger/OpenAPI 3.0
- **Performance Monitoring** and caching with memory-cache
- **Input Validation** with Joi and Express Validator
- **Enhanced Rate Limiting** with multiple tiers and endpoint-specific limits
- **PDF Generation** for invoices using PDFKit
- **Email Services** with Nodemailer
- **Comprehensive Logging** with Winston
- **Error Handling** and validation
- **Response Compression** for optimized performance
- **Database Indexing** for faster queries
- **Token Management** with secure JWT handling
- **Request ID Tracking** for debugging and monitoring
- **Redis Integration** for enhanced caching and rate limiting

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── controllers/         # Business logic controllers
│   │   ├── authController.js    # Authentication logic
│   │   ├── productController.js # Product management
│   │   ├── cartController.js    # Shopping cart operations
│   │   ├── orderController.js   # Order processing
│   │   ├── categoryController.js # Category management
│   │   ├── addressController.js # Address management
│   ├── models/              # MongoDB schemas
│   │   ├── User.js          # User model with role-based access
│   │   ├── Product.js       # Product model with text search
│   │   ├── Category.js      # Category model
│   │   ├── Cart.js          # Cart model
│   │   ├── Orders.js        # Order model
│   │   ├── ShippingAddress.js # Address model
│   │   └── Invoice.js       # Invoice model
│   ├── routes/              # API route definitions
│   │   └── routes.js        # All API endpoints with Swagger docs
│   ├── middleware/          # Custom middleware
│   │   ├── auth.js          # Authentication middleware
│   │   ├── validation.js    # Input validation
│   │   ├── cache.js         # Caching middleware
│   │   ├── errorHandler.js  # Error handling middleware
│   │   ├── rateLimiter.js   # Basic rate limiting
│   │   └── enhancedRateLimiter.js # Advanced rate limiting
│   └── utils/               # Utility functions
│       ├── logger.js        # Winston logging
│       ├── performance.js   # Performance monitoring
│       ├── databaseOptimizer.js # Database optimization
│       └── tokenManager.js  # JWT token management
├── index.js                 # Server entry point
├── package.json             # Dependencies
└── performance-test.js      # Performance testing utilities
```

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express.js 4.18.2** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose 7.0.3** - Object Document Mapper
- **JWT 9.0.0** - JSON Web Tokens for authentication
- **Joi 17.9.2** - Schema validation
- **Winston 3.11.0** - Logging library
- **Swagger 6.2.8** - API documentation
- **Helmet 7.0.0** - Security middleware
- **CORS 2.8.5** - Cross-origin resource sharing
- **Compression 1.7.4** - Response compression
- **Rate Limiting 7.0.0** - Request throttling
- **PDFKit 0.13.0** - PDF generation
- **Nodemailer 6.9.1** - Email services
- **BCrypt 5.1.0** - Password hashing
- **Express Validator 7.0.1** - Input validation
- **Memory Cache 0.2.0** - Caching
- **Jest 29.7.0** - Testing framework
- **Express Mongo Sanitize 2.2.0** - NoSQL injection prevention
- **XSS Clean 0.1.4** - XSS protection
- **HPP 0.2.3** - HTTP Parameter Pollution protection
- **Redis 4.6.7** - Caching and rate limiting
- **Rate Limit Redis 4.2.0** - Redis-based rate limiting

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Redis (optional, for enhanced rate limiting)
- npm or yarn package manager

### Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file in the root directory:

   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/golden-basket-mart

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

   # CORS Configuration
   # In development: Leave empty to use localhost defaults
   # In production: Set to your frontend domain (e.g., https://yourdomain.com)
   CORS_ORIGIN=

   # Email Configuration (for password reset, etc.)
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=noreply@goldenbasketmart.com

   # Redis Configuration (optional)
   REDIS_URL=redis://localhost:6379

   # Optional: Logging Configuration
   LOG_LEVEL=info
   ```

### CORS Configuration

The application uses a flexible CORS configuration:

- **Development**: Automatically allows localhost origins (5173, 3000, 127.0.0.1 variants)
- **Production**: Only allows the domain specified in `CORS_ORIGIN` environment variable
- **Security**: Prevents unauthorized cross-origin requests in production

### Environment-Specific Behavior

- **Development (`NODE_ENV=development`)**:
  - Allows multiple localhost origins for development convenience
  - Includes fallback URLs for different localhost variants
  - Swagger documentation points to localhost

- **Production (`NODE_ENV=production`)**:
  - Only allows the domain specified in `CORS_ORIGIN`
  - Swagger documentation points to the production domain
  - Stricter security settings

3. **Start the server**

   ```bash
   # Development mode with nodemon
   npm run dev

   # Production mode
   npm start
   ```

## 📱 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run Jest tests
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## 🌐 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify/:token` - Email verification
- `POST /api/auth/change-password` - Change password
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Products

- `GET /api/products` - Get all products (with pagination)
- `GET /api/products/:id` - Get single product
- `GET /api/products/search` - Search products
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create/update category (Admin only)

### Shopping Cart

- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/remove` - Remove item from cart
- `POST /api/cart/clear` - Clear entire cart

### Orders

- `POST /api/orders/place` - Place order from cart
- `GET /api/orders` - Get user's orders
- `GET /api/orders/stats` - Get user's order statistics
- `GET /api/orders/all` - Get all orders (Admin only)
- `GET /api/orders/filtered` - Get filtered orders (Admin only)
- `PUT /api/orders/:id/status` - Update order status (Admin only)
- `PUT /api/orders/:id/payment` - Update payment status (Admin only)

### Addresses

- `GET /api/addresses` - Get user's addresses
- `POST /api/addresses` - Add new address
- `PUT /api/addresses/:id` - Update address
- `DELETE /api/addresses/:id` - Delete address

### Users (Admin only)

- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `PATCH /api/users/:id/role` - Change user role
- `PATCH /api/users/:id/invite` - Send invitation email

### Invoices

- `GET /api/invoices` - Get user's invoices
- `GET /api/invoice/:id` - Download invoice PDF

### Performance & Monitoring

- `GET /api/performance` - Performance metrics
- `GET /api-docs` - API documentation

## 🔐 Authentication & Authorization

### JWT Token Structure

```json
{
  "id": "user_id",
  "email": "user@example.com",
  "role": "user|admin",
  "iat": "issued_at_timestamp",
  "exp": "expiration_timestamp"
}
```

### Protected Routes

- **User Routes**: Require valid JWT token
- **Admin Routes**: Require valid JWT token with admin role
- **Public Routes**: No authentication required

### Middleware Usage

```javascript
// User authentication required
router.get('/protected', auth, controller.method);

// Admin authentication required
router.get('/admin', auth, admin, controller.method);

// Rate limiting for auth routes
router.post('/auth/login', authLimiter, controller.method);
```

### Enhanced Rate Limiting

- **Auth Routes**: 5 requests per 15 minutes
- **General Routes**: 100 requests per 15 minutes
- **API Routes**: 200 requests per 15 minutes
- **Sensitive Routes**: 10 requests per 15 minutes
- **Redis Support**: Optional Redis-based rate limiting for production

## 🗄️ Database Models

### User Model

```javascript
{
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  phone: String (optional),
  role: String (enum: ['user', 'admin'], default: 'user'),
  isVerified: Boolean (default: false),
  isDefaultPassword: Boolean (default: false),
  inviter: ObjectId (ref: 'User'),
  timestamps: true
}
```

### Product Model

```javascript
{
  name: String (required),
  description: String (optional),
  price: Number (required),
  category: ObjectId (ref: 'Category'),
  stock: Number (required),
  images: [String],
  ratings: Number (default: 0),
  reviews: [{
    user: ObjectId (ref: 'User'),
    comment: String,
    rating: Number
  }],
  timestamps: true
}
```

### Order Model

```javascript
{
  user: ObjectId (ref: 'User', required),
  items: [{
    product: ObjectId (ref: 'Product'),
    quantity: Number,
    price: Number
  }],
  totalAmount: Number (required),
  shippingAddress: ObjectId (ref: 'ShippingAddress'),
  orderStatus: String (enum: ['processing', 'shipped', 'delivered', 'cancelled']),
  paymentStatus: String (enum: ['pending', 'paid', 'failed']),
  paymentMethod: String (enum: ['card', 'paypal', 'upi', 'cod', 'net_banking']),
  trackingNumber: String,
  trackingUrl: String,
  notes: String,
  timestamps: true
}
```

### Cart Model

```javascript
{
  user: ObjectId (ref: 'User', required),
  items: [{
    product: ObjectId (ref: 'Product'),
    quantity: Number
  }],
  timestamps: true
}
```

## 🔒 Security Features

### Security Middleware

- **Helmet** - Security headers (Content-Security-Policy, X-Frame-Options, etc.)
- **CORS** - Cross-origin protection with environment-specific configuration
- **XSS Protection** - Cross-site scripting prevention
- **NoSQL Injection Protection** - MongoDB query sanitization
- **Enhanced Rate Limiting** - Multi-tier request throttling with Redis support
- **Input Validation** - Schema-based validation with Joi and Express Validator
- **JWT Security** - Token-based authentication with secure storage
- **Password Hashing** - BCrypt encryption for password security
- **HTTP Parameter Pollution** - HPP protection
- **Request ID Tracking** - Security monitoring and debugging

### CORS Configuration

```javascript
cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400, // 24 hours
});
```

### Enhanced Rate Limiting Configuration

```javascript
// Auth routes: 5 requests per 15 minutes
const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per 15 minutes for auth endpoints
  message: 'Too many authentication attempts. Please try again later.',
});

// General routes: 100 requests per 15 minutes
const generalRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

// API routes: 200 requests per 15 minutes
const apiRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 200,
});

// Sensitive routes: 10 requests per 15 minutes
const strictRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message:
    'Too many requests to this sensitive endpoint. Please try again later.',
});
```

## 📊 Performance Features

### Response Compression

- **Gzip compression** for all responses
- **Optimized compression level** (6) for balanced performance
- **Threshold-based compression** (only compress responses > 1KB)
- **Configurable compression filters**

### Database Optimization

- **Indexing** on frequently queried fields
- **Text search indexes** for product search
- **Compound indexes** for complex queries
- **Lean queries** for better performance
- **Connection pooling** for MongoDB
- **Query optimization** with database optimizer utility

### Caching Strategy

- **Memory-based caching** with memory-cache
- **Cache middleware** for frequently accessed data
- **Cache invalidation** on data updates
- **Configurable cache TTL**
- **Redis integration** for distributed caching

### Performance Monitoring

```javascript
// Performance monitoring middleware
app.use(performanceMiddleware);

// Performance metrics endpoint
app.get('/api/performance', (req, res) => {
  const stats = performanceMonitor.getStats();
  res.json({
    message: 'Performance metrics',
    timestamp: new Date().toISOString(),
    stats,
  });
});
```

## 📝 API Documentation

The API is fully documented using Swagger/OpenAPI 3.0. Access the interactive documentation at:

```
http://localhost:3000/api-docs
```

### Swagger Features

- **Interactive API testing** with try-it-out functionality
- **Request/response examples** for all endpoints
- **Authentication requirements** clearly documented
- **Schema definitions** for all data models
- **Error responses** with status codes and messages
- **Environment-specific documentation** (development vs production)

### Example Swagger Documentation

```javascript
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 */
```

## 🧪 Testing

### Running Tests

```bash
npm test
```

### Test Structure

- **Unit Tests** - Individual function testing
- **Integration Tests** - API endpoint testing with Supertest
- **Performance Tests** - Load and stress testing
- **Error Handling Tests** - Validation and error scenarios

### Example Test

```javascript
describe('POST /api/auth/login', () => {
  it('should login with valid credentials', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
  });
});
```

## 📈 Monitoring & Logging

### Winston Logging

```javascript
// Log levels
logger.info('General application events');
logger.warn('Potential issues');
logger.error('Error tracking');
logger.debug('Development debugging');
```

### Log Configuration

- **Info Level** - General application events
- **Warn Level** - Potential issues and warnings
- **Error Level** - Error tracking and debugging
- **Debug Level** - Development debugging information

### Performance Monitoring

- **Request/response timing** tracking
- **Database query performance** monitoring
- **Memory usage** tracking
- **Endpoint performance metrics**
- **Response time analysis**
- **Request ID tracking** for debugging

## 🚀 Deployment

### Production Configuration

1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set secure JWT secret
4. Configure CORS origin for production domain
5. Set up environment-specific variables
6. Configure logging for production
7. Set up Redis for production rate limiting

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://production-db-uri
JWT_SECRET=production-secret-key
CORS_ORIGIN=https://yourdomain.com
EMAIL_USER=your-production-email
EMAIL_PASS=your-production-password
REDIS_URL=redis://production-redis-uri
LOG_LEVEL=error
```

### Deployment Steps

1. **Build and package** the application
2. **Set up environment variables** for production
3. **Configure MongoDB** connection
4. **Set up Redis** for rate limiting and caching
5. **Set up reverse proxy** (Nginx/Apache)
6. **Configure SSL/TLS** certificates
7. **Set up process manager** (PM2)
8. **Configure monitoring** and logging
9. **Set up backup** strategies

### PM2 Configuration

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'golden-basket-api',
      script: 'index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
    },
  ],
};
```

## 🔧 Configuration

### Server Configuration

```javascript
// Express app configuration
app.use(
  express.json({
    limit: '10mb',
    strict: true,
  })
);
app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb',
    parameterLimit: 1000,
  })
);
```

### Database Configuration

```javascript
// MongoDB connection with options
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});
```

### Security Configuration

```javascript
// Helmet configuration
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable CSP for development
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration
app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 86400,
  })
);
```

## 📞 Support

For backend-specific issues and questions:

1. Check the API documentation at `/api-docs`
2. Review the logs for error details
3. Check the performance metrics at `/api/performance`
4. Verify environment variables are correctly set
5. Open an issue in the GitHub repository

### Common Issues

- **CORS errors**: Check CORS_ORIGIN configuration
- **Database connection**: Verify MongoDB URI and network connectivity
- **Authentication issues**: Check JWT_SECRET and token expiration
- **Performance issues**: Monitor `/api/performance` endpoint
- **Email issues**: Verify email configuration and credentials
- **Rate limiting issues**: Check Redis configuration and rate limit settings

---

**Golden Basket Mart Backend** - Powering your grocery store experience! 🚀🛒

_Built with security, performance, and scalability in mind._
