# Golden Basket Mart - Grocery Store

A full-stack e-commerce grocery store application built with modern web technologies. This project features a React 19 frontend with Material-UI 7 components and a Node.js/Express backend with MongoDB database, designed for optimal performance and user experience across all devices including foldables and ultra-wide screens.

## 🚀 Features

### Frontend Features

- **Modern React 19.1.0** with hooks and functional components
- **Material-UI 7.1.1** for beautiful, responsive design with custom theme
- **Responsive Design** optimized for all device sizes including foldables and ultra-wide screens
- **Lazy Loading** for improved performance with React.lazy()
- **React Router 7.6.2** for client-side navigation with HashRouter
- **React Query (TanStack Query) 5.0.0** for efficient data fetching and caching
- **Form Validation** with React Hook Form 7.48.0
- **Error Boundaries** for graceful error handling
- **Custom Hooks** for authentication, cart management, and responsive design
- **Performance Optimization** with code splitting and bundle optimization
- **Service Worker Support** for offline functionality
- **Dark Mode Toggle** with theme switching capability

### Backend Features

- **Node.js/Express** server with RESTful API
- **MongoDB** database with Mongoose ODM
- **JWT Authentication** with role-based access control (user/admin)
- **Security Middleware** (Helmet, CORS, XSS protection, NoSQL injection prevention)
- **API Documentation** with Swagger/OpenAPI 3.0
- **Performance Monitoring** and caching with memory-cache
- **Input Validation** with Joi and Express Validator
- **Enhanced Rate Limiting** with multiple tiers and endpoint-specific limits
- **PDF Generation** for invoices using PDFKit
- **Email Services** with Nodemailer
- **Comprehensive Logging** with Winston
- **Response Compression** for optimized performance
- **Database Optimization** with indexing and query optimization
- **Token Management** with secure JWT handling
- **Request ID Tracking** for debugging and monitoring

### Core Functionality

- **User Authentication** (Register, Login, Password Management, Profile Updates)
- **Product Catalog** with categories, search, and filtering
- **Shopping Cart** management with real-time updates
- **Order Processing** and checkout with multiple payment methods
- **Address Management** for shipping addresses
- **Admin Panel** for product, user, and order management
- **Order History** and tracking with status updates
- **Invoice Generation** and download
- **Responsive Design** for all devices with foldable support
- **Role-Based Access Control** with permission management
- **Performance Monitoring** and analytics
- **Role-Based Access Control** with permission management
- **Performance Monitoring** and analytics

## 🏗️ Project Structure

