import React, { useState } from 'react';
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

  const handleInputChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
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
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: '0 12px 40px rgba(163, 130, 76, 0.15)',
          m: { xs: 2, sm: 4 },
          border: '2px solid var(--color-primary-light)',
          background:
            'linear-gradient(135deg, var(--color-cream-light) 0%, var(--color-cream-medium) 100%)',
        },
      }}
    >
      <DialogTitle
        sx={{
          background:
            'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
          color: 'white',
          fontWeight: 800,
          fontSize: { xs: '1.25rem', sm: '1.5rem' },
          py: { xs: 2, sm: 3 },
          textAlign: 'center',
          borderBottom: '3px solid var(--color-primary-light)',
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
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body2"
            sx={{
              color: 'var(--color-text-secondary)',
              textAlign: 'center',
              mb: 3,
              fontSize: { xs: '0.9rem', sm: '1rem' },
              lineHeight: 1.6,
            }}
          >
            Enter your current password and choose a new one to update your
            account security.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Current Password */}
          <TextField
            label="Current Password"
            type={showPasswords.currentPassword ? 'text' : 'password'}
            value={formData.currentPassword}
            onChange={handleInputChange('currentPassword')}
            error={!!errors.currentPassword}
            helperText={errors.currentPassword}
            FormHelperTextProps={{
              sx: {
                color: errors.currentPassword
                  ? 'var(--color-error)'
                  : 'var(--color-text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 500,
              },
            }}
            fullWidth
            size="medium"
            InputProps={{
              startAdornment: (
                <LockIcon
                  sx={{
                    mr: 2,
                    color: 'var(--color-primary)',
                    fontSize: '1.5rem',
                  }}
                />
              ),
              endAdornment: (
                <IconButton
                  onClick={() => togglePasswordVisibility('currentPassword')}
                  edge="end"
                  sx={{ mr: 1 }}
                >
                  {showPasswords.currentPassword ? (
                    <VisibilityOffIcon />
                  ) : (
                    <VisibilityIcon />
                  )}
                </IconButton>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                border: '1px solid rgba(163, 130, 76, 0.2)',
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--color-primary)',
                  borderWidth: '2px',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--color-primary)',
                  borderWidth: '2px',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'var(--color-text-secondary)',
                fontWeight: 500,
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'var(--color-primary)',
                fontWeight: 600,
              },
            }}
          />

          {/* New Password */}
          <TextField
            label="New Password"
            type={showPasswords.newPassword ? 'text' : 'password'}
            value={formData.newPassword}
            onChange={handleInputChange('newPassword')}
            error={!!errors.newPassword}
            helperText={errors.newPassword || 'Minimum 6 characters'}
            FormHelperTextProps={{
              sx: {
                color: errors.newPassword
                  ? 'var(--color-error)'
                  : 'var(--color-text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 500,
              },
            }}
            fullWidth
            size="medium"
            InputProps={{
              startAdornment: (
                <LockIcon
                  sx={{
                    mr: 2,
                    color: 'var(--color-primary)',
                    fontSize: '1.5rem',
                  }}
                />
              ),
              endAdornment: (
                <IconButton
                  onClick={() => togglePasswordVisibility('newPassword')}
                  edge="end"
                  sx={{ mr: 1 }}
                >
                  {showPasswords.newPassword ? (
                    <VisibilityOffIcon />
                  ) : (
                    <VisibilityIcon />
                  )}
                </IconButton>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                border: '1px solid rgba(163, 130, 76, 0.2)',
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--color-primary)',
                  borderWidth: '2px',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--color-primary)',
                  borderWidth: '2px',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'var(--color-text-secondary)',
                fontWeight: 500,
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'var(--color-primary)',
                fontWeight: 600,
              },
            }}
          />

          {/* Confirm New Password */}
          <TextField
            label="Confirm New Password"
            type={showPasswords.confirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleInputChange('confirmPassword')}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            FormHelperTextProps={{
              sx: {
                color: errors.confirmPassword
                  ? 'var(--color-error)'
                  : 'var(--color-text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 500,
              },
            }}
            fullWidth
            size="medium"
            InputProps={{
              startAdornment: (
                <LockIcon
                  sx={{
                    mr: 2,
                    color: 'var(--color-primary)',
                    fontSize: '1.5rem',
                  }}
                />
              ),
              endAdornment: (
                <IconButton
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                  edge="end"
                  sx={{ mr: 1 }}
                >
                  {showPasswords.confirmPassword ? (
                    <VisibilityOffIcon />
                  ) : (
                    <VisibilityIcon />
                  )}
                </IconButton>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                border: '1px solid rgba(163, 130, 76, 0.2)',
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--color-primary)',
                  borderWidth: '2px',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--color-primary)',
                  borderWidth: '2px',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'var(--color-text-secondary)',
                fontWeight: 500,
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'var(--color-primary)',
                fontWeight: 600,
              },
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 4, gap: 3, justifyContent: 'center' }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          startIcon={<CloseIcon />}
          sx={{
            color: 'var(--color-text-secondary)',
            borderColor: 'var(--color-primary-light)',
            borderWidth: '2px',
            px: 4,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 600,
            borderRadius: 2,
            minWidth: 120,
            '&:hover': {
              borderColor: 'var(--color-primary)',
              color: 'var(--color-primary-dark)',
              backgroundColor: 'var(--color-cream-light)',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 16px rgba(163, 130, 76, 0.2)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <Loading /> : <LockIcon />}
          sx={{
            background:
              'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
            color: 'white',
            borderWidth: '2px',
            px: 4,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 600,
            borderRadius: 2,
            minWidth: 120,
            '&:hover': {
              background:
                'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 24px rgba(163, 130, 76, 0.3)',
            },
            '&:disabled': {
              background: 'linear-gradient(90deg, #f5f5f5 0%, #e0e0e0 100%)',
              color: '#999',
              borderColor: '#ccc',
              transform: 'none',
              boxShadow: 'none',
            },
            transition: 'all 0.3s ease',
          }}
        >
          {isSubmitting ? 'Changing...' : 'Change Password'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangePasswordDialog;
