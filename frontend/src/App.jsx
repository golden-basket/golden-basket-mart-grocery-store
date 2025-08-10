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
const AddressBook = lazy(() => import('./pages/AddressBook'));
const OrderCheckout = lazy(() => import('./pages/OrderCheckout'));
const OrderHistory = lazy(() => import('./pages/OrderHistory'));

const ThemeWrapper = ({ children }) => {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#1976d2',
        contrastText: '#fff',
      },
      secondary: {
        main: '#dc004e',
        contrastText: '#fff',
      },
    },
    typography: {
      fontFamily: 'Roboto, sans-serif',
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: '#fff',
            boxShadow: '0 2px 8px hsla(0, 0.00%, 0.00%, 0.10)',
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            width: '100vw',
            overflowX: 'hidden',
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
