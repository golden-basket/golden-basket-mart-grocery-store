import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Avatar,
  IconButton,
  Chip,
  Stack,
  Container,
  Card,
  CardContent,
  Grow,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  ShoppingCart as CartIcon,
  Receipt as OrderIcon,
  Lock as LockIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  AccountCircle as AccountIcon,
} from '@mui/icons-material';
import Badge from '@mui/material/Badge';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useAddresses, useOrderStats } from '../hooks/useProfile';
import EditProfileDialog from '../components/EditProfileDialog';
import ChangePasswordDialog from '../components/ChangePasswordDialog';
import ThemeSnackbar from '../components/ThemeSnackbar';
import { Link } from 'react-router-dom';
import { useFoldableDisplay } from '../hooks/useFoldableDisplay';
import Loading from '../components/Loading';

const Profile = () => {
  const { user, getProfile, loading } = useAuth();
  const { isMobile, isTablet, isFoldable } = useFoldableDisplay();

  // Use optimized hooks for data fetching with better error handling
  const { data: cart, isLoading: cartLoading, error: cartError } = useCart();
  const {
    data: addresses = [],
    isLoading: addressesLoading,
    error: addressesError,
  } = useAddresses();
  const {
    data: orderStats,
    isLoading: orderStatsLoading,
    error: orderStatsError,
  } = useOrderStats();

  // Provide default values for order stats
  const safeOrderStats = useMemo(() => {
    try {
      if (!orderStats) {
        return { totalOrders: 0, totalSpent: 0, topCategory: 'None' };
      }

      const totalOrders = parseInt(orderStats.totalOrders);
      const totalSpent = parseFloat(orderStats.totalSpent);
      const topCategory = orderStats.topCategory;

      return {
        totalOrders: isNaN(totalOrders) ? 0 : totalOrders,
        totalSpent: isNaN(totalSpent) ? 0 : totalSpent,
        topCategory:
          topCategory && typeof topCategory === 'string' ? topCategory : 'None',
      };
    } catch (error) {
      console.error('Error processing order stats:', error);
      return { totalOrders: 0, totalSpent: 0, topCategory: 'None' };
    }
  }, [orderStats]);

  // Calculate cart items count from cart data with better error handling
  const cartItems = useMemo(() => {
    try {
      if (!cart || !cart.items || !Array.isArray(cart.items)) {
        return 0;
      }
      return cart.items.reduce((total, item) => {
        if (!item || typeof item !== 'object') return total;
        const quantity = parseInt(item.quantity) || 0;
        return total + (isNaN(quantity) ? 0 : quantity);
      }, 0);
    } catch (error) {
      console.error('Error calculating cart items:', error);
      return 0;
    }
  }, [cart]);
  const refreshProfileData = useCallback(async () => {
    try {
      await getProfile();
    } catch (error) {
      console.error('Error refreshing profile data:', error);
      setSnackbar({
        open: true,
        message: 'Failed to refresh profile data. Please try again.',
        severity: 'error',
      });
    }
  }, [getProfile]);

  // Ensure we have the minimum required user data
  const displayName = useMemo(() => {
    if (!user) return 'User';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || user.email?.charAt(0)?.toUpperCase() || 'User';
  }, [user]);

  const displayPhone = useMemo(() => {
    if (!user) return 'Not provided';
    return user.phone || 'Not provided';
  }, [user]);

  const displayEmail = useMemo(() => {
    if (!user) return 'Not provided';
    return user.email || 'Not provided';
  }, [user]);

  const memberSinceDate = useMemo(() => {
    if (!user?.createdAt) return new Date();
    try {
      const date = new Date(user.createdAt);
      return isNaN(date.getTime()) ? new Date() : date;
    } catch {
      console.warn('Invalid date format for user.createdAt:', user.createdAt);
      return new Date();
    }
  }, [user?.createdAt]);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleEditProfile = useCallback(() => {
    try {
      setIsEditDialogOpen(true);
    } catch (error) {
      console.error('Error opening edit profile dialog:', error);
      setSnackbar({
        open: true,
        message: 'Error opening profile editor. Please try again.',
        severity: 'error',
      });
    }
  }, []);

  const handleProfileUpdateSuccess = useCallback(() => {
    try {
      setSnackbar({
        open: true,
        message: 'Profile updated successfully!',
        severity: 'success',
      });
      setIsEditDialogOpen(false);
      refreshProfileData();
    } catch (error) {
      console.error('Error handling profile update success:', error);
      setSnackbar({
        open: true,
        message: 'Profile updated but there was an error refreshing data.',
        severity: 'warning',
      });
    }
  }, [refreshProfileData]);

  const handleProfileUpdateError = useCallback(() => {
    try {
      setSnackbar({
        open: true,
        message: 'Failed to update profile. Please try again.',
        severity: 'error',
      });
    } catch (error) {
      console.error('Error handling profile update error:', error);
    }
  }, []);

  const handleCloseSnackbar = useCallback(() => {
    try {
      setSnackbar((prev) => ({ ...prev, open: false }));
    } catch (error) {
      console.error('Error closing snackbar:', error);
    }
  }, []);

  // TODO: Implement profile image change functionality
  // This is a placeholder function that can be implemented in the future
  const handleProfileChange = useCallback(() => {
    try {
      // Future implementation will include:
      // 1. File input dialog for image selection
      // 2. Image validation (size, format, dimensions)
      // 3. Image upload to server
      // 4. Update user profile with new image
      // 5. Show success/error feedback

      setSnackbar({
        open: true,
        message: 'Profile image change feature coming soon! 🚀',
        severity: 'info',
      });
    } catch (error) {
      console.error('Error in handleProfileChange:', error);
      setSnackbar({
        open: true,
        message: 'Error processing profile image change request.',
        severity: 'error',
      });
    }
  }, []);

  // Memoized last login date to avoid unnecessary recalculations
  const lastLoginDate = useMemo(() => {
    try {
      return new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Today';
    }
  }, []);

  // Show loading state for any data fetching
  if (loading || cartLoading || addressesLoading || orderStatsLoading) {
    return <Loading />;
  }

  // Show error state if any data fetching failed
  if (cartError || addressesError || orderStatsError) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="error">
            Error loading profile data. Please try refreshing the page.
          </Typography>
        </Box>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="primary">
            Please log in to view your profile.
          </Typography>
        </Box>
      </Container>
    );
  }

  // Show loading state while fetching profile data
  if (!user.firstName && !user.lastName && user.email) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="primary">
            Loading profile...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4, mt: 8 }}>
      <Box
        sx={{
          position: 'relative',
          margin: '0 auto',
          display: 'grid',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'radial-gradient(circle at 20% 80%, rgba(163, 130, 76, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(163, 130, 76, 0.03) 0%, transparent 50%)',
            pointerEvents: 'none',
            zIndex: -1,
          },
        }}
      >
        <Grid
          container
          spacing={{ xs: 2, sm: 3, md: 4, lg: 5 }}
          sx={{
            display: 'flex',
            justifyContent: {
              xs: 'center',
              sm: 'center',
              md: isTablet ? 'center' : 'flex-start',
              lg: 'flex-start',
            },
          }}
        >
          {/* Profile Information - Left Column (70%) */}
          <Grid
            sx={{
              width: {
                xs: '100%',
                sm: isFoldable ? '100%' : '100%',
                md: isTablet ? '100%' : '67.5%',
                lg: '67.5%',
              },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: {
                xs: 'center',
                sm: isFoldable ? 'center' : 'center',
                md: isTablet ? 'center' : 'flex-start',
                lg: 'flex-start',
              },
            }}
          >
            <Stack spacing={{ xs: 3, sm: 4, md: 4, lg: 4 }}>
              {/* Main Profile Card */}
              <Grow in timeout={1500}>
                <Card
                  elevation={8}
                  sx={{
                    overflow: 'visible',
                    border: '2px solid',
                    borderColor: 'primary.light',
                    background:
                      'linear-gradient(135deg, background.paper 0%, rgba(163, 130, 76, 0.05) 100%)',
                  }}
                >
                  <CardContent
                    sx={{
                      p: {
                        xs: isMobile ? 1.5 : 2,
                        sm: 3,
                        md: 4,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: {
                          xs: 'column',
                          sm: isFoldable ? 'column' : 'column',
                          md: isTablet ? 'column' : 'row',
                          lg: 'row',
                        },
                        alignItems: {
                          xs: 'center',
                          sm: 'center',
                          md: isTablet ? 'center' : 'flex-start',
                          lg: 'flex-start',
                        },
                        gap: {
                          xs: isMobile ? 2.5 : 3,
                          sm: isFoldable ? 3 : 4,
                          md: isTablet ? 3 : 4,
                          lg: 4,
                        },
                        width: '100%',
                      }}
                    >
                      {/* Avatar Section */}
                      <Box
                        sx={{
                          position: 'relative',
                          flexShrink: 0,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Badge
                          overlap="circular"
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                          }}
                          badgeContent={
                            <IconButton
                              onClick={handleProfileChange}
                              sx={{
                                width: {
                                  xs: isMobile ? 20 : 24,
                                  sm: isFoldable ? 24 : 26,
                                  md: isTablet ? 26 : 28,
                                  lg: 30,
                                },
                                height: {
                                  xs: isMobile ? 20 : 24,
                                  sm: isFoldable ? 24 : 26,
                                  md: isTablet ? 26 : 28,
                                  lg: 30,
                                },
                                minWidth: {
                                  xs: isMobile ? 20 : 24,
                                  sm: isFoldable ? 24 : 26,
                                  md: isTablet ? 26 : 28,
                                  lg: 30,
                                },
                                minHeight: {
                                  xs: isMobile ? 20 : 24,
                                  sm: isFoldable ? 24 : 26,
                                  md: isTablet ? 26 : 28,
                                  lg: 30,
                                },
                                p: { xs: isMobile ? 1.5 : 2, sm: 2 },
                                bgcolor: 'primary.main',
                                color: 'white',
                                border: '3px solid white',
                                '&:hover': {
                                  bgcolor: 'primary.dark',
                                  transform: 'scale(1.1)',
                                },
                                transition: 'all 0.3s ease',
                              }}
                            >
                              <EditIcon
                                sx={{
                                  fontSize: {
                                    xs: isMobile ? 16 : 18,
                                    sm: isFoldable ? 18 : 20,
                                    md: isTablet ? 18 : 20,
                                    lg: 20,
                                  },
                                }}
                              />
                            </IconButton>
                          }
                        >
                          <Avatar
                            sx={{
                              width: {
                                xs: isMobile ? 70 : 80,
                                sm: isFoldable ? 85 : 100,
                                md: isTablet ? 110 : 120,
                                lg: 140,
                              },
                              height: {
                                xs: isMobile ? 70 : 80,
                                sm: isFoldable ? 85 : 100,
                                md: isTablet ? 110 : 120,
                                lg: 140,
                              },
                              background:
                                'linear-gradient(135deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
                              fontSize: {
                                xs: isMobile ? '1.75rem' : '2rem',
                                sm: isFoldable ? '2.2rem' : '2.5rem',
                                md: isTablet ? '2.7rem' : '3rem',
                                lg: '3.5rem',
                              },
                              border: '4px solid',
                              borderColor: '#e6d897',
                              boxShadow:
                                '0 8px 32px rgba(163, 130, 76, 0.25), 0 4px 16px rgba(230, 216, 151, 0.15)',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'scale(1.05)',
                                boxShadow:
                                  '0 12px 40px rgba(163, 130, 76, 0.35), 0 8px 24px rgba(230, 216, 151, 0.25)',
                                background:
                                  'linear-gradient(135deg, #866422 0%, #a3824c 50%, #b59961 100%)',
                              },
                            }}
                          >
                            {displayName.charAt(0).toUpperCase()}
                          </Avatar>
                        </Badge>
                      </Box>

                      {/* Profile Details */}
                      <Box
                        sx={{
                          flex: 1,
                          textAlign: {
                            xs: 'center',
                            sm: 'center',
                            md: isTablet ? 'center' : 'left',
                            lg: 'left',
                          },
                          minWidth: 0,
                          width: '100%',
                        }}
                      >
                        <Typography
                          variant="h4"
                          component="h2"
                          sx={{
                            fontWeight: 700,
                            color: 'primary.dark',
                            mb: 2,
                            fontSize: {
                              xs: isMobile ? '1.1rem' : '1.25rem',
                              sm: isFoldable ? '1.3rem' : '1.5rem',
                              md: isTablet ? '1.6rem' : '1.75rem',
                              lg: '2rem',
                            },
                            wordBreak: 'break-word',
                          }}
                        >
                          {displayName}
                        </Typography>

                        <Stack spacing={1.5} sx={{ mb: 3, width: '100%' }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1.5,
                              justifyContent: {
                                xs: 'center',
                                sm: 'center',
                                md: isTablet ? 'center' : 'flex-start',
                                lg: 'flex-start',
                              },
                              width: '100%',
                            }}
                          >
                            <EmailIcon
                              color="primary"
                              sx={{
                                fontSize: {
                                  xs: isMobile ? '1rem' : '1.1rem',
                                  sm: isFoldable ? '1.15rem' : '1.25rem',
                                },
                              }}
                            />
                            <Typography
                              variant="body1"
                              color="text.secondary"
                              sx={{
                                fontSize: {
                                  xs: isMobile ? '0.8rem' : '0.85rem',
                                  sm: isFoldable ? '0.85rem' : '0.9rem',
                                  md: isTablet ? '0.95rem' : '1rem',
                                },
                                wordBreak: 'break-word',
                              }}
                            >
                              {displayEmail}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1.5,
                              justifyContent: {
                                xs: 'center',
                                sm: 'center',
                                md: isTablet ? 'center' : 'flex-start',
                                lg: 'flex-start',
                              },
                              width: '100%',
                            }}
                          >
                            <PhoneIcon
                              color="primary"
                              sx={{
                                fontSize: {
                                  xs: isMobile ? '1rem' : '1.1rem',
                                  sm: isFoldable ? '1.15rem' : '1.25rem',
                                },
                              }}
                            />
                            <Typography
                              variant="body1"
                              color="text.secondary"
                              sx={{
                                fontSize: {
                                  xs: isMobile ? '0.8rem' : '0.85rem',
                                  sm: isFoldable ? '0.85rem' : '0.9rem',
                                  md: isTablet ? '0.95rem' : '1rem',
                                },
                                wordBreak: 'break-word',
                              }}
                            >
                              {displayPhone}
                            </Typography>
                          </Box>
                        </Stack>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontStyle: 'italic',
                            textAlign: {
                              xs: 'center',
                              sm: 'center',
                              md: isTablet ? 'center' : 'left',
                              lg: 'left',
                            },
                            fontSize: {
                              xs: isMobile ? '0.75rem' : '0.8rem',
                              sm: isFoldable ? '0.8rem' : '0.85rem',
                              md: isTablet ? '0.85rem' : '0.9rem',
                            },
                          }}
                        >
                          Member since{' '}
                          {memberSinceDate.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </Typography>

                        {/* Action Buttons */}
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: {
                              xs: isMobile ? 'column' : 'column',
                              sm: isFoldable ? 'column' : 'row',
                              md: isTablet ? 'row' : 'row',
                            },
                            flexWrap: 'wrap',
                            gap: { xs: isMobile ? 1.5 : 2, sm: 2 },
                            alignItems: 'center',
                            justifyContent: {
                              xs: 'center',
                              sm: 'center',
                              md: isTablet ? 'center' : 'flex-start',
                              lg: 'flex-start',
                            },
                            mt: 3,
                          }}
                        >
                          <Button
                            variant="contained"
                            onClick={handleEditProfile}
                            startIcon={<EditIcon />}
                            sx={{
                              px: {
                                xs: isMobile ? 1.5 : 2,
                                sm: isFoldable ? 2 : 2.5,
                                md: isTablet ? 2.5 : 3,
                              },
                              py: { xs: isMobile ? 1.2 : 1.5, sm: 1.5 },
                              minWidth: {
                                xs: isMobile ? '180px' : '200px',
                                sm: isFoldable ? '150px' : '140px',
                              },
                              width: {
                                xs: isMobile ? '100%' : '100%',
                                sm: isFoldable ? '100%' : 'auto',
                                md: isTablet ? 'auto' : 'auto',
                              },
                              fontSize: {
                                xs: isMobile ? '0.8rem' : '0.85rem',
                                sm: isFoldable ? '0.85rem' : '0.9rem',
                                md: isTablet ? '0.9rem' : '1rem',
                              },
                            }}
                          >
                            Edit Profile
                          </Button>

                          <Button
                            variant="outlined"
                            onClick={() => setIsPasswordDialogOpen(true)}
                            startIcon={<LockIcon />}
                            sx={{
                              px: {
                                xs: isMobile ? 1.5 : 2,
                                sm: isFoldable ? 2 : 2.5,
                                md: isTablet ? 2.5 : 3,
                              },
                              py: { xs: isMobile ? 1.2 : 1.5, sm: 1.5 },
                              minWidth: {
                                xs: isMobile ? '180px' : '200px',
                                sm: isFoldable ? '150px' : '140px',
                              },
                              width: {
                                xs: isMobile ? '100%' : '100%',
                                sm: isFoldable ? '100%' : 'auto',
                                md: isTablet ? 'auto' : 'auto',
                              },
                              borderWidth: 2,
                              fontSize: {
                                xs: isMobile ? '0.8rem' : '0.85rem',
                                sm: isFoldable ? '0.85rem' : '0.9rem',
                                md: isTablet ? '0.9rem' : '1rem',
                              },
                            }}
                          >
                            Change Password
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grow>

              {/* Statistics Section */}
              {/* <Grow in timeout={1500}>
                <Card
                  elevation={6}
                  sx={{
                    border: '2px solid',
                    borderColor: 'primary.light',
                  }}
                >
                  <CardContent
                    sx={{
                      p: {
                        xs: isMobile ? 1.5 : 2,
                        sm: isFoldable ? 2.5 : 3,
                        md: isTablet ? 3.5 : 4,
                      },
                    }}
                  >
                    <Typography
                      variant="h4"
                      component="h3"
                      sx={{
                        fontWeight: 700,
                        color: 'primary.dark',
                        mb: { xs: isMobile ? 3 : 4, sm: 4 },
                        textAlign: 'center',
                        fontSize: {
                          xs: isMobile ? '1.1rem' : '1.25rem',
                          sm: isFoldable ? '1.3rem' : '1.5rem',
                          md: isTablet ? '1.6rem' : '1.75rem',
                          lg: '2rem',
                        },
                        borderBottom: '3px solid',
                        borderColor: 'primary.light',
                        pb: { xs: isMobile ? 2 : 3, sm: 3 },
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: -3,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: { xs: isMobile ? '50px' : '60px', sm: '60px' },
                          height: '3px',
                          backgroundColor: 'primary.main',
                          borderRadius: '2px',
                        },
                      }}
                    >
                      📊 Account Statistics
                    </Typography>

                    <Grid
                      container
                      spacing={{
                        xs: isMobile ? 1.5 : 2,
                        sm: isFoldable ? 2 : 3,
                        md: isTablet ? 2.5 : 3,
                      }}
                    >
                      <Grid item xs={6} sm={6} md={3}>
                        <Box
                          sx={{
                            p: {
                              xs: isMobile ? 1.5 : 2,
                              sm: isFoldable ? 2.5 : 3,
                              md: isTablet ? 2.5 : 3,
                            },
                            textAlign: 'center',
                            bgcolor: 'background.paper',
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: 'divider',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                            },
                          }}
                        >
                          <CartIcon
                            sx={{
                              fontSize: {
                                xs: isMobile ? '1.2rem' : '1.5rem',
                                sm: isFoldable ? '1.7rem' : '2rem',
                                md: isTablet ? '2.2rem' : '2.5rem',
                              },
                              color: 'primary.main',
                              mb: { xs: isMobile ? 1.5 : 2, sm: 2 },
                            }}
                          />
                          <Typography
                            variant="h4"
                            component="div"
                            sx={{
                              fontWeight: 700,
                              mb: 1,
                              fontSize: {
                                xs: isMobile ? '1rem' : '1.25rem',
                                sm: isFoldable ? '1.3rem' : '1.5rem',
                                md: isTablet ? '1.7rem' : '2rem',
                              },
                            }}
                          >
                            {cartItems}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              fontSize: {
                                xs: isMobile ? '0.7rem' : '0.75rem',
                                sm: isFoldable ? '0.8rem' : '0.875rem',
                                md: isTablet ? '0.8rem' : '0.875rem',
                              },
                            }}
                          >
                            Cart Items
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6} sm={6} md={3}>
                        <Box
                          sx={{
                            p: {
                              xs: isMobile ? 1.5 : 2,
                              sm: isFoldable ? 2.5 : 3,
                              md: isTablet ? 2.5 : 3,
                            },
                            textAlign: 'center',
                            bgcolor: 'background.paper',
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: 'divider',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                            },
                          }}
                        >
                          <OrderIcon
                            sx={{
                              fontSize: {
                                xs: isMobile ? '1.2rem' : '1.5rem',
                                sm: isFoldable ? '1.7rem' : '2rem',
                                md: isTablet ? '2.2rem' : '2.5rem',
                              },
                              color: 'secondary.main',
                              mb: { xs: isMobile ? 1.5 : 2, sm: 2 },
                            }}
                          />
                          <Typography
                            variant="h4"
                            component="div"
                            sx={{
                              fontWeight: 700,
                              mb: 1,
                              fontSize: {
                                xs: isMobile ? '1rem' : '1.25rem',
                                sm: isFoldable ? '1.3rem' : '1.5rem',
                                md: isTablet ? '1.7rem' : '2rem',
                              },
                            }}
                          >
                            {safeOrderStats.totalOrders}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              fontSize: {
                                xs: isMobile ? '0.7rem' : '0.75rem',
                                sm: isFoldable ? '0.8rem' : '0.875rem',
                                md: isTablet ? '0.8rem' : '0.875rem',
                              },
                            }}
                          >
                            Total Orders
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6} sm={6} md={3}>
                        <Box
                          sx={{
                            p: {
                              xs: isMobile ? 1.5 : 2,
                              sm: isFoldable ? 2.5 : 3,
                              md: isTablet ? 2.5 : 3,
                            },
                            textAlign: 'center',
                            bgcolor: 'background.paper',
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: 'divider',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                            },
                          }}
                        >
                          <TrendingUpIcon
                            sx={{
                              fontSize: {
                                xs: isMobile ? '1.2rem' : '1.5rem',
                                sm: isFoldable ? '1.7rem' : '2rem',
                                md: isTablet ? '2.2rem' : '2.5rem',
                              },
                              color: 'success.main',
                              mb: { xs: isMobile ? 1.5 : 2, sm: 2 },
                            }}
                          />
                          <Typography
                            variant="h4"
                            component="div"
                            sx={{
                              fontWeight: 700,
                              mb: 1,
                              fontSize: {
                                xs: isMobile ? '1rem' : '1.25rem',
                                sm: isFoldable ? '1.3rem' : '1.5rem',
                                md: isTablet ? '1.7rem' : '2rem',
                              },
                            }}
                          >
                            {safeOrderStats.totalSpent.toFixed(0)}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              fontSize: {
                                xs: isMobile ? '0.7rem' : '0.75rem',
                                sm: isFoldable ? '0.8rem' : '0.875rem',
                                md: isTablet ? '0.8rem' : '0.875rem',
                              },
                            }}
                          >
                            Total Spent(₹)
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6} sm={6} md={3}>
                        <Box
                          sx={{
                            p: {
                              xs: isMobile ? 1.5 : 2,
                              sm: isFoldable ? 2.5 : 3,
                              md: isTablet ? 2.5 : 3,
                            },
                            textAlign: 'center',
                            bgcolor: 'background.paper',
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: 'divider',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                            },
                          }}
                        >
                          <StarIcon
                            sx={{
                              fontSize: {
                                xs: isMobile ? '1.2rem' : '1.5rem',
                                sm: isFoldable ? '1.7rem' : '2rem',
                                md: isTablet ? '2.2rem' : '2.5rem',
                              },
                              color: 'warning.main',
                              mb: { xs: isMobile ? 1.5 : 2, sm: 2 },
                            }}
                          />
                          <Typography
                            variant="h6"
                            component="div"
                            sx={{
                              fontWeight: 700,
                              mb: 1,
                              fontSize: {
                                xs: isMobile ? '0.8rem' : '0.9rem',
                                sm: isFoldable ? '0.95rem' : '1rem',
                                md: isTablet ? '1.1rem' : '1.25rem',
                              },
                            }}
                          >
                            {safeOrderStats.topCategory}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              fontSize: {
                                xs: isMobile ? '0.7rem' : '0.75rem',
                                sm: isFoldable ? '0.8rem' : '0.875rem',
                                md: isTablet ? '0.8rem' : '0.875rem',
                              },
                            }}
                          >
                            Top Category
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grow> */}
              {/* Compact Statistics */}
              <Grow in timeout={1900}>
                <Card
                  elevation={6}
                  sx={{
                    border: '2px solid',
                    borderColor: 'primary.light',
                    background:
                      'linear-gradient(135deg, background.paper 0%, rgba(163, 130, 76, 0.03) 100%)',
                  }}
                >
                  <CardContent
                    sx={{
                      p: {
                        xs: isMobile ? 1.5 : 2,
                        sm: isFoldable ? 2.5 : 3,
                        md: isTablet ? 3.5 : 4,
                      },
                    }}
                  >
                    <Typography
                      variant="h5"
                      component="h3"
                      sx={{
                        fontWeight: 700,
                        color: 'primary.dark',
                        mb: { xs: isMobile ? 2.5 : 3, sm: 3 },
                        textAlign: 'center',
                        borderBottom: '2px solid',
                        borderColor: 'primary.light',
                        pb: { xs: isMobile ? 1.5 : 2, sm: 2 },
                        fontSize: {
                          xs: isMobile ? '0.9rem' : '1rem',
                          sm: isFoldable ? '1.05rem' : '1.1rem',
                          md: isTablet ? '1.15rem' : '1.25rem',
                        },
                        wordBreak: 'break-word',
                      }}
                    >
                      📊 Quick Stats
                    </Typography>

                    <Stack spacing={2} sx={{ width: '100%' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          p: {
                            xs: isMobile ? 1.1 : 1.25,
                            sm: isFoldable ? 1.3 : 1.5,
                            md: isTablet ? 1.7 : 2,
                          },
                          bgcolor: 'background.paper',
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                          width: '100%',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            flex: 1,
                            minWidth: 0,
                          }}
                        >
                          <CartIcon
                            sx={{
                              fontSize: {
                                xs: isMobile ? '0.9rem' : '1rem',
                                sm: isFoldable ? '1.05rem' : '1.1rem',
                                md: isTablet ? '1.15rem' : '1.2rem',
                              },
                              color: 'primary.main',
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              fontSize: {
                                xs: isMobile ? '0.7rem' : '0.75rem',
                                sm: isFoldable ? '0.75rem' : '0.8rem',
                                md: isTablet ? '0.8rem' : '0.875rem',
                              },
                              wordBreak: 'break-word',
                            }}
                          >
                            Cart Items
                          </Typography>
                        </Box>
                        <Chip
                          label={cartItems}
                          size={isMobile ? 'small' : 'small'}
                          sx={{
                            fontWeight: 600,
                            background:
                              'linear-gradient(135deg, #2196f3 0%, #0d47a1 100%) !important',
                            color: 'white !important',
                            flexShrink: 0,
                            '& .MuiChip-label': {
                              color: 'white !important',
                            },
                            boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)',
                          }}
                        />
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          p: {
                            xs: isMobile ? 1.1 : 1.25,
                            sm: isFoldable ? 1.3 : 1.5,
                            md: isTablet ? 1.7 : 2,
                          },
                          bgcolor: 'background.paper',
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                          width: '100%',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            flex: 1,
                            minWidth: 0,
                          }}
                        >
                          <OrderIcon
                            sx={{
                              fontSize: {
                                xs: isMobile ? '0.9rem' : '1rem',
                                sm: isFoldable ? '1.05rem' : '1.1rem',
                                md: isTablet ? '1.15rem' : '1.2rem',
                              },
                              color: 'secondary.main',
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              fontSize: {
                                xs: isMobile ? '0.7rem' : '0.75rem',
                                sm: isFoldable ? '0.75rem' : '0.8rem',
                                md: isTablet ? '0.8rem' : '0.875rem',
                              },
                              wordBreak: 'break-word',
                            }}
                          >
                            Total Orders
                          </Typography>
                        </Box>
                        <Chip
                          label={safeOrderStats.totalOrders}
                          size={isMobile ? 'small' : 'small'}
                          sx={{
                            fontWeight: 600,
                            background:
                              'linear-gradient(135deg, #e91e63 0%, #ad1457 100%) !important',
                            color: 'white !important',
                            flexShrink: 0,
                            '& .MuiChip-label': {
                              color: 'white !important',
                            },
                            boxShadow: '0 2px 8px rgba(233, 30, 99, 0.3)',
                          }}
                        />
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          p: {
                            xs: isMobile ? 1.1 : 1.25,
                            sm: isFoldable ? 1.3 : 1.5,
                            md: isTablet ? 1.7 : 2,
                          },
                          bgcolor: 'background.paper',
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                          width: '100%',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            flex: 1,
                            minWidth: 0,
                          }}
                        >
                          <TrendingUpIcon
                            sx={{
                              fontSize: {
                                xs: isMobile ? '0.9rem' : '1rem',
                                sm: isFoldable ? '1.05rem' : '1.1rem',
                                md: isTablet ? '1.15rem' : '1.2rem',
                              },
                              color: 'success.main',
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              fontSize: {
                                xs: isMobile ? '0.7rem' : '0.75rem',
                                sm: isFoldable ? '0.75rem' : '0.8rem',
                                md: isTablet ? '0.8rem' : '0.875rem',
                              },
                              wordBreak: 'break-word',
                            }}
                          >
                            Total Spent(₹)
                          </Typography>
                        </Box>
                        <Chip
                          label={`${safeOrderStats.totalSpent.toFixed(0)}`}
                          size={isMobile ? 'small' : 'small'}
                          sx={{
                            fontWeight: 600,
                            background:
                              'linear-gradient(135deg, #4caf50 0%, #1b5e20 100%) !important',
                            color: 'white !important',
                            flexShrink: 0,
                            '& .MuiChip-label': {
                              color: 'white !important',
                            },
                            boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)',
                          }}
                        />
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grow>
            </Stack>
          </Grid>

          {/* Right Sidebar (30%) */}
          <Grid
            sx={{
              width: {
                xs: '100%',
                sm: isFoldable ? '100%' : '100%',
                md: isTablet ? '100%' : '27.5%',
                lg: '27.5%',
              },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: {
                xs: 'center',
                sm: isFoldable ? 'center' : 'center',
                md: isTablet ? 'center' : 'flex-start',
                lg: 'flex-start',
              },
            }}
          >
            <Stack spacing={{ xs: 3, sm: 4, md: 4, lg: 4 }}>
              {/* Address Management */}
              <Grow in timeout={1600}>
                <Card
                  elevation={6}
                  sx={{
                    border: '2px solid',
                    borderColor: 'primary.light',
                    height: 'fit-content',
                    background:
                      'linear-gradient(135deg, background.paper 0%, rgba(163, 130, 76, 0.03) 100%)',
                  }}
                >
                  <CardContent
                    sx={{
                      p: {
                        xs: isMobile ? 1.5 : 2,
                        sm: isFoldable ? 2.5 : 3,
                        md: isTablet ? 3.5 : 4,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: { xs: isMobile ? 2.5 : 3, sm: 3 },
                        width: '100%',
                      }}
                    >
                      <LocationIcon
                        sx={{
                          mr: { xs: isMobile ? 1.5 : 2, sm: 2 },
                          color: 'primary.main',
                          fontSize: {
                            xs: isMobile ? '1.1rem' : '1.25rem',
                            sm: isFoldable ? '1.3rem' : '1.5rem',
                            md: isTablet ? '1.7rem' : '2rem',
                          },
                          flexShrink: 0,
                        }}
                      />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 700,
                            color: 'primary.dark',
                            fontSize: {
                              xs: isMobile ? '0.9rem' : '1rem',
                              sm: isFoldable ? '1.05rem' : '1.1rem',
                              md: isTablet ? '1.15rem' : '1.25rem',
                            },
                            wordBreak: 'break-word',
                          }}
                        >
                          🏠 Addresses
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontSize: {
                              xs: isMobile ? '0.7rem' : '0.75rem',
                              sm: isFoldable ? '0.75rem' : '0.8rem',
                              md: isTablet ? '0.8rem' : '0.875rem',
                            },
                            wordBreak: 'break-word',
                          }}
                        >
                          Manage your shipping addresses
                        </Typography>
                      </Box>
                    </Box>

                    {addresses && addresses.length > 0 ? (
                      <Stack spacing={2} sx={{ mb: 3 }}>
                        {addresses.slice(0, 3).map((address) => {
                          if (!address || !address._id) return null;
                          return (
                            <Box
                              key={address._id}
                              sx={{
                                p: {
                                  xs: isMobile ? 1.2 : 1.5,
                                  md: isTablet ? 1.7 : 2,
                                },
                                bgcolor: 'background.paper',
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: 'divider',
                                transition: 'all 0.3s ease',
                                width: '100%',
                                '&:hover': {
                                  bgcolor: 'action.hover',
                                  transform: 'translateX(4px)',
                                },
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  color: 'text.primary',
                                  mb: 0.5,
                                  fontSize: {
                                    xs: isMobile ? '0.7rem' : '0.75rem',
                                    sm: isFoldable ? '0.75rem' : '0.8rem',
                                    md: isTablet ? '0.8rem' : '0.875rem',
                                  },
                                  wordBreak: 'break-word',
                                  lineHeight: 1.3,
                                }}
                              >
                                {address.addressLine1 || 'Address'}
                                {address.addressLine2 &&
                                  `, ${address.addressLine2}`}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                  fontSize: {
                                    xs: isMobile ? '0.6rem' : '0.65rem',
                                    sm: isFoldable ? '0.65rem' : '0.7rem',
                                    md: isTablet ? '0.7rem' : '0.75rem',
                                  },
                                  wordBreak: 'break-word',
                                  lineHeight: 1.2,
                                }}
                              >
                                {[address.city, address.state, address.pinCode]
                                  .filter(Boolean)
                                  .join(', ') ||
                                  'Location details not available'}
                              </Typography>
                            </Box>
                          );
                        })}
                        {addresses.length > 3 && (
                          <Typography
                            variant="body2"
                            sx={{
                              textAlign: 'center',
                              color: 'text.secondary',
                              fontStyle: 'italic',
                              py: 1,
                              fontSize: {
                                xs: isMobile ? '0.75rem' : '0.8rem',
                                md: isTablet ? '0.8rem' : '0.875rem',
                              },
                            }}
                          >
                            +{addresses.length - 3} more addresses
                          </Typography>
                        )}
                      </Stack>
                    ) : (
                      <Box
                        sx={{
                          textAlign: 'center',
                          py: { xs: isMobile ? 2.5 : 3, sm: 3 },
                          color: 'text.secondary',
                        }}
                      >
                        <LocationIcon
                          sx={{
                            fontSize: {
                              xs: isMobile ? '2rem' : '2.5rem',
                              md: isTablet ? '2.7rem' : '3rem',
                            },
                            color: 'primary.light',
                            mb: 2,
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            mb: 2,
                            fontSize: {
                              xs: isMobile ? '0.75rem' : '0.8rem',
                              md: isTablet ? '0.8rem' : '0.875rem',
                            },
                          }}
                        >
                          No addresses added yet
                        </Typography>
                      </Box>
                    )}

                    <Button
                      variant="contained"
                      fullWidth
                      component={Link}
                      to="/addresses"
                      startIcon={<AddIcon />}
                      sx={{
                        py: {
                          xs: isMobile ? 1.1 : 1.25,
                          sm: isFoldable ? 1.3 : 1.5,
                        },
                        fontSize: {
                          xs: isMobile ? '0.75rem' : '0.8rem',
                          sm: isFoldable ? '0.8rem' : '0.85rem',
                          md: isTablet ? '0.85rem' : '0.875rem',
                        },
                        minHeight: {
                          xs: isMobile ? '36px' : '40px',
                          sm: isFoldable ? '42px' : '44px',
                        },
                      }}
                    >
                      {addresses && addresses.length > 0
                        ? 'Manage Addresses'
                        : 'Add Address'}
                    </Button>
                  </CardContent>
                </Card>
              </Grow>

              {/* Account Summary */}
              <Grow in timeout={1800}>
                <Card
                  elevation={6}
                  sx={{
                    border: '2px solid',
                    borderColor: 'primary.light',
                    height: 'fit-content',
                    background:
                      'linear-gradient(135deg, background.paper 0%, rgba(163, 130, 76, 0.03) 100%)',
                  }}
                >
                  <CardContent
                    sx={{
                      p: {
                        xs: isMobile ? 1.5 : 2,
                        sm: isFoldable ? 2.5 : 3,
                        md: isTablet ? 3.5 : 4,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: { xs: isMobile ? 2.5 : 3, sm: 3 },
                        width: '100%',
                      }}
                    >
                      <AccountIcon
                        sx={{
                          mr: { xs: isMobile ? 1.5 : 2, sm: 2 },
                          color: 'primary.main',
                          fontSize: {
                            xs: isMobile ? '1.1rem' : '1.25rem',
                            sm: isFoldable ? '1.3rem' : '1.5rem',
                            md: isTablet ? '1.7rem' : '2rem',
                          },
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: 'primary.dark',
                          fontSize: {
                            xs: isMobile ? '0.9rem' : '1rem',
                            sm: isFoldable ? '1.05rem' : '1.1rem',
                            md: isTablet ? '1.15rem' : '1.25rem',
                          },
                          wordBreak: 'break-word',
                        }}
                      >
                        📋 Summary
                      </Typography>
                    </Box>

                    <Stack spacing={2} sx={{ width: '100%' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          p: {
                            xs: isMobile ? 1.1 : 1.25,
                            sm: isFoldable ? 1.3 : 1.5,
                            md: isTablet ? 1.7 : 2,
                          },
                          bgcolor: 'background.paper',
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                          width: '100%',
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontSize: {
                              xs: isMobile ? '0.7rem' : '0.75rem',
                              sm: isFoldable ? '0.75rem' : '0.8rem',
                              md: isTablet ? '0.8rem' : '0.875rem',
                            },
                            wordBreak: 'break-word',
                          }}
                        >
                          Member Status
                        </Typography>
                        <Chip
                          label="Active"
                          color="success"
                          size={isMobile ? 'small' : 'small'}
                          sx={{ fontWeight: 600, flexShrink: 0 }}
                        />
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          p: {
                            xs: isMobile ? 1.1 : 1.25,
                            sm: isFoldable ? 1.3 : 1.5,
                            md: isTablet ? 1.7 : 2,
                          },
                          bgcolor: 'background.paper',
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                          width: '100%',
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontSize: {
                              xs: isMobile ? '0.7rem' : '0.75rem',
                              sm: isFoldable ? '0.75rem' : '0.8rem',
                              md: isTablet ? '0.8rem' : '0.875rem',
                            },
                            wordBreak: 'break-word',
                          }}
                        >
                          Last Login
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            fontSize: {
                              xs: isMobile ? '0.7rem' : '0.75rem',
                              sm: isFoldable ? '0.75rem' : '0.8rem',
                              md: isTablet ? '0.8rem' : '0.875rem',
                            },
                            wordBreak: 'break-word',
                          }}
                        >
                          {lastLoginDate}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grow>

              {/* Quick Actions */}
              <Grow in timeout={2000}>
                <Card
                  elevation={6}
                  sx={{
                    border: '2px solid',
                    borderColor: 'primary.light',
                    background:
                      'linear-gradient(135deg, background.paper 0%, rgba(163, 130, 76, 0.03) 100%)',
                  }}
                >
                  <CardContent
                    sx={{
                      p: {
                        xs: isMobile ? 1.5 : 2,
                        sm: isFoldable ? 2.5 : 3,
                        md: isTablet ? 3.5 : 4,
                      },
                    }}
                  >
                    <Typography
                      variant="h5"
                      component="h3"
                      sx={{
                        fontWeight: 700,
                        color: 'primary.dark',
                        mb: { xs: isMobile ? 2.5 : 3, sm: 3 },
                        textAlign: 'center',
                        borderBottom: '2px solid',
                        borderColor: 'primary.light',
                        pb: { xs: isMobile ? 1.5 : 2, sm: 2 },
                        fontSize: {
                          xs: isMobile ? '0.9rem' : '1rem',
                          sm: isFoldable ? '1.05rem' : '1.1rem',
                          md: isTablet ? '1.15rem' : '1.25rem',
                        },
                        wordBreak: 'break-word',
                      }}
                    >
                      ⚡ Quick Actions
                    </Typography>

                    <Stack spacing={2} sx={{ width: '100%' }}>
                      <Button
                        variant="outlined"
                        fullWidth
                        component={Link}
                        to="/cart"
                        startIcon={<CartIcon />}
                        sx={{
                          py: {
                            xs: isMobile ? 1.1 : 1.25,
                            sm: isFoldable ? 1.3 : 1.5,
                          },
                          borderWidth: 2,
                          fontSize: {
                            xs: isMobile ? '0.75rem' : '0.8rem',
                            sm: isFoldable ? '0.8rem' : '0.85rem',
                            md: isTablet ? '0.85rem' : '0.875rem',
                          },
                          minHeight: {
                            xs: isMobile ? '36px' : '40px',
                            sm: isFoldable ? '42px' : '44px',
                          },
                        }}
                      >
                        View Cart
                      </Button>
                      <Button
                        variant="outlined"
                        fullWidth
                        component={Link}
                        to="/orders"
                        startIcon={<OrderIcon />}
                        sx={{
                          py: {
                            xs: isMobile ? 1.1 : 1.25,
                            sm: isFoldable ? 1.3 : 1.5,
                          },
                          borderWidth: 2,
                          fontSize: {
                            xs: isMobile ? '0.75rem' : '0.8rem',
                            sm: isFoldable ? '0.8rem' : '0.85rem',
                            md: isTablet ? '0.85rem' : '0.875rem',
                          },
                          minHeight: {
                            xs: isMobile ? '36px' : '40px',
                            sm: isFoldable ? '42px' : '44px',
                          },
                        }}
                      >
                        Order History
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grow>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {/* Edit Profile Dialog */}
      {user && (
        <EditProfileDialog
          open={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          user={user}
          onSuccess={handleProfileUpdateSuccess}
          onError={handleProfileUpdateError}
        />
      )}

      {/* Change Password Dialog */}
      {user && (
        <ChangePasswordDialog
          open={isPasswordDialogOpen}
          onClose={() => setIsPasswordDialogOpen(false)}
          onSuccess={(message) => {
            try {
              setSnackbar({
                open: true,
                message: message || 'Password changed successfully!',
                severity: 'success',
              });
            } catch (error) {
              console.error('Error handling password change success:', error);
              setSnackbar({
                open: true,
                message: 'Password changed successfully!',
                severity: 'success',
              });
            }
          }}
          onError={(message) => {
            try {
              setSnackbar({
                open: true,
                message:
                  message || 'Failed to change password. Please try again.',
                severity: 'error',
              });
            } catch (error) {
              console.error('Error handling password change error:', error);
              setSnackbar({
                open: true,
                message: 'Failed to change password. Please try again.',
                severity: 'error',
              });
            }
          }}
        />
      )}

      {/* Theme Snackbar */}
      <ThemeSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
      />
    </Container>
  );
};

export default Profile;
