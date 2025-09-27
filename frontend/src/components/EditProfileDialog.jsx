import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
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
import { useTheme } from '@mui/material/styles';

const EditProfileDialog = ({ open, onClose, user, onSuccess, onError }) => {
  const { updateProfile } = useAuth();
  const { showSuccess, showError } = useToastNotifications();
  const theme = useTheme();

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

  const getTextFieldStyles = () => ({
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
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='md'
      fullWidth
      slotProps={{
        paper: {
          sx: {
            background: theme.palette.background.paper,
            boxShadow: theme.shadows[12],
            m: { xs: 2, sm: 3 },
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
          color: theme.palette.primary.contrastText,
          fontWeight: 800,
          textAlign: 'center',
          borderBottom: `2px solid ${theme.palette.primary.light}`,
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
              size={{
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
                margin='normal'
                sx={getTextFieldStyles()}
                slotProps={{
                  input: {
                    startAdornment: (
                      <PersonIcon
                        sx={{
                          color: errors.firstName
                            ? theme.palette.error.main
                            : theme.palette.primary.main,
                        }}
                      />
                    ),
                  },
                }}
              />
            </Grid>

            <Grid
              size={{
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
                margin='normal'
                sx={getTextFieldStyles()}
                slotProps={{
                  input: {
                    startAdornment: (
                      <PersonIcon
                        sx={{
                          color: errors.lastName
                            ? theme.palette.error.main
                            : theme.palette.primary.main,
                        }}
                      />
                    ),
                  },
                }}
              />
            </Grid>

            <Grid size={12}>
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
                margin='normal'
                sx={getTextFieldStyles()}
                slotProps={{
                  input: {
                    startAdornment: (
                      <EmailIcon
                        sx={{
                          color: errors.email
                            ? theme.palette.error.main
                            : theme.palette.primary.main,
                        }}
                      />
                    ),
                  },
                }}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label='Phone'
                name='phone'
                value={formData.phone}
                onChange={handleInputChange}
                error={!!errors.phone}
                helperText={errors.phone}
                placeholder='+1 (555) 123-4567'
                margin='normal'
                sx={getTextFieldStyles()}
                slotProps={{
                  input: {
                    startAdornment: (
                      <PhoneIcon
                        sx={{
                          color: errors.phone
                            ? theme.palette.error.main
                            : theme.palette.primary.main,
                        }}
                      />
                    ),
                  },
                }}
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
              color: theme.palette.primary.dark,
              borderColor: theme.palette.primary.main,
              borderWidth: '2px',
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: 2,
              minWidth: 120,
              '&:hover': {
                borderColor: theme.palette.primary.dark,
                backgroundColor: theme.palette.action.hover,
                transform: 'translateY(-3px)',
                boxShadow: theme.shadows[6],
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
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
              color: theme.palette.primary.contrastText,
              border: `2px solid ${theme.palette.primary.dark}`,
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: 2,
              minWidth: 140,
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                transform: 'translateY(-3px)',
                boxShadow: theme.shadows[8],
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

EditProfileDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.object,
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
};

export default EditProfileDialog;
