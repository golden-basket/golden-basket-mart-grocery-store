// Route constants for consistent routing across the application
export const ROUTES = {
  // Public Routes
  HOME: '/',
  TEST: '/test',
  CATALOGUE: '/catalogue',
  
  // Authentication Routes
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  
  // Email Verification Routes
  VERIFY_EMAIL: '/verify-email',
  VERIFY_EMAIL_WITH_TOKEN: '/auth/verify/:token',
  
  // Protected User Routes
  PROFILE: '/profile',
  CHANGE_PASSWORD: '/change-password',
  ADDRESSES: '/addresses',
  
  // Shopping Routes
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  
  // Admin Routes
  ADMIN: '/admin',
};

// Route groups for organization
export const ROUTE_GROUPS = {
  PUBLIC: [ROUTES.HOME, ROUTES.TEST, ROUTES.CATALOGUE],
  AUTH: [ROUTES.LOGIN, ROUTES.REGISTER, ROUTES.FORGOT_PASSWORD],
  VERIFICATION: [ROUTES.VERIFY_EMAIL, ROUTES.VERIFY_EMAIL_WITH_TOKEN],
  PROTECTED: [ROUTES.PROFILE, ROUTES.CHANGE_PASSWORD, ROUTES.ADDRESSES],
  SHOPPING: [ROUTES.CART, ROUTES.CHECKOUT, ROUTES.ORDERS],
  ADMIN: [ROUTES.ADMIN],
};

// Helper function to generate verification URL
export const generateVerificationUrl = (token) => {
  return `${ROUTES.VERIFY_EMAIL_WITH_TOKEN.replace(':token', token)}`;
};

// Helper function to check if a route is public
export const isPublicRoute = (pathname) => {
  return ROUTE_GROUPS.PUBLIC.includes(pathname) || 
         ROUTE_GROUPS.AUTH.includes(pathname) || 
         ROUTE_GROUPS.VERIFICATION.some(route => 
           pathname.startsWith(route.replace('/:token', ''))
         );
};

// Helper function to check if a route requires authentication
export const requiresAuth = (pathname) => {
  return ROUTE_GROUPS.PROTECTED.includes(pathname) || 
         ROUTE_GROUPS.SHOPPING.includes(pathname) || 
         ROUTE_GROUPS.ADMIN.includes(pathname);
};

// Helper function to check if a route requires admin privileges
export const requiresAdmin = (pathname) => {
  return ROUTE_GROUPS.ADMIN.includes(pathname);
};

export default ROUTES;
