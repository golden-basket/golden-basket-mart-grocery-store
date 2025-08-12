# Golden Basket Mart - Frontend

A modern, responsive React frontend for the Golden Basket Mart grocery store application. Built with React 19, Material-UI 7, and optimized for all device sizes including foldables and ultra-wide screens.

## 🚀 Features

### Core Features
- **Modern React 19** with hooks and functional components
- **Material-UI 7** for beautiful, responsive design
- **Responsive Design** optimized for all device sizes
- **Lazy Loading** for improved performance
- **React Router 7** for client-side navigation
- **React Query** for efficient data fetching and caching
- **Form Validation** with React Hook Form
- **Error Boundaries** for graceful error handling

### User Experience
- **Responsive Navigation** with mobile-first design
- **Product Catalog** with search and filtering
- **Shopping Cart** with real-time updates
- **User Authentication** with protected routes
- **Order Management** and tracking
- **Address Book** for shipping
- **Admin Panel** for product management
- **Responsive Design** for all screen sizes

### Performance Features
- **Code Splitting** with React.lazy()
- **Bundle Optimization** with Vite
- **Image Optimization** and lazy loading
- **Caching** with React Query
- **Responsive Images** for different screen densities

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx       # Navigation component
│   │   ├── Footer.jsx       # Footer component
│   │   ├── Loading.jsx      # Loading spinner
│   │   ├── ErrorBoundary.jsx # Error handling
│   │   ├── ProtectedRoute.jsx # Route protection
│   │   ├── HeroBanner.jsx   # Home page banner
│   │   ├── ProductCarousel.jsx # Product showcase
│   │   ├── AddProductDialog.jsx # Product management
│   │   ├── EditProfileDialog.jsx # Profile editing
│   │   └── ChangePasswordDialog.jsx # Password management
│   ├── pages/               # Page components
│   │   ├── Home.jsx         # Home page
│   │   ├── Catalogue.jsx    # Product catalog
│   │   ├── Cart.jsx         # Shopping cart
│   │   ├── Login.jsx        # Login page
│   │   ├── Register.jsx     # Registration page
│   │   ├── Profile.jsx      # User profile
│   │   ├── Admin.jsx        # Admin panel
│   │   ├── OrderCheckout.jsx # Checkout process
│   │   ├── OrderHistory.jsx # Order tracking
│   │   ├── AddressBook.jsx  # Address management
│   │   └── ChangePassword.jsx # Password change
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.js       # Authentication logic
│   │   ├── useCart.js       # Cart management
│   │   ├── useProducts.js   # Product data fetching
│   │   └── useFoldableDisplay.js # Responsive utilities
│   ├── services/            # API services
│   │   └── api.js           # HTTP client and API calls
│   ├── providers/           # Context providers
│   │   └── QueryProvider.jsx # React Query provider
│   ├── assets/              # Static assets
│   │   ├── golden-basket-rounded.png
│   │   └── golden-basket.jpeg
│   ├── App.jsx              # Main application component
│   ├── AuthContext.jsx      # Authentication context
│   ├── main.jsx             # Application entry point
│   ├── index.css            # Global styles
│   └── App.css              # Component styles
├── public/                  # Public assets
├── index.html               # HTML template
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
└── eslint.config.js         # ESLint configuration
```

## 🛠️ Tech Stack

### Core Technologies
- **React 19** - UI library with latest features
- **Material-UI 7** - Component library and design system
- **React Router 7** - Client-side routing
- **React Query** - Data fetching and state management
- **Vite** - Fast build tool and development server

### UI & Styling
- **Material-UI Icons** - Icon library
- **Emotion** - CSS-in-JS styling
- **Responsive Design** - Mobile-first approach
- **Theme System** - Customizable Material-UI theme

### Development Tools
- **ESLint** - Code quality and consistency
- **React Hooks** - Modern React patterns
- **PropTypes** - Runtime type checking
- **Error Boundaries** - Graceful error handling

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

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Component Architecture

### Core Components

#### Navbar
- Responsive navigation with mobile drawer
- User authentication status
- Shopping cart indicator
- Admin panel access

#### ProductCarousel
- Responsive product showcase
- Lazy loading for performance
- Touch-friendly interactions
- Optimized for all screen sizes

#### ProtectedRoute
- Route protection based on authentication
- Role-based access control
- Redirect handling for unauthorized access

### Page Components

#### Home
- Hero banner with call-to-action
- Featured products carousel
- Category-based product filtering
- Responsive grid layout

#### Catalogue
- Product grid with pagination
- Search and filtering options
- Category navigation
- Add to cart functionality

#### Cart
- Shopping cart management
- Quantity updates
- Price calculations
- Checkout process

#### Admin
- Product management interface
- User management
- Order processing
- Analytics dashboard

## 🎯 Custom Hooks

### useAuth
```javascript
const { user, login, logout, register } = useAuth();
```
- Authentication state management
- Login/logout functionality
- User registration
- Protected route access

### useCart
```javascript
const { data: cart, addToCart, updateQuantity, removeFromCart } = useCart();
```
- Shopping cart state
- Cart operations (add, update, remove)
- Real-time cart updates
- Cart persistence

### useProducts
```javascript
const { data: products, isLoading, error } = useProducts(page, limit);
```
- Product data fetching
- Pagination support
- Search and filtering
- Caching with React Query

### useFoldableDisplay
```javascript
const { isMobile, isTablet, isFoldable, isUltraWide } = useFoldableDisplay();
```
- Responsive breakpoint detection
- Device-specific utilities
- Responsive class generation
- Screen size optimization

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
- JWT token management
- Automatic token refresh
- Protected API calls
- Error handling for unauthorized requests

## 🎨 Theming & Styling

### Material-UI Theme
```javascript
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' }
  },
  typography: {
    fontFamily: 'Roboto, sans-serif'
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
          boxShadow: '0 2px 8px hsla(0, 0%, 0%, 0.1)'
        }
      }
    }
  }
});
```

### Responsive Design
- Mobile-first approach
- Breakpoint-based layouts
- Flexible grid systems
- Touch-friendly interactions

## 📱 Responsive Features

### Device Optimization
- **Mobile**: Touch-optimized interface
- **Tablet**: Adaptive layouts
- **Desktop**: Full-featured experience
- **Foldable**: Multi-pane layouts
- **Ultra-wide**: Extended content areas

### Breakpoint System
```javascript
const breakpoints = {
  xs: 0,      // Extra small devices
  sm: 600,    // Small devices
  md: 900,    // Medium devices
  lg: 1200,   // Large devices
  xl: 1536    // Extra large devices
};
```

## 🚀 Performance Optimization

### Code Splitting
```javascript
// Lazy load components
const Catalogue = lazy(() => import('./pages/Catalogue'));
const Admin = lazy(() => import('./pages/Admin'));
const Cart = lazy(() => import('./pages/Cart'));
```

### Bundle Optimization
- Vendor chunk splitting
- Dynamic imports
- Tree shaking
- Minification

### Image Optimization
- Lazy loading
- Responsive images
- WebP format support
- Compression optimization

## 🔐 Authentication Flow

### Login Process
1. User enters credentials
2. Form validation
3. API authentication call
4. JWT token storage
5. User context update
6. Redirect to protected route

### Protected Routes
```javascript
<Route
  path="/admin"
  element={
    <ProtectedRoute adminOnly={true}>
      <Admin />
    </ProtectedRoute>
  }
