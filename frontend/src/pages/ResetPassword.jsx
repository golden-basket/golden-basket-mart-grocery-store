import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  Fade,
  Slide,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Tooltip,
  Zoom,
  LinearProgress,
} from '@mui/material';
import {
  Lock,
  Visibility,
  VisibilityOff,
  Security,
  ArrowBack,
  CheckCircle,
} from '@mui/icons-material';
import JumpingCartAvatar from './JumpingCartAvatar';
import ApiService from '../services/api';
import { validatePassword } from '../utils/common';
import { useToastNotifications } from '../hooks/useToast';
import { ROUTES } from '../utils/routeConstants';

// Password strength indicator component (reused from Register)
const PasswordStrengthIndicator = ({ password }) => {
  const getPasswordStrength = password => {
    if (!password) return { score: 0, label: '', color: '#e0e0e0' };

    let score = 0;
    const feedback = [];

    if (password.length >= 8) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[!@#$%^&*]/.test(password)) score += 1;

    if (password.length < 8) feedback.push('At least 8 characters');
    if (!/[a-z]/.test(password)) feedback.push('Lowercase letter');
    if (!/[A-Z]/.test(password)) feedback.push('Uppercase letter');
    if (!/[0-9]/.test(password)) feedback.push('Number');
    if (!/[!@#$%^&*]/.test(password)) feedback.push('Special character');

    const colors = [
      '#e0e0e0',
      '#ff4444',
      '#ff8800',
      '#ffaa00',
      '#88cc00',
      '#44aa44',
    ];
    const labels = ['', 'Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

    return {
      score: Math.min(score, 5),
      label: labels[score],
      color: colors[score],
      feedback: feedback.length > 0 ? feedback : null,
    };
  };

  const strength = getPasswordStrength(password);
  const progress = (strength.score / 5) * 100;

  return (
    <Box sx={{ mt: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Security sx={{ fontSize: 16, color: strength.color }} />
        <Typography
          variant='caption'
          sx={{ color: strength.color, fontWeight: 600 }}
        >
          Password Strength: {strength.label}
        </Typography>
      </Box>
      <LinearProgress
        variant='determinate'
        value={progress}
        sx={{
          height: 4,
          borderRadius: 2,
          backgroundColor: '#e0e0e0',
          '& .MuiLinearProgress-bar': {
            backgroundColor: strength.color,
            borderRadius: 2,
          },
        }}
      />
      {strength.feedback && (
        <Typography
          variant='caption'
          sx={{ color: '#666', mt: 0.5, display: 'block' }}
        >
          Missing: {strength.feedback.join(', ')}
        </Typography>
      )}
    </Box>
  );
};

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { showSuccess, showError } = useToastNotifications();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState('');

  // Get token from URL params
  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (!tokenFromUrl) {
      showError(
        'Invalid or missing reset token. Please request a new password reset.'
      );
      setTimeout(() => navigate(ROUTES.FORGOT_PASSWORD), 3000);
      return;
    }
    setToken(tokenFromUrl);
  }, [searchParams, navigate, showError]);

  // Real-time validation
  useEffect(() => {
    const newErrors = {};

    if (touched.password && !formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (touched.password && !validatePassword(formData.password)) {
      newErrors.password = 'Password must meet requirements';
    }

    if (touched.confirmPassword && !formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (
      touched.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
  }, [formData, touched]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleBlur = fieldName => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must meet requirements';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!token) {
      showError('Invalid reset token. Please request a new password reset.');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccess('');

    try {
      const response = await ApiService.resetPassword(token, formData.password);

      const successMessage =
        response.message ||
        'Password reset successful! You can now log in with your new password.';

      showSuccess(successMessage);
      setSuccess(successMessage);

      // Auto-redirect to login after 3 seconds
      setTimeout(() => navigate(ROUTES.LOGIN), 3000);
    } catch (err) {
      console.error('ResetPassword: Password reset error:', err);
      console.error('ResetPassword: Error details:', {
        message: err.message,
        response: err.response,
        status: err.response?.status,
        data: err.response?.data,
      });

      const errorMessage =
        err.message || 'Password reset failed. Please try again.';

      showError(errorMessage);
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  if (!token) {
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
        <Paper
          elevation={24}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            width: { xs: '100%', sm: '95%', md: '80%', lg: '60%', xl: '50%' },
            maxWidth: 600,
            borderRadius: { xs: 2, sm: 3, md: 4 },
            background:
              'linear-gradient(135deg, #fff 0%, #fffbe6 50%, #f7ecd0 100%)',
            border: '2px solid #e6d897',
            boxShadow: '0 20px 40px rgba(163,130,76,0.2)',
            textAlign: 'center',
          }}
        >
          <CircularProgress size={60} sx={{ color: '#a3824c', mb: 2 }} />
          <Typography variant='h6' color='text.secondary'>
            Validating reset token...
          </Typography>
        </Paper>
      </Box>
    );
  }

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
      <Slide direction='up' in={true} timeout={400}>
        <Paper
          elevation={24}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            width: { xs: '100%', sm: '95%', md: '80%', lg: '60%', xl: '50%' },
            maxWidth: 600,
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
              Reset Your Password
            </Typography>
            <Typography
              variant={isMobile ? 'body2' : 'body1'}
              color='text.secondary'
              sx={{ fontWeight: 500 }}
            >
              Enter your new password to complete the reset process
            </Typography>
          </Box>

          {/* Alerts */}
          {errors.submit && (
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
                {errors.submit}
              </Alert>
            </Fade>
          )}

          {success && (
            <Fade in={true}>
              <Alert
                severity='success'
                icon={<CheckCircle />}
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

          {/* Reset Password Form */}
          <Box component='form' onSubmit={handleSubmit} noValidate>
            <TextField
              label='New Password'
              name='password'
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              onBlur={() => handleBlur('password')}
              onKeyPress={handleKeyPress}
              fullWidth
              required
              margin='normal'
              error={!!errors.password}
              helperText={
                errors.password ||
                'Min 8 chars, uppercase, lowercase, number, special char'
              }
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Lock sx={{ color: '#a3824c' }} />
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
                        sx={{ color: '#a3824c' }}
                        aria-label={
                          showPassword ? 'Hide password' : 'Show password'
                        }
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </Tooltip>
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
                  color: errors.password ? '#d32f2f' : '#a3824c',
                  fontSize: '0.8rem',
                },
              }}
            />

            {/* Password Strength Indicator */}
            {formData.password && (
              <PasswordStrengthIndicator password={formData.password} />
            )}

            <TextField
              label='Confirm New Password'
              name='confirmPassword'
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={() => handleBlur('confirmPassword')}
              onKeyPress={handleKeyPress}
              fullWidth
              required
              margin='normal'
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Lock sx={{ color: '#a3824c' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position='end'>
                    <Tooltip
                      title={
                        showConfirmPassword ? 'Hide password' : 'Show password'
                      }
                      TransitionComponent={Zoom}
                    >
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge='end'
                        disabled={loading}
                        sx={{ color: '#a3824c' }}
                        aria-label={
                          showConfirmPassword
                            ? 'Hide password'
                            : 'Show password'
                        }
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </Tooltip>
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
              disabled={loading}
              startIcon={
                loading ? (
                  <CircularProgress size={20} color='inherit' />
                ) : (
                  <Security />
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
                  background:
                    'linear-gradient(90deg, #f5f5f5 0%, #e0e0e0 100%)',
                  color: '#999',
                  borderColor: '#ccc',
                  transform: 'none',
                  boxShadow: 'none',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
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
              to={ROUTES.LOGIN}
              fullWidth
              variant='outlined'
              disabled={loading}
              startIcon={<ArrowBack />}
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
              Back to Login
            </Button>
          </Box>
        </Paper>
      </Slide>
    </Box>
  );
};

export default ResetPassword;