```
golden-basket-mart-grocery-store/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/    # Business logic controllers
│   │   │   ├── authController.js    # Authentication logic
│   │   │   ├── productController.js # Product management
│   │   │   ├── cartController.js    # Shopping cart operations
│   │   │   ├── orderController.js   # Order processing
│   │   │   ├── categoryController.js # Category management
│   │   │   ├── addressController.js # Address management
│   │   ├── models/         # MongoDB schemas
│   │   │   ├── User.js          # User model with role-based access
│   │   │   ├── Product.js       # Product model with text search
│   │   │   ├── Category.js      # Category model
│   │   │   ├── Cart.js          # Cart model
│   │   │   ├── Orders.js        # Order model
│   │   │   ├── ShippingAddress.js # Address model
│   │   │   └── Invoice.js       # Invoice model
│   │   ├── routes/         # API route definitions
│   │   │   └── routes.js        # All API endpoints with Swagger docs
│   │   ├── middleware/     # Custom middleware
│   │   │   ├── auth.js          # Authentication middleware
│   │   │   ├── validation.js    # Input validation
│   │   │   ├── cache.js         # Caching middleware
│   │   │   ├── errorHandler.js  # Error handling middleware
│   │   │   ├── rateLimiter.js   # Basic rate limiting
│   │   │   └── enhancedRateLimiter.js # Advanced rate limiting
│   │   └── utils/          # Utility functions
│   │       ├── logger.js        # Winston logging
│   │       ├── performance.js   # Performance monitoring
│   │       ├── databaseOptimizer.js # Database optimization
│   │       └── tokenManager.js  # JWT token management
│   ├── index.js            # Server entry point
│   ├── package.json        # Backend dependencies
│   └── performance-test.js # Performance testing utilities
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── Navbar.jsx       # Responsive navigation
│   │   │   ├── Footer.jsx       # Footer component
│   │   │   ├── Loading.jsx      # Loading spinner
│   │   │   ├── ErrorBoundary.jsx # Error handling
│   │   │   ├── ProtectedRoute.jsx # Route protection
│   │   │   ├── HeroBanner.jsx   # Home page banner
│   │   │   ├── ProductCarousel.jsx # Product showcase
│   │   │   ├── AddProductDialog.jsx # Product management
│   │   │   ├── EditProfileDialog.jsx # Profile editing
│   │   │   ├── ChangePasswordDialog.jsx # Password management
│   │   │   ├── PaymentMethodSelector.jsx # Payment selection
│   │   │   ├── ReusableFilterControls.jsx # Filter components
│   │   │   ├── ToastNotifications.jsx # Notifications
│   │   │   ├── ImageWithFallback.jsx # Image handling
│   │   │   ├── DarkModeToggle.jsx # Theme switching
│   │   │   ├── EnhancedSearch.jsx # Advanced search
│   │   │   ├── FilterStatusBar.jsx # Filter status display
│   │   │   ├── JumpingCartAvatar.jsx # Animated cart indicator
│   │   │   ├── LoadingSkeleton.jsx # Loading placeholders
│   │   │   ├── OptimizedProductCard.jsx # Product display
│   │   │   ├── PermissionGuard.jsx # Permission checking
│   │   │   ├── RoleBasedAccess.jsx # Role-based UI
│   │   │   ├── RoleBasedNavigation.jsx # Role-based navigation
│   │   │   ├── RoleBasedUI.jsx # Role-based components
│   │   │   ├── TestResetPassword.jsx # Password reset testing
│   │   │   ├── TestVerification.jsx # Email verification testing
│   │   │   └── admin/           # Admin-specific components
│   │   │       ├── CategoryManagement.jsx
│   │   │       ├── OrderManagement.jsx
│   │   │       ├── ProductManagement.jsx
│   │   │       ├── UserManagement.jsx
│   │   │       └── adminStyles.js
│   │   ├── pages/          # Page components
│   │   │   ├── Home.jsx         # Home page
│   │   │   ├── Catalogue.jsx    # Product catalog
│   │   │   ├── Cart.jsx         # Shopping cart
│   │   │   ├── Login.jsx        # Login page
│   │   │   ├── Register.jsx     # Registration page
│   │   │   ├── Profile.jsx      # User profile
│   │   │   ├── Admin.jsx        # Admin panel
│   │   │   ├── OrderCheckout.jsx # Checkout process
│   │   │   ├── OrderHistory.jsx # Order tracking
│   │   │   ├── AddressBook.jsx  # Address management
│   │   │   ├── ChangePassword.jsx # Password change
│   │   │   ├── ForgotPassword.jsx # Password recovery
│   │   │   ├── ResetPassword.jsx # Password reset
│   │   │   └── EmailVerification.jsx # Email verification
│   │   ├── hooks/          # Custom React hooks
│   │   │   ├── useAuth.js       # Authentication logic
│   │   │   ├── useCart.js       # Cart management
│   │   │   ├── useProducts.js   # Product data fetching
│   │   │   ├── useAdmin.js      # Admin functionality
│   │   │   ├── useApi.js        # API utilities
│   │   │   ├── useProfile.js    # Profile management
│   │   │   ├── useFoldableDisplay.js # Responsive utilities
│   │   │   ├── usePerformance.js # Performance monitoring
│   │   │   ├── usePermissions.js # Permission management
│   │   │   ├── useServiceWorker.js # Service worker utilities
│   │   │   ├── useTheme.js      # Theme management
│   │   │   └── useToast.js      # Toast notifications
│   │   ├── services/       # API services
│   │   │   └── api.js           # HTTP client and API calls
│   │   ├── providers/      # Context providers
│   │   │   └── QueryProvider.jsx # React Query provider
│   │   ├── contexts/       # React contexts
│   │   │   ├── AuthContext.js   # Authentication context
│   │   │   └── ThemeContext.jsx # Theme context
│   │   ├── styles/         # Styling and theming
│   │   │   └── theme.js         # Material-UI theme configuration
│   │   ├── utils/          # Utility functions
│   │   │   ├── common.js        # Common utilities
│   │   │   ├── errorHandler.js  # Error handling utilities
│   │   │   ├── routeConstants.js # Route definitions
│   │   │   └── toastConstants.js # Toast configuration
│   │   ├── assets/         # Static assets
│   │   │   ├── golden-basket-rounded.png
│   │   │   └── golden-basket.jpeg
│   │   ├── App.jsx         # Main application component
│   │   ├── AuthContext.jsx # Authentication provider
│   │   ├── main.jsx        # Application entry point
│   │   ├── index.css       # Global styles
│   │   └── App.css         # Component styles
│   ├── public/             # Public assets
│   ├── index.html          # HTML template
│   ├── package.json        # Frontend dependencies
│   ├── vite.config.js      # Vite configuration
│   └── eslint.config.js    # ESLint configuration
└── README.md               # This file
```

