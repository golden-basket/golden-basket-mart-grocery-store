import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, createTheme, Box } from '@mui/material';
import { Suspense, lazy } from 'react';

import Navbar from './components/Navbar';
import Loading from './components/Loading';
import PropTypes from 'prop-types';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load components for better performance
const Catalogue = lazy(() => import('./pages/Catalogue'));
const Admin = lazy(() => import('./pages/Admin'));
const HomeComponent = lazy(() => import('./pages/Home'));
const Cart = lazy(() => import('./pages/Cart'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const AddressBook = lazy(() => import('./pages/AddressBook'));
const OrderCheckout = lazy(() => import('./pages/OrderCheckout'));
const OrderHistory = lazy(() => import('./pages/OrderHistory'));
const ChangePassword = lazy(() => import('./pages/ChangePassword'));

const ThemeWrapper = ({ children }) => {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#a3824c',
        light: '#e6d897',
        dark: '#866422',
        contrastText: '#fff',
      },
      secondary: {
        main: '#388e3c',
        light: '#4caf50',
        dark: '#1b5e20',
        contrastText: '#fff',
      },
      success: {
        main: '#388e3c',
        light: '#4caf50',
        dark: '#1b5e20',
      },
      warning: {
        main: '#ffb300',
        light: '#ffc107',
        dark: '#f57c00',
      },
      error: {
        main: '#d32f2f',
        light: '#f44336',
        dark: '#b71c1c',
      },
      info: {
        main: '#0288d1',
        light: '#29b6f6',
        dark: '#01579b',
      },
      background: {
        default: '#f7fbe8',
        paper: '#fffbe6',
      },
      text: {
        primary: '#2e3a1b',
        secondary: '#7d6033',
      },
    },
    typography: {
      fontFamily: 'Poppins, Roboto, sans-serif',
      h1: {
        fontWeight: 700,
        color: '#2e3a1b',
      },
      h2: {
        fontWeight: 600,
        color: '#2e3a1b',
      },
      h3: {
        fontWeight: 600,
        color: '#2e3a1b',
      },
      h4: {
        fontWeight: 600,
        color: '#2e3a1b',
      },
      h5: {
        fontWeight: 600,
        color: '#2e3a1b',
      },
      h6: {
        fontWeight: 600,
        color: '#2e3a1b',
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: '#fffbe6',
            boxShadow: '0 4px 16px rgba(163, 130, 76, 0.15)',
            borderRadius: 12,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: '#fffbe6',
            boxShadow: '0 6px 24px rgba(163, 130, 76, 0.12)',
            borderRadius: 16,
            border: '1px solid rgba(163, 130, 76, 0.1)',
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
          contained: {
            background: 'linear-gradient(135deg, #a3824c 0%, #866422 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #866422 0%, #7d6033 100%)',
            },
          },
          outlined: {
            borderColor: '#a3824c',
            color: '#866422',
            '&:hover': {
              borderColor: '#866422',
              backgroundColor: 'rgba(163, 130, 76, 0.08)',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            fontWeight: 600,
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            width: '100vw',
            overflowX: 'hidden',
            backgroundColor: '#f7fbe8',
            backgroundImage: 'linear-gradient(135deg, #f7fbe8 0%, #fffbe6 100%)',
          },
          '#root': {
            width: '100vw',
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

ThemeWrapper.propTypes = {
  children: PropTypes.node,
};

const App = () => {
  return (
    <Router>
      <ThemeWrapper>
        <CssBaseline />
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Navbar />
          <Box
            sx={{
              flex: 1,
              boxShadow: '0 2px 8px hsla(0, 0.00%, 0.00%, 0.10)',
              backgroundColor:
                'linear-gradient(90deg, #1a1a1a 0%, #3e2d14 50%, #1a1a1a 100%)',
            }}
          >
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<HomeComponent />} />
                <Route path="/catalogue" element={<Catalogue />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <Admin />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/change-password"
                  element={
                    <ProtectedRoute>
                      <ChangePassword />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/addresses"
                  element={
                    <ProtectedRoute>
                      <AddressBook />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <OrderCheckout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <OrderHistory />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Suspense>
          </Box>
          <Footer />
        </Box>
      </ThemeWrapper>
    </Router>
  );
};

export default App;
