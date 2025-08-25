# Route Documentation

This document provides a comprehensive overview of all routes in the Golden Basket Mart application.

## Route Structure

### Public Routes
- `/` - Home page
- `/test` - Test component page
- `/catalogue` - Product catalogue

### Authentication Routes
- `/login` - User login page
- `/register` - User registration page
- `/forgot-password` - Password reset request page
- `/reset-password` - Password reset page (with token)

### Email Verification Routes
- `/verify-email` - Email verification page (query parameter format)
- `/auth/verify/:token` - Email verification page (path parameter format)

### Protected User Routes
- `/profile` - User profile management
- `/change-password` - Change password page
- `/addresses` - Address book management

### Shopping Routes
- `/cart` - Shopping cart
- `/checkout` - Order checkout
- `/orders` - Order history

### Admin Routes
- `/admin` - Admin dashboard

### Error Routes
- `*` - 404 Not Found page (catch-all route)

## Route Constants

All routes are defined in `src/utils/routeConstants.js` to maintain consistency across the application.

### Usage Example
```javascript
import { ROUTES } from '../utils/routeConstants';

// Navigate to a route
navigate(ROUTES.LOGIN);

// Check if route requires auth
if (requiresAuth(pathname)) {
  // Handle authentication
}
```

## Route Groups

Routes are organized into logical groups:

- **PUBLIC**: Routes accessible to all users
- **AUTH**: Authentication-related routes
- **VERIFICATION**: Email verification routes
- **PROTECTED**: Routes requiring user authentication
- **SHOPPING**: Shopping-related routes
- **ADMIN**: Admin-only routes

## Route Protection

- **Public Routes**: No authentication required
- **Protected Routes**: Require user authentication
- **Admin Routes**: Require admin privileges
- **Verification Routes**: Special handling for email verification tokens

## URL Patterns

### Hash Router
The application uses HashRouter, so all URLs are prefixed with `#`:
- `http://localhost:5173/#/login`
- `http://localhost:5173/#/auth/verify/token123`

### Dynamic Routes
- `:token` - Used for email verification tokens
- `*` - Catch-all route for 404 pages

## Navigation Helpers

### generateVerificationUrl(token)
Generates a verification URL with the provided token.

### isPublicRoute(pathname)
Checks if a route is publicly accessible.

### requiresAuth(pathname)
Checks if a route requires authentication.

### requiresAdmin(pathname)
Checks if a route requires admin privileges.

## Best Practices

1. **Always use route constants** instead of hardcoded strings
2. **Group related routes** together in the routing configuration
3. **Use appropriate protection** for each route type
4. **Handle 404 errors** with the catch-all route
5. **Maintain consistency** in route naming and structure

## Testing Routes

To test routes:
1. Navigate to `/test` to access the test component
2. Use the test component to verify API calls and functionality
3. Test protected routes with and without authentication
4. Test 404 handling by navigating to non-existent routes
