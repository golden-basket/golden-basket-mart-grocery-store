import React from 'react';
import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  TextField,
  Grid,
  Card,
  CardContent,
  Alert,
  Button,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  LocalShipping as CodIcon,
  QrCode as QrCodeIcon,
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useFoldableDisplay } from '../hooks/useFoldableDisplay';
import { useToastNotifications } from '../hooks/useToast';

const PaymentMethodSelector = ({
  selectedMethod,
  onMethodChange,
  paymentDetails,
  onPaymentDetailsChange,
  onPaymentScreenshotChange,
  paymentScreenshot,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { showSuccess, showError } = useToastNotifications();

  // Enhanced responsive utilities
  const {
    isExtraSmall,
    isSmall,
    isMedium,
    isLarge,
    getResponsiveSpacingClasses,
    getResponsiveTextClasses,
    getResponsiveButtonSize,
    getResponsiveCardSize,
    getResponsiveInputSize,
    getResponsiveAlertSize,
  } = useFoldableDisplay();

  // Support COD and UPI payment methods
  const paymentMethods = [
    {
      value: 'cod',
      label: 'Cash on Delivery',
      icon: <CodIcon />,
      description: 'Pay when you receive your order',
      color: theme.palette.success.main,
      fields: [],
    },
    // {
    //   value: 'upi',
    //   label: 'UPI Payment',
    //   icon: <QrCodeIcon />,
    //   description: 'Pay using UPI ID and upload payment screenshot',
          //   color: theme.palette.secondary.main,
    //   fields: [
    //     { name: 'upiId', label: 'UPI ID', type: 'text', placeholder: 'username@upi' },
    //   ],
    // },
  ];

  const selectedMethodData = paymentMethods.find(
    method => method.value === selectedMethod
  );

  const handleMethodChange = event => {
    const newMethod = event.target.value;
    onMethodChange(newMethod);
    // Clear payment details when method changes
    onPaymentDetailsChange({});
    // Clear payment screenshot
    onPaymentScreenshotChange(null);
  };

  const handleFieldChange = (fieldName, value) => {
    onPaymentDetailsChange({
      ...paymentDetails,
      [fieldName]: value,
    });
  };

  const handleScreenshotUpload = event => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showError('Please select an image file (JPEG, PNG, etc.)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showError('File size must be less than 5MB');
        return;
      }

      onPaymentScreenshotChange(file);
      showSuccess('Payment screenshot uploaded successfully!');
    }
  };

  const removeScreenshot = () => {
    onPaymentScreenshotChange(null);
    showSuccess('Payment screenshot removed');
  };

  const getResponsiveSpacing = () => {
    if (isExtraSmall || isSmall) return 1;
    if (isMedium) return 2;
    if (isLarge) return 3;
    return 4;
  };

  const getResponsiveTypography = variant => {
    if (isExtraSmall || isSmall) {
      return variant === 'h6' ? 'h6' : 'body2';
    }
    if (isMedium) {
      return variant === 'h6' ? 'h6' : 'body1';
    }
    return variant;
  };

  return (
    <Box className={getResponsiveSpacingClasses()}>
      <Typography
        variant={getResponsiveTypography('h6')}
        gutterBottom
        sx={{
          fontWeight: 700,
          color: theme.palette.primary.main,
          mb: getResponsiveSpacing(),
          textAlign: isMobile ? 'center' : 'left',
          fontSize: getResponsiveSpacing() === 1 ? '0.9rem' : getResponsiveSpacing() === 2 ? '1rem' : '1.1rem',
          letterSpacing: '0.5px',
        }}
      >
        Select Payment Method
      </Typography>

      {/* Payment Method Info Alert */}
      <Alert
        severity='info'
        sx={{
          mb: getResponsiveSpacing(),
          background: `${theme.palette.primary.main}1A`,
          border: `1px solid ${theme.palette.primary.light}`,
          '& .MuiAlert-icon': {
            color: theme.palette.primary.main,
          },
        }}
        className={getResponsiveAlertSize()}
      >
        <Typography variant='body2' className={getResponsiveTextClasses()}>
          <strong>Payment Options:</strong> Choose between Cash on Delivery (COD) 
          or UPI payment. For UPI payments, please upload a screenshot of
          your payment confirmation after completing the transaction.
        </Typography>
      </Alert>

      <RadioGroup
        value={selectedMethod}
        onChange={handleMethodChange}
        sx={{
          mb: getResponsiveSpacing(),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Grid container spacing={getResponsiveSpacing()}>
          {paymentMethods.map(method => (
            <Grid item xs={12} sm={6} key={method.value}>
              <Card
                sx={{
                  cursor: 'pointer',
                  border:
                    selectedMethod === method.value
                      ? `2px solid ${theme.palette.primary.main}`
                      : `1px solid ${theme.palette.primary.light}`,
                  borderRadius: theme.shape.borderRadius * 0.17,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
                    transform: 'translateY(-1px)',
                  },
                  background:
                    selectedMethod === method.value
                      ? `linear-gradient(90deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`
                      : theme.palette.background.paper,
                  boxShadow: `0 2px 12px 0 ${theme.palette.primary.main}1A`,
                  ...getResponsiveCardSize(),
                }}
                onClick={() => onMethodChange(method.value)}
                className='card-golden'
              >
                <CardContent sx={{ 
                  p: getResponsiveSpacing() * 0.75,
                  '&:last-child': { pb: getResponsiveSpacing() * 0.75 }
                }}>
                  <Box display='flex' alignItems='center' mb={getResponsiveSpacing() * 0.5}>
                    <Box
                      sx={{
                        color: method.color,
                        mr: 1,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {method.icon}
                    </Box>
                    <FormControlLabel
                      value={method.value}
                      control={<Radio sx={{ color: theme.palette.primary.main }} />}
                      label={
                        <Typography
                          variant={isMobile ? 'body2' : 'body1'}
                          fontWeight={600}
                          color={theme.palette.primary.main}
                        >
                          {method.label}
                        </Typography>
                      }
                      sx={{
                        margin: 0,
                        '& .MuiFormControlLabel-label': {
                          fontWeight: 600,
                          color: theme.palette.primary.main,
                        },
                      }}
                    />
                  </Box>
                  <Typography
                    variant='body2'
                    color='textSecondary'
                    sx={{ ml: getResponsiveSpacing() * 2 }}
                    className={getResponsiveTextClasses()}
                  >
                    {method.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </RadioGroup>

      {/* Payment Details Form */}
      {selectedMethodData &&
        selectedMethodData.fields &&
        selectedMethodData.fields.length > 0 && (
          <Paper
            sx={{
              p: getResponsiveSpacing() * 0.75,
              background:
                `linear-gradient(90deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
              border: `1px solid ${theme.palette.primary.light}`,
              borderRadius: theme.shape.borderRadius * 0.17,
              mb: getResponsiveSpacing(),
              boxShadow: `0 2px 12px 0 ${theme.palette.primary.main}1A`,
            }}
            className='card-golden'
          >
            <Typography
              variant={getResponsiveTypography('h6')}
              gutterBottom
              sx={{
                fontWeight: 600,
                color: theme.palette.primary.main,
                mb: getResponsiveSpacing(),
                textAlign: isMobile ? 'center' : 'left',
                fontSize: getResponsiveSpacing() === 1 ? '0.85rem' : getResponsiveSpacing() === 2 ? '0.9rem' : '1rem',
                letterSpacing: '0.3px',
              }}
            >
              {selectedMethodData.label} Details
            </Typography>

            <Grid container spacing={getResponsiveSpacing()}>
              {selectedMethodData.fields.map(field => (
                <Grid item xs={12} sm={6} key={field.name}>
                  <TextField
                    fullWidth
                    label={field.label}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={paymentDetails[field.name] || ''}
                    onChange={e =>
                      handleFieldChange(field.name, e.target.value)
                    }
                    className={getResponsiveInputSize()}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: 'white',
                        borderRadius: theme.shape.borderRadius * 0.08,
                        '&:hover fieldset': {
                          borderColor: theme.palette.primary.main,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: theme.palette.primary.main,
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: theme.palette.primary.main,
                        fontWeight: 500,
                        '&.Mui-focused': {
                          color: theme.palette.primary.main,
                        },
                      },
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}

      {/* UPI QR Code and Payment Screenshot Section */}
      {selectedMethod === 'upi' && (
                  <Paper
            sx={{
              p: getResponsiveSpacing() * 0.75,
              background:
                `linear-gradient(90deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
              border: `1px solid ${theme.palette.primary.light}`,
              borderRadius: theme.shape.borderRadius * 0.17,
              mb: getResponsiveSpacing(),
              boxShadow: `0 2px 12px 0 ${theme.palette.primary.main}1A`,
            }}
            className='card-golden'
          >
          <Typography
            variant={getResponsiveTypography('h6')}
            gutterBottom
            sx={{
              fontWeight: 600,
              color: theme.palette.primary.main,
              mb: getResponsiveSpacing(),
              textAlign: 'center',
              fontSize: getResponsiveSpacing() === 1 ? '0.85rem' : getResponsiveSpacing() === 2 ? '0.9rem' : '1rem',
              letterSpacing: '0.3px',
            }}
          >
            UPI Payment Instructions
          </Typography>

          {/* QR Code Section */}
          <Box sx={{ mb: getResponsiveSpacing() * 0.75, textAlign: 'center' }}>
            <Typography variant='body2' color='textSecondary' sx={{ mb: getResponsiveSpacing() * 0.5 }}>
              Scan this QR code to pay via UPI:
            </Typography>
            <Box
              sx={{
                width: isMobile ? 150 : 200,
                height: isMobile ? 150 : 200,
                margin: '0 auto',
                background: theme.palette.background.paper,
                border: `2px solid ${theme.palette.primary.light}`,
                borderRadius: theme.shape.borderRadius * 0.17,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: getResponsiveSpacing() * 0.75,
                boxShadow: `0 2px 8px ${theme.palette.primary.main}1A`,
              }}
            >
              <QrCodeIcon
                sx={{
                  fontSize: isMobile ? 100 : 150,
                  color: theme.palette.primary.main,
                }}
              />
            </Box>
            <Typography
              variant='caption'
              color='textSecondary'
              sx={{ mt: getResponsiveSpacing() * 0.5, display: 'block' }}
            >
              UPI ID: goldenbasket@upi
            </Typography>
          </Box>

          {/* Payment Screenshot Upload */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant='body2' color='textSecondary' sx={{ mb: getResponsiveSpacing() * 0.5 }}>
              After payment, upload a screenshot of your payment confirmation:
            </Typography>

            {!paymentScreenshot ? (
              <Button
                variant='outlined'
                component='label'
                startIcon={<UploadIcon />}
                sx={{
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  borderRadius: theme.shape.borderRadius * 0.17,
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: theme.palette.primary.dark,
                    backgroundColor: `${theme.palette.primary.main}1A`,
                    transform: 'translateY(-1px)',
                    boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
                  },
                  transition: 'all 0.3s ease',
                }}
                className={getResponsiveButtonSize()}
              >
                Upload Payment Screenshot
                <input
                  type='file'
                  hidden
                  accept='image/*'
                  onChange={handleScreenshotUpload}
                />
              </Button>
            ) : (
              <Box sx={{ textAlign: 'center' }}>
                <Chip
                  label='Screenshot uploaded'
                  color='success'
                  icon={<UploadIcon />}
                  sx={{ mb: getResponsiveSpacing() * 0.5 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: getResponsiveSpacing() * 0.5 }}>
                  <Button
                    variant='outlined'
                    size='small'
                    onClick={removeScreenshot}
                    startIcon={<DeleteIcon />}
                    sx={{
                      borderColor: theme.palette.error.main,
                      color: theme.palette.error.main,
                      borderRadius: theme.shape.borderRadius * 0.08,
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: theme.palette.error.main,
                        backgroundColor: `${theme.palette.error.main}1A`,
                        transform: 'translateY(-1px)',
                        boxShadow: `0 2px 8px ${theme.palette.error.main}40`,
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Remove
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Paper>
      )}

      {/* COD Notice */}
      {selectedMethod === 'cod' && (
        <Alert
          severity='info'
          sx={{
            background: `${theme.palette.primary.light}40`,
            border: `1px solid ${theme.palette.primary.light}`,
            '& .MuiAlert-icon': {
              color: theme.palette.primary.main,
            },
          }}
          className={getResponsiveAlertSize()}
        >
          <Typography variant='body2' className={getResponsiveTextClasses()}>
            <strong>Cash on Delivery:</strong> Please have exact change ready.
            Free delivery is included with all orders.
          </Typography>
        </Alert>
      )}

      {/* Security Notice */}
      <Alert
        severity='info'
        sx={{
          mt: getResponsiveSpacing(),
          background: `${theme.palette.primary.light}40`,
          border: `1px solid ${theme.palette.primary.light}`,
          '& .MuiAlert-icon': {
            color: theme.palette.primary.main,
          },
        }}
        className={getResponsiveAlertSize()}
      >
        <Typography variant='body2' className={getResponsiveTextClasses()}>
          <strong>Security:</strong> Your payment information is encrypted and
          secure. We do not store your payment details.
        </Typography>
      </Alert>
    </Box>
  );
};

export default PaymentMethodSelector;
