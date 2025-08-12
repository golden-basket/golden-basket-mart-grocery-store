# Golden Basket Mart - Backend API

A robust Node.js/Express backend API for the Golden Basket Mart grocery store application. This backend provides a comprehensive REST API with authentication, product management, order processing, and more.

## 🚀 Features

- **RESTful API** with comprehensive endpoints
- **JWT Authentication** with role-based access control
- **MongoDB Integration** with Mongoose ODM
- **Security Middleware** (Helmet, CORS, XSS protection, etc.)
- **API Documentation** with Swagger/OpenAPI
- **Performance Monitoring** and caching
- **Input Validation** with Joi and Express Validator
- **Rate Limiting** and security measures
- **PDF Generation** for invoices
- **Email Services** with Nodemailer
- **Comprehensive Logging** with Winston
- **Error Handling** and validation

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
│   │   └── projectController.js # Project utilities
│   ├── models/              # MongoDB schemas
│   │   ├── User.js          # User model
│   │   ├── Product.js       # Product model
│   │   ├── Category.js      # Category model
│   │   ├── Cart.js          # Cart model
│   │   ├── Orders.js        # Order model
│   │   ├── ShippingAddress.js # Address model
│   │   └── Invoice.js       # Invoice model
│   ├── routes/              # API route definitions
│   │   └── routes.js        # All API endpoints
│   ├── middleware/          # Custom middleware
│   │   ├── auth.js          # Authentication middleware
│   │   ├── validation.js    # Input validation
│   │   └── cache.js         # Caching middleware
│   └── utils/               # Utility functions
│       ├── logger.js        # Winston logging
│       └── performance.js   # Performance monitoring
├── index.js                 # Server entry point
├── package.json             # Dependencies
└── performance-test.js      # Performance testing utilities
```

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - Object Document Mapper
- **JWT** - JSON Web Tokens for authentication
- **Joi** - Schema validation
- **Winston** - Logging library
- **Swagger** - API documentation
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Compression** - Response compression
- **Rate Limiting** - Request throttling

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/golden-basket-mart
   JWT_SECRET=your-super-secret-jwt-key
   CORS_ORIGIN=http://localhost:5173
   NODE_ENV=development
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

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

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/me` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Products
- `GET /api/products` - Get all products (with pagination)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create category (Admin only)
- `PUT /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Delete category (Admin only)

### Shopping Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/remove/:productId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Orders
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status (Admin only)
- `GET /api/orders/:id/invoice` - Download order invoice

### Addresses
- `GET /api/addresses` - Get user's addresses
- `POST /api/addresses` - Add new address
- `PUT /api/addresses/:id` - Update address
- `DELETE /api/addresses/:id` - Delete address

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

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

## 🗄️ Database Models

### User Model
- Authentication fields (email, password)
- Profile information (firstName, lastName, phone)
- Role-based access control
- Timestamps and validation

### Product Model
- Product details (name, description, price)
- Inventory management (stock, category)
- Image support and ratings
- Search optimization with text indexes

### Order Model
- Order details and status tracking
- Payment information
- Shipping address reference
- Invoice generation support

### Cart Model
- User-specific shopping cart
- Product references with quantities
- Real-time stock validation

## 🔒 Security Features

- **Helmet** - Security headers
- **CORS** - Cross-origin protection
- **XSS Protection** - Cross-site scripting prevention
- **NoSQL Injection Protection** - MongoDB query sanitization
- **Rate Limiting** - Request throttling
- **Input Validation** - Schema-based validation
- **JWT Security** - Token-based authentication

## 📊 Performance Features

- **Response Compression** - Gzip compression
- **Database Indexing** - Optimized queries
- **Caching Middleware** - Memory-based caching
- **Performance Monitoring** - Request/response timing
- **Query Optimization** - Lean queries and field selection

## 📝 API Documentation

The API is fully documented using Swagger/OpenAPI 3.0. Access the interactive documentation at:

```
http://localhost:3000/api-docs
```

### Swagger Features
- Interactive API testing
- Request/response examples
- Authentication requirements
- Schema definitions
- Error responses

## 🧪 Testing

### Running Tests
```bash
npm test
```

### Test Structure
- **Unit Tests** - Individual function testing
- **Integration Tests** - API endpoint testing
- **Performance Tests** - Load and stress testing

## 📈 Monitoring & Logging

### Winston Logging
- **Info Level** - General application events
- **Warn Level** - Potential issues
- **Error Level** - Error tracking
- **Debug Level** - Development debugging

### Performance Monitoring
- Request/response timing
- Database query performance
- Memory usage tracking
- Endpoint performance metrics

## 🚀 Deployment

### Production Configuration
1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set secure JWT secret
4. Configure CORS origin for production domain
5. Set up environment-specific variables

### Environment Variables
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://production-db-uri
JWT_SECRET=production-secret-key
CORS_ORIGIN=https://yourdomain.com
```

## 🔧 Configuration

### CORS Settings
```javascript
cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
})
```

### Rate Limiting
- **Auth Routes**: 5 requests per 15 minutes
- **General Routes**: 100 requests per 15 minutes
- **Admin Routes**: 1000 requests per 15 minutes

## 📞 Support

For backend-specific issues and questions:
1. Check the API documentation at `/api-docs`
2. Review the logs for error details
3. Open an issue in the GitHub repository

---

**Golden Basket Mart Backend** - Powering your grocery store experience! 🚀🛒 