/>
```

## 🧪 Error Handling

### Error Boundaries
```javascript
<ErrorBoundary fallback={<ErrorFallback />}>
  <Component />
</ErrorBoundary>
```

### API Error Handling
- Network error handling
- Validation error display
- User-friendly error messages
- Retry mechanisms

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
          mui: ['@mui/material', '@mui/icons-material']
        }
      }
    }
  }
});
```

### Production Build
1. Run `npm run build`
2. Deploy `dist` folder
3. Configure environment variables
4. Set up CDN for assets

## 🔧 Configuration

### Environment Variables
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=Golden Basket Mart
VITE_ENABLE_ANALYTICS=false
```

### Build Configuration
- ES2015 target for broad compatibility
- Terser minification
- Manual chunk splitting
- Source map generation (development)

## 📊 Monitoring & Analytics

### Performance Monitoring
- Component render times
- Bundle size analysis
- Loading performance
- User interaction metrics

### Error Tracking
- JavaScript error logging
- API error monitoring
- User experience metrics
- Performance degradation detection

## 🚀 Future Enhancements

### Planned Features
- **PWA Support** - Offline functionality
- **Real-time Updates** - WebSocket integration
- **Advanced Search** - Elasticsearch integration
- **Payment Integration** - Stripe/PayPal support
- **Multi-language** - Internationalization
- **Dark Mode** - Theme switching

### Performance Improvements
- **Service Workers** - Caching strategies
- **Image Optimization** - WebP and AVIF support
- **Bundle Analysis** - Performance monitoring
- **Lazy Loading** - Route-based code splitting

## 📞 Support

For frontend-specific issues and questions:
1. Check the browser console for errors
2. Review the component documentation
3. Check Material-UI documentation
4. Open an issue in the GitHub repository

## 🤝 Contributing

### Development Guidelines
1. Follow React best practices
2. Use functional components with hooks
3. Implement proper error boundaries
4. Write responsive, accessible components
5. Follow Material-UI design patterns

### Code Quality
- ESLint configuration
- PropTypes validation
- Error boundary implementation
- Responsive design testing

---

**Golden Basket Mart Frontend** - Delivering exceptional user experiences! 🎨✨
