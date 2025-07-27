import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, createTheme, Box } from '@mui/material';

import Navbar from './components/Navbar';
import Catalogue from './pages/Catalogue';
import Admin from './pages/Admin';
import HomeComponent from './pages/Home';
import PropTypes from 'prop-types';
import Footer from './components/Footer';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import AddressBook from './pages/AddressBook';
import OrderCheckout from './pages/OrderCheckout';
import OrderHistory from './pages/OrderHistory';

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
    <BrowserRouter>
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
              backgroundColor: 'linear-gradient(90deg, #1a1a1a 0%, #3e2d14 50%, #1a1a1a 100%)',
            }}
          >
            <Routes>
              <Route path="/" element={<HomeComponent />} />
              <Route path="/catalogue" element={<Catalogue />} />
              <Route path="/admin" element={<ProtectedRoute adminOnly={true}><Admin /></ProtectedRoute>} />
              <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/addresses" element={<ProtectedRoute><AddressBook /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><OrderCheckout /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </ThemeWrapper>
    </BrowserRouter>
  );
};

export default App;
