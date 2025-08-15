# Golden Basket Mart - Frontend

A modern, responsive React frontend for the Golden Basket Mart grocery store application. Built with React 19, Material-UI 7, and optimized for all device sizes including foldables and ultra-wide screens, featuring advanced responsive design patterns and performance optimization.

## 🚀 Features

### Core Features

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

### User Experience

- **Responsive Navigation** with mobile-first design and foldable support
- **Product Catalog** with search, filtering, and pagination
- **Shopping Cart** with real-time updates and quantity management
- **User Authentication** with protected routes and role-based access
- **Order Management** and tracking with status updates
- **Address Book** for shipping address management
- **Admin Panel** for comprehensive product, user, and order management
- **Responsive Design** for all screen sizes with adaptive layouts

### Performance Features

- **Code Splitting** with React.lazy() and dynamic imports
- **Bundle Optimization** with Vite and manual chunk configuration
- **Image Optimization** and lazy loading with fallback support
- **Caching** with React Query for efficient data management
- **Responsive Images** for different screen densities
- **Tree Shaking** for unused code elimination
- **Vendor Chunk Splitting** for better caching

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx       # Responsive navigation with foldable support
│   │   ├── Footer.jsx       # Footer component
│   │   ├── Loading.jsx      # Loading spinner with animations
│   │   ├── ErrorBoundary.jsx # Error handling with fallback UI
│   │   ├── ProtectedRoute.jsx # Route protection with role-based access
│   │   ├── HeroBanner.jsx   # Home page banner with carousel
│   │   ├── ProductCarousel.jsx # Product showcase with React Slick
│   │   ├── AddProductDialog.jsx # Product management dialog
│   │   ├── EditProfileDialog.jsx # Profile editing dialog
│   │   ├── ChangePasswordDialog.jsx # Password management dialog
│   │   ├── PaymentMethodSelector.jsx # Payment selection component
│   │   ├── ReusableFilterControls.jsx # Filter components with responsive design
│   │   ├── ThemeSnackbar.jsx # Notifications with Material-UI
│   │   ├── ImageWithFallback.jsx # Image handling with error fallback
│   │   ├── FilterStatusBar.jsx # Filter status display
│   │   ├── JumpingCartAvatar.jsx # Animated cart indicator
│   │   └── admin/           # Admin-specific components
│   │       ├── CategoryManagement.jsx # Category CRUD operations
│   │       ├── OrderManagement.jsx # Order processing interface
│   │       ├── ProductManagement.jsx # Product CRUD operations
│   │       ├── UserManagement.jsx # User management interface
│   │       └── adminStyles.js # Admin-specific styling
│   ├── pages/               # Page components
│   │   ├── Home.jsx         # Home page with hero banner
│   │   ├── Catalogue.jsx    # Product catalog with filters
│   │   ├── Cart.jsx         # Shopping cart management
│   │   ├── Login.jsx        # Login page with form validation
│   │   ├── Register.jsx     # Registration page
│   │   ├── Profile.jsx      # User profile management
│   │   ├── Admin.jsx        # Admin panel dashboard
│   │   ├── OrderCheckout.jsx # Checkout process
│   │   ├── OrderHistory.jsx # Order tracking and history
│   │   ├── AddressBook.jsx  # Address management
│   │   └── ChangePassword.jsx # Password change functionality
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.js       # Authentication logic and state
│   │   ├── useCart.js       # Cart management with React Query
│   │   ├── useProducts.js   # Product data fetching and caching
│   │   ├── useAdmin.js      # Admin functionality and permissions
│   │   ├── useApi.js        # API utilities and error handling
│   │   ├── useProfile.js    # Profile management and updates
│   │   └── useFoldableDisplay.js # Responsive utilities and breakpoints
│   ├── services/            # API services
│   │   └── api.js           # HTTP client and API calls with Axios
│   ├── providers/           # Context providers
│   │   └── QueryProvider.jsx # React Query provider configuration
│   ├── contexts/            # React contexts
│   │   └── AuthContext.js   # Authentication context definition
│   ├── styles/              # Styling and theming
│   │   └── theme.js         # Material-UI theme configuration
│   ├── utils/               # Utility functions
│   │   └── common.js        # Common utilities and helpers
│   ├── assets/              # Static assets
│   │   ├── golden-basket-rounded.png
│   │   └── golden-basket.jpeg
│   ├── App.jsx              # Main application component
│   ├── AuthContext.jsx      # Authentication provider
│   ├── main.jsx             # Application entry point
│   ├── index.css            # Global styles and CSS variables
│   └── App.css              # Component-specific styles
├── public/                  # Public assets
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite configuration with optimization
└── eslint.config.js         # ESLint configuration
```

## 🛠️ Tech Stack

### Core Technologies

- **React 19.1.0** - UI library with latest features and hooks
- **Material-UI 7.1.1** - Component library and design system
- **React Router 7.6.2** - Client-side routing with HashRouter
- **React Query (TanStack Query) 5.0.0** - Data fetching and state management
- **Vite 6.3.5** - Fast build tool and development server

### UI & Styling

- **Material-UI Icons 7.1.1** - Icon library
- **Emotion 11.14.0** - CSS-in-JS styling
- **Responsive Design** - Mobile-first approach with foldable support
- **Theme System** - Customizable Material-UI theme with CSS variables
- **React Slick 0.30.3** - Carousel components
- **Slick Carousel 1.8.1** - Carousel styling

### Development Tools

- **ESLint 9.25.0** - Code quality and consistency
- **React Hooks** - Modern React patterns and custom hooks
- **PropTypes** - Runtime type checking
- **Error Boundaries** - Graceful error handling
- **React Error Boundary 4.1.2** - Error boundary component
- **React Hook Form 7.48.0** - Form handling and validation
- **React Intersection Observer 9.5.3** - Lazy loading utilities

### Additional Libraries

- **Axios 1.9.0** - HTTP client for API calls
- **Day.js 1.11.13** - Date manipulation
- **Date-fns 4.1.0** - Date utility functions

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Backend server running (see backend README)

### Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file in the root directory:

   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   VITE_APP_NAME=Golden Basket Mart
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 📱 Available Scripts

- `npm run dev` - Start development server (Vite)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Component Architecture

### Core Components

#### Navbar

- **Responsive navigation** with mobile drawer and desktop menu
- **User authentication status** with profile dropdown
- **Shopping cart indicator** with badge count
- **Admin panel access** for authorized users
- **Foldable device support** with adaptive layouts
- **Touch-friendly interactions** for mobile devices

#### ProductCarousel

- **Responsive product showcase** with React Slick
- **Lazy loading** for performance optimization
- **Touch-friendly interactions** for mobile devices
- **Optimized for all screen sizes** including foldables
- **Image fallback handling** with error states

#### ProtectedRoute

- **Route protection** based on authentication status
- **Role-based access control** for admin routes
- **Redirect handling** for unauthorized access
- **Loading states** during authentication checks

### Page Components

#### Home

- **Hero banner** with call-to-action and carousel
- **Featured products** carousel with lazy loading
- **Category-based filtering** with responsive design
- **Responsive grid layout** for different screen sizes

#### Catalogue

- **Product grid** with pagination and infinite scroll
- **Search and filtering** options with real-time updates
- **Category navigation** with responsive design
- **Add to cart functionality** with optimistic updates

#### Cart

- **Shopping cart management** with real-time updates
- **Quantity updates** with validation
- **Price calculations** with tax and shipping
- **Checkout process** with multiple payment methods

#### Admin

- **Product management** interface with CRUD operations
- **User management** with role-based access
- **Order processing** with status updates
- **Analytics dashboard** with charts and metrics

## 🎯 Custom Hooks

### useAuth

```javascript
const { user, login, logout, register, getProfile, updateProfile } = useAuth();
```

- **Authentication state management** with localStorage persistence
- **Login/logout functionality** with JWT token handling
- **User registration** with form validation
- **Protected route access** with role-based permissions
- **Profile management** with real-time updates

### useCart

```javascript
const {
  data: cart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} = useCart();
