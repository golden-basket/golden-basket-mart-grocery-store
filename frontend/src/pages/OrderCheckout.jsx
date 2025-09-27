import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import ApiService from '../services/api';
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel,
  Divider,
  Grid,
  Chip,
  Stack,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Loading from '../components/Loading';
import PaymentMethodSelector from '../components/PaymentMethodSelector';
import { useNavigate } from 'react-router-dom';
import { useFoldableDisplay } from '../hooks/useFoldableDisplay';
import { useToastNotifications } from '../hooks/useToast';
import { useCart } from '../hooks/useCart';

const OrderCheckout = () => {
  const theme = useTheme();
  const { token } = useAuth();
  const { showSuccess, showError } = useToastNotifications();
  const showErrorRef = useRef();
  showErrorRef.current = showError;
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cod');
  const [paymentDetails, setPaymentDetails] = useState({});
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);

  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [invoice, setInvoice] = useState(null);
  const navigate = useNavigate();

  // Use cart hook for consistent state management
  const { data: cartData, refetch: refetchCart } = useCart();
  const cart = cartData?.items || [];

  // Enhanced responsive utilities from useFoldableDisplay
  const {
    isExtraSmall,
    isSmall,
    isMedium,
    isLarge,
    isExtraLarge,
    isTablet,
    getResponsiveSpacingClasses,
    getResponsiveTextClasses,
    getResponsiveButtonSize,
    getResponsiveAlertSize,
    getResponsiveCardSize,
    getResponsiveContainer,
    getResponsiveValue,
  } = useFoldableDisplay();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    ApiService.getAddresses()
      .then((addrRes) => {
        if (isMounted) {
          setAddresses(addrRes);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          showErrorRef.current(
            'Failed to load addresses. Please try again.'
          );
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [token]); // Only depend on token

  // Calculate total with conditional delivery charges
  const calculateTotal = () => {
    if (!cart || cart.length === 0) {
      return {
        subtotal: 0,
        deliveryCharge: 0,
        gst: 0,
        total: 0,
      };
    }
    
    const subtotal = cart.reduce(
      (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 0),
      0
    );
    
    // Get selected address to determine delivery charges
    const selectedAddr = addresses.find(addr => addr._id === selectedAddress);
    
    let deliveryCharge;
    if (selectedAddr?.addressType === 'inside_anantra') {
      // Free delivery for inside_anantra addresses
      deliveryCharge = 0;
    } else {
      // For outside_anantra addresses or no address selected
      deliveryCharge = subtotal >= 150 ? 0 : 10;
    }
    
    const gst = subtotal * 0.18; // 18% GST
    return {
      subtotal,
      deliveryCharge,
      gst,
      total: subtotal + deliveryCharge + gst,
    };
  };

  // Minimum order amount
  const MIN_ORDER_AMOUNT = 100;

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      showError('Please select a shipping address.');
      return;
    }

    const totals = calculateTotal();

    // Check minimum order amount
    if (totals.total < MIN_ORDER_AMOUNT) {
      showError(
        `Minimum order amount is ₹${MIN_ORDER_AMOUNT}. Please add more items to your cart.`
      );
      return;
    }

    // Validate payment details based on selected method
    if (selectedPaymentMethod === 'upi') {
      if (!paymentDetails.upiId) {
        showError('Please enter your UPI ID.');
        return;
      }
      if (!paymentScreenshot) {
        showError('Please upload a screenshot of your payment confirmation.');
        return;
      }
    }

    setPlacing(true);
    try {
      const orderData = {
        shippingAddressId: selectedAddress,
        paymentMode: selectedPaymentMethod,
        paymentDetails:
          selectedPaymentMethod === 'upi' ? paymentDetails : undefined,
        paymentScreenshot: paymentScreenshot,

        deliveryCharges: totals.deliveryCharge, // Conditional delivery charges
      };

      const res = await ApiService.placeOrder(orderData);
      showSuccess('Order placed successfully!');
      setInvoice(res.invoice);
      // Refresh cart data to update navbar count
      refetchCart();
      navigate('/orders');
    } catch (err) {
      showError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  const totals = calculateTotal();

  // Enhanced responsive spacing based on device type
  const getResponsiveSpacing = () => {
    return getResponsiveValue(1, 1, 2, 3, 4, 5, 2);
  };

  // Enhanced responsive typography based on device type
  const getResponsiveTypography = variant => {
    if (isExtraSmall || isSmall) {
      return variant === 'h5' ? 'h6' : 'body2';
    }
    if (isMedium) {
      return variant === 'h5' ? 'h6' : 'body1';
    }
    if (isLarge) {
      return variant === 'h5' ? 'h5' : 'body1';
    }
    return variant;
  };

  // Enhanced responsive container width
  const getResponsiveContainerWidth = () => {
    if (isExtraSmall || isSmall) return '95%';
    if (isMedium) return '90%';
    if (isLarge) return '85%';
    if (isExtraLarge) return '80%';
    return '75%';
  };

  // Enhanced responsive padding
  const getResponsivePadding = () => {
    return getResponsiveValue(1, 1, 2, 3, 4, 5, 2);
  };

  // Enhanced responsive margin
  const getResponsiveMargin = () => {
    return getResponsiveValue(1, 1, 2, 3, 4, 5, 2);
  };

  return (
    <Box
      sx={{
        maxWidth: getResponsiveContainerWidth(),
        mx: 'auto',
        mt: getResponsiveMargin(),
        px: getResponsivePadding(),
        pb: getResponsivePadding() * 2,
        // Enhanced mobile responsiveness - now using responsive system
      }}
      className={`${getResponsiveSpacingClasses()} ${getResponsiveContainer()} responsive-container`}
    >
      <Typography
        variant={getResponsiveTypography('h5')}
        fontWeight={700}
        align='center'
        sx={{
          background: `linear-gradient(90deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: getResponsiveSpacing(),
          fontSize: getResponsiveValue(
            '1.25rem',
            '1.5rem',
            '1.75rem',
            '2rem',
            '2.25rem',
            '2.5rem',
            '1.75rem'
          ),
          lineHeight: getResponsiveValue(1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.4),
        }}
        className={`golden-text ${getResponsiveTextClasses()}`}
      >
        Checkout
      </Typography>

      {/* Delivery Information */}
      <Alert
        severity='info'
        sx={{
          mb: getResponsiveSpacing(),
          borderRadius: 2,
          background: `linear-gradient(90deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
          border: `1px solid ${theme.palette.primary.light}`,
          '& .MuiAlert-icon': {
            color: theme.palette.primary.main,
          },
        }}
        className={`${getResponsiveAlertSize()} ${getResponsiveCardSize()}`}
      >
        <Typography
          variant='body2'
          className={getResponsiveTextClasses()}
          sx={{
            fontSize: getResponsiveValue(
              '0.7rem',
              '0.75rem',
              '0.8rem',
              '0.85rem',
              '0.9rem',
              '0.95rem',
              '0.8rem'
            ),
            fontWeight: 600,
            color: theme.palette.primary.main,
            mb: 0.5,
          }}
        >
          🚚 Delivery Information
        </Typography>
        <Typography
          variant='caption'
          sx={{
            fontSize: getResponsiveValue(
              '0.65rem',
              '0.7rem',
              '0.75rem',
              '0.8rem',
              '0.85rem',
              '0.9rem',
              '0.75rem'
            ),
            color: theme.palette.text.secondary,
            display: 'block',
            lineHeight: 1.3,
            mb: 0.25,
          }}
          className={getResponsiveTextClasses()}
        >
          • <strong>Inside Anantra:</strong> Free delivery for all orders
        </Typography>
        <Typography
          variant='caption'
          sx={{
            fontSize: getResponsiveValue(
              '0.65rem',
              '0.7rem',
              '0.75rem',
              '0.8rem',
              '0.85rem',
              '0.9rem',
              '0.75rem'
            ),
            color: theme.palette.text.secondary,
            display: 'block',
            lineHeight: 1.3,
            mb: 0.25,
          }}
          className={getResponsiveTextClasses()}
        >
          • <strong>Outside Anantra:</strong> Free delivery for orders ≥ ₹150, ₹10 for orders below ₹150
        </Typography>
      </Alert>

      {loading || !cartData ? (
        <Loading />
      ) : (
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
          {/* Left Column - Order Details (70%) */}
          <Grid
            sx={{
              width: {
                xs: '100%',
                sm: '100%',
                md: isTablet ? '100%' : '66%',
                lg: '66%',
              },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: {
                xs: 'center',
                sm: 'center',
                md: isTablet ? 'center' : 'flex-start',
                lg: 'flex-start',
              },
            }}
          >
            <Stack spacing={{ xs: 1.5, sm: 2, md: 2.5, lg: 2.5 }}>
              {/* Shipping Address */}
              <Paper
                sx={{
                  p: getResponsiveValue(0.75, 1, 1.25, 1.5, 1.75, 2, 1.25),
                  borderRadius: 1.5,
                  background: `linear-gradient(90deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
                  border: `1px solid ${theme.palette.primary.light}`,
                  boxShadow: `0 2px 12px 0 ${theme.palette.primary.main}20`,
                }}
                className={`card-golden ${getResponsiveCardSize()}`}
              >
                <Typography
                  fontWeight={600}
                  mb={getResponsiveValue(0.5, 0.5, 0.75, 1, 1.25, 1.5, 0.75)}
                  sx={{
                    color: theme.palette.primary.main,
                    fontSize: getResponsiveValue(
                      '0.7rem',
                      '0.75rem',
                      '0.8rem',
                      '0.9rem',
                      '1rem',
                      '1.1rem',
                      '0.8rem'
                    ),
                  }}
                  className={getResponsiveTextClasses()}
                >
                  Select Shipping Address
                </Typography>
                <RadioGroup
                  value={selectedAddress}
                  onChange={e => setSelectedAddress(e.target.value)}
                  sx={{
                    gap: getResponsiveValue(
                      0.125,
                      0.125,
                      0.25,
                      0.5,
                      0.75,
                      1,
                      0.25
                    ),
                    // Enhanced mobile layout - now using responsive system
                  }}
                >
                  {addresses.map(addr => (
                    <FormControlLabel
                      key={addr._id}
                      value={addr._id}
                      control={<Radio sx={{ color: theme.palette.primary.main }} />}
                      label={
                        <Box
                          sx={{
                            p: getResponsiveValue(
                              0.25,
                              0.25,
                              0.5,
                              0.75,
                              1,
                              1.25,
                              0.5
                            ),
                            borderRadius: theme.shape.borderRadius * 0.125,
                            background: `${theme.palette.primary.main}1A`,
                            border: `1px solid ${theme.palette.primary.main}33`,
                            transition: 'all 0.3s ease',
                            // Enhanced mobile responsiveness - now using responsive system
                            '&:hover': {
                              background: `${theme.palette.primary.main}33`,
                              borderColor: theme.palette.primary.light,
                            },
                          }}
                        >
                          {/* Address Type and Villa Number */}
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                              mb: getResponsiveValue(
                                0.125,
                                0.125,
                                0.25,
                                0.375,
                                0.5,
                                0.625,
                                0.25
                              ),
                            }}
                          >
                            <Chip
                              label={addr.addressType === 'inside_anantra' ? 'Inside Anantra' : 'Outside Anantra'}
                              size="small"
                              sx={{
                                background: addr.addressType === 'inside_anantra' 
                                  ? `linear-gradient(90deg, ${theme.palette.success.main} 0%, ${theme.palette.success.light} 100%)`
                                  : `linear-gradient(90deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.light} 100%)`,
                                color: theme.palette.primary.contrastText,
                                fontWeight: 600,
                                fontSize: getResponsiveValue(
                                  '0.5rem',
                                  '0.55rem',
                                  '0.6rem',
                                  '0.65rem',
                                  '0.7rem',
                                  '0.75rem',
                                  '0.6rem'
                                ),
                                height: '20px',
                              }}
                            />
                            {addr.villaNumber && (
                              <Chip
                                label={`Villa ${addr.villaNumber}`}
                                size="small"
                                variant="outlined"
                                sx={{
                                  borderColor: theme.palette.primary.main,
                                  color: theme.palette.primary.main,
                                  fontWeight: 600,
                                  fontSize: getResponsiveValue(
                                    '0.5rem',
                                    '0.55rem',
                                    '0.6rem',
                                    '0.65rem',
                                    '0.7rem',
                                    '0.75rem',
                                    '0.6rem'
                                  ),
                                  height: '20px',
                                }}
                              />
                            )}
                          </Box>

                          <Typography
                            fontWeight={600}
                            sx={{
                              color: theme.palette.primary.main,
                              fontSize: getResponsiveValue(
                                '0.65rem',
                                '0.7rem',
                                '0.75rem',
                                '0.8rem',
                                '0.85rem',
                                '0.9rem',
                                '0.75rem'
                              ),
                              mb: getResponsiveValue(
                                0.125,
                                0.125,
                                0.25,
                                0.375,
                                0.5,
                                0.625,
                                0.25
                              ),
                            }}
                            className={getResponsiveTextClasses()}
                          >
                            {addr.addressLine1}
                          </Typography>
                          {addr.addressLine2 && (
                            <Typography
                              sx={{
                                color: theme.palette.text.secondary,
                                fontSize: getResponsiveValue(
                                  '0.6rem',
                                  '0.65rem',
                                  '0.7rem',
                                  '0.75rem',
                                  '0.8rem',
                                  '0.85rem',
                                  '0.7rem'
                                ),
                                mb: getResponsiveValue(
                                  0.125,
                                  0.125,
                                  0.25,
                                  0.375,
                                  0.5,
                                  0.625,
                                  0.25
                                ),
                              }}
                              className={getResponsiveTextClasses()}
                            >
                              {addr.addressLine2}
                            </Typography>
                          )}
                          <Typography
                            sx={{
                              color: theme.palette.text.secondary,
                              fontSize: getResponsiveValue(
                                '0.6rem',
                                '0.65rem',
                                '0.7rem',
                                '0.75rem',
                                '0.8rem',
                                '0.85rem',
                                '0.7rem'
                              ),
                              mb: getResponsiveValue(
                                0.125,
                                0.125,
                                0.25,
                                0.375,
                                0.5,
                                0.625,
                                0.25
                              ),
                            }}
                            className={getResponsiveTextClasses()}
                          >
                            {addr.city}, {addr.state}, {addr.country} -{' '}
                            {addr.pinCode}
                          </Typography>
                          <Typography
                            sx={{
                              color: theme.palette.text.secondary,
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
                            Phone: {addr.phoneNumber}
                          </Typography>
                        </Box>
                      }
                      sx={{
                        mb: getResponsiveValue(
                          0.5,
                          0.5,
                          0.75,
                          1,
                          1.25,
                          1.5,
                          0.75
                        ),
                        alignItems: 'flex-start',
                        width: '100%',
                        '& .MuiFormControlLabel-label': {
                          width: '100% !important',
                          margin: 0,
                        },
                      }}
                    />
                  ))}
                </RadioGroup>
                <Button
                  variant='outlined'
                  sx={{
                    mt: getResponsiveValue(0.75, 0.75, 1, 1.25, 1.5, 1.75, 1),
                    textTransform: 'none',
                    fontWeight: 600,
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    background: `linear-gradient(90deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
                    borderRadius: theme.shape.borderRadius * 0.125,
                    fontSize: getResponsiveValue(
                      '0.65rem',
                      '0.7rem',
                      '0.75rem',
                      '0.8rem',
                      '0.85rem',
                      '0.9rem',
                      '0.75rem'
                    ),
                    px: getResponsiveValue(0.75, 0.75, 1.5, 2.25, 3, 3.75, 1.5),
                    py: getResponsiveValue(
                      0.375,
                      0.375,
                      0.75,
                      1.125,
                      1.5,
                      1.875,
                      0.75
                    ),
                    '&:hover': {
                      borderColor: theme.palette.primary.light,
                      background: `linear-gradient(90deg, ${theme.palette.primary.light} 0%, ${theme.palette.background.paper} 100%)`,
                      color: theme.palette.text.secondary,
                    },
                  }}
                  onClick={() => navigate('/addresses')}
                  className={getResponsiveButtonSize()}
                >
                  Manage Addresses
                </Button>
              </Paper>

              {/* Payment Method */}
              <Paper
                sx={{
                  p: getResponsiveValue(0.75, 1, 1.25, 1.5, 1.75, 2, 1.25),
                  borderRadius: theme.shape.borderRadius * 0.25,
                  background: `linear-gradient(90deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
                  border: `1px solid ${theme.palette.primary.light}`,
                  boxShadow: `0 2px 12px 0 ${theme.palette.primary.main}33`,
                  '& .MuiTypography-root': {
                    fontSize: getResponsiveValue(
                      '0.6rem',
                      '0.65rem',
                      '0.7rem',
                      '0.75rem',
                      '0.8rem',
                      '0.85rem',
                      '0.7rem'
                    ),
                  },
                  '& .MuiFormLabel-root': {
                    fontSize: getResponsiveValue(
                      '0.55rem',
                      '0.6rem',
                      '0.65rem',
                      '0.7rem',
                      '0.75rem',
                      '0.8rem',
                      '0.65rem'
                    ),
                  },
                  '& .MuiInputBase-root': {
                    fontSize: getResponsiveValue(
                      '0.6rem',
                      '0.65rem',
                      '0.7rem',
                      '0.75rem',
                      '0.8rem',
                      '0.85rem',
                      '0.7rem'
                    ),
                  },
                  '& .MuiButton-root': {
                    fontSize: getResponsiveValue(
                      '0.55rem',
                      '0.6rem',
                      '0.65rem',
                      '0.7rem',
                      '0.75rem',
                      '0.8rem',
                      '0.65rem'
                    ),
                  },
                }}
                className={`card-golden ${getResponsiveCardSize()}`}
              >
                <PaymentMethodSelector
                  selectedMethod={selectedPaymentMethod}
                  onMethodChange={setSelectedPaymentMethod}
                  paymentDetails={paymentDetails}
                  onPaymentDetailsChange={setPaymentDetails}
                  onPaymentScreenshotChange={setPaymentScreenshot}
                  paymentScreenshot={paymentScreenshot}
                />
              </Paper>
            </Stack>
          </Grid>

          {/* Right Column - Order Summary (30%) */}
          <Grid
            sx={{
              width: {
                xs: '100%',
                sm: '100%',
                md: isTablet ? '100%' : '30%',
                lg: '30%',
              },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: {
                xs: 'center',
                sm: 'center',
                md: 'flex-start',
                lg: 'flex-start',
              },
            }}
          >
            <Stack spacing={{ xs: 3, sm: 4, md: 4, lg: 4 }}>
              <Paper
                sx={{
                  p: 1.5,
                  height: 'auto',
                  maxHeight: 'none',
                  overflow: 'visible',

                  borderRadius: 3,
                  background: `linear-gradient(90deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
                  border: `1px solid ${theme.palette.primary.light}`,
                  boxShadow: `0 2px 12px 0 ${theme.palette.primary.main}20`,
                }}
                className={`card-golden ${getResponsiveCardSize()} responsive-card`}
              >
                <Typography
                  textAlign='center'
                  fontWeight={600}
                  mb={1}
                  sx={{
                    color: theme.palette.primary.main,
                    fontSize: getResponsiveValue(
                      '1rem',
                      '1.1rem',
                      '1.2rem',
                      '1.3rem',
                      '1.4rem',
                      '1.5rem',
                      '1.2rem'
                    ),
                  }}
                  className={getResponsiveTextClasses()}
                >
                  Summary
                </Typography>

                <Divider
                  sx={{ mb: 1, borderColor: theme.palette.primary.light }}
                />

                {/* Cart Items */}
                {cart.length === 0 ? (
                  <Typography
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: getResponsiveValue(
                        '0.875rem',
                        '0.9rem',
                        '1rem',
                        '1.1rem',
                        '1.2rem',
                        '1.3rem',
                        '1rem'
                      ),
                    }}
                    className={getResponsiveTextClasses()}
                  >
                    No items in cart.
                  </Typography>
                ) : (
                  <>
                                    {cart && cart.length > 0 && cart.map(item => (
                  <Box
                    key={item.product._id}
                    sx={{
                      mb: 1,
                      px: 1,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      borderRadius: theme.shape.borderRadius * 0.17,
                      background: `${theme.palette.primary.main}1A`,
                      border: `1px solid ${theme.palette.primary.main}33`,
                    }}
                  >
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            sx={{
                              color: theme.palette.primary.main,
                              fontWeight: 400,
                              fontSize: getResponsiveValue(
                                '0.65rem',
                                '0.7rem',
                                '0.75rem',
                                '0.8rem',
                                '0.85rem',
                                '0.9rem',
                                '0.75rem'
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
                            Qty: {item.quantity}
                          </Typography>
                        </Box>
                        <Typography
                          sx={{
                            color: theme.palette.text.secondary,
                            fontWeight: 400,
                            fontSize: getResponsiveValue(
                              '0.65rem',
                              '0.7rem',
                              '0.75rem',
                              '0.8rem',
                              '0.85rem',
                              '0.9rem',
                              '0.75rem'
                            ),
                          }}
                          className={getResponsiveTextClasses()}
                        >
                          ₹{(item.product.price * item.quantity).toFixed(2)}
                        </Typography>
                      </Box>
                    ))}

                    <Divider
                      sx={{ borderColor: theme.palette.primary.light, my: 1 }}
                    />

                    {/* Price Breakdown */}
                    <Box sx={{ mb: 1 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          px: 1,
                        }}
                      >
                        <Typography
                          sx={{
                            color: theme.palette.text.secondary,
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
                          Subtotal:
                        </Typography>
                        <Typography
                          sx={{
                            color: theme.palette.text.secondary,
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
                          ₹{totals.subtotal.toFixed(2)}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          px: 1,
                        }}
                      >
                        <Typography
                          sx={{
                            color: theme.palette.text.secondary,
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
                          Delivery:
                        </Typography>
                        <Typography
                          sx={{
                            color: theme.palette.text.secondary,
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
                          {totals.deliveryCharge === 0
                            ? 'Free'
                            : `₹${totals.deliveryCharge.toFixed(2)}`}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          px: 1,
                        }}
                      >
                        <Typography
                          sx={{
                            color: theme.palette.text.secondary,
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
                          GST (18%):
                        </Typography>
                        <Typography
                          sx={{
                            color: theme.palette.text.secondary,
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
                          ₹{totals.gst.toFixed(2)}
                        </Typography>
                      </Box>
                      <Divider
                        sx={{
                          my: 1,
                          borderColor: theme.palette.primary.light,
                        }}
                      />
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          p: 1,
                          background: `${theme.palette.primary.main}33`,
                          borderRadius: theme.shape.borderRadius * 0.33,
                        }}
                      >
                        <Typography
                          sx={{
                            color: theme.palette.primary.main,
                            fontWeight: 700,
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
                          Total:
                        </Typography>
                        <Typography
                          sx={{
                            color: theme.palette.primary.main,
                            fontWeight: 700,
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
                          ₹{totals.total.toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Payment Method Display */}
                    <Box
                      sx={{
                        mb: 1,
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Typography
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: getResponsiveValue(
                            '0.6rem',
                            '0.65rem',
                            '0.7rem',
                            '0.75rem',
                            '0.8rem',
                            '0.85rem',
                            '0.7rem'
                          ),
                          mb: 1,
                        }}
                        className={getResponsiveTextClasses()}
                      >
                        Payment Method:
                      </Typography>
                      <Chip
                        label={selectedPaymentMethod.toUpperCase()}
                        sx={{
                          background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                          color: theme.palette.primary.contrastText,
                          fontWeight: 400,
                          fontSize: getResponsiveValue(
                            '0.5rem',
                            '0.55rem',
                            '0.6rem',
                            '0.65rem',
                            '0.7rem',
                            '0.75rem',
                            '0.6rem'
                          ),
                          height: '24px',
                        }}
                      />
                    </Box>

                    {/* Delivery Charges Information */}
                    <Alert
                      severity='info'
                      sx={{
                        mb: 1,
                        borderRadius: 2,
                        background: `linear-gradient(90deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
                        border: `1px solid ${theme.palette.primary.light}`,
                        '& .MuiAlert-icon': {
                          color: theme.palette.primary.main,
                        },
                      }}
                      className={`${getResponsiveAlertSize()} ${getResponsiveCardSize()}`}
                    >
                      <Typography
                        variant='body2'
                        className={getResponsiveTextClasses()}
                        sx={{
                          fontSize: getResponsiveValue(
                            '0.7rem',
                            '0.75rem',
                            '0.8rem',
                            '0.85rem',
                            '0.9rem',
                            '0.95rem',
                            '0.8rem'
                          ),
                          fontWeight: 600,
                          color: theme.palette.primary.main,
                          mb: 0.5,
                        }}
                      >
                        📦 Delivery Charges Explained
                      </Typography>
                      <Typography
                        variant='caption'
                        sx={{
                          fontSize: getResponsiveValue(
                            '0.65rem',
                            '0.7rem',
                            '0.75rem',
                            '0.8rem',
                            '0.85rem',
                            '0.9rem',
                            '0.75rem'
                          ),
                          color: theme.palette.text.secondary,
                          display: 'block',
                          lineHeight: 1.3,
                          mb: 0.5,
                        }}
                        className={getResponsiveTextClasses()}
                      >
                        <strong>How it works:</strong>
                      </Typography>
                      <Typography
                        variant='caption'
                        sx={{
                          fontSize: getResponsiveValue(
                            '0.65rem',
                            '0.7rem',
                            '0.75rem',
                            '0.8rem',
                            '0.85rem',
                            '0.9rem',
                            '0.75rem'
                          ),
                          color: theme.palette.text.secondary,
                          display: 'block',
                          lineHeight: 1.3,
                          mb: 0.25,
                        }}
                        className={getResponsiveTextClasses()}
                      >
                        • <strong>Inside Anantra:</strong> <span style={{color: theme.palette.success.main, fontWeight: 600}}>FREE delivery</span> for all orders
                      </Typography>
                      <Typography
                        variant='caption'
                        sx={{
                          fontSize: getResponsiveValue(
                            '0.65rem',
                            '0.7rem',
                            '0.75rem',
                            '0.8rem',
                            '0.85rem',
                            '0.9rem',
                            '0.75rem'
                          ),
                          color: theme.palette.text.secondary,
                          display: 'block',
                          lineHeight: 1.3,
                          mb: 0.25,
                        }}
                        className={getResponsiveTextClasses()}
                      >
                        • <strong>Outside Anantra:</strong> <span style={{color: theme.palette.primary.main, fontWeight: 600}}>FREE delivery</span> for orders ≥ ₹150, <span style={{color: theme.palette.warning.main, fontWeight: 600}}>₹10 delivery charge</span> for orders below ₹150
                      </Typography>
                      {(() => {
                        const selectedAddr = addresses.find(addr => addr._id === selectedAddress);
                        if (selectedAddr && selectedAddr.addressType === 'outside_anantra' && totals.subtotal < 150) {
                          return (
                            <Typography
                              variant='caption'
                              sx={{
                                fontSize: getResponsiveValue(
                                  '0.65rem',
                                  '0.7rem',
                                  '0.75rem',
                                  '0.8rem',
                                  '0.85rem',
                                  '0.9rem',
                                  '0.75rem'
                                ),
                                color: theme.palette.primary.main,
                                display: 'block',
                                lineHeight: 1.3,
                                mt: 0.5,
                                fontWeight: 600,
                              }}
                              className={getResponsiveTextClasses()}
                            >
                              💡 Tip: Add ₹{(150 - totals.subtotal).toFixed(2)} more to your cart for free delivery!
                            </Typography>
                          );
                        }
                        return null;
                      })()}
                    </Alert>

                    {/* Minimum Order Notice */}
                    {totals.total < MIN_ORDER_AMOUNT && (
                      <Alert
                        severity='warning'
                        sx={{
                          mb: 1,
                          borderRadius: theme.shape.borderRadius * 0.33,
                          background: `linear-gradient(90deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
                          border: `1px solid ${theme.palette.primary.light}`,
                          '& .MuiAlert-icon': {
                            color: theme.palette.primary.main,
                          },
                        }}
                        className={`${getResponsiveAlertSize()} ${getResponsiveCardSize()}`}
                      >
                        <Typography
                          variant='body2'
                          className={getResponsiveTextClasses()}
                          sx={{
                            fontSize: getResponsiveValue(
                              '0.7rem',
                              '0.75rem',
                              '0.8rem',
                              '0.85rem',
                              '0.9rem',
                              '0.95rem',
                              '0.8rem'
                            ),
                            fontWeight: 600,
                            color: theme.palette.primary.main,
                            mb: 0.5,
                          }}
                        >
                          Heads Up!
                        </Typography>
                        <Typography
                          variant='caption'
                          sx={{
                            fontSize: getResponsiveValue(
                              '0.65rem',
                              '0.7rem',
                              '0.75rem',
                              '0.8rem',
                              '0.85rem',
                              '0.9rem',
                              '0.75rem'
                            ),
                            color: theme.palette.text.secondary,
                            display: 'block',
                            lineHeight: 1.3,
                          }}
                          className={getResponsiveTextClasses()}
                        >
                          Almost there! Add ₹
                          {(MIN_ORDER_AMOUNT - totals.total).toFixed(2)} more
                          items to reach our minimum order amount of ₹
                          {MIN_ORDER_AMOUNT} and enjoy free delivery to your
                          doorstep!
                        </Typography>
                      </Alert>
                    )}

                    {/* Place Order Button */}
                    <Button
                      variant='contained'
                      fullWidth
                      onClick={handlePlaceOrder}
                      disabled={
                        placing ||
                        !cart ||
                        cart.length === 0 ||
                        totals.total < MIN_ORDER_AMOUNT
                      }
                      sx={{
                        fontWeight: 500,
                        background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                        color: theme.palette.primary.contrastText,
                        textTransform: 'none',
                        borderRadius: 1,
                        fontSize: getResponsiveValue(
                          '0.6rem',
                          '0.65rem',
                          '0.7rem',
                          '0.75rem',
                          '0.8rem',
                          '0.85rem',
                          '0.7rem'
                        ),
                        boxShadow: `0 2px 8px ${theme.palette.primary.main}20`,
                        mb: 1,
                        py: 0.75,
                        minHeight: '44px',
                        '&:hover': {
                          background: `linear-gradient(90deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                          color: theme.palette.primary.contrastText,
                          boxShadow: `0 4px 16px ${theme.palette.primary.main}30`,
                        },
                        transition: 'all 0.3s ease',
                      }}
                      className={getResponsiveButtonSize()}
                    >
                      {placing ? 'Placing Order...' : 'Place Order'}
                    </Button>

                    {/* Navigate to catalogue */}
                    <Button
                      variant='outlined'
                      fullWidth
                      onClick={() => navigate('/catalogue')}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        background: `linear-gradient(90deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
                        color: theme.palette.primary.main,
                        border: `1px solid ${theme.palette.primary.light}`,
                      }}
                    >
                      Continue Shopping
                    </Button>

                    {/* Download Invoice */}
                    {invoice && (
                      <Button
                        variant='outlined'
                        fullWidth
                        sx={{
                          textTransform: 'none',
                          fontWeight: 600,
                          background: `linear-gradient(90deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
                          color: theme.palette.primary.main,
                          border: `1px solid ${theme.palette.primary.light}`,
                          borderRadius: 2,
                          fontSize: getResponsiveValue(
                            '0.875rem',
                            '0.9rem',
                            '1rem',
                            '1.1rem',
                            '1.2rem',
                            '1.3rem',
                            '1rem'
                          ),
                          py: getResponsiveValue(
                            0.75,
                            0.75,
                            1,
                            1.25,
                            1.5,
                            1.75,
                            1
                          ),
                          minHeight: getResponsiveValue(
                            '44px',
                            '48px',
                            '52px',
                            '56px',
                            '60px',
                            '64px',
                            '52px'
                          ),
                          // Enhanced mobile responsiveness
                          '@media (max-width: 600px)': {
                            minHeight: '48px',
                            fontSize: '1rem',
                            py: 1,
                            borderRadius: 2,
                          },
                          '@media (max-width: 480px)': {
                            minHeight: '44px',
                            fontSize: '0.9rem',
                            py: 0.75,
                            borderRadius: 1.5,
                          },
                          '&:hover': {
                            background: `linear-gradient(90deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                            color: theme.palette.primary.contrastText,
                          },
                        }}
                        href={`http://localhost:3000/api/invoice/${invoice._id}`}
                        target='_blank'
                        className={getResponsiveButtonSize()}
                      >
                        Download Invoice
                      </Button>
                    )}
                  </>
                )}
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default OrderCheckout;
