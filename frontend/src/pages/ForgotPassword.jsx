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
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 50%, ${theme.palette.action.hover} 100%)`,
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
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 50%, ${theme.palette.action.selected} 100%)`,
            border: `2px solid ${theme.palette.primary.light}`,
            boxShadow: `0 20px 40px ${theme.palette.primary.main}30`,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 50%, ${theme.palette.primary.dark} 100%)`,
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
                background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 50%, ${theme.palette.primary.dark} 100%)`,
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
                    <EmailIcon sx={{ color: theme.palette.primary.main }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                  '&.Mui-error fieldset': {
                    borderColor: theme.palette.error.main,
                  },
                },
                '& .MuiInputLabel-root': {
                  '&.Mui-focused': { color: theme.palette.primary.main },
                  '&.Mui-error': { color: theme.palette.error.main },
                },
                '& .MuiFormHelperText-root': {
                  '&.Mui-error': {
                    color: theme.palette.error.main,
                  },
                },
              }}
            />

            <Button
              type='submit'
              fullWidth
              disabled={loading || !!error || !email.trim() || !validateEmail(email)}
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
                background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 50%, ${theme.palette.primary.dark} 100%)`,
                color: theme.palette.primary.contrastText,
                textTransform: 'none',
                boxShadow: `0 4px 12px ${theme.palette.primary.main}50`,
                '&:hover': {
                  background: `linear-gradient(90deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                  color: theme.palette.primary.contrastText,
                  transform: 'translateY(-2px)',
                  boxShadow: `0 6px 20px ${theme.palette.primary.main}60`,
                },
                '&:disabled': {
                  background: `linear-gradient(90deg, ${theme.palette.grey[300]} 0%, ${theme.palette.grey[400]} 100%)`,
                  color: theme.palette.grey[600],
                  transform: 'none',
                  boxShadow: 'none',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {loading ? 'Sending...' : 'Send Reset Instructions'}
            </Button>

            <Divider
              sx={{
                my: 3,
                '&::before, &::after': {
                  borderColor: theme.palette.primary.light,
                },
              }}
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
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                textTransform: 'none',
                fontSize: { xs: '0.9rem', sm: '1rem' },
                '&:hover': {
                  color: theme.palette.primary.main,
                  borderColor: theme.palette.primary.light,
                  backgroundColor: `${theme.palette.primary.main}10`,
                  transform: 'translateY(-1px)',
                  boxShadow: `0 4px 12px ${theme.palette.primary.main}30`,
                },
                '&:disabled': {
                  borderColor: theme.palette.grey[400],
                  color: theme.palette.grey[500],
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
