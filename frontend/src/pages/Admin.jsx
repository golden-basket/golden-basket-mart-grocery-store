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
const getResponsiveValue = ({
  isSmallMobile,
  isMobile,
  isLargeScreen,
  isExtraLargeScreen,
  smallMobile,
  mobile,
  large,
  extraLarge,
  defaultVal,
}) => {
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
      fontSize: getResponsiveValue({
        isSmallMobile,
        isMobile,
        isLargeScreen,
        isExtraLargeScreen,
        smallMobile: '0.65rem',
        mobile: '0.75rem',
        large: '0.9rem',
        extraLarge: '1rem',
        defaultVal: '0.85rem',
      }),
      px: getResponsiveValue({
        isSmallMobile,
        isMobile,
        isLargeScreen,
        isExtraLargeScreen,
        smallMobile: 0.5,
        mobile: 1,
        large: 2,
        extraLarge: 3,
        defaultVal: 1.5,
      }),
      py: getResponsiveValue({
        isSmallMobile,
        isMobile,
        isLargeScreen,
        isExtraLargeScreen,
        smallMobile: 0.25,
        mobile: 0.5,
        large: 1,
        extraLarge: 1.5,
        defaultVal: 0.75,
      }),
      minWidth: getResponsiveValue({
        isSmallMobile,
        isMobile,
        isLargeScreen,
        isExtraLargeScreen,
        smallMobile: '60px',
        mobile: '70px',
        large: '90px',
        extraLarge: '100px',
        defaultVal: '80px',
      }),
      height: getResponsiveValue({
        isSmallMobile,
        isMobile,
        isLargeScreen,
        isExtraLargeScreen,
        smallMobile: '32px',
        mobile: '36px',
        large: '40px',
        extraLarge: '44px',
        defaultVal: '38px',
      }),
      borderRadius: getResponsiveValue({
        isSmallMobile,
        isMobile,
        isLargeScreen,
        isExtraLargeScreen,
        smallMobile: '3px',
        mobile: '4px',
        large: '6px',
        extraLarge: '8px',
        defaultVal: '5px',
      }),
      fontWeight: getResponsiveValue({
        isSmallMobile,
        isMobile,
        isLargeScreen,
        isExtraLargeScreen,
        smallMobile: 500,
        mobile: 600,
        large: 600,
        extraLarge: 700,
        defaultVal: 600,
      }),
      letterSpacing: getResponsiveValue({
        isSmallMobile,
        isMobile,
        isLargeScreen,
        isExtraLargeScreen,
        smallMobile: '0.3px',
        mobile: '0.4px',
        large: '0.5px',
        extraLarge: '0.6px',
        defaultVal: '0.4px',
      }),
    }),
    [isSmallMobile, isMobile, isLargeScreen, isExtraLargeScreen]
  );

  // Responsive tabs container styles
  const responsiveTabsStyles = useMemo(
    () => ({
      mb: getResponsiveValue({
        isSmallMobile,
        isMobile,
        isLargeScreen,
        isExtraLargeScreen,
        smallMobile: 0.5,
        mobile: 1,
        large: 2,
        extraLarge: 3,
        defaultVal: 1.5,
      }),
      '& .MuiTabs-indicator': {
        background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 50%, ${theme.palette.primary.dark} 100%)`,
        height: getResponsiveValue({
          isSmallMobile,
          isMobile,
          isLargeScreen,
          isExtraLargeScreen,
          smallMobile: 1.5,
          mobile: 2,
          large: 3,
          extraLarge: 4,
          defaultVal: 2.5,
        }),
        borderRadius: getResponsiveValue({
          isSmallMobile,
          isMobile,
          isLargeScreen,
          isExtraLargeScreen,
          smallMobile: 0.5,
          mobile: 1,
          large: 1.5,
          extraLarge: 2,
          defaultVal: 1,
        }),
        boxShadow: `0 2px 8px ${theme.palette.primary.main}4D`,
      },
      '& .MuiTabs-flexContainer': {
        gap: getResponsiveValue({
          isSmallMobile,
          isMobile,
          isLargeScreen,
          isExtraLargeScreen,
          smallMobile: 0.25,
          mobile: 0.5,
          large: 1.5,
          extraLarge: 2,
          defaultVal: 1,
        }),
      },
      // Responsive scroll buttons for mobile
      '& .MuiTabs-scrollButtons': {
        width: getResponsiveValue({
          isSmallMobile,
          isMobile,
          isLargeScreen,
          isExtraLargeScreen,
          smallMobile: '20px',
          mobile: '28px',
          large: '32px',
          extraLarge: '32px',
          defaultVal: '32px',
        }),
        height: getResponsiveValue({
          isSmallMobile,
          isMobile,
          isLargeScreen,
          isExtraLargeScreen,
          smallMobile: '20px',
          mobile: '28px',
          large: '28px',
          extraLarge: '28px',
          defaultVal: '28px',
        }),
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
        variant={getResponsiveValue({
          isSmallMobile,
          isMobile,
          isLargeScreen,
          isExtraLargeScreen,
          smallMobile: 'h6',
          mobile: 'h5',
          large: 'h4',
          extraLarge: 'h3',
          defaultVal: 'h5',
        })}
        align='center'
        gutterBottom
        sx={{
          ...styles.titleStyles,
          fontSize: getResponsiveValue({
            isSmallMobile,
            isMobile,
            isLargeScreen,
            isExtraLargeScreen,
            smallMobile: '1.25rem',
            mobile: '1.5rem',
            large: '2rem',
            extraLarge: '2.5rem',
            defaultVal: '1.75rem',
          }),
          mb: getResponsiveValue({
            isSmallMobile,
            isMobile,
            isLargeScreen,
            isExtraLargeScreen,
            smallMobile: 1,
            mobile: 2,
            large: 4,
            extraLarge: 5,
            defaultVal: 3,
          }),
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
          label='Orders'
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
          label='Users'
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

      {/* Order Management */}
      {tab === 2 && <OrderManagement />}

      {/* User Management */}
      {tab === 3 && (
        <UserManagement users={users} onUserUpdate={handleUserUpdate} />
      )}
    </Container>
  );
};

export default Admin;
