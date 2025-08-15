import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';
import { Suspense, lazy } from 'react';

import Navbar from './components/Navbar';
import Loading from './components/Loading';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

import { ThemeProvider } from './contexts/ThemeContext.jsx';
import ToastProvider from './components/ToastNotifications';
import TestComponent from './components/TestComponent';

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
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));

const App = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <ErrorBoundary>
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
                  backgroundColor: 'background.default',
                }}
              >
                <Suspense fallback={<Loading />}>
                  <Routes>
                    <Route path='/' element={<HomeComponent />} />
                    <Route path='/test' element={<TestComponent />} />
                    <Route path='/catalogue' element={<Catalogue />} />
                    <Route
                      path='/admin'
                      element={
                        <ProtectedRoute adminOnly={true}>
                          <Admin />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path='/cart'
                      element={
                        <ProtectedRoute>
                          <Cart />
                        </ProtectedRoute>
                      }
                    />
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                    <Route
                      path='/forgot-password'
                      element={<ForgotPassword />}
                    />
                    <Route
                      path='/profile'
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path='/change-password'
                      element={
                        <ProtectedRoute>
                          <ChangePassword />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path='/addresses'
                      element={
                        <ProtectedRoute>
                          <AddressBook />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path='/checkout'
                      element={
                        <ProtectedRoute>
                          <OrderCheckout />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path='/orders'
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
          </ErrorBoundary>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