## 🛠️ Tech Stack

### Frontend

- **React 19.1.0** - UI library with latest features
- **Material-UI 7.1.1** - Component library and design system
- **React Router 7.6.2** - Client-side routing
- **React Query (TanStack Query) 5.0.0** - Data fetching and state management
- **Vite 6.3.5** - Fast build tool and development server
- **Axios 1.9.0** - HTTP client
- **React Hook Form 7.48.0** - Form handling
- **React Error Boundary 4.1.2** - Error handling
- **React Slick 0.30.3** - Carousel components
- **Day.js 1.11.13** - Date manipulation
- **Date-fns 4.1.0** - Date utility functions
- **ESLint 9.25.0** - Code quality
- **React Intersection Observer 9.5.3** - Lazy loading utilities

### Backend

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

1. **Clone the repository**

   ```bash
   git clone https://github.com/itsrkator/golden-basket-mart-grocery-store.git
   cd golden-basket-mart-grocery-store
   ```

2. **Backend Setup**

   ```bash
   cd backend
   npm install

   # Create .env file with your configuration
   cp .env.example .env

   # Start development server
   npm run dev
   ```

3. **Frontend Setup**

   ```bash
   cd frontend
   npm install

   # Start development server
   npm run dev
   ```

4. **Database Setup**
   - Ensure MongoDB is running
   - Update the `MONGODB_URI` in your backend `.env` file
   - Optional: Set up Redis for enhanced rate limiting

### Environment Variables

Create a `.env` file in the backend directory:

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

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=Golden Basket Mart
```

## 📱 Available Scripts

### Backend

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run Jest tests
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

### Frontend

- `npm run dev` - Start development server (Vite)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## 🌐 API Endpoints

The backend provides a comprehensive REST API documented with Swagger:

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

Access the full API documentation at: `http://localhost:3000/api-docs`

## 🔐 Authentication & Authorization

- **JWT-based authentication** with secure token management
- **Role-based access control** (User/Admin)
- **Protected routes** for authenticated users
- **Admin-only routes** for administrative functions
- **Enhanced rate limiting** with multiple tiers
- **Password hashing** with BCrypt
- **Email verification** system
- **Permission-based UI components**

## 📱 Responsive Design

The application is fully responsive and optimized for:

- **Mobile devices** (320px+)
- **Tablets** (768px+)
- **Desktop computers** (1024px+)
- **Foldable devices** with multi-pane layouts
- **Ultra-wide screens** (1920px+)
- **Extra small devices** (320px-480px)

### Responsive Features

- **Mobile-first approach** with progressive enhancement
- **Touch-friendly interactions** for mobile devices
- **Adaptive layouts** for different screen sizes
- **Flexible grid systems** using Material-UI breakpoints
- **Optimized navigation** with mobile drawer and desktop menu
- **Responsive typography** with clamp() functions
- **Image optimization** for different screen densities
- **Foldable device detection** with specialized layouts

## 🚀 Performance Features

### Frontend Performance

- **Lazy loading** of components with React.lazy()
- **Code splitting** with Vite and manual chunk configuration
- **Bundle optimization** with vendor chunk splitting
- **Image optimization** and lazy loading
- **Caching** with React Query
- **Responsive images** for different screen densities
- **Tree shaking** for unused code elimination
- **Service worker** for offline functionality

### Backend Performance

