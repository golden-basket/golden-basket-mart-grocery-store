import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Avatar,
  IconButton,
  Alert,
  Snackbar,
  Chip,
  Stack,
  Container,
  Card,
  CardContent,
  Grow,
} from '@mui/material';
import {
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  ShoppingCart as CartIcon,
  Receipt as OrderIcon,
  Star as StarIcon,
  Lock as LockIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  AccountCircle as AccountIcon,
} from '@mui/icons-material';
import Badge from '@mui/material/Badge';
import { useAuth } from '../hooks/useAuth';
import EditProfileDialog from '../components/EditProfileDialog';
import ChangePasswordDialog from '../components/ChangePasswordDialog';
import ApiService from '../services/api';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, getProfile, loading } = useAuth();
  const [cartItems, setCartItems] = useState(0);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    topCategory: 'None',
  });
  const [addresses, setAddresses] = useState([]);
  const [categories, setCategories] = useState({});

  const fetchOrderStats = useCallback(async () => {
    try {
      const orders = await ApiService.getUserOrders();
      const totalOrders = orders.length || 0;
      const totalSpent = orders.reduce(
        (sum, order) => sum + (order.totalAmount || 0),
        0
      );

      // Get top category from orders
      const categoryCounts = {};
      orders.forEach((order) => {
        order.items?.forEach((item) => {
          if (item.product?.category) {
            const categoryId = item.product.category;
            categoryCounts[categoryId] = (categoryCounts[categoryId] || 0) + 1;
          }
        });
      });

      const topCategoryId =
        Object.keys(categoryCounts).length > 0
          ? Object.keys(categoryCounts).reduce((a, b) =>
              categoryCounts[a] > categoryCounts[b] ? a : b
            )
          : null;

      const topCategory =
        topCategoryId && categories[topCategoryId]
          ? categories[topCategoryId]
          : 'None';

      setOrderStats({ totalOrders, totalSpent, topCategory });
    } catch (error) {
      console.error('Failed to fetch order stats:', error);
    }
  }, [categories]);

  const fetchAddresses = useCallback(async () => {
    try {
      const userAddresses = await ApiService.getAddresses();
      setAddresses(userAddresses);
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const allCategories = await ApiService.getCategories();
      const categoryMap = {};
      allCategories.forEach((cat) => {
        categoryMap[cat._id] = cat.name;
      });
      setCategories(categoryMap);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }, []);

  // Calculate cart items count correctly
  const getCartItemCount = () => {
    ApiService.getCart()
      .then((cart) => {
        setCartItems(
          cart.items?.reduce((total, item) => total + item.quantity, 0) || 0
        );
      })
      .catch((error) => {
        console.error('Failed to fetch cart items:', error);
      });
  };

  const handleEditProfile = () => {
    setIsEditDialogOpen(true);
  };

  const handleProfileUpdateSuccess = () => {
    setSnackbar({
      open: true,
      message: 'Profile updated successfully!',
      severity: 'success',
    });
    setIsEditDialogOpen(false);
    refreshProfileData();
  };

  const refreshProfileData = async () => {
    await getProfile();
    await fetchCategories();
    await fetchAddresses();
  };

  const handleProfileUpdateError = () => {
    setSnackbar({
      open: true,
      message: 'Failed to update profile. Please try again.',
      severity: 'error',
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Fetch order stats whenever categories change
  useEffect(() => {
    if (Object.keys(categories).length > 0) {
      fetchOrderStats();
    }
  }, [categories, fetchOrderStats]);

  // Fetch user data when component mounts
  useEffect(() => {
    if (user && !loading) {
      getProfile();
      fetchCategories();
      fetchAddresses();
    }
  }, [user, getProfile, loading, fetchCategories, fetchAddresses]);

  useEffect(() => {
    getCartItemCount();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="primary">
            Loading your profile...
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

  // Ensure we have the minimum required user data
  const displayName = (user.firstName + ' ' + user.lastName).trim() || 'User';
  const displayPhone = user.phone || 'Not provided';
  const displayEmail = user.email || 'Not provided';

  return (
    <Container maxWidth="xl" sx={{ py: 4, mt: 8 }}>
      <Box
        sx={{
          position: 'relative',
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
        <Grid container spacing={{ xs: 2, sm: 3, md: 4, lg: 5 }}>
          {/* Profile Information - Left Column (70%) */}
          <Grid item xs={12} md={8} lg={8}>
            <Stack spacing={{ xs: 3, sm: 4, md: 4, lg: 4 }}>
              {/* Main Profile Card */}
              <Grow in timeout={1000}>
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
                  <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: {
                          xs: 'column',
                          sm: 'column',
                          md: 'column',
                          lg: 'row',
                        },
                        alignItems: {
                          xs: 'center',
                          sm: 'center',
                          md: 'center',
                          lg: 'flex-start',
                        },
                        gap: { xs: 2, sm: 3, md: 4 },
                        width: '100%',
                        maxWidth: '100%',
                      }}
                    >
                      <Box
                        direction={{
                          xs: 'column',
                          sm: 'row',
                          md: 'row',
                          lg: 'column',
                        }}
                        spacing={2}
                        sx={{
                          mt: { xs: 2, sm: 2, md: 2, lg: 0 },
                        }}
                      >
                        {/* Avatar Section */}
                        <Box sx={{ position: 'relative', flexShrink: 0 }}>
                          <Badge
                            overlap="circular"
                            anchorOrigin={{
                              vertical: 'bottom',
                              horizontal: 'right',
                            }}
                            badgeContent={
                              <IconButton
                                onClick={handleEditProfile}
                                sx={{
                                  width: { xs: 24, sm: 26, md: 28, lg: 30 },
                                  height: { xs: 24, sm: 26, md: 28, lg: 30 },
                                  minWidth: { xs: 24, sm: 26, md: 28, lg: 30 },
                                  minHeight: { xs: 24, sm: 26, md: 28, lg: 30 },
                                  p: 2,
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
                                      xs: 20,
                                      sm: 20,
                                      md: 20,
                                      lg: 20,
                                    },
                                  }}
                                />
                              </IconButton>
                            }
                          >
                            <Avatar
                              sx={{
                                width: { xs: 80, sm: 100, md: 120, lg: 140 },
                                height: { xs: 80, sm: 100, md: 120, lg: 140 },
                                background:
                                  'linear-gradient(135deg, primary.main 0%, primary.dark 100%)',
                                fontSize: {
                                  xs: '2rem',
                                  sm: '2.5rem',
                                  md: '3rem',
                                  lg: '3.5rem',
                                },
                                border: '4px solid',
                                borderColor: 'primary.light',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'scale(1.05)',
                                  boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
                                },
                              }}
                            >
                              {user.firstName?.charAt(0) ||
                                user.email?.charAt(0) ||
                                'U'}
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
                              md: 'center',
                              lg: 'left',
                            },
                            minWidth: 0,
                            width: '100%',
                            maxWidth: {
                              xs: '100%',
                              sm: '100%',
                              md: '100%',
                              lg: 'none',
                            },
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
                                xs: '1.25rem',
                                sm: '1.5rem',
                                md: '1.75rem',
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
                                  md: 'center',
                                  lg: 'flex-start',
                                },
                                width: '100%',
                              }}
                            >
                              <EmailIcon
                                color="primary"
                                sx={{
                                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                                }}
                              />
                              <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{
                                  fontSize: {
                                    xs: '0.85rem',
                                    sm: '0.9rem',
                                    md: '1rem',
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
                                  md: 'center',
                                  lg: 'flex-start',
                                },
                                width: '100%',
                              }}
                            >
                              <PhoneIcon
                                color="primary"
                                sx={{
                                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                                }}
                              />
                              <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{
                                  fontSize: {
                                    xs: '0.85rem',
                                    sm: '0.9rem',
                                    md: '1rem',
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
                                md: 'center',
                                lg: 'left',
                              },
                              fontSize: {
                                xs: '0.8rem',
                                sm: '0.85rem',
                                md: '0.9rem',
                              },
                            }}
                          >
                            Member since{' '}
                            {new Date(
                              user.createdAt || Date.now()
                            ).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </Typography>
                        </Box>

                        {/* Action Buttons */}
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            gap: 2,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            mt: 3,
                          }}
                        >
                          <Button
                            variant="contained"
                            onClick={handleEditProfile}
                            startIcon={<EditIcon />}
                            sx={{
                              px: { xs: 2, sm: 2.5, md: 3 },
                              py: 1.5,
                              minWidth: { xs: '120px', sm: '140px' },
                              fontSize: {
                                xs: '0.85rem',
                                sm: '0.9rem',
                                md: '1rem',
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
                              px: { xs: 2, sm: 2.5, md: 3 },
                              py: 1.5,
                              minWidth: { xs: '120px', sm: '140px' },
                              borderWidth: 2,
                              fontSize: {
                                xs: '0.85rem',
                                sm: '0.9rem',
                                md: '1rem',
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
              <Grow in timeout={1200}>
                <Card
                  elevation={6}
                  sx={{
                    border: '2px solid',
                    borderColor: 'primary.light',
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography
                      variant="h4"
                      component="h3"
                      sx={{
                        fontWeight: 700,
                        color: 'primary.dark',
                        mb: 4,
                        textAlign: 'center',
                        borderBottom: '3px solid',
                        borderColor: 'primary.light',
                        pb: 3,
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: -3,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '60px',
                          height: '3px',
                          backgroundColor: 'primary.main',
                          borderRadius: '2px',
                        },
                      }}
                    >
                      📊 Account Statistics
                    </Typography>

                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box
                          sx={{
                            p: 3,
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
                              fontSize: '2.5rem',
                              color: 'primary.main',
                              mb: 2,
                            }}
                          />
                          <Typography
                            variant="h4"
                            component="div"
                            sx={{ fontWeight: 700, mb: 1 }}
                          >
                            {cartItems}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Cart Items
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6} md={3}>
                        <Box
                          sx={{
                            p: 3,
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
                              fontSize: '2.5rem',
                              color: 'secondary.main',
                              mb: 2,
                            }}
                          />
                          <Typography
                            variant="h4"
                            component="div"
                            sx={{ fontWeight: 700, mb: 1 }}
                          >
                            {orderStats.totalOrders}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Total Orders
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6} md={3}>
                        <Box
                          sx={{
                            p: 3,
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
                              fontSize: '2.5rem',
                              color: 'success.main',
                              mb: 2,
                            }}
                          />
                          <Typography
                            variant="h4"
                            component="div"
                            sx={{ fontWeight: 700, mb: 1 }}
                          >
                            ₹{orderStats.totalSpent.toFixed(0)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Total Spent
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6} md={3}>
                        <Box
                          sx={{
                            p: 3,
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
                              fontSize: '2.5rem',
                              color: 'warning.main',
                              mb: 2,
                            }}
                          />
                          <Typography
                            variant="h6"
                            component="div"
                            sx={{ fontWeight: 700, mb: 1 }}
                          >
                            {orderStats.topCategory}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Top Category
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grow>

              {/* Quick Actions */}
              <Grow in timeout={1400}>
                <Card
                  elevation={6}
                  sx={{
                    border: '2px solid',
                    borderColor: 'primary.light',
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography
                      variant="h4"
                      component="h3"
                      sx={{
                        fontWeight: 700,
                        color: 'primary.dark',
                        mb: 4,
                        textAlign: 'center',
                        borderBottom: '3px solid',
                        borderColor: 'primary.light',
                        pb: 3,
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: -3,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '60px',
                          height: '3px',
                          backgroundColor: 'primary.main',
                          borderRadius: '2px',
                        },
                      }}
                    >
                      ⚡ Quick Actions
                    </Typography>

                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Button
                          variant="outlined"
                          fullWidth
                          component={Link}
                          to="/cart"
                          startIcon={<CartIcon />}
                          sx={{
                            py: 2,
                            px: 3,
                            borderWidth: 2,
                            fontSize: '1.1rem',
                          }}
                        >
                          View Cart
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Button
                          variant="outlined"
                          fullWidth
                          component={Link}
                          to="/orders"
                          startIcon={<OrderIcon />}
                          sx={{
                            py: 2,
                            px: 3,
                            borderWidth: 2,
                            fontSize: '1.1rem',
                          }}
                        >
                          Order History
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grow>
            </Stack>
          </Grid>

          {/* Right Sidebar (30%) */}
          <Grid item xs={12} md={4} lg={4}>
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
                  <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 3,
                        width: '100%',
                      }}
                    >
                      <LocationIcon
                        sx={{
                          mr: 2,
                          color: 'primary.main',
                          fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
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
                              xs: '1rem',
                              sm: '1.1rem',
                              md: '1.25rem',
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
                              xs: '0.75rem',
                              sm: '0.8rem',
                              md: '0.875rem',
                            },
                            wordBreak: 'break-word',
                          }}
                        >
                          Manage your shipping addresses
                        </Typography>
                      </Box>
                    </Box>

                    {addresses.length > 0 ? (
                      <Stack spacing={2} sx={{ mb: 3 }}>
                        {addresses.slice(0, 3).map((address) => (
                          <Box
                            key={address._id}
                            sx={{
                              p: { xs: 1.5, md: 2 },
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
                                  xs: '0.75rem',
                                  sm: '0.8rem',
                                  md: '0.875rem',
                                },
                                wordBreak: 'break-word',
                                lineHeight: 1.3,
                              }}
                            >
                              {address.addressLine1}
                              {address.addressLine2 &&
                                `, ${address.addressLine2}`}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                fontSize: {
                                  xs: '0.65rem',
                                  sm: '0.7rem',
                                  md: '0.75rem',
                                },
                                wordBreak: 'break-word',
                                lineHeight: 1.2,
                              }}
                            >
                              {address.city}, {address.state} {address.pinCode}
                            </Typography>
                          </Box>
                        ))}
                        {addresses.length > 3 && (
                          <Typography
                            variant="body2"
                            sx={{
                              textAlign: 'center',
                              color: 'text.secondary',
                              fontStyle: 'italic',
                              py: 1,
                              fontSize: { xs: '0.8rem', md: '0.875rem' },
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
                          py: 3,
                          color: 'text.secondary',
                        }}
                      >
                        <LocationIcon
                          sx={{
                            fontSize: { xs: '2.5rem', md: '3rem' },
                            color: 'primary.light',
                            mb: 2,
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            mb: 2,
                            fontSize: { xs: '0.8rem', md: '0.875rem' },
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
                        py: { xs: 1.25, sm: 1.5 },
                        fontSize: {
                          xs: '0.8rem',
                          sm: '0.85rem',
                          md: '0.875rem',
                        },
                        minHeight: { xs: '40px', sm: '44px' },
                      }}
                    >
                      {addresses.length > 0
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
                  <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 3,
                        width: '100%',
                      }}
                    >
                      <AccountIcon
                        sx={{
                          mr: 2,
                          color: 'primary.main',
                          fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: 'primary.dark',
                          fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                          wordBreak: 'break-word',
                        }}
                      >
                        📋 Account Summary
                      </Typography>
                    </Box>

                    <Stack spacing={2} sx={{ width: '100%' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          p: { xs: 1.25, sm: 1.5, md: 2 },
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
                              xs: '0.75rem',
                              sm: '0.8rem',
                              md: '0.875rem',
                            },
                            wordBreak: 'break-word',
                          }}
                        >
                          Member Status
                        </Typography>
                        <Chip
                          label="Active"
                          color="success"
                          size="small"
                          sx={{ fontWeight: 600, flexShrink: 0 }}
                        />
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          p: { xs: 1.25, sm: 1.5, md: 2 },
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
                              xs: '0.75rem',
                              sm: '0.8rem',
                              md: '0.875rem',
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
                              xs: '0.75rem',
                              sm: '0.8rem',
                              md: '0.875rem',
                            },
                            wordBreak: 'break-word',
                          }}
                        >
                          {new Date().toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grow>

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
                  <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                    <Typography
                      variant="h5"
                      component="h3"
                      sx={{
                        fontWeight: 700,
                        color: 'primary.dark',
                        mb: 3,
                        textAlign: 'center',
                        borderBottom: '2px solid',
                        borderColor: 'primary.light',
                        pb: 2,
                        fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
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
                          p: { xs: 1.25, sm: 1.5, md: 2 },
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
                                xs: '1rem',
                                sm: '1.1rem',
                                md: '1.2rem',
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
                                xs: '0.75rem',
                                sm: '0.8rem',
                                md: '0.875rem',
                              },
                              wordBreak: 'break-word',
                            }}
                          >
                            Cart Items
                          </Typography>
                        </Box>
                        <Chip
                          label={cartItems}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            background:
                              'linear-gradient(135deg, primary.light 0%, primary.main 100%)',
                            color: 'white',
                            flexShrink: 0,
                          }}
                        />
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          p: { xs: 1.25, sm: 1.5, md: 2 },
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
                                xs: '1rem',
                                sm: '1.1rem',
                                md: '1.2rem',
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
                                xs: '0.75rem',
                                sm: '0.8rem',
                                md: '0.875rem',
                              },
                              wordBreak: 'break-word',
                            }}
                          >
                            Total Orders
                          </Typography>
                        </Box>
                        <Chip
                          label={orderStats.totalOrders}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            background:
                              'linear-gradient(135deg, secondary.light 0%, secondary.main 100%)',
                            color: 'white',
                            flexShrink: 0,
                          }}
                        />
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          p: { xs: 1.25, sm: 1.5, md: 2 },
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
                                xs: '1rem',
                                sm: '1.1rem',
                                md: '1.2rem',
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
                                xs: '0.75rem',
                                sm: '0.8rem',
                                md: '0.875rem',
                              },
                              wordBreak: 'break-word',
                            }}
                          >
                            Total Spent
                          </Typography>
                        </Box>
                        <Chip
                          label={`₹${orderStats.totalSpent.toFixed(0)}`}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            background:
                              'linear-gradient(135deg, success.light 0%, success.main 100%)',
                            color: 'white',
                            flexShrink: 0,
                          }}
                        />
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
                  <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                    <Typography
                      variant="h5"
                      component="h3"
                      sx={{
                        fontWeight: 700,
                        color: 'primary.dark',
                        mb: 3,
                        textAlign: 'center',
                        borderBottom: '2px solid',
                        borderColor: 'primary.light',
                        pb: 2,
                        fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
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
                          py: { xs: 1.25, sm: 1.5 },
                          borderWidth: 2,
                          fontSize: {
                            xs: '0.8rem',
                            sm: '0.85rem',
                            md: '0.875rem',
                          },
                          minHeight: { xs: '40px', sm: '44px' },
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
                          py: { xs: 1.25, sm: 1.5 },
                          borderWidth: 2,
                          fontSize: {
                            xs: '0.8rem',
                            sm: '0.85rem',
                            md: '0.875rem',
                          },
                          minHeight: { xs: '40px', sm: '44px' },
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
            setSnackbar({
              open: true,
              message,
              severity: 'success',
            });
          }}
          onError={(message) => {
            setSnackbar({
              open: true,
              message,
              severity: 'error',
            });
          }}
        />
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: 8 }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: '100%',
            maxWidth: 400,
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;
