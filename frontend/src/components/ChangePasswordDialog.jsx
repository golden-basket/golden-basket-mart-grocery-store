import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockIcon from '@mui/icons-material/Lock';
import CloseIcon from '@mui/icons-material/Close';
import Loading from './Loading';
import { useAuth } from '../hooks/useAuth';
import ApiService from '../services/api';
import { useTheme } from '@mui/material/styles';

const ChangePasswordDialog = ({ open, onClose, onSuccess, onError }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const theme = useTheme();

  const handleInputChange = field => event => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
    // Clear error when user starts typing
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

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters long';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword =
        'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await ApiService.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      onSuccess('Password changed successfully!');
      handleClose();
    } catch (error) {
      console.error('Error changing password:', error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        'Failed to change password. Please try again.';
      onError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setErrors({});
    setShowPasswords({
      currentPassword: false,
      newPassword: false,
      confirmPassword: false,
    });
    onClose();
  };

  if (!user) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth='sm'
      fullWidth
      slotProps={{
        paper: {
          sx: {
            boxShadow: theme.shadows[12],
            m: { xs: 2, sm: 4 },
            background: theme.palette.background.paper,
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: theme.palette.primary.contrastText,
          fontWeight: 800,
          fontSize: { xs: '1.25rem', sm: '1.5rem' },
          py: { xs: 2, sm: 3 },
          textAlign: 'center',
          borderBottom: `3px solid ${theme.palette.primary.light}`,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          <LockIcon sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem' } }} />
          Change Password
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 4, pb: 2, px: { xs: 3, sm: 4 } }}>
        {isSubmitting ? (
          <Loading size='small' variant='default' />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Current Password */}
            <TextField
              label='Current Password'
              type={showPasswords.currentPassword ? 'text' : 'password'}
              value={formData.currentPassword}
              onChange={handleInputChange('currentPassword')}
              error={!!errors.currentPassword}
              helperText={errors.currentPassword}
              fullWidth
              required
              margin='normal'
              slotProps={{
                input: {
                  startAdornment: (
                    <LockIcon
                      sx={{
                        color: errors.currentPassword
                          ? theme.palette.error.main
                          : theme.palette.primary.main,
                      }}
                    />
                  ),
                  endAdornment: (
                    <IconButton
                      onClick={() =>
                        togglePasswordVisibility('currentPassword')
                      }
                      edge='end'
                    >
                      {showPasswords.currentPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  ),
                },
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
                  '&.Mui-error': { color: theme.palette.error.main },
                },
                '& .MuiFormHelperText-root': {
                  '&.Mui-error': {
                    color: theme.palette.error.main,
                  },
                },
              }}
            />

            {/* New Password */}
            <TextField
              label='New Password'
              type={showPasswords.newPassword ? 'text' : 'password'}
              value={formData.newPassword}
              onChange={handleInputChange('newPassword')}
              error={!!errors.newPassword}
              helperText={errors.newPassword || 'Minimum 6 characters'}
              fullWidth
              required
              margin='normal'
              slotProps={{
                input: {
                  startAdornment: (
                    <LockIcon
                      sx={{
                        color: errors.newPassword
                          ? theme.palette.error.main
                          : theme.palette.primary.main,
                      }}
                    />
                  ),
                  endAdornment: (
                    <IconButton
                      onClick={() => togglePasswordVisibility('newPassword')}
                      edge='end'
                    >
                      {showPasswords.newPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  ),
                },
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
                  '&.Mui-error': { color: theme.palette.error.main },
                },
                '& .MuiFormHelperText-root': {
                  '&.Mui-error': {
                    color: theme.palette.error.main,
                  },
                },
              }}
            />

            {/* Confirm New Password */}
            <TextField
              label='Confirm New Password'
              type={showPasswords.confirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              fullWidth
              required
              margin='normal'
              slotProps={{
                input: {
                  startAdornment: (
                    <LockIcon
                      sx={{
                        color: errors.confirmPassword
                          ? theme.palette.error.main
                          : theme.palette.primary.main,
                      }}
                    />
                  ),
                  endAdornment: (
                    <IconButton
                      onClick={() =>
                        togglePasswordVisibility('confirmPassword')
                      }
                      edge='end'
                    >
                      {showPasswords.confirmPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  ),
                },
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
                  '&.Mui-error': { color: theme.palette.error.main },
                },
                '& .MuiFormHelperText-root': {
                  '&.Mui-error': {
                    color: theme.palette.error.main,
                  },
                },
              }}
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 4, gap: 3, justifyContent: 'center' }}>
        <Button
          onClick={handleClose}
          variant='outlined'
          startIcon={<CloseIcon />}
          sx={{
            color: theme.palette.text.secondary,
            borderColor: theme.palette.primary.light,
            borderWidth: '2px',
            px: 4,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 600,
            borderRadius: 2,
            minWidth: 120,
            '&:hover': {
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.dark,
              backgroundColor: theme.palette.background.default,
              transform: 'translateY(-2px)',
              boxShadow: theme.shadows[4],
            },
            transition: 'all 0.3s ease',
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={handleSubmit}
          variant='contained'
          disabled={isSubmitting}
          startIcon={<LockIcon />}
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: theme.palette.primary.contrastText,
            borderWidth: '2px',
            px: 4,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 600,
            borderRadius: 2,
            minWidth: 120,
            '&:hover': {
              background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
              transform: 'translateY(-2px)',
              boxShadow: theme.shadows[6],
            },
            '&:disabled': {
              background: theme.palette.action.disabledBackground,
              color: theme.palette.action.disabled,
              transform: 'none',
              boxShadow: 'none',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Change Password
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ChangePasswordDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
};

export default ChangePasswordDialog;
