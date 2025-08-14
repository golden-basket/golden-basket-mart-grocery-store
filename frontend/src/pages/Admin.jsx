import { useState, useCallback, useMemo } from 'react';
import {
  Container,
  Typography,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import ProductManagement from '../components/admin/ProductManagement';
import CategoryManagement from '../components/admin/CategoryManagement';
import UserManagement from '../components/admin/UserManagement';
import OrderManagement from '../components/admin/OrderManagement';
import { useAdmin } from '../hooks/useAdmin';
import { createAdminStyles } from '../components/admin/adminStyles';

const Admin = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const isExtraLargeScreen = useMediaQuery(theme.breakpoints.up('xl'));

  const [tab, setTab] = useState(() => {
    // Get the saved tab from localStorage, default to 0 (Products)
    const savedTab = localStorage.getItem('adminActiveTab');
    return savedTab ? parseInt(savedTab) : 0;
  });

  // Save tab to localStorage whenever it changes
  const handleTabChange = useCallback((_, newTab) => {
    setTab(newTab);
    localStorage.setItem('adminActiveTab', newTab.toString());
  }, []);

  // Use the admin hook for state management
  const {
    users,
    handleUserUpdate,
    categories,
    handleCategoryUpdate,
    handleProductUpdate,
  } = useAdmin();

  // Get styles from the shared styles utility
  const styles = useMemo(() => createAdminStyles(isMobile), [isMobile]);

  // Responsive tab styles based on screen size
  const responsiveTabStyles = useMemo(
    () => ({
      // Font sizes - reduced
      fontSize: isSmallMobile
        ? '0.65rem'
        : isMobile
        ? '0.75rem'
        : isLargeScreen
        ? '0.9rem'
        : isExtraLargeScreen
        ? '1rem'
        : '0.85rem',

      // Padding - reduced
      px: isSmallMobile
        ? 0.5
        : isMobile
        ? 1
        : isLargeScreen
        ? 2
        : isExtraLargeScreen
        ? 3
        : 1.5,
      py: isSmallMobile
        ? 0.25
        : isMobile
        ? 0.5
        : isLargeScreen
        ? 1
        : isExtraLargeScreen
        ? 1.5
        : 0.75,

      // Min width - reduced
      minWidth: isSmallMobile
        ? '60px'
        : isMobile
        ? '70px'
        : isLargeScreen
        ? '90px'
        : isExtraLargeScreen
        ? '100px'
        : '80px',

      // Height - reduced
      height: isSmallMobile
        ? '32px'
        : isMobile
        ? '36px'
        : isLargeScreen
        ? '40px'
        : isExtraLargeScreen
        ? '44px'
        : '38px',

      // Border radius - reduced
      borderRadius: isSmallMobile
        ? '3px'
        : isMobile
        ? '4px'
        : isLargeScreen
        ? '6px'
        : isExtraLargeScreen
        ? '8px'
        : '5px',

      // Font weight - reduced
      fontWeight: isSmallMobile
        ? 500
        : isMobile
        ? 600
        : isLargeScreen
        ? 600
        : isExtraLargeScreen
        ? 700
        : 600,

      // Letter spacing - reduced
      letterSpacing: isSmallMobile
        ? '0.3px'
        : isMobile
        ? '0.4px'
        : isLargeScreen
        ? '0.5px'
        : isExtraLargeScreen
        ? '0.6px'
        : '0.4px',
    }),
    [isSmallMobile, isMobile, isLargeScreen, isExtraLargeScreen]
  );

  // Responsive tabs container styles
  const responsiveTabsStyles = useMemo(
    () => ({
      mb: isSmallMobile
        ? 0.5
        : isMobile
        ? 1
        : isLargeScreen
        ? 2
        : isExtraLargeScreen
        ? 3
        : 1.5,
      '& .MuiTabs-indicator': {
        background:
          'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
        height: isSmallMobile
          ? 1.5
          : isMobile
          ? 2
          : isLargeScreen
          ? 3
          : isExtraLargeScreen
          ? 4
          : 2.5,
        borderRadius: isSmallMobile
          ? 0.5
          : isMobile
          ? 1
          : isLargeScreen
          ? 1.5
          : isExtraLargeScreen
          ? 2
          : 1,
        boxShadow: '0 2px 8px rgba(163,130,76,0.3)',
      },
      '& .MuiTabs-flexContainer': {
        gap: isSmallMobile
          ? 0.25
          : isMobile
          ? 0.5
          : isLargeScreen
          ? 1.5
          : isExtraLargeScreen
          ? 2
          : 1,
      },
      // Responsive scroll buttons for mobile
      '& .MuiTabs-scrollButtons': {
        width: isSmallMobile ? '20px' : isMobile ? '28px' : '32px',
        height: isSmallMobile ? '20px' : isMobile ? '28px' : '28px',
      },
    }),
    [isSmallMobile, isMobile, isLargeScreen, isExtraLargeScreen]
  );

  return (
    <Container maxWidth="xl" sx={styles.containerStyles}>
      <Typography
        variant={
          isSmallMobile
            ? 'h6'
            : isMobile
            ? 'h5'
            : isLargeScreen
            ? 'h4'
            : isExtraLargeScreen
            ? 'h3'
            : 'h5'
        }
        align="center"
        gutterBottom
        sx={{
          ...styles.titleStyles,
          fontSize: isSmallMobile
            ? '1.25rem'
            : isMobile
            ? '1.5rem'
            : isLargeScreen
            ? '2rem'
            : isExtraLargeScreen
            ? '2.5rem'
            : '1.75rem',
          mb: isSmallMobile
            ? 1
            : isMobile
            ? 2
            : isLargeScreen
            ? 4
            : isExtraLargeScreen
            ? 5
            : 3,
        }}
      >
        Admin Dashboard
      </Typography>

      <Tabs
        value={tab}
        onChange={handleTabChange}
        centered={!isMobile}
        variant={isMobile ? 'scrollable' : 'standard'}
        scrollButtons={isMobile ? 'auto' : false}
        sx={responsiveTabsStyles}
      >
        <Tab
          label="Products"
          sx={{
            ...styles.tabStyles,
            ...responsiveTabStyles,
            color: tab === 0 ? '#a3824c' : '#7d6033ff',
          }}
        />
        <Tab
          label="Categories"
          sx={{
            ...styles.tabStyles,
            ...responsiveTabStyles,
            color: tab === 1 ? '#a3824c' : '#7d6033ff',
          }}
        />
        <Tab
          label="Users"
          sx={{
            ...styles.tabStyles,
            ...responsiveTabStyles,
            color: tab === 2 ? '#a3824c' : '#7d6033ff',
          }}
        />
        <Tab
          label="Orders"
          sx={{
            ...styles.tabStyles,
            ...responsiveTabStyles,
            color: tab === 3 ? '#a3824c' : '#7d6033ff',
          }}
        />
      </Tabs>

      {/* Product Management */}
      {tab === 0 && (
        <ProductManagement
          categories={categories}
          onProductUpdate={handleProductUpdate}
        />
      )}

      {/* Category Management */}
      {tab === 1 && (
        <CategoryManagement
          categories={categories}
          onCategoryUpdate={handleCategoryUpdate}
        />
      )}

      {/* User Management */}
      {tab === 2 && (
        <UserManagement users={users} onUserUpdate={handleUserUpdate} />
      )}

      {/* Order Management */}
      {tab === 3 && <OrderManagement />}
    </Container>
  );
};

export default Admin;
