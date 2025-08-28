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
import { ROUTES } from './utils/routeConstants';

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
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const EmailVerification = lazy(() => import('./pages/EmailVerification'));
const NotFound = lazy(() => import('./pages/NotFound'));

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
                    {/* Public Routes */}
                    <Route path={ROUTES.HOME} element={<HomeComponent />} />
                    <Route path={ROUTES.TEST} element={<TestComponent />} />
                    <Route path={ROUTES.CATALOGUE} element={<Catalogue />} />

                    {/* Authentication Routes */}
                    <Route path={ROUTES.LOGIN} element={<Login />} />
                    <Route path={ROUTES.REGISTER} element={<Register />} />
                    <Route
                      path={ROUTES.FORGOT_PASSWORD}
                      element={<ForgotPassword />}
                    />
                    <Route
                      path={ROUTES.RESET_PASSWORD}
                      element={<ResetPassword />}
                    />

                    {/* Email Verification Routes */}
                    <Route
                      path={ROUTES.VERIFY_EMAIL}
                      element={<EmailVerification />}
                    />

                    {/* Protected User Routes */}
                    <Route
                      path={ROUTES.PROFILE}
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path={ROUTES.CHANGE_PASSWORD}
                      element={
                        <ProtectedRoute>
                          <ChangePassword />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path={ROUTES.ADDRESSES}
                      element={
                        <ProtectedRoute>
                          <AddressBook />
                        </ProtectedRoute>
                      }
                    />

                    {/* Shopping Routes */}
                    <Route
                      path={ROUTES.CART}
                      element={
                        <ProtectedRoute>
                          <Cart />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path={ROUTES.CHECKOUT}
                      element={
                        <ProtectedRoute>
                          <OrderCheckout />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path={ROUTES.ORDERS}
                      element={
                        <ProtectedRoute>
                          <OrderHistory />
                        </ProtectedRoute>
                      }
                    />

                    {/* Admin Routes */}
                    <Route
                      path={ROUTES.ADMIN}
                      element={
                        <ProtectedRoute adminOnly={true}>
                          <Admin />
                        </ProtectedRoute>
                      }
                    />

                    {/* 404 - Catch All Route */}
                    <Route path='*' element={<NotFound />} />
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