- **Response compression** with Gzip
- **Database indexing** for faster queries
- **Caching middleware** with memory-cache
- **Performance monitoring** endpoints
- **Query optimization** with lean queries
- **Connection pooling** for MongoDB
- **Enhanced rate limiting** with Redis support
- **Request ID tracking** for debugging

## 🧪 Testing

### Backend Testing

- **Jest** for unit and integration testing
- **Supertest** for API endpoint testing
- **Performance testing** utilities
- **Error handling** validation

### Frontend Testing

- **Vitest** for unit and component testing
- **Error boundaries** for graceful error handling
- **Component testing** with React Testing Library
- **Form validation** testing
- **Responsive design** testing

## 📦 Deployment

### Backend Deployment

1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set secure JWT secret
4. Configure CORS origin for production domain
5. Set up environment-specific variables
6. Use PM2 or similar process manager
7. Configure Redis for production rate limiting

### Frontend Deployment

1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Configure environment variables for production API endpoints
4. Set up CDN for static assets
5. Configure HTTPS and security headers

### Environment Variables for Production

**Backend (.env)**

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://production-db-uri
JWT_SECRET=production-secret-key
CORS_ORIGIN=https://yourdomain.com
EMAIL_USER=your-production-email
EMAIL_PASS=your-production-password
REDIS_URL=redis://production-redis-uri
```

**Frontend (.env)**

```env
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_APP_NAME=Golden Basket Mart
```

## 🔒 Security Features

### Backend Security

- **Helmet** - Security headers
- **CORS** - Cross-origin protection
- **XSS Protection** - Cross-site scripting prevention
- **NoSQL Injection Protection** - MongoDB query sanitization
- **Enhanced Rate Limiting** - Multi-tier request throttling
- **Input Validation** - Schema-based validation with Joi and Express Validator
- **JWT Security** - Token-based authentication with secure storage
- **Password Hashing** - BCrypt encryption
- **HTTP Parameter Pollution** - HPP protection
- **Request ID Tracking** - Security monitoring

### Frontend Security

- **HTTPS enforcement** in production
- **Secure token storage** in localStorage
- **Input sanitization** and validation
- **XSS prevention** with proper escaping
- **CSRF protection** with proper headers
- **Permission-based access control**

## 📊 Monitoring & Analytics

### Backend Monitoring

- **Winston logging** with multiple levels
- **Performance monitoring** endpoints
- **Request/response timing** tracking
- **Database query performance** monitoring
- **Memory usage** tracking
- **Error tracking** and logging
- **Request ID tracking** for debugging
- **Request ID tracking** for debugging

### Frontend Monitoring

- **Error boundaries** for JavaScript errors
- **Performance monitoring** with React DevTools
- **Bundle size analysis** with Vite
- **User interaction metrics** tracking
- **Service worker** monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the coding standards
4. Add tests if applicable
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines

- Follow React best practices and hooks
- Use functional components with hooks
- Implement proper error boundaries
- Write responsive, accessible components
- Follow Material-UI design patterns
- Maintain consistent code style with ESLint
- Write comprehensive API documentation
- Test on multiple devices and screen sizes

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Rohitash Kator**

## 📞 Support

For support and questions:

1. Check the API documentation at `/api-docs`
2. Review the component documentation
3. Check the browser console for frontend errors
4. Review the backend logs for server issues
5. Open an issue in the GitHub repository

## 🚀 Future Enhancements

### Planned Features

- **PWA Support** - Offline functionality and app-like experience
- **Real-time Updates** - WebSocket integration for live updates
- **Advanced Search** - Elasticsearch integration
- **Payment Integration** - Stripe/PayPal support
- **Multi-language** - Internationalization (i18n)
- **Push Notifications** - Order status updates
- **Social Login** - Google, Facebook authentication
- **Wishlist** - Save favorite products
- **Product Reviews** - User ratings and comments

### Performance Improvements

- **Service Workers** - Advanced caching strategies
- **Image Optimization** - WebP and AVIF support
- **Bundle Analysis** - Performance monitoring
- **Lazy Loading** - Route-based code splitting
- **CDN Integration** - Global content delivery
- **Database Optimization** - Advanced indexing strategies

---

**Golden Basket Mart** - Your one-stop solution for online grocery shopping! 🛒✨

_Built with ❤️ using modern web technologies for the best user experience across all devices._