```

- **Shopping cart state** with React Query caching
- **Cart operations** (add, update, remove, clear)
- **Real-time cart updates** across components
- **Cart persistence** with optimistic updates
- **Stock validation** and error handling

### useProducts

```javascript
const {
  data: products,
  isLoading,
  error,
  refetch,
} = useProducts(page, limit, filters);
```

- **Product data fetching** with pagination support
- **Search and filtering** with debounced queries
- **Caching** with React Query for performance
- **Error handling** with retry mechanisms
- **Infinite scroll** support for large catalogs

### useFoldableDisplay

```javascript
const {
  isMobile,
  isTablet,
  isFoldable,
  isUltraWide,
  isExtraSmall,
  isSmall,
  getFoldableClasses,
  getResponsiveButtonSize,
  getResponsiveTextClasses,
} = useFoldableDisplay();
```

- **Responsive breakpoint detection** for all device types
- **Device-specific utilities** for adaptive layouts
- **Responsive class generation** for CSS-in-JS
- **Screen size optimization** with dynamic adjustments
- **Foldable device support** with multi-pane layouts

### useAdmin

```javascript
const { isAdmin, adminStats, manageProducts, manageUsers, manageOrders } =
  useAdmin();
```

- **Admin permission checking** with role-based access
- **Admin dashboard statistics** with real-time data
- **Product management** with CRUD operations
- **User management** with role changes
- **Order processing** with status updates

## 🌐 API Integration

### API Service

```javascript
import ApiService from '../services/api';

