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
  IconButton,
  Divider,
  Fade,
  Slide,
  Grid,
  LinearProgress,
  useTheme,
  useMediaQuery,
  Tooltip,
  Zoom,
  CircularProgress,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SecurityIcon from '@mui/icons-material/Security';
import JumpingCartAvatar from './JumpingCartAvatar';
import ApiService from '../services/api';
import { validateEmail, validatePassword } from '../utils/common';
import { useToastNotifications } from '../hooks/useToast';
import { ROUTES } from '../utils/routeConstants';

// Password strength indicator component
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
        <SecurityIcon sx={{ fontSize: 16, color: strength.color }} />
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

const Register = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { showSuccess, showError } = useToastNotifications();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Real-time validation
  useEffect(() => {
    const newErrors = {};

    if (touched.firstName && !formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (touched.firstName && formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (touched.lastName && !formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (touched.lastName && formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    if (touched.email && !formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (touched.email && !validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

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

    // Mark field as touched
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleBlur = fieldName => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

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

  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    setTouched({});
    setErrors({});
    setSuccess('');
    setLoading(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccess('');

    try {
      const res = await ApiService.register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      // Show success message
      const successMessage =
        res.message ||
        'Registration successful! Please check your email to verify your account.';

      showSuccess(successMessage);

      // Set success state for UI
      setSuccess(successMessage);

      // Clear Form Data
      handleReset();

      // Auto-redirect after 3 seconds
      setTimeout(() => navigate(ROUTES.LOGIN), 3000);
    } catch (err) {
      console.error('Register: Registration error:', err);
      console.error('Register: Error details:', {
        message: err.message,
        response: err.response,
        status: err.response?.status,
        data: err.response?.data,
      });

      // Show error toast
      const errorMessage =
        err.message || 'Registration failed. Please try again.';

      showError(errorMessage);

      // Clear any previous inline errors and success state
      setErrors({});
      setSuccess('');
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
              Join Golden Basket Mart
            </Typography>
            <Typography
              variant={isMobile ? 'body2' : 'body1'}
              color='text.secondary'
              sx={{ fontWeight: 500 }}
            >
              Create your account and start shopping fresh groceries
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

          {/* Registration Form */}
          <Box
            component='form'
            onSubmit={handleSubmit}
            onReset={handleReset}
            noValidate
          >
            <Grid container spacing={2}>
              <Grid item size={{ xs: 12, sm: 6 }}>
                <TextField
                  label='First Name'
                  name='firstName'
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={() => handleBlur('firstName')}
                  onKeyPress={handleKeyPress}
                  fullWidth
                  required
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <PersonIcon sx={{ color: '#a3824c' }} />
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
              </Grid>
              <Grid item size={{ xs: 12, sm: 6 }}>
                <TextField
                  label='Last Name'
                  name='lastName'
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={() => handleBlur('lastName')}
                  onKeyPress={handleKeyPress}
                  fullWidth
                  required
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <PersonIcon sx={{ color: '#a3824c' }} />
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
              </Grid>
            </Grid>

            <TextField
              label='Email Address'
              name='email'
              type='email'
              value={formData.email}
              onChange={handleChange}
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

            <TextField
              label='Password'
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
                    <LockIcon sx={{ color: '#a3824c' }} />
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
              label='Confirm Password'
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
                    <LockIcon sx={{ color: '#a3824c' }} />
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
                  <PersonAddIcon />
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
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <Divider
              sx={{ my: 3, '&::before, &::after': { borderColor: '#e6d897' } }}
            >
              <Typography variant='body2' color='text.secondary' sx={{ px: 2 }}>
                Already have an account?
              </Typography>
            </Divider>

            <Button
              component={Link}
              to={ROUTES.LOGIN}
              fullWidth
              variant='outlined'
              disabled={loading}
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
              Sign In Instead
            </Button>
          </Box>
        </Paper>
      </Slide>
    </Box>
  );
};

export default Register;
