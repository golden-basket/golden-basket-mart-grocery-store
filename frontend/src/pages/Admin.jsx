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

// Helper function for responsive values
const getResponsiveValue = (
  isSmallMobile,
  isMobile,
  isLargeScreen,
  isExtraLargeScreen,
  smallMobile,
  mobile,
  large,
  extraLarge,
  defaultVal
) => {
  if (isSmallMobile) return smallMobile;
  if (isMobile) return mobile;
  if (isLargeScreen) return large;
  if (isExtraLargeScreen) return extraLarge;
  return defaultVal;
};

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
  const styles = useMemo(
    () => createAdminStyles(isMobile, theme),
    [isMobile, theme]
  );

  // Responsive tab styles based on screen size
  const responsiveTabStyles = useMemo(
    () => ({
      fontSize: getResponsiveValue(
        isSmallMobile,
        isMobile,
        isLargeScreen,
        isExtraLargeScreen,
        '0.65rem',
        '0.75rem',
        '0.9rem',
        '1rem',
        '0.85rem'
      ),
      px: getResponsiveValue(
        isSmallMobile,
        isMobile,
        isLargeScreen,
        isExtraLargeScreen,
        0.5,
        1,
        2,
        3,
        1.5
      ),
      py: getResponsiveValue(
        isSmallMobile,
        isMobile,
        isLargeScreen,
        isExtraLargeScreen,
        0.25,
        0.5,
        1,
        1.5,
        0.75
      ),
      minWidth: getResponsiveValue(
        isSmallMobile,
        isMobile,
        isLargeScreen,
        isExtraLargeScreen,
        '60px',
        '70px',
        '90px',
        '100px',
        '80px'
      ),
      height: getResponsiveValue(
        isSmallMobile,
        isMobile,
        isLargeScreen,
        isExtraLargeScreen,
        '32px',
        '36px',
        '40px',
        '44px',
        '38px'
      ),
      borderRadius: getResponsiveValue(
        isSmallMobile,
        isMobile,
        isLargeScreen,
        isExtraLargeScreen,
        '3px',
        '4px',
        '6px',
        '8px',
        '5px'
      ),
      fontWeight: getResponsiveValue(
        isSmallMobile,
        isMobile,
        isLargeScreen,
        isExtraLargeScreen,
        500,
        600,
        600,
        700,
        600
      ),
      letterSpacing: getResponsiveValue(
        isSmallMobile,
        isMobile,
        isLargeScreen,
        isExtraLargeScreen,
        '0.3px',
        '0.4px',
        '0.5px',
        '0.6px',
        '0.4px'
      ),
    }),
    [isSmallMobile, isMobile, isLargeScreen, isExtraLargeScreen]
  );

  // Responsive tabs container styles
  const responsiveTabsStyles = useMemo(
    () => ({
      mb: getResponsiveValue(
        isSmallMobile,
        isMobile,
        isLargeScreen,
        isExtraLargeScreen,
        0.5,
        1,
        2,
        3,
        1.5
      ),
      '& .MuiTabs-indicator': {
        background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 50%, ${theme.palette.primary.dark} 100%)`,
        height: getResponsiveValue(
          isSmallMobile,
          isMobile,
          isLargeScreen,
          isExtraLargeScreen,
          1.5,
          2,
          3,
          4,
          2.5
        ),
        borderRadius: getResponsiveValue(
          isSmallMobile,
          isMobile,
          isLargeScreen,
          isExtraLargeScreen,
          0.5,
          1,
          1.5,
          2,
          1
        ),
        boxShadow: `0 2px 8px ${theme.palette.primary.main}4D`,
      },
      '& .MuiTabs-flexContainer': {
        gap: getResponsiveValue(
          isSmallMobile,
          isMobile,
          isLargeScreen,
          isExtraLargeScreen,
          0.25,
          0.5,
          1.5,
          2,
          1
        ),
      },
      // Responsive scroll buttons for mobile
      '& .MuiTabs-scrollButtons': {
        width: getResponsiveValue(
          isSmallMobile,
          isMobile,
          isLargeScreen,
          isExtraLargeScreen,
          '20px',
          '28px',
          '32px',
          '32px',
          '32px'
        ),
        height: getResponsiveValue(
          isSmallMobile,
          isMobile,
          isLargeScreen,
          isExtraLargeScreen,
          '20px',
          '28px',
          '28px',
          '28px',
          '28px'
        ),
      },
    }),
    [
      isSmallMobile,
      isMobile,
      isLargeScreen,
      isExtraLargeScreen,
      theme.palette.primary.main,
      theme.palette.primary.light,
      theme.palette.primary.dark,
    ]
  );

  return (
    <Container maxWidth='xl' sx={styles.containerStyles}>
      <Typography
        variant={getResponsiveValue(
          isSmallMobile,
          isMobile,
          isLargeScreen,
          isExtraLargeScreen,
          'h6',
          'h5',
          'h4',
          'h3',
          'h5'
        )}
        align='center'
        gutterBottom
        sx={{
          ...styles.titleStyles,
          fontSize: getResponsiveValue(
            isSmallMobile,
            isMobile,
            isLargeScreen,
            isExtraLargeScreen,
            '1.25rem',
            '1.5rem',
            '2rem',
            '2.5rem',
            '1.75rem'
          ),
          mb: getResponsiveValue(
            isSmallMobile,
            isMobile,
            isLargeScreen,
            isExtraLargeScreen,
            1,
            2,
            4,
            5,
            3
          ),
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
          label='Products'
          sx={{
            ...styles.tabStyles,
            ...responsiveTabStyles,
            color:
              tab === 0
                ? theme.palette.primary.main
                : theme.palette.text.secondary,
          }}
        />
        <Tab
          label='Categories'
          sx={{
            ...styles.tabStyles,
            ...responsiveTabStyles,
            color:
              tab === 1
                ? theme.palette.primary.main
                : theme.palette.text.secondary,
          }}
        />
        <Tab
          label='Users'
          sx={{
            ...styles.tabStyles,
            ...responsiveTabStyles,
            color:
              tab === 2
                ? theme.palette.primary.main
                : theme.palette.text.secondary,
          }}
        />
        <Tab
          label='Orders'
          sx={{
            ...styles.tabStyles,
            ...responsiveTabStyles,
            color:
              tab === 3
                ? theme.palette.primary.main
                : theme.palette.text.secondary,
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