// Product operations
const products = await ApiService.getProducts();
const product = await ApiService.getProduct(id);
await ApiService.createProduct(productData);

// Cart operations
await ApiService.addToCart(productId, quantity);
await ApiService.updateCartItem(productId, quantity);
await ApiService.removeFromCart(productId);

// Order operations
await ApiService.placeOrder(orderData);
const orders = await ApiService.getOrders();
```

### Authentication

- **JWT token management** with automatic refresh
- **Protected API calls** with authorization headers
- **Error handling** for unauthorized requests
- **Token expiration** handling with automatic logout

### Error Handling

```javascript
// Global error handling with Axios interceptors
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle token expiration
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## 🎨 Theming & Styling

### Material-UI Theme

```javascript
const theme = createTheme({
  palette: {
    primary: { main: '#a3824c', light: '#e6d897', dark: '#866422' },
    secondary: { main: '#388e3c', light: '#4caf50', dark: '#1b5e20' },
    background: { default: '#f7fbe8', paper: '#fffbe6' },
    text: { primary: '#2e3a1b', secondary: '#7d6033' },
  },
  typography: {
    fontFamily: 'Poppins, Roboto, sans-serif',
    h1: { fontWeight: 700, color: '#2e3a1b' },
    h2: { fontWeight: 600, color: '#2e3a1b' },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#fffbe6',
          boxShadow: '0 6px 24px rgba(163, 130, 76, 0.12)',
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: '0 2px 8px rgba(163, 130, 76, 0.2)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 16px rgba(163, 130, 76, 0.3)',
          },
        },
      },
    },
  },
});
```

### CSS Variables

```css
:root {
  --color-primary: #a3824c;
  --color-primary-light: #e6d897;
  --color-primary-dark: #866422;
  --color-primary-darker: #7d6033;
  --color-cream-light: #fffbe6;
  --color-error: #d32f2f;
  --color-success: #388e3c;
  --color-warning: #ffb300;
  --color-info: #0288d1;
}
```

### Responsive Design

- **Mobile-first approach** with progressive enhancement
- **Breakpoint-based layouts** using Material-UI breakpoints
- **Flexible grid systems** with responsive containers
- **Touch-friendly interactions** for mobile devices
- **Adaptive typography** with clamp() functions

