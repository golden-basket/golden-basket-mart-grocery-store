import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import Grid from '@mui/material/Grid';
import { useAuth } from '../hooks/useAuth';
import { useToastNotifications } from '../hooks/useToast';

const EditProfileDialog = ({ open, onClose, user, onSuccess, onError }) => {
  const { updateProfile } = useAuth();
  const { showSuccess, showError } = useToastNotifications();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && open) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
      });
      setErrors({});
    }
  }, [user, open]); // Reset when user changes or dialog opens

  // Don't render if user is not available
  if (!user) {
    return null;
  }

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (
      formData.phone &&
      !/^[+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))
    ) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await updateProfile(formData);
      showSuccess('Profile updated successfully!');
      onSuccess();
    } catch (error) {
      console.error('Profile update error:', error);
      showError('Failed to update profile. Please try again.');
      onError();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original user data
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
    setErrors({});
    onClose();
  };

  const getTextFieldStyles = fieldName => ({
    transition: 'all 0.3s ease',
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: errors[fieldName]
          ? 'var(--color-error)'
          : 'var(--color-primary-light)',
      },
      '&:hover fieldset': {
        borderColor: errors[fieldName]
          ? 'var(--color-error)'
          : 'var(--color-primary)',
      },
      '&.Mui-focused fieldset': {
        borderColor: errors[fieldName]
          ? 'var(--color-error)'
          : 'var(--color-primary-dark)',
      },
    },
    '& .MuiInputLabel-root': {
      color: errors[fieldName]
        ? 'var(--color-error)'
        : 'var(--color-primary-medium)',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: errors[fieldName]
        ? 'var(--color-error)'
        : 'var(--color-primary-dark)',
    },
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='md'
      fullWidth
      PaperProps={{
        sx: {
          background:
            'linear-gradient(135deg, var(--color-cream-light) 0%, var(--color-cream-medium) 100%)',
          border: '2px solid var(--color-primary-light)',
          borderRadius: 4,
          boxShadow: '0 12px 40px rgba(163, 130, 76, 0.2)',
          m: { xs: 2, sm: 3 },
        },
      }}
    >
      <DialogTitle
        sx={{
          background:
            'linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
          color: 'var(--color-cream-light)',
          fontWeight: 800,
          textAlign: 'center',
          borderBottom: '2px solid var(--color-primary-light)',
          fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
          py: { xs: 2, sm: 3 },
        }}
      >
        Edit Profile
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 4, pb: 2 }}>
          <Grid container spacing={4}>
            <Grid
              item
              span={{
                xs: 12,
                sm: 6,
              }}
            >
              <TextField
                fullWidth
                label='First Name'
                name='firstName'
                value={formData.firstName}
                onChange={handleInputChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
                required
                sx={getTextFieldStyles('firstName')}
                InputProps={{
                  startAdornment: (
                    <PersonIcon
                      sx={{
                        mr: 2,
                        color: 'var(--color-primary-medium)',
                        fontSize: '1.5rem',
                      }}
                    />
                  ),
                }}
                size='medium'
              />
            </Grid>

            <Grid
              item
              span={{
                xs: 12,
                sm: 6,
              }}
            >
              <TextField
                fullWidth
                label='Last Name'
                name='lastName'
                value={formData.lastName}
                onChange={handleInputChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
                required
                sx={getTextFieldStyles('lastName')}
                InputProps={{
                  startAdornment: (
                    <PersonIcon
                      sx={{
                        mr: 2,
                        color: 'var(--color-primary-medium)',
                        fontSize: '1.5rem',
                      }}
                    />
                  ),
                }}
                size='medium'
              />
            </Grid>

            <Grid item span={12}>
              <TextField
                fullWidth
                label='Email'
                name='email'
                type='email'
                value={formData.email}
                onChange={handleInputChange}
                error={!!errors.email}
                helperText={errors.email}
                required
                sx={getTextFieldStyles('email')}
                InputProps={{
                  startAdornment: (
                    <EmailIcon
                      sx={{
                        mr: 2,
                        color: 'var(--color-primary-medium)',
                        fontSize: '1.5rem',
                      }}
                    />
                  ),
                }}
                size='medium'
              />
            </Grid>

            <Grid item span={12}>
              <TextField
                fullWidth
                label='Phone'
                name='phone'
                value={formData.phone}
                onChange={handleInputChange}
                error={!!errors.phone}
                helperText={errors.phone}
                placeholder='+1 (555) 123-4567'
                sx={getTextFieldStyles('phone')}
                InputProps={{
                  startAdornment: (
                    <PhoneIcon
                      sx={{
                        mr: 2,
                        color: 'var(--color-primary-medium)',
                        fontSize: '1.5rem',
                      }}
                    />
                  ),
                }}
                size='medium'
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 4, gap: 3, justifyContent: 'center' }}>
          <Button
            variant='outlined'
            onClick={handleCancel}
            startIcon={<CancelIcon sx={{ fontSize: '1.25rem' }} />}
            disabled={isSubmitting}
            sx={{
              color: 'var(--color-primary-dark)',
              borderColor: 'var(--color-primary)',
              borderWidth: '2px',
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: 2,
              minWidth: 120,
              '&:hover': {
                borderColor: 'var(--color-primary-dark)',
                backgroundColor: 'var(--color-cream-light)',
                transform: 'translateY(-3px)',
                boxShadow: '0 6px 20px rgba(163, 130, 76, 0.3)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Cancel
          </Button>

          <Button
            type='submit'
            variant='contained'
            startIcon={
              isSubmitting ? (
                <CircularProgress size={15} />
              ) : (
                <SaveIcon sx={{ fontSize: '1.25rem' }} />
              )
            }
            disabled={isSubmitting}
            sx={{
              background:
                'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
              color: 'var(--color-cream-light)',
              border: '2px solid var(--color-primary-dark)',
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: 2,
              minWidth: 140,
              '&:hover': {
                background:
                  'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)',
                transform: 'translateY(-3px)',
                boxShadow: '0 8px 24px rgba(163, 130, 76, 0.5)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditProfileDialog;
