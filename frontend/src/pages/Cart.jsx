import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Alert,
  Divider,
  Stack,
  Paper,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import JumpingCartAvatar from './JumpingCartAvatar';
import {
  useCart,
  useUpdateCartItem,
  useRemoveFromCart,
} from '../hooks/useCart';
import { useFoldableDisplay } from '../hooks/useFoldableDisplay';
import { useToastNotifications } from '../hooks/useToast';

const Cart = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { showSuccess, showError } = useToastNotifications();

  // Enhanced responsive utilities from useFoldableDisplay
  const {
    isExtraSmall,
    isSmall,
    isMedium,
    isLarge,
    isExtraLarge,
    isTablet,
    isFoldable,
    getResponsiveTypography,
    getResponsiveCardSize,
    getResponsiveButtonSize,
    getResponsiveTextClasses,
    getResponsiveContainer,
    getResponsiveValue,
  } = useFoldableDisplay();

  // Use the improved cart hooks
  const { data: cartData, isLoading, error: cartError } = useCart();
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();

  // Extract cart items from the cart data - fix the data structure access
  const cart = cartData?.items || [];

  const increaseQuantity = productId => {
    const item = cart.find(item => item.product._id === productId);
    if (!item) return;

    updateCartItem.mutate(
      { productId, quantity: item.quantity + 1 },
      {
        onError: err => {
          console.error('Increase quantity error:', err);
          showError(err.message || 'Failed to update cart.');
        },
        onSuccess: () => {
          showSuccess('Cart updated successfully!');
          setError(''); // Clear any previous errors
        },
      }
    );
  };

  const decreaseQuantity = productId => {
    const item = cart.find(item => item.product._id === productId);
    if (!item) return;

    if (item.quantity === 1) {
      removeFromCart.mutate(productId, {
        onError: err => {
          console.error('Remove from cart error:', err);
          showError(err.message || 'Failed to remove from cart.');
        },
        onSuccess: () => {
          showSuccess('Item removed from cart!');
          setError(''); // Clear any previous errors
        },
      });
    } else {
      updateCartItem.mutate(
        { productId, quantity: item.quantity - 1 },
        {
          onError: err => {
            console.error('Decrease quantity error:', err);
            showError(err.message || 'Failed to update cart.');
          },
          onSuccess: () => {
            showSuccess('Cart updated successfully!');
            setError(''); // Clear any previous errors
          },
        }
      );
    }
  };

  const handleRemoveFromCart = productId => {
    removeFromCart.mutate(productId, {
      onError: err => {
        console.error('Remove from cart error:', err);
        showError(err.message || 'Failed to remove from cart.');
      },
      onSuccess: () => {
        showSuccess('Item removed from cart!');
        setError(''); // Clear any previous errors
      },
    });
  };

  const subtotal = cart
    .filter(item => item && item.product && item.product.price)
    .reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const deliveryCharge = subtotal >= 499 ? 0 : 50; // Free delivery for orders ≥ ₹499
  const gst = subtotal * 0.18; // 18% GST
  const total = subtotal + deliveryCharge + gst; // Total including delivery and GST

  // Show loading state
  if (isLoading) {
    return <Loading />;
  }

  // Show error state
  if (cartError) {
    return (
      <Box
        className={getResponsiveContainer()}
        sx={{
          mt:
            isExtraSmall || isSmall
              ? 1
              : isMedium
                ? 1
                : isLarge
                  ? 2
                  : isExtraLarge
                    ? 3
                    : 4,
          px:
            isExtraSmall || isSmall
              ? 1
              : isMedium
                ? 1
                : isLarge
                  ? 2
                  : isExtraLarge
                    ? 3
                    : 4,
          pb:
            isExtraSmall || isSmall
              ? 2
              : isMedium
                ? 3
                : isLarge
                  ? 4
                  : isExtraLarge
                    ? 5
                    : 6,
        }}
      >
        <Alert severity='error' sx={{ mb: 2, borderRadius: 2 }}>
          Failed to load cart: {cartError.message}
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth:
          isExtraSmall || isSmall
            ? '95%'
            : isMedium
              ? '90%'
              : isLarge
                ? '85%'
                : isExtraLarge
                  ? '80%'
                  : '75%',
        mx: 'auto',
        mt:
          isExtraSmall || isSmall
            ? 1
            : isMedium
              ? 1.5
              : isLarge
                ? 2
                : isExtraLarge
                  ? 2.5
                  : 3,
        px: getResponsiveValue(1, 1.5, 2, 2.5, 3, 3.5),
        pb:
          (isExtraSmall || isSmall
            ? 1
            : isMedium
              ? 1.5
              : isLarge
                ? 2
                : isExtraLarge
                  ? 2.5
                  : 3) * 2,
        // Enhanced mobile responsiveness
        '@media (max-width: 600px)': {
          px: 1,
          mt: 2,
          pb: 3,
        },
        '@media (max-width: 480px)': {
          px: 0.5,
          mt: 1,
          pb: 2,
        },
      }}
      className={`${getResponsiveContainer()}`}
    >
      <Typography
        variant={getResponsiveTypography('h5', 'h4', 'h3', 'h3', 'h2', 'h2')}
        gutterBottom
        align='center'
        className={getResponsiveTextClasses()}
        sx={{
          fontWeight: 600,
          letterSpacing:
            isExtraSmall || isSmall
              ? 0.5
              : isMedium
                ? 0.5
                : isLarge
                  ? 0.75
                  : isExtraLarge
                    ? 1
                    : 1.25,
          mb:
            isExtraSmall || isSmall
              ? 1.5
              : isMedium
                ? 2
                : isLarge
                  ? 2.5
                  : isExtraLarge
                    ? 3
                    : 3.5,
          background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 50%, ${theme.palette.primary.dark} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: `0 2px 8px ${theme.palette.primary.main}20`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize:
            isExtraSmall || isSmall
              ? '1.125rem'
              : isMedium
                ? '1.375rem'
                : isLarge
                  ? '1.625rem'
                  : isExtraLarge
                    ? '1.875rem'
                    : '2.125rem',
          lineHeight:
            isExtraSmall || isSmall
              ? 1.2
              : isMedium
                ? 1.3
                : isLarge
                  ? 1.4
                  : isExtraLarge
                    ? 1.5
                    : 1.6,
        }}
      >
        <JumpingCartAvatar />
        <Box
          sx={{
            mt:
              isExtraSmall || isSmall
                ? 0.75
                : isMedium
                  ? 1
                  : isLarge
                    ? 1.25
                    : isExtraLarge
                      ? 1.5
                      : 1.75,
            fontWeight: 600,
            fontSize: getResponsiveTypography(
              '0.875rem',
              '0.95rem',
              '1.05rem',
              '1.15rem',
              '1.25rem',
              '1.35rem'
            ),
            letterSpacing:
              isExtraSmall || isSmall
                ? 0.5
                : isMedium
                  ? 0.5
                  : isLarge
                    ? 0.75
                    : isExtraLarge
                      ? 1
                      : 1.25,
          }}
        >
          Manage Your Cart
        </Box>
      </Typography>

      {error && (
        <Alert severity='error' sx={{ mb: 2, borderRadius: 1 }}>
          {error}
        </Alert>
      )}

      <Grid
        container
        spacing={{ xs: 2, sm: 2, md: 3, lg: 3 }}
        sx={{
          display: 'flex',
          justifyContent: {
            xs: 'center',
            sm: 'center',
            md: isTablet
              ? 'center'
              : cart.length === 0
                ? 'center'
                : 'flex-start',
            lg: cart.length === 0 ? 'center' : 'flex-start',
          },
          maxWidth: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Left Column - Cart Items (67.5%) or Full Width when Empty */}
        <Grid
          sx={{
            width: {
              xs: '100%',
              sm: isFoldable ? '100%' : '100%',
              md: isTablet ? '100%' : cart.length === 0 ? '100%' : '67.5%',
              lg: cart.length === 0 ? '100%' : '67.5%',
            },
            maxWidth: '100%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: {
              xs: 'center',
              sm: isFoldable ? 'center' : 'center',
              md: isTablet
                ? 'center'
                : cart.length === 0
                  ? 'center'
                  : 'flex-start',
              lg: cart.length === 0 ? 'center' : 'flex-start',
            },
          }}
        >
          {cart.length === 0 ? (
            <Box
              className={getResponsiveContainer()}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  textAlign: 'center',
                  mt:
                    isExtraSmall || isSmall
                      ? 2
                      : isMedium
                        ? 3
                        : isLarge
                          ? 4
                          : isExtraLarge
                            ? 5
                            : 6,
                  px:
                    isExtraSmall || isSmall
                      ? 1
                      : isMedium
                        ? 1.5
                        : isLarge
                          ? 2
                          : isExtraLarge
                            ? 2.5
                            : 3,
                  py:
                    isExtraSmall || isSmall
                      ? 1.5
                      : isMedium
                        ? 2
                        : isLarge
                          ? 2.5
                          : isExtraLarge
                            ? 3
                            : 3.5,
                  background: `linear-gradient(90deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
                  borderRadius: 1.5,
                  boxShadow: `0 2px 12px 0 ${theme.palette.primary.main}20`,
                  maxWidth:
                    isExtraSmall || isSmall
                      ? 320
                      : isMedium
                        ? 360
                        : isLarge
                          ? 400
                          : isExtraLarge
                            ? 440
                            : 480,
                  mx: 'auto',
                  border: `1px solid ${theme.palette.primary.light}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Avatar
                  sx={{
                    width:
                      isExtraSmall || isSmall
                        ? 40
                        : isMedium
                          ? 48
                          : isLarge
                            ? 56
                            : isExtraLarge
                              ? 64
                              : 72,
                    height:
                      isExtraSmall || isSmall
                        ? 40
                        : isMedium
                          ? 48
                          : isLarge
                            ? 56
                            : isExtraLarge
                              ? 64
                              : 72,
                    mb:
                      isExtraSmall || isSmall
                        ? 1
                        : isMedium
                          ? 1.5
                          : isLarge
                            ? 2
                            : isExtraLarge
                              ? 2.5
                              : 3,
                    background: `linear-gradient(90deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                    boxShadow: `0 2px 8px ${theme.palette.primary.main}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ShoppingCartIcon
                    sx={{
                      fontSize:
                        isExtraSmall || isSmall
                          ? 20
                          : isMedium
                            ? 24
                            : isLarge
                              ? 28
                              : isExtraLarge
                                ? 32
                                : 36,
                      color: theme.palette.primary.contrastText,
                      textShadow: `0 2px 8px ${theme.palette.primary.main}30`,
                    }}
                  />
                </Avatar>
                <Typography
                  variant={getResponsiveTypography(
                    'h6',
                    'h5',
                    'h5',
                    'h4',
                    'h4',
                    'h3'
                  )}
                  sx={{
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                    mb:
                      isExtraSmall || isSmall
                        ? 0.5
                        : isMedium
                          ? 1
                          : isLarge
                            ? 1.5
                            : isExtraLarge
                              ? 2
                              : 2.5,
                    letterSpacing:
                      isExtraSmall || isSmall
                        ? 0.5
                        : isMedium
                          ? 0.75
                          : isLarge
                            ? 1
                            : isExtraLarge
                              ? 1.25
                              : 1.5,
                    fontSize:
                      isExtraSmall || isSmall
                        ? '0.95rem'
                        : isMedium
                          ? '1.1rem'
                          : isLarge
                            ? '1.25rem'
                            : isExtraLarge
                              ? '1.4rem'
                              : '1.55rem',
                  }}
                >
                  Your cart is empty
                </Typography>
                <Typography
                  variant={getResponsiveTypography(
                    'body2',
                    'body1',
                    'body1',
                    'body1',
                    'body1',
                    'body1'
                  )}
                  sx={{
                    color: theme.palette.text.secondary,
                    maxWidth:
                      isExtraSmall || isSmall
                        ? 280
                        : isMedium
                          ? 320
                          : isLarge
                            ? 360
                            : isExtraLarge
                              ? 400
                              : 440,
                    mx: 'auto',
                    fontWeight: 500,
                    fontSize:
                      isExtraSmall || isSmall
                        ? '0.8rem'
                        : isMedium
                          ? '0.9rem'
                          : isLarge
                            ? '1rem'
                            : isExtraLarge
                              ? '1.1rem'
                              : '1.2rem',
                  }}
                >
                  Looks like you haven&apos;t added any products yet.
                  <br />
                  Browse our catalogue and start shopping!
                </Typography>
                <Button
                  variant='contained'
                  className={getResponsiveButtonSize()}
                  sx={{
                    mt:
                      isExtraSmall || isSmall
                        ? 2
                        : isMedium
                          ? 2.5
                          : isLarge
                            ? 3
                            : 3.5,
                    textTransform: 'none',
                    fontWeight: 700,
                    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 50%, ${theme.palette.primary.dark} 100%)`,
                    color: theme.palette.primary.contrastText,
                    borderRadius: 1.5,
                    fontSize: getResponsiveTypography(
                      '0.875rem',
                      '0.9rem',
                      '1rem',
                      '1.1rem',
                      '1.2rem',
                      '1.3rem'
                    ),
                    boxShadow: `0 2px 8px ${theme.palette.primary.main}20`,
                    px:
                      isExtraSmall || isSmall
                        ? 2
                        : isMedium
                          ? 2.5
                          : isLarge
                            ? 3
                            : 3.5,
                    py:
                      isExtraSmall || isSmall
                        ? 0.75
                        : isMedium
                          ? 1
                          : isLarge
                            ? 1.25
                            : 1.5,
                    minHeight:
                      isExtraSmall || isSmall
                        ? 44
                        : isMedium
                          ? 48
                          : isLarge
                            ? 52
                            : isExtraLarge
                              ? 56
                              : 60,
                    '&:hover': {
                      background: `linear-gradient(90deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                      color: theme.palette.primary.contrastText,
                      boxShadow: `0 4px 16px ${theme.palette.primary.main}30`,
                    },
                  }}
                  onClick={() => navigate('/')}
                >
                  Browse Products
                </Button>
              </Box>
            </Box>
          ) : (
            <List>
              {cart
                .filter(item => item && item.product && item.product._id)
                .map(item => (
                  <ListItem
                    key={item.product._id}
                    alignItems='flex-start'
                    sx={{
                      bgcolor: `linear-gradient(90deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
                      borderRadius: 1.5,
                      boxShadow: `0 2px 12px 0 ${theme.palette.primary.main}20`,
                      mb:
                        isExtraSmall || isSmall
                          ? 0.75
                          : isMedium
                            ? 1
                            : isLarge
                              ? 1.25
                              : isExtraLarge
                                ? 1.5
                                : 1.75,
                      px:
                        isExtraSmall || isSmall
                          ? 1
                          : isMedium
                            ? 1.25
                            : isLarge
                              ? 1.5
                              : isExtraLarge
                                ? 1.75
                                : 2,
                      py:
                        isExtraSmall || isSmall
                          ? 0.75
                          : isMedium
                            ? 1
                            : isLarge
                              ? 1.25
                              : isExtraLarge
                                ? 1.5
                                : 1.75,
                      pr: {
                        xs:
                          isExtraSmall || isSmall
                            ? 3.5
                            : isMedium
                              ? 4
                              : isLarge
                                ? 4.5
                                : isExtraLarge
                                  ? 5
                                  : 5.5,
                        sm:
                          isExtraSmall || isSmall
                            ? 1.25
                            : isMedium
                              ? 1.5
                              : isLarge
                                ? 1.75
                                : isExtraLarge
                                  ? 2
                                  : 2.25,
                      },
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      border: `1px solid ${theme.palette.primary.light}`,
                      position: 'relative',
                      overflow: 'hidden',
                      maxWidth: '100%',
                      width: '100%',
                    }}
                    secondaryAction={
                      <IconButton
                        edge='end'
                        size='small'
                        aria-label='delete'
                        color='error'
                        onClick={() => handleRemoveFromCart(item.product._id)}
                        disabled={removeFromCart.isPending}
                        sx={{
                          bgcolor: theme.palette.background.paper,
                          borderRadius: 0.75,
                          '&:hover': {
                            bgcolor: theme.palette.primary.light,
                            transform: 'scale(1.05)',
                          },
                          position: { xs: 'absolute', sm: 'static' },
                          top: {
                            xs:
                              isExtraSmall || isSmall
                                ? 1
                                : isMedium
                                  ? 1.25
                                  : isLarge
                                    ? 1.5
                                    : isExtraLarge
                                      ? 1.75
                                      : 2,
                            sm: 'auto',
                          },
                          right: {
                            xs:
                              isExtraSmall || isSmall
                                ? 1
                                : isMedium
                                  ? 1.25
                                  : isLarge
                                    ? 1.5
                                    : isExtraLarge
                                      ? 1.75
                                      : 2,
                            sm: 'auto',
                          },
                          zIndex: 2,
                          minWidth:
                            isExtraSmall || isSmall
                              ? 24
                              : isMedium
                                ? 28
                                : isLarge
                                  ? 32
                                  : isExtraLarge
                                    ? 36
                                    : 40,
                          minHeight:
                            isExtraSmall || isSmall
                              ? 24
                              : isMedium
                                ? 28
                                : isLarge
                                  ? 32
                                  : isExtraLarge
                                    ? 36
                                    : 40,
                          p:
                            isExtraSmall || isSmall
                              ? 0.25
                              : isMedium
                                ? 0.5
                                : isLarge
                                  ? 0.75
                                  : isExtraLarge
                                    ? 1
                                    : 1.25,
                          transition: 'all 0.2s ease',
                          '& .MuiSvgIcon-root': {
                            fontSize:
                              isExtraSmall || isSmall
                                ? '0.75rem'
                                : isMedium
                                  ? '0.8rem'
                                  : isLarge
                                    ? '0.85rem'
                                    : isExtraLarge
                                      ? '0.9rem'
                                      : '0.95rem',
                            color: theme.palette.error.main,
                          },
                          '&:disabled': {
                            opacity: 0.6,
                            bgcolor: theme.palette.action.disabledBackground,
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={
                        <Typography
                          variant={getResponsiveTypography(
                            'h6',
                            'h5',
                            'h5',
                            'h4',
                            'h4',
                            'h3'
                          )}
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.primary.main,
                            mb:
                              isExtraSmall || isSmall
                                ? 0.0625
                                : isMedium
                                  ? 0.125
                                  : isLarge
                                    ? 0.25
                                    : isExtraLarge
                                      ? 0.375
                                      : 0.5,
                            fontSize:
                              isExtraSmall || isSmall
                                ? '0.7rem'
                                : isMedium
                                  ? '0.8rem'
                                  : isLarge
                                    ? '0.9rem'
                                    : isExtraLarge
                                      ? '1rem'
                                      : '1.1rem',
                            pr: {
                              xs:
                                isExtraSmall || isSmall
                                  ? 2
                                  : isMedium
                                    ? 2.25
                                    : isLarge
                                      ? 2.5
                                      : isExtraLarge
                                        ? 2.75
                                        : 3,
                              sm: 0,
                            },
                          }}
                        >
                          {item.product.name}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant={getResponsiveTypography(
                            'body2',
                            'body1',
                            'body1',
                            'body1',
                            'body1',
                            'body1'
                          )}
                          sx={{
                            color: theme.palette.text.secondary,
                            fontWeight: 500,
                            fontSize:
                              isExtraSmall || isSmall
                                ? '0.6rem'
                                : isMedium
                                  ? '0.7rem'
                                  : isLarge
                                    ? '0.8rem'
                                    : isExtraLarge
                                      ? '0.9rem'
                                      : '1rem',
                            pr: {
                              xs:
                                isExtraSmall || isSmall
                                  ? 2
                                  : isMedium
                                    ? 2.25
                                    : isLarge
                                      ? 2.5
                                      : isExtraLarge
                                        ? 2.75
                                        : 3,
                              sm: 0,
                            },
                          }}
                        >
                          ₹{item.product.price} / {item.product.unit || 'unit'}
                        </Typography>
                      }
                      sx={{
                        minWidth:
                          isExtraSmall || isSmall
                            ? 110
                            : isMedium
                              ? 125
                              : isLarge
                                ? 140
                                : isExtraLarge
                                  ? 155
                                  : 170,
                        flex: { xs: '1 1 auto', sm: '1 1 auto' },
                        mr: {
                          xs: 0,
                          sm:
                            isExtraSmall || isSmall
                              ? 0.25
                              : isMedium
                                ? 0.375
                                : isLarge
                                  ? 0.5
                                  : isExtraLarge
                                    ? 0.625
                                    : 0.75,
                        },
                      }}
                    />
                    <Stack
                      direction='row'
                      alignItems='center'
                      spacing={
                        isExtraSmall || isSmall
                          ? 0.5
                          : isMedium
                            ? 0.75
                            : isLarge
                              ? 1
                              : isExtraLarge
                                ? 1.25
                                : 1.5
                      }
                      sx={{
                        ml: {
                          xs: 0,
                          sm:
                            isExtraSmall || isSmall
                              ? 0.75
                              : isMedium
                                ? 1
                                : isLarge
                                  ? 1.25
                                  : isExtraLarge
                                    ? 1.5
                                    : 1.75,
                        },
                        mt: {
                          xs:
                            isExtraSmall || isSmall
                              ? 0.5
                              : isMedium
                                ? 0.75
                                : isLarge
                                  ? 1
                                  : isExtraLarge
                                    ? 1.25
                                    : 1.5,
                          sm: 0,
                        },
                        mr: {
                          xs:
                            isExtraSmall || isSmall
                              ? 0.5
                              : isMedium
                                ? 0.75
                                : isLarge
                                  ? 1
                                  : isExtraLarge
                                    ? 1.25
                                    : 1.5,
                          sm: 0,
                        },
                        bgcolor: theme.palette.background.paper,
                        borderRadius: 1,
                        px:
                          isExtraSmall || isSmall
                            ? 1
                            : isMedium
                              ? 1.25
                              : isLarge
                                ? 1.5
                                : isExtraLarge
                                  ? 1.75
                                  : 2,
                        py:
                          isExtraSmall || isSmall
                            ? 0.5
                            : isMedium
                              ? 0.75
                              : isLarge
                                ? 1
                                : isExtraLarge
                                  ? 1.25
                                  : 1.5,
                      }}
                    >
                      <IconButton
                        size='small'
                        disabled={
                          updateCartItem.isPending || removeFromCart.isPending
                        }
                        sx={{
                          color: theme.palette.primary.main,
                          bgcolor: theme.palette.action.hover,
                          borderRadius: 0.75,
                          '&:hover': { bgcolor: theme.palette.primary.light },
                          minWidth: 32,
                          minHeight: 32,
                          '& .MuiSvgIcon-root': {
                            fontSize: getResponsiveTypography(
                              '0.75rem',
                              '0.8rem',
                              '0.85rem',
                              '0.9rem',
                              '0.95rem',
                              '1rem'
                            ),
                          },
                        }}
                        onClick={() =>
                          item.quantity === 1
                            ? handleRemoveFromCart(item.product._id)
                            : decreaseQuantity(item.product._id)
                        }
                      >
                        <RemoveIcon />
                      </IconButton>
                      <Typography
                        variant={getResponsiveTypography(
                          'body1',
                          'h6',
                          'h6',
                          'h5',
                          'h5',
                          'h4'
                        )}
                        sx={{
                          px:
                            isExtraSmall || isSmall
                              ? 0.5
                              : isMedium
                                ? 0.75
                                : isLarge
                                  ? 1
                                  : isExtraLarge
                                    ? 1.25
                                    : 1.5,
                          minWidth:
                            isExtraSmall || isSmall
                              ? 20
                              : isMedium
                                ? 24
                                : isLarge
                                  ? 28
                                  : isExtraLarge
                                    ? 32
                                    : 36,
                          textAlign: 'center',
                          fontWeight: 600,
                          color: theme.palette.primary.main,
                          fontSize:
                            isExtraSmall || isSmall
                              ? '0.8rem'
                              : isMedium
                                ? '0.9rem'
                                : isLarge
                                  ? '1rem'
                                  : isExtraLarge
                                    ? '1.1rem'
                                    : '1.2rem',
                        }}
                      >
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size='small'
                        disabled={
                          updateCartItem.isPending || removeFromCart.isPending
                        }
                        sx={{
                          color: theme.palette.primary.main,
                          bgcolor: theme.palette.action.hover,
                          borderRadius: 0.75,
                          '&:hover': { bgcolor: theme.palette.primary.light },
                          minWidth: 32,
                          minHeight: 32,
                          '& .MuiSvgIcon-root': {
                            fontSize: getResponsiveTypography(
                              '0.75rem',
                              '0.8rem',
                              '0.85rem',
                              '0.9rem',
                              '0.95rem',
                              '1rem'
                            ),
                          },
                        }}
                        onClick={() => increaseQuantity(item.product._id)}
                      >
                        <AddIcon />
                      </IconButton>
                    </Stack>
                    <Typography
                      variant={getResponsiveTypography(
                        'body1',
                        'h6',
                        'h6',
                        'h5',
                        'h5',
                        'h4'
                      )}
                      sx={{
                        mt: {
                          xs:
                            isExtraSmall || isSmall
                              ? 0.25
                              : isMedium
                                ? 0.5
                                : isLarge
                                  ? 0.75
                                  : isExtraLarge
                                    ? 1
                                    : 1.25,
                          sm: 0,
                        },
                        fontWeight: 500,
                        color: theme.palette.primary.main,
                        px:
                          isExtraSmall || isSmall
                            ? 0.5
                            : isMedium
                              ? 0.75
                              : isLarge
                                ? 1
                                : isExtraLarge
                                  ? 1.25
                                  : 1.5,
                        mr: {
                          xs:
                            isExtraSmall || isSmall
                              ? 6.5
                              : isMedium
                                ? 7
                                : isLarge
                                  ? 7.5
                                  : isExtraLarge
                                    ? 8
                                    : 8.5,
                          sm:
                            isExtraSmall || isSmall
                              ? 4
                              : isMedium
                                ? 4.5
                                : isLarge
                                  ? 5
                                  : isExtraLarge
                                    ? 5.5
                                    : 6,
                        },
                        fontSize:
                          isExtraSmall || isSmall
                            ? '0.75rem'
                            : isMedium
                              ? '0.85rem'
                              : isLarge
                                ? '0.95rem'
                                : isExtraLarge
                                  ? '1.05rem'
                                  : '1.15rem',
                      }}
                    >
                      Subtotal: ₹{item.product.price * item.quantity}
                    </Typography>
                  </ListItem>
                ))}
            </List>
          )}
        </Grid>
        {cart.length > 0 && (
          /* Right Column - Cart Summary (27.5%) */
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
            <Stack spacing={{ xs: 2, sm: 2.5, md: 3, lg: 3 }}>
              <Paper
                sx={{
                  p: 1,
                  height: 'auto',
                  maxHeight: 'none',
                  overflow: 'visible',
                  borderRadius: getResponsiveValue(1.5, 1.5, 2, 2.5, 3, 3.5, 2),
                  background: `linear-gradient(90deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
                  border: `1px solid ${theme.palette.primary.light}`,
                  boxShadow: `0 2px 12px 0 ${theme.palette.primary.main}20`,
                }}
                className={`card-golden ${getResponsiveCardSize()} responsive-card`}
              >
                <Typography
                  textAlign='center'
                  fontWeight={600}
                  mb={0.5}
                  sx={{
                    color: theme.palette.primary.main,
                    fontSize: getResponsiveValue(
                      '0.9rem',
                      '1rem',
                      '1.1rem',
                      '1.2rem',
                      '1.3rem',
                      '1.4rem',
                      '1.1rem'
                    ),
                  }}
                  className={getResponsiveTextClasses()}
                >
                  Summary
                </Typography>

                <Divider
                  sx={{ mb: 0.5, borderColor: theme.palette.primary.light }}
                />

                {/* Cart Items */}
                {cart.length === 0 ? (
                  <Typography
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: getResponsiveValue(
                        '0.8rem',
                        '0.85rem',
                        '0.9rem',
                        '0.95rem',
                        '1rem',
                        '1.05rem',
                        '0.9rem'
                      ),
                    }}
                    className={getResponsiveTextClasses()}
                  >
                    No items in cart.
                  </Typography>
                ) : (
                  <>
                    {cart.map(item => (
                      <Box
                        key={item.product._id}
                        sx={{
                          mb: 0.5,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          p: 0.25,
                          borderRadius: 0.5,
                          background: `${theme.palette.primary.main}10`,
                          border: `1px solid ${theme.palette.primary.main}20`,
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            sx={{
                              color: theme.palette.primary.main,
                              fontWeight: 400,
                              fontSize: getResponsiveValue(
                                '0.6rem',
                                '0.65rem',
                                '0.7rem',
                                '0.75rem',
                                '0.8rem',
                                '0.85rem',
                                '0.7rem'
                              ),
                            }}
                            className={getResponsiveTextClasses()}
                          >
                            {item.product.name}
                          </Typography>
                          <Typography
                            sx={{
                              color: theme.palette.text.secondary,
                              fontSize: getResponsiveValue(
                                '0.55rem',
                                '0.6rem',
                                '0.65rem',
                                '0.7rem',
                                '0.75rem',
                                '0.8rem',
                                '0.65rem'
                              ),
                            }}
                            className={getResponsiveTextClasses()}
                          >
                            Qty: {item.quantity}
                          </Typography>
                        </Box>
                        <Typography
                          sx={{
                            color: theme.palette.text.secondary,
                            fontWeight: 200,
                            fontSize: getResponsiveValue(
                              '0.55rem',
                              '0.6rem',
                              '0.65rem',
                              '0.7rem',
                              '0.75rem',
                              '0.8rem',
                              '0.65rem'
                            ),
                          }}
                          className={getResponsiveTextClasses()}
                        >
                          ₹{(item.product.price * item.quantity).toFixed(2)}
                        </Typography>
                      </Box>
                    ))}

                    <Divider
                      sx={{
                        borderColor: theme.palette.primary.light,
                        my: 0.5,
                      }}
                    />

                    {/* Price Breakdown */}
                    <Box sx={{ mb: 0.5 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          mb: 0.25,
                          p: 0.25,
                        }}
                      >
                        <Typography
                          sx={{
                            color: theme.palette.text.secondary,
                            fontSize: getResponsiveValue(
                              '0.55rem',
                              '0.6rem',
                              '0.65rem',
                              '0.7rem',
                              '0.75rem',
                              '0.8rem',
                              '0.65rem'
                            ),
                          }}
                          className={getResponsiveTextClasses()}
                        >
                          Subtotal:
                        </Typography>
                        <Typography
                          sx={{
                            color: theme.palette.text.secondary,
                            fontSize: getResponsiveValue(
                              '0.55rem',
                              '0.6rem',
                              '0.65rem',
                              '0.7rem',
                              '0.75rem',
                              '0.8rem',
                              '0.65rem'
                            ),
                          }}
                          className={getResponsiveTextClasses()}
                        >
                          ₹{subtotal.toFixed(2)}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          mb: 0.25,
                          p: 0.25,
                        }}
                      >
                        <Typography
                          sx={{
                            color: theme.palette.text.secondary,
                            fontSize: getResponsiveValue(
                              '0.55rem',
                              '0.6rem',
                              '0.65rem',
                              '0.7rem',
                              '0.75rem',
                              '0.8rem',
                              '0.65rem'
                            ),
                          }}
                          className={getResponsiveTextClasses()}
                        >
                          Delivery:
                        </Typography>
                        <Typography
                          sx={{
                            color: theme.palette.text.secondary,
                            fontSize: getResponsiveValue(
                              '0.55rem',
                              '0.6rem',
                              '0.65rem',
                              '0.7rem',
                              '0.75rem',
                              '0.8rem',
                              '0.65rem'
                            ),
                          }}
                          className={getResponsiveTextClasses()}
                        >
                          {deliveryCharge === 0
                            ? 'Free'
                            : `Rs.${deliveryCharge.toFixed(2)}`}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          mb: 0.25,
                          p: 0.25,
                        }}
                      >
                        <Typography
                          sx={{
                            color: theme.palette.text.secondary,
                            fontSize: getResponsiveValue(
                              '0.55rem',
                              '0.6rem',
                              '0.65rem',
                              '0.7rem',
                              '0.75rem',
                              '0.8rem',
                              '0.65rem'
                            ),
                          }}
                          className={getResponsiveTextClasses()}
                        >
                          GST (18%):
                        </Typography>
                        <Typography
                          sx={{
                            color: theme.palette.text.secondary,
                            fontSize: getResponsiveValue(
                              '0.55rem',
                              '0.6rem',
                              '0.65rem',
                              '0.7rem',
                              '0.75rem',
                              '0.8rem',
                              '0.65rem'
                            ),
                          }}
                          className={getResponsiveTextClasses()}
                        >
                          ₹{gst.toFixed(2)}
                        </Typography>
                      </Box>
                      <Divider
                        sx={{
                          my: 0.5,
                          borderColor: theme.palette.primary.light,
                        }}
                      />
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          p: 0.5,
                          background: `${theme.palette.primary.main}20`,
                          borderRadius: getResponsiveValue(
                            0.5,
                            0.5,
                            1,
                            1.5,
                            2,
                            2.5,
                            1
                          ),
                        }}
                      >
                        <Typography
                          sx={{
                            color: theme.palette.primary.main,
                            fontWeight: 700,
                            fontSize: getResponsiveValue(
                              '0.55rem',
                              '0.6rem',
                              '0.65rem',
                              '0.7rem',
                              '0.75rem',
                              '0.8rem',
                              '0.65rem'
                            ),
                          }}
                          className={getResponsiveTextClasses()}
                        >
                          Total:
                        </Typography>
                        <Typography
                          sx={{
                            color: theme.palette.primary.main,
                            fontWeight: 700,
                            fontSize: getResponsiveValue(
                              '0.55rem',
                              '0.6rem',
                              '0.65rem',
                              '0.7rem',
                              '0.75rem',
                              '0.8rem',
                              '0.65rem'
                            ),
                          }}
                          className={getResponsiveTextClasses()}
                        >
                          ₹{total.toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Delivery Charges Information */}
                    <Alert
                      severity='info'
                      sx={{
                        mb: 0.5,
                        borderRadius: getResponsiveValue(
                          0.5,
                          0.5,
                          1,
                          1.5,
                          2,
                          2.5,
                          1
                        ),
                        background: `linear-gradient(90deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
                        border: `1px solid ${theme.palette.primary.light}`,
                        '& .MuiAlert-icon': {
                          color: theme.palette.primary.main,
                        },
                      }}
                      className={getResponsiveCardSize()}
                    >
                      <Typography
                        variant='caption'
                        sx={{
                          fontSize: getResponsiveValue(
                            '0.5rem',
                            '0.55rem',
                            '0.6rem',
                            '0.65rem',
                            '0.7rem',
                            '0.75rem',
                            '0.6rem'
                          ),
                          fontWeight: 600,
                          color: theme.palette.primary.main,
                          mb: 0.25,
                          display: 'block',
                        }}
                      >
                        📦 Delivery Info
                      </Typography>
                      <Typography
                        variant='caption'
                        sx={{
                          fontSize: getResponsiveValue(
                            '0.45rem',
                            '0.5rem',
                            '0.55rem',
                            '0.6rem',
                            '0.65rem',
                            '0.7rem',
                            '0.55rem'
                          ),
                          color: theme.palette.text.secondary,
                          display: 'block',
                          lineHeight: 1.2,
                        }}
                      >
                        Orders ≥ Rs.499:{' '}
                        <strong style={{ color: theme.palette.primary.main }}>
                          FREE
                        </strong>
                      </Typography>
                      <Typography
                        variant='caption'
                        sx={{
                          fontSize: getResponsiveValue(
                            '0.45rem',
                            '0.5rem',
                            '0.55rem',
                            '0.6rem',
                            '0.65rem',
                            '0.7rem',
                            '0.55rem'
                          ),
                          color: theme.palette.text.secondary,
                          display: 'block',
                          lineHeight: 1.2,
                        }}
                      >
                        Orders under Rs.499:{' '}
                        <strong style={{ color: theme.palette.primary.main }}>
                          Rs.50
                        </strong>
                      </Typography>
                      {subtotal < 499 && (
                        <Typography
                          variant='caption'
                          sx={{
                            fontSize: getResponsiveValue(
                              '0.45rem',
                              '0.5rem',
                              '0.55rem',
                              '0.6rem',
                              '0.65rem',
                              '0.7rem',
                              '0.55rem'
                            ),
                            color: theme.palette.primary.main,
                            display: 'block',
                            lineHeight: 1.2,
                            mt: 0.25,
                            fontWeight: 600,
                          }}
                        >
                          💡 Add Rs.{(499 - subtotal).toFixed(2)} more for free
                          delivery!
                        </Typography>
                      )}
                    </Alert>

                    {/* Checkout Button */}
                    <Button
                      variant='contained'
                      fullWidth
                      onClick={() => navigate('/checkout')}
                      disabled={cart.length === 0}
                      sx={{
                        fontWeight: 500,
                        background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                        color: theme.palette.primary.contrastText,
                        textTransform: 'none',
                        borderRadius: 0.5,
                        fontSize: getResponsiveValue(
                          '0.55rem',
                          '0.6rem',
                          '0.65rem',
                          '0.7rem',
                          '0.75rem',
                          '0.8rem',
                          '0.65rem'
                        ),
                        boxShadow: `0 2px 8px ${theme.palette.primary.main}20`,
                        mb: 0.5,
                        py: 0.5,
                        minHeight: '36px',
                        '&:hover': {
                          background: `linear-gradient(90deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                          color: theme.palette.primary.contrastText,
                          boxShadow: `0 4px 16px ${theme.palette.primary.main}30`,
                        },
                        transition: 'all 0.3s ease',
                      }}
                      className={getResponsiveButtonSize()}
                    >
                      Proceed to Checkout
                    </Button>
                  </>
                )}
              </Paper>
            </Stack>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Cart;