## 📱 Responsive Features

### Device Optimization

- **Mobile (320px+)**: Touch-optimized interface with mobile drawer
- **Tablet (768px+)**: Adaptive layouts with enhanced navigation
- **Desktop (1024px+)**: Full-featured experience with desktop menu
- **Foldable**: Multi-pane layouts with adaptive content
- **Ultra-wide (1920px+)**: Extended content areas with optimized spacing
- **Extra small (320px-480px)**: Compact layouts with essential features

### Breakpoint System

```javascript
const breakpoints = {
  xs: 0, // Extra small devices (phones)
  sm: 600, // Small devices (tablets)
  md: 960, // Medium devices (small laptops)
  lg: 1280, // Large devices (desktops)
  xl: 1920, // Extra large devices (ultra-wide screens)
};
```

### Responsive Utilities

```javascript
// Responsive text classes
const getResponsiveTextClasses = () => {
  return {
    xs: 'text-xs sm:text-sm md:text-base lg:text-lg',
    sm: 'text-sm sm:text-base md:text-lg lg:text-xl',
    md: 'text-base sm:text-lg md:text-xl lg:text-2xl',
  };
};

// Responsive button sizes
const getResponsiveButtonSize = () => {
  return isMobile ? 'small' : isTablet ? 'medium' : 'large';
};
```

## 🚀 Performance Optimization

### Code Splitting

```javascript
// Lazy load components for better performance
const Catalogue = lazy(() => import('./pages/Catalogue'));
const Admin = lazy(() => import('./pages/Admin'));
const Cart = lazy(() => import('./pages/Cart'));
const OrderCheckout = lazy(() => import('./pages/OrderCheckout'));
```

### Bundle Optimization

```javascript
// Vite configuration with manual chunk splitting
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
          carousel: ['react-slick', 'slick-carousel'],
        },
      },
    },
  },
});
```

### Image Optimization

- **Lazy loading** with Intersection Observer
- **Responsive images** for different screen densities
- **WebP format support** with fallbacks
- **Compression optimization** with proper sizing
- **Error fallback handling** with placeholder images

### Caching Strategy

```javascript
// React Query configuration for optimal caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});
```

## 🔐 Authentication Flow

### Login Process

1. **User enters credentials** with form validation
2. **API authentication call** with error handling
3. **JWT token storage** in localStorage
4. **User context update** with profile data
5. **Redirect to protected route** or intended destination
6. **Token refresh handling** for expired tokens

### Protected Routes

```javascript
<Route
  path='/admin'
  element={
    <ProtectedRoute adminOnly={true}>
      <Admin />
    </ProtectedRoute>
  }
/>
```

### Authentication Context

```javascript
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Token persistence and auto-login
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (user, token) => {
    setUser(user);
    setToken(token);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

## 🧪 Error Handling

### Error Boundaries

```javascript
<ErrorBoundary fallback={<ErrorFallback />}>
  <Component />
</ErrorBoundary>
```

### API Error Handling

- **Network error handling** with retry mechanisms
- **Validation error display** with user-friendly messages
- **Authentication error handling** with automatic logout
- **Server error handling** with fallback UI

### Form Validation

```javascript
// React Hook Form with validation
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: yupResolver(validationSchema),
});

// Custom validation messages
const validationSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});
```

## 📦 Build & Deployment

### Vite Configuration

```javascript
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2015',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
          carousel: ['react-slick', 'slick-carousel'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@mui/material', '@mui/icons-material'],
  },
});
```

### Production Build

1. **Run build command**: `npm run build`
2. **Deploy dist folder** to hosting service
3. **Configure environment variables** for production API endpoints
4. **Set up CDN** for static assets
5. **Configure HTTPS** and security headers

### Environment Variables

```env
# Development
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=Golden Basket Mart

