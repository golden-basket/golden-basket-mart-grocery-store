import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import ApiService from '../services/api';
import { useToastNotifications } from '../hooks/useToast';

const ChangePassword = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showSuccess, showError } = useToastNotifications();

  // Check if user has temporary authentication
  useEffect(() => {
    const tempUser = localStorage.getItem('tempUser');
    const tempToken = localStorage.getItem('tempToken');

    if (!tempUser || !tempToken) {
      // No temporary auth, redirect to login
      navigate('/login');
      return;
    }

    // Set the temporary token for API calls
    localStorage.setItem('token', tempToken);
  }, [navigate]);

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = field => event => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));

    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const togglePasswordVisibility = field => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'New password must be at least 8 characters long';
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(
        formData.newPassword
      )
    ) {
      newErrors.newPassword =
        'Password must include uppercase, lowercase, number, and special character';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async event => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await ApiService.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      showSuccess(
        'Password changed successfully! Completing authentication...'
      );

      // Clear form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      // Get temporary user data and complete authentication
      const tempUser = JSON.parse(localStorage.getItem('tempUser'));
      const tempToken = localStorage.getItem('tempToken');

      // Update user object to reflect password change
      const updatedUser = { ...tempUser, isDefaultPassword: false };

      // Complete the login process
      login(updatedUser, tempToken);

      // Clean up temporary data
      localStorage.removeItem('tempUser');
      localStorage.removeItem('tempToken');

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      showError(
        error.message || 'Failed to change password. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerStyles = {
    mt: isMobile ? 2 : 4,
    mb: isMobile ? 2 : 4,
    px: isMobile ? 2 : 4,
    py: isMobile ? 3 : 5,
    background:
      'linear-gradient(135deg, #fffbe6 0%, #f7e7c1 50%, #fffbe6 100%)',
    borderRadius: isMobile ? 2 : 3,
    boxShadow: '0 4px 20px 0 rgba(163,130,76,0.15)',
    border: '1px solid #e6d897',
  };

  const paperStyles = {
    background: 'linear-gradient(135deg, #fffbe6 0%, #f7e7c4 100%)',
    borderRadius: isMobile ? 2 : 3,
    p: isMobile ? 3 : 4,
    border: '2px solid #e6d897',
    boxShadow: '0 6px 24px 0 rgba(163,130,76,0.15)',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background:
        'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
      borderRadius: isMobile ? '8px 8px 0 0' : '12px 12px 0 0',
    },
  };

  const buttonStyles = {
    fontWeight: 700,
    background:
      'linear-gradient(135deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
    color: '#fff',
    textTransform: 'none',
    boxShadow: '0 4px 12px rgba(163,130,76,0.3)',
    borderRadius: isMobile ? 1 : 2,
    py: isMobile ? 1.5 : 2,
    px: isMobile ? 4 : 6,
    fontSize: isMobile ? '1rem' : '1.1rem',
    '&:hover': {
      background: 'linear-gradient(135deg, #e6d897 0%, #a3824c 100%)',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(163,130,76,0.4)',
    },
    transition: 'all 0.3s ease',
    '&:disabled': {
      background: 'linear-gradient(90deg, #f5f5f5 0%, #e0e0e0 100%)',
      color: '#999',
      borderColor: '#ccc',
      transform: 'none',
      boxShadow: 'none',
    },
  };

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
      borderRadius: isMobile ? 1 : 2,
      boxShadow: '0 1px 4px 0 rgba(163,130,76,0.07)',
      '&:hover fieldset': { borderColor: '#a3824c' },
      '&.Mui-focused fieldset': { borderColor: '#a3824c' },
      '&.Mui-error fieldset': { borderColor: '#f44336' },
    },
    '& .MuiInputLabel-root': {
      color: '#a3824c',
      fontWeight: 500,
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#a3824c',
    },
  };

  return (
    <Container maxWidth='sm' sx={containerStyles}>
      <Paper sx={paperStyles}>
        <Box textAlign='center' mb={4}>
          <LockIcon
            sx={{
              fontSize: isMobile ? 48 : 64,
              color: '#a3824c',
              mb: 2,
            }}
          />
          <Typography
            variant={isMobile ? 'h5' : 'h4'}
            sx={{
              background:
                'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
              mb: 1,
            }}
          >
            Change Password
          </Typography>
          <Typography
            variant='body1'
            color='#b59961'
            sx={{ maxWidth: 400, mx: 'auto' }}
          >
            Please change your default password to secure your account
          </Typography>
        </Box>

        <Box component='form' onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label='Current Password'
              type={showPasswords.current ? 'text' : 'password'}
              value={formData.currentPassword}
              onChange={handleInputChange('currentPassword')}
              error={!!errors.currentPassword}
              helperText={errors.currentPassword}
              fullWidth
              required
              sx={inputStyles}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={() => togglePasswordVisibility('current')}
                      edge='end'
                    >
                      {showPasswords.current ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label='New Password'
              type={showPasswords.new ? 'text' : 'password'}
              value={formData.newPassword}
              onChange={handleInputChange('newPassword')}
              error={!!errors.newPassword}
              helperText={
                errors.newPassword ||
                'Must be at least 8 characters with uppercase, lowercase, number, and special character'
              }
              fullWidth
              required
              sx={inputStyles}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={() => togglePasswordVisibility('new')}
                      edge='end'
                    >
                      {showPasswords.new ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label='Confirm New Password'
              type={showPasswords.confirm ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              fullWidth
              required
              sx={inputStyles}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={() => togglePasswordVisibility('confirm')}
                      edge='end'
                    >
                      {showPasswords.confirm ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type='submit'
              variant='contained'
              disabled={isSubmitting}
              sx={buttonStyles}
              fullWidth
            >
              {isSubmitting ? 'Changing Password...' : 'Change Password'}
            </Button>
          </Stack>
        </Box>

        <Box textAlign='center' mt={3}>
          <Typography variant='body2' color='#b59961'>
            After changing your password, you'll be redirected to the dashboard
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default ChangePassword;
