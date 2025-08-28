import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  InputAdornment,
  Divider,
  Fade,
  Slide,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import JumpingCartAvatar from './JumpingCartAvatar';
import ApiService from '../services/api';
import { validateEmail } from '../utils/common';
import { useToastNotifications } from '../hooks/useToast';
import { ROUTES } from '../utils/routeConstants';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { showSuccess, showError } = useToastNotifications();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  // Real-time validation
  useEffect(() => {
    if (touched && !email.trim()) {
      setError('Email is required');
    } else if (touched && !validateEmail(email)) {
      setError('Please enter a valid email address');
    } else {
      setError('');
    }
  }, [email, touched]);

  const handleSubmit = async e => {
    e.preventDefault();

    if (!email.trim()) {
      showError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      showError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Call the actual API endpoint for password reset
      const response = await ApiService.forgotPassword(email.trim());

      const successMessage =
        response.message ||
        'Password reset instructions have been sent to your email address. Please check your inbox and follow the instructions to reset your password.';

      showSuccess(successMessage);

      // Auto-redirect after 5 seconds
      setTimeout(() => navigate(ROUTES.LOGIN), 5000);
    } catch (err) {
      showError(
        err.message || 'Failed to send password reset email. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        p: { xs: 1, sm: 2, md: 3 },
        background:
          'linear-gradient(135deg, #f7fbe8 0%, #fffbe6 50%, #f7ecd0 100%)',
      }}
    >
      <Slide direction='right' in={true} timeout={400}>
        <Paper
          elevation={24}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            width: { xs: '100%', sm: '90%', md: '70%', lg: '50%', xl: '40%' },
            maxWidth: 500,
            borderRadius: { xs: 2, sm: 3, md: 4 },
            background:
              'linear-gradient(135deg, #fff 0%, #fffbe6 50%, #f7ecd0 100%)',
            border: '2px solid #e6d897',
            boxShadow: '0 20px 40px rgba(163,130,76,0.2)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background:
                'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
            },
          }}
        >
          {/* Header Section */}
          <Box sx={{ textAlign: 'center', mb: { xs: 2, sm: 3, md: 4 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <JumpingCartAvatar />
            </Box>
            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              fontWeight={700}
              sx={{
                background:
                  'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
                letterSpacing: 1,
              }}
            >
              Forgot Password
            </Typography>
            <Typography
              variant={isMobile ? 'body2' : 'body1'}
              color='text.secondary'
              sx={{ fontWeight: 500 }}
            >
              Enter your email address and we'll send you instructions to reset
              your password
            </Typography>
          </Box>

          {/* Alerts */}
          {error && (
            <Fade in={true}>
              <Alert
                severity='error'
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  background:
                    'linear-gradient(90deg, #fff5f5 0%, #fed7d7 100%)',
                  color: '#c53030',
                  border: '1px solid #feb2b2',
                  '& .MuiAlert-icon': { color: '#c53030' },
                }}
              >
                {error}
              </Alert>
            </Fade>
          )}

          {success && (
            <Fade in={true}>
              <Alert
                severity='success'
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  background:
                    'linear-gradient(90deg, #f0fff4 0%, #c6f6d5 100%)',
                  color: '#22543d',
                  border: '1px solid #9ae6b4',
                  '& .MuiAlert-icon': { color: '#22543d' },
                }}
              >
                {success}
              </Alert>
            </Fade>
          )}

          {/* Form */}
          <Box component='form' onSubmit={handleSubmit} noValidate>
            <TextField
              label='Email Address'
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              onBlur={() => setTouched(true)}
              onKeyPress={handleKeyPress}
              fullWidth
              required
              margin='normal'
              error={!!error}
              helperText={error}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <EmailIcon sx={{ color: '#a3824c' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': { borderColor: '#a3824c' },
                  '&.Mui-focused fieldset': { borderColor: '#a3824c' },
                  '&.Mui-error fieldset': { borderColor: '#d32f2f' },
                },
                '& .MuiInputLabel-root': {
                  '&.Mui-focused': { color: '#a3824c' },
                  '&.Mui-error': { color: '#d32f2f' },
                },
                '& .MuiFormHelperText-root': {
                  '&.Mui-error': { color: '#d32f2f' },
                },
              }}
            />

            <Button
              type='submit'
              fullWidth
              disabled={loading || !!error}
              startIcon={
                loading ? (
                  <CircularProgress size={20} color='inherit' />
                ) : (
                  <SendIcon />
                )
              }
              sx={{
                mt: 3,
                mb: 2,
                py: { xs: 1.5, sm: 2 },
                fontWeight: 700,
                fontSize: { xs: '1rem', sm: '1.1rem' },
                borderRadius: 2,
                background:
                  'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
                color: '#fff',
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(163,130,76,0.3)',
                '&:hover': {
                  background:
                    'linear-gradient(90deg, #e6d897 0%, #a3824c 100%)',
                  color: '#000',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(163,130,76,0.4)',
                },
                '&:disabled': {
                  background: 'linear-gradient(90deg, #ccc 0%, #ddd 100%)',
                  color: '#666',
                  transform: 'none',
                  boxShadow: 'none',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {loading ? 'Sending...' : 'Send Reset Instructions'}
            </Button>

            <Divider
              sx={{ my: 3, '&::before, &::after': { borderColor: '#e6d897' } }}
            >
              <Typography variant='body2' color='text.secondary' sx={{ px: 2 }}>
                Remember your password?
              </Typography>
            </Divider>

            <Button
              component={Link}
              to='/login'
              fullWidth
              variant='outlined'
              disabled={loading}
              startIcon={<ArrowBackIcon />}
              sx={{
                py: { xs: 1.5, sm: 2 },
                fontWeight: 600,
                borderRadius: 2,
                borderColor: '#a3824c',
                color: '#a3824c',
                textTransform: 'none',
                fontSize: { xs: '0.9rem', sm: '1rem' },
                '&:hover': {
                  color: '#a3824c',
                  borderColor: '#e6d897',
                  backgroundColor: 'rgba(163,130,76,0.05)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(163,130,76,0.2)',
                },
                '&:disabled': {
                  borderColor: '#ccc',
                  color: '#999',
                  transform: 'none',
                  boxShadow: 'none',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Back to Sign In
            </Button>
          </Box>
        </Paper>
      </Slide>
    </Box>
  );
};

export default ForgotPassword;