# Production
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_APP_NAME=Golden Basket Mart
```

## 🔧 Configuration

### Build Configuration

- **ES2015 target** for broad browser compatibility
- **Terser minification** for optimized bundle size
- **Manual chunk splitting** for better caching
- **Source map generation** (disabled in production)
- **Dependency optimization** with Vite

### Development Configuration

- **Hot module replacement** for fast development
- **ESLint integration** for code quality
- **Error overlay** for debugging
- **Fast refresh** for React components

## 📊 Monitoring & Analytics

### Performance Monitoring

- **Component render times** with React DevTools
- **Bundle size analysis** with Vite build output
- **Loading performance** with network tab
- **User interaction metrics** with custom tracking

### Error Tracking

- **JavaScript error logging** with error boundaries
- **API error monitoring** with Axios interceptors
- **User experience metrics** with performance API
- **Performance degradation detection** with monitoring

## 🚀 Future Enhancements

### Planned Features

- **PWA Support** - Offline functionality and app-like experience
- **Real-time Updates** - WebSocket integration for live updates
- **Advanced Search** - Elasticsearch integration with autocomplete
- **Payment Integration** - Stripe/PayPal support with secure checkout
- **Multi-language** - Internationalization (i18n) with react-intl
- **Dark Mode** - Theme switching capability with system preference
- **Push Notifications** - Order status updates and promotions
- **Social Login** - Google, Facebook authentication integration
- **Wishlist** - Save favorite products with sync
- **Product Reviews** - User ratings and comments system

### Performance Improvements

- **Service Workers** - Advanced caching strategies for offline support
- **Image Optimization** - WebP and AVIF support with responsive images
- **Bundle Analysis** - Performance monitoring with webpack-bundle-analyzer
- **Lazy Loading** - Route-based code splitting with dynamic imports
- **CDN Integration** - Global content delivery for faster loading
- **Database Optimization** - Advanced indexing strategies for search

### User Experience Enhancements

- **Voice Search** - Speech recognition for hands-free shopping
- **AR Product Preview** - Augmented reality for product visualization
- **Smart Recommendations** - AI-powered product suggestions
- **One-Click Checkout** - Streamlined purchase process
- **Social Sharing** - Share products and orders on social media
- **Gamification** - Rewards and loyalty program integration

## 📞 Support

For frontend-specific issues and questions:

1. Check the browser console for JavaScript errors
2. Review the component documentation and props
3. Check Material-UI documentation for component usage
4. Verify API endpoints and network requests
5. Test responsive design on different devices
6. Open an issue in the GitHub repository

### Common Issues

- **Build errors**: Check Node.js version and dependencies
- **Styling issues**: Verify Material-UI theme configuration
- **Responsive problems**: Test on different screen sizes
- **Performance issues**: Monitor bundle size and loading times
- **Authentication errors**: Check token storage and API calls

## 🤝 Contributing

### Development Guidelines

1. Follow React best practices and hooks patterns
2. Use functional components with hooks instead of class components
3. Implement proper error boundaries for error handling
4. Write responsive, accessible components with ARIA labels
5. Follow Material-UI design patterns and theming
6. Maintain consistent code style with ESLint configuration
7. Write comprehensive component documentation
8. Test components on multiple devices and screen sizes

### Code Quality

- **ESLint configuration** for consistent code style
- **PropTypes validation** for runtime type checking
- **Error boundary implementation** for graceful error handling
- **Responsive design testing** on multiple devices
- **Performance optimization** with bundle analysis
- **Accessibility compliance** with ARIA standards

### Testing Strategy

- **Component testing** with React Testing Library
- **Integration testing** for user workflows
- **Responsive testing** on different screen sizes
- **Performance testing** with Lighthouse
- **Accessibility testing** with axe-core
- **Cross-browser testing** for compatibility

---

**Golden Basket Mart Frontend** - Delivering exceptional user experiences! 🎨✨

_Built with modern React patterns, responsive design, and performance optimization for the best user experience across all devices._
