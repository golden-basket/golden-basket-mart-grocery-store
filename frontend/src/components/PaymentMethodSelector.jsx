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
  IconButton,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  CreditCard as CardIcon,
  AccountBalance as BankIcon,
  Payment as UpiIcon,
  LocalShipping as CodIcon,
  QrCode as QrCodeIcon,
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useFoldableDisplay } from '../hooks/useFoldableDisplay';

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

  // Only support COD and UPI for now
  const paymentMethods = [
    {
      value: 'cod',
      label: 'Cash on Delivery',
      icon: <CodIcon />,
      description: 'Pay when you receive your order',
      color: '#4caf50',
      fields: [],
    },
    // {
    //   value: 'upi',
    //   label: 'UPI Payment',
    //   icon: <UpiIcon />,
    //   description: 'Pay using UPI ID and upload payment screenshot',
    //   color: '#9c27b0',
    //   fields: [
    //     { name: 'upiId', label: 'UPI ID', type: 'text', placeholder: 'username@upi' },
    //   ],
    // },
  ];

  const selectedMethodData = paymentMethods.find(
    (method) => method.value === selectedMethod
  );

  const handleMethodChange = (event) => {
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

  const handleScreenshotUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      onPaymentScreenshotChange(file);
    }
  };

  const removeScreenshot = () => {
    onPaymentScreenshotChange(null);
  };

  const getResponsiveSpacing = () => {
    if (isExtraSmall || isSmall) return 1;
    if (isMedium) return 2;
    if (isLarge) return 3;
    return 4;
  };

  const getResponsiveTypography = (variant) => {
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
          color: 'var(--color-primary)',
          mb: getResponsiveSpacing(),
          textAlign: isMobile ? 'center' : 'left',
        }}
      >
        Select Payment Method
      </Typography>

      {/* Payment Method Info Alert */}
      <Alert
        severity="info"
        sx={{
          mb: getResponsiveSpacing(),
          background: 'rgba(163,130,76,0.1)',
          border: '1px solid var(--color-primary-light)',
          '& .MuiAlert-icon': {
            color: 'var(--color-primary)',
          },
        }}
        className={getResponsiveAlertSize()}
      >
        <Typography variant="body2" className={getResponsiveTextClasses()}>
          <strong>Note:</strong> We currently support Cash on Delivery (COD) and
          UPI payments only. For UPI payments, please upload a screenshot of
          your payment confirmation.
        </Typography>
      </Alert>

      <RadioGroup
        value={selectedMethod}
        onChange={handleMethodChange}
        sx={{ mb: getResponsiveSpacing(), display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <Grid container spacing={getResponsiveSpacing()}>
          {paymentMethods.map((method) => (
            <Grid item xs={12} sm={6} key={method.value}>
              <Card
                sx={{
                  cursor: 'pointer',
                  border:
                    selectedMethod === method.value
                      ? '2px solid var(--color-primary)'
                      : '1px solid var(--color-primary-light)',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: 'var(--color-primary)',
                    boxShadow: '0 4px 12px rgba(163,130,76,0.2)',
                    transform: 'translateY(-2px)',
                  },
                  background:
                    selectedMethod === method.value
                      ? 'linear-gradient(135deg, var(--color-cream-light) 0%, var(--color-cream-medium) 100%)'
                      : 'white',
                  ...getResponsiveCardSize(),
                }}
                onClick={() => onMethodChange(method.value)}
                className="card-golden hover-responsive"
              >
                <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
                  <Box display="flex" alignItems="center" mb={1}>
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
                      control={<Radio sx={{ color: 'var(--color-primary)' }} />}
                      label={
                        <Typography
                          variant={isMobile ? 'body2' : 'body1'}
                          fontWeight={600}
                          color="var(--color-text-primary)"
                        >
                          {method.label}
                        </Typography>
                      }
                      sx={{
                        margin: 0,
                        '& .MuiFormControlLabel-label': {
                          fontWeight: 600,
                          color: 'var(--color-text-primary)',
                        },
                      }}
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ ml: 4 }}
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
              p: getResponsiveSpacing(),
              background:
                'linear-gradient(135deg, var(--color-cream-light) 0%, var(--color-cream-medium) 100%)',
              border: '1px solid var(--color-primary-light)',
              borderRadius: 2,
              mb: getResponsiveSpacing(),
            }}
            className="card-golden"
          >
            <Typography
              variant={getResponsiveTypography('h6')}
              gutterBottom
              sx={{
                fontWeight: 600,
                color: 'var(--color-primary)',
                mb: getResponsiveSpacing(),
                textAlign: isMobile ? 'center' : 'left',
              }}
            >
              {selectedMethodData.label} Details
            </Typography>

            <Grid container spacing={getResponsiveSpacing()}>
              {selectedMethodData.fields.map((field) => (
                <Grid item xs={12} sm={6} key={field.name}>
                  <TextField
                    fullWidth
                    label={field.label}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={paymentDetails[field.name] || ''}
                    onChange={(e) =>
                      handleFieldChange(field.name, e.target.value)
                    }
                    className={getResponsiveInputSize()}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: 'white',
                        borderRadius: 1,
                        '&:hover fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'var(--color-primary)',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'var(--color-primary)',
                        fontWeight: 500,
                        '&.Mui-focused': {
                          color: 'var(--color-primary)',
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
            p: getResponsiveSpacing(),
            background:
              'linear-gradient(135deg, var(--color-cream-light) 0%, var(--color-cream-medium) 100%)',
            border: '1px solid var(--color-primary-light)',
            borderRadius: 2,
            mb: getResponsiveSpacing(),
          }}
          className="card-golden"
        >
          <Typography
            variant={getResponsiveTypography('h6')}
            gutterBottom
            sx={{
              fontWeight: 600,
              color: 'var(--color-primary)',
              mb: getResponsiveSpacing(),
              textAlign: 'center',
            }}
          >
            UPI Payment Instructions
          </Typography>

          {/* QR Code Section */}
          <Box sx={{ mb: getResponsiveSpacing(), textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              Scan this QR code to pay via UPI:
            </Typography>
            <Box
              sx={{
                width: isMobile ? 150 : 200,
                height: isMobile ? 150 : 200,
                margin: '0 auto',
                background: 'white',
                border: '2px solid var(--color-primary-light)',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
              }}
            >
              <QrCodeIcon
                sx={{
                  fontSize: isMobile ? 100 : 150,
                  color: 'var(--color-primary)',
                }}
              />
            </Box>
            <Typography
              variant="caption"
              color="textSecondary"
              sx={{ mt: 1, display: 'block' }}
            >
              UPI ID: goldenbasket@upi
            </Typography>
          </Box>

          {/* Payment Screenshot Upload */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              After payment, upload a screenshot of your payment confirmation:
            </Typography>

            {!paymentScreenshot ? (
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadIcon />}
                sx={{
                  borderColor: 'var(--color-primary)',
                  color: 'var(--color-primary)',
                  '&:hover': {
                    borderColor: 'var(--color-primary-dark)',
                    backgroundColor: 'rgba(163,130,76,0.1)',
                  },
                }}
                className={getResponsiveButtonSize()}
              >
                Upload Payment Screenshot
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleScreenshotUpload}
                />
              </Button>
            ) : (
              <Box sx={{ textAlign: 'center' }}>
                <Chip
                  label="Screenshot uploaded"
                  color="success"
                  icon={<UploadIcon />}
                  sx={{ mb: 1 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={removeScreenshot}
                    startIcon={<DeleteIcon />}
                    sx={{
                      borderColor: 'var(--color-error)',
                      color: 'var(--color-error)',
                      '&:hover': {
                        borderColor: 'var(--color-error)',
                        backgroundColor: 'rgba(211,47,47,0.1)',
                      },
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
          severity="warning"
          sx={{
            background: 'rgba(255,152,0,0.1)',
            border: '1px solid var(--color-warning)',
            '& .MuiAlert-icon': {
              color: 'var(--color-warning)',
            },
          }}
          className={getResponsiveAlertSize()}
        >
          <Typography variant="body2" className={getResponsiveTextClasses()}>
            <strong>Cash on Delivery:</strong> Please have exact change ready.
            Additional delivery charges may apply based on your location and
            order amount.
          </Typography>
        </Alert>
      )}

      {/* Security Notice */}
      <Alert
        severity="info"
        sx={{
          mt: getResponsiveSpacing(),
          background: 'rgba(163,130,76,0.1)',
          border: '1px solid var(--color-primary-light)',
          '& .MuiAlert-icon': {
            color: 'var(--color-primary)',
          },
        }}
        className={getResponsiveAlertSize()}
      >
        <Typography variant="body2" className={getResponsiveTextClasses()}>
          <strong>Security:</strong> Your payment information is encrypted and
          secure. We do not store your payment details.
        </Typography>
      </Alert>
    </Box>
  );
};

export default PaymentMethodSelector;
