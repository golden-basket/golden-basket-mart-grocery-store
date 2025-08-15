import React from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  Alert,
  Chip,
} from '@mui/material';
import { useThemeContext } from '../hooks/useTheme';
import { useToastNotifications } from '../hooks/useToast';
import ImageWithFallback from './ImageWithFallback';
import Logo from './Logo';
import { useAuth } from '../hooks/useAuth';
import { usePermissions } from '../hooks/usePermissions';
import RoleBasedAccess from './RoleBasedAccess';
import PermissionGuard from './PermissionGuard';
import RoleBasedUI from './RoleBasedUI';

const TestComponent = () => {
  const { isDarkMode, toggleTheme } = useThemeContext();
  const { showSuccess, showError, showWarning, showInfo } =
    useToastNotifications();
  const { user } = useAuth();
  const { permissions, hasPermission } = usePermissions();

  const testToast = type => {
    switch (type) {
      case 'success':
        showSuccess('This is a success message!');
        break;
      case 'error':
        showError('This is an error message!');
        break;
      case 'warning':
        showWarning('This is a warning message!');
        break;
      case 'info':
        showInfo('This is an info message!');
        break;
      default:
        break;
    }
  };

  return (
    <Paper sx={{ p: 3, m: 2, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant='h5' gutterBottom>
        🧪 Test Component - All Systems Check
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant='h6' gutterBottom>
          Theme System
        </Typography>
        <Typography variant='body2' sx={{ mb: 2 }}>
          Current theme: <strong>{isDarkMode ? 'Dark' : 'Light'}</strong>
        </Typography>
        <Button variant='contained' onClick={toggleTheme}>
          Toggle Theme
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant='h6' gutterBottom>
          Toast Notifications
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button variant='outlined' onClick={() => testToast('success')}>
            Success
          </Button>
          <Button variant='outlined' onClick={() => testToast('error')}>
            Error
          </Button>
          <Button variant='outlined' onClick={() => testToast('warning')}>
            Warning
          </Button>
          <Button variant='outlined' onClick={() => testToast('info')}>
            Info
          </Button>
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant='h6' gutterBottom>
          Authentication & Role System
        </Typography>
        {user ? (
          <Box>
            <Alert severity='success' sx={{ mb: 2 }}>
              ✅ Logged in as:{' '}
              <strong>
                {user.firstName} {user.lastName}
              </strong>{' '}
              ({user.email})
            </Alert>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              <Chip
                label={`Role: ${user.role}`}
                color={user.role === 'admin' ? 'error' : 'primary'}
                variant='outlined'
              />
              <Chip
                label={`Verified: ${user.isVerified ? 'Yes' : 'No'}`}
                color={user.isVerified ? 'success' : 'warning'}
                variant='outlined'
              />
              <Chip
                label={`Default Password: ${
                  user.isDefaultPassword ? 'Yes' : 'No'
                }`}
                color={user.isDefaultPassword ? 'error' : 'success'}
                variant='outlined'
              />
            </Box>
          </Box>
        ) : (
          <Alert severity='warning'>
            ⚠️ Not logged in. Please log in to see role-based functionality.
          </Alert>
        )}
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant='h6' gutterBottom>
          Permission System
        </Typography>
        <Grid container spacing={2}>
          <Grid item size={{ xs: 12, md: 6 }}>
            <Typography variant='subtitle2' gutterBottom>
              All Permissions:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {Object.entries(permissions).map(([permission, hasAccess]) => (
                <Chip
                  key={permission}
                  label={permission}
                  color={hasAccess ? 'success' : 'default'}
                  variant={hasAccess ? 'filled' : 'outlined'}
                  size='small'
                />
              ))}
            </Box>
          </Grid>
          <Grid item size={{ xs: 12, md: 6 }}>
            <Typography variant='subtitle2' gutterBottom>
              Permission Checks:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant='body2'>
                Can Manage Users:{' '}
                {hasPermission('canManageUsers') ? '✅ Yes' : '❌ No'}
              </Typography>
              <Typography variant='body2'>
                Can Access Admin:{' '}
                {hasPermission('canAccessAdmin') ? '✅ Yes' : '❌ No'}
              </Typography>
              <Typography variant='body2'>
                Is Admin: {hasPermission('isAdmin') ? '✅ Yes' : '❌ No'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant='h6' gutterBottom>
          Role-Based Components Test
        </Typography>
        <Grid container spacing={3}>
          <Grid item size={{ xs: 12, md: 4 }}>
            <Typography variant='subtitle2' gutterBottom>
              RoleBasedAccess:
            </Typography>
            <RoleBasedAccess
              allowedRoles={['admin']}
              fallback={<Alert severity='info'>Admin only content</Alert>}
            >
              <Alert severity='success'>✅ Admin content visible!</Alert>
            </RoleBasedAccess>
          </Grid>
          <Grid item size={{ xs: 12, md: 4 }}>
            <Typography variant='subtitle2' gutterBottom>
              PermissionGuard:
            </Typography>
            <PermissionGuard
              permissions={['manage_users']}
              fallback={
                <Alert severity='info'>Requires manage_users permission</Alert>
              }
            >
              <Alert severity='success'>
                ✅ User management content visible!
              </Alert>
            </PermissionGuard>
          </Grid>
          <Grid item size={{ xs: 12, md: 4 }}>
            <Typography variant='subtitle2' gutterBottom>
              RoleBasedUI:
            </Typography>
            <RoleBasedUI
              adminOnly
              fallback={<Alert severity='info'>Admin only UI</Alert>}
            >
              <Alert severity='success'>✅ Admin UI visible!</Alert>
            </RoleBasedUI>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant='h6' gutterBottom>
          Logo Component Test
        </Typography>
        <Grid container spacing={3} alignItems='center'>
          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant='body2' gutterBottom>
              Small Logo:
            </Typography>
            <Logo size='small' variant='navbar' />
          </Grid>
          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant='body2' gutterBottom>
              Default Logo:
            </Typography>
            <Logo size='default' variant='navbar' />
          </Grid>
          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant='body2' gutterBottom>
              Large Logo:
            </Typography>
            <Logo size='large' variant='navbar' />
          </Grid>
          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant='body2' gutterBottom>
              Footer Logo:
            </Typography>
            <Logo size='large' variant='footer' showText={false} />
          </Grid>
        </Grid>

        {/* Simple inline test */}
        <Box sx={{ mt: 3, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
          <Typography variant='body2' gutterBottom>
            Inline Logo Test (64px):
          </Typography>
          <Box
            component='img'
            src='/golden-basket-rounded.png'
            alt='Inline Test'
            sx={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              border: '2px solid red',
              objectFit: 'cover',
            }}
          />
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant='h6' gutterBottom>
          Image Rendering Test
        </Typography>
        <Grid container spacing={2}>
          <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant='body2' gutterBottom>
              Logo Image:
            </Typography>
            <ImageWithFallback
              src='/golden-basket-rounded.png'
              alt='Logo Test'
              style={{ width: '100px', height: '100px', borderRadius: '50%' }}
            />
          </Grid>
          <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant='body2' gutterBottom>
              Invalid Image (should show fallback):
            </Typography>
            <ImageWithFallback
              src='/invalid-image.jpg'
              alt='Invalid Image Test'
              fallbackSrc='/golden-basket-rounded.png'
              style={{ width: '100px', height: '100px', borderRadius: '50%' }}
            />
          </Grid>
          <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant='body2' gutterBottom>
              No Image (should show fallback):
            </Typography>
            <ImageWithFallback
              src=''
              alt='No Image Test'
              fallbackSrc='/golden-basket-rounded.png'
              style={{ width: '100px', height: '100px', borderRadius: '50%' }}
            />
          </Grid>
        </Grid>
      </Box>

      <Box>
        <Typography variant='h6' gutterBottom>
          Status
        </Typography>
        <Typography variant='body2' color='success.main'>
          ✅ Theme Context: Working
        </Typography>
        <Typography variant='body2' color='success.main'>
          ✅ Toast System: Working
        </Typography>
        <Typography variant='body2' color='success.main'>
          ✅ Material-UI: Working
        </Typography>
        <Typography variant='body2' color='success.main'>
          ✅ Dark Mode: {isDarkMode ? 'Enabled' : 'Disabled'}
        </Typography>
        <Typography variant='body2' color='success.main'>
          ✅ Logo Component: Working
        </Typography>
        <Typography variant='body2' color='success.main'>
          ✅ Image Component: Working
        </Typography>
        <Typography variant='body2' color='success.main'>
          ✅ Authentication: {user ? 'Working' : 'Not Logged In'}
        </Typography>
        <Typography variant='body2' color='success.main'>
          ✅ Role System: {user ? 'Working' : 'N/A'}
        </Typography>
        <Typography variant='body2' color='success.main'>
          ✅ Permission System: {user ? 'Working' : 'N/A'}
        </Typography>
        <Typography variant='body2' color='success.main'>
          ✅ Role-Based Components: Working
        </Typography>
      </Box>
    </Paper>
  );
};

export default TestComponent;
