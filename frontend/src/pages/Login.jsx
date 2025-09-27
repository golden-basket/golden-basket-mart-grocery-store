import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  Slide,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Tooltip,
  Zoom,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
import RememberMeIcon from '@mui/icons-material/RememberMe';
import JumpingCartAvatar from './JumpingCartAvatar';
import ApiService from '../services/api';
import { validateEmail } from '../utils/common';
import { useToastNotifications } from '../hooks/useToast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { showSuccess, showError, showInfo } = useToastNotifications();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

  // Real-time validation
  useEffect(() => {
    const newErrors = {};

    if (touched.email && !formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (touched.email && !validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (touched.password && !formData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
  }, [formData, touched]);

  const handleInputChange = e => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rememberMe' ? checked : value,
    }));

    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));
  };

  const handleBlur = fieldName => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: true,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setAttemptCount(prev => prev + 1);

    try {
      const res = await ApiService.login({
        email: formData.email.trim(),
        password: formData.password,
      });

      const user = res.user;
      const authToken = res.token;

      if (!user || !authToken) {
        throw new Error('Invalid response from server');
      }

      // Check if user has a default password and redirect accordingly
      if (user.isDefaultPassword) {
        // Store user and token temporarily for password change
        localStorage.setItem('tempUser', JSON.stringify(user));
        localStorage.setItem('tempToken', authToken);
        showInfo('Please change your default password');
        navigate('/change-password');
      } else {
        // Normal login flow
        login(user, authToken);

        // Handle remember me functionality
        if (formData.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('rememberMe');
        }

        showSuccess('Login successful! Welcome back!');
        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);

      // Show error toast
      showError(err.message || 'Login failed. Please try again.');

      // Clear any previous inline errors
      setErrors({});
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
              Welcome Back
            </Typography>
            <Typography
              variant={isMobile ? 'body2' : 'body1'}
              color='text.secondary'
              sx={{ fontWeight: 500 }}
            >
              Sign in to your Golden Basket Mart account
            </Typography>
          </Box>

          {/* Login Form */}
          <Box component='form' onSubmit={handleSubmit} noValidate>
            <TextField
              label='Email Address'
              name='email'
              type='email'
              value={formData.email}
              onChange={handleInputChange}
              onBlur={() => handleBlur('email')}
              onKeyPress={handleKeyPress}
              fullWidth
              required
              margin='normal'
              error={!!errors.email}
              helperText={errors.email}
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
                    borderWidth: '2px',
                  },
                },
                '& .MuiInputLabel-root': {
                  '&.Mui-focused': { color: theme.palette.primary.main },
                  '&.Mui-error': { color: theme.palette.primary.main },
                },
                '& .MuiFormHelperText-root': {
                  '&.Mui-error': {
                    color: theme.palette.error.main,
                  },
                },
              }}
            />

            <TextField
              label='Password'
              name='password'
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange}
              onBlur={() => handleBlur('password')}
              onKeyPress={handleKeyPress}
              fullWidth
              required
              margin='normal'
              error={!!errors.password}
              helperText={errors.password}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <LockIcon sx={{ color: theme.palette.primary.main }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position='end'>
                    <Tooltip
                      title={showPassword ? 'Hide password' : 'Show password'}
                      TransitionComponent={Zoom}
                    >
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge='end'
                        disabled={loading}
                        sx={{ color: theme.palette.primary.main }}
                        aria-label={
                          showPassword ? 'Hide password' : 'Show password'
                        }
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </Tooltip>
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
                    borderWidth: '2px',
                  },
                },
                '& .MuiInputLabel-root': {
                  '&.Mui-focused': { color: theme.palette.primary.main },
                  '&.Mui-error': { color: theme.palette.primary.main },
                },
                '& .MuiFormHelperText-root': {
                  color: theme.palette.error.main,
                },
              }}
            />

            {/* Remember Me Checkbox */}
            <Box
              sx={{
                mt: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    name='rememberMe'
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    disabled={loading}
                    sx={{
                      color: theme.palette.primary.main,
                      '&.Mui-checked': { color: theme.palette.primary.main },
                    }}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <RememberMeIcon
                      sx={{ fontSize: 16, color: theme.palette.primary.main }}
                    />
                    <Typography
                      variant='body2'
                      sx={{ color: theme.palette.text.secondary }}
                    >
                      Remember me
                    </Typography>
                  </Box>
                }
              />

              <Tooltip
                title='Contact support if you forgot your password'
                TransitionComponent={Zoom}
              >
                <Button
                  component={Link}
                  to='/forgot-password'
                  disabled={loading}
                  sx={{
                    textTransform: 'none',
                    color: theme.palette.primary.main,
                    fontSize: '0.875rem',
                    '&:hover': {
                      color: theme.palette.primary.dark,
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Forgot Password?
                </Button>
              </Tooltip>
            </Box>

            <Button
              type='submit'
              fullWidth
              disabled={loading || attemptCount >= 5}
              startIcon={
                loading ? (
                  <CircularProgress size={20} color='inherit' />
                ) : (
                  <LoginIcon />
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
              {loading ? 'Signing In...' : 'Sign In'}
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
                New to Golden Basket Mart?
              </Typography>
            </Divider>

            <Button
              component={Link}
              to='/register'
              fullWidth
              variant='outlined'
              disabled={loading}
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
              Create New Account
            </Button>
          </Box>
        </Paper>
      </Slide>
    </Box>
  );
};

export default Login;
