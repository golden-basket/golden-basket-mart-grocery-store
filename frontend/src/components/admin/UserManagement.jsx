import { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Stack,
  Chip,
  Select,
  MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { createAdminStyles } from './adminStyles';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useToastNotifications } from '../../hooks/useToast';
import PropTypes from 'prop-types';

const UserManagement = ({ users, onUserUpdate }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const { showSuccess, showError } = useToastNotifications();

  // User state
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [userDialogMode, setUserDialogMode] = useState('add');
  const [editUser, setEditUser] = useState(null);
  const [userDialogForm, setUserDialogForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'user',
  });

  // Get styles from shared utility
  const styles = useMemo(
    () => createAdminStyles(isMobile, theme),
    [isMobile, theme]
  );

  // User handlers
  const handleUserDialogOpen = useCallback((mode, user = null) => {
    setUserDialogMode(mode);
    setEditUser(user);
    setUserDialogForm(
      user
        ? {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
          }
        : {
            firstName: '',
            lastName: '',
            email: '',
            role: 'user',
          }
    );
    setUserDialogOpen(true);
  }, []);

  const handleUserDialogClose = useCallback(() => {
    setUserDialogOpen(false);
    setEditUser(null);
    setUserDialogMode('add');
  }, []);

  const handleUserDialogSave = useCallback(() => {
    try {
      onUserUpdate(userDialogMode, userDialogForm, editUser?._id);
      showSuccess(
        userDialogMode === 'add'
          ? 'User added successfully!'
          : 'User updated successfully!'
      );
      handleUserDialogClose();
    } catch (error) {
      console.error('Failed to save user:', error);
      showError(
        userDialogMode === 'add'
          ? 'Failed to add user. Please try again.'
          : 'Failed to update user. Please try again.'
      );
    }
  }, [
    userDialogMode,
    userDialogForm,
    editUser,
    handleUserDialogClose,
    onUserUpdate,
    showSuccess,
    showError,
  ]);

  const handleDeleteUser = useCallback(
    id => {
      try {
        onUserUpdate('delete', null, id);
        showSuccess('User deleted successfully!');
      } catch (error) {
        console.error('Failed to delete user:', error);
        showError('Failed to delete user. Please try again.');
      }
    },
    [onUserUpdate, showSuccess, showError]
  );

  const handleInviteUser = useCallback(
    userId => {
      try {
        onUserUpdate('invite', null, userId);
        showSuccess('User invitation sent successfully!');
      } catch (error) {
        console.error('Failed to send invitation:', error);
        showError('Failed to send invitation. Please try again.');
      }
    },
    [onUserUpdate, showSuccess, showError]
  );

  // Form change handlers
  const handleUserFormChange = useCallback((field, value) => {
    setUserDialogForm(f => ({ ...f, [field]: value }));
  }, []);

  // Enhanced mobile user card rendering
  const renderMobileUserCard = user => (
    <Card
      key={user._id}
      sx={{
        mb: 2,
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
        border: `1px solid ${theme.palette.primary.light}`,
        borderRadius: theme.shape.borderRadius * 2,
      }}
      className='card-golden'
    >
      <CardContent sx={{ p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 2,
          }}
        >
          <Box>
            <Typography
              variant='h6'
              sx={{ color: theme.palette.primary.main, fontWeight: 600 }}
            >
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant='body2' color='textSecondary'>
              {user.email}
            </Typography>
          </Box>
          <Chip
            label={user.role}
            color={user.role === 'admin' ? 'error' : 'primary'}
            size='small'
            sx={{ fontWeight: 600 }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            size='small'
            variant='outlined'
            startIcon={<EditIcon />}
            onClick={() => handleUserDialogOpen('edit', user)}
            sx={{
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              '&:hover': {
                borderColor: theme.palette.primary.dark,
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            Edit
          </Button>
          <Button
            size='small'
            variant='outlined'
            startIcon={
              !user.isDefaultPassword && user.isVerified ? (
                <VerifiedIcon />
              ) : (
                <NotificationsIcon />
              )
            }
            disabled={!user.isDefaultPassword && user.isVerified}
            onClick={() => handleInviteUser(user._id)}
            sx={{
              borderColor: theme.palette.success.main,
              color: theme.palette.success.main,
              '&:hover': {
                borderColor: theme.palette.success.dark,
                backgroundColor: theme.palette.success.light + '20',
              },
              '&:disabled': {
                color: theme.palette.primary.main + ' !important',
                opacity: 0.5,
              },
            }}
            title={
              !user.isDefaultPassword && user.isVerified ? 'Verified' : 'Invite'
            }
          >
            {!user.isDefaultPassword && user.isVerified ? 'Verified' : 'Invite'}
          </Button>
          <Button
            size='small'
            variant='outlined'
            color='error'
            startIcon={<DeleteIcon />}
            onClick={() => handleDeleteUser(user._id)}
            sx={{
              '&:hover': {
                backgroundColor: theme.palette.error.light + '20',
              },
            }}
          >
            Delete
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  // Enhanced responsive table with mobile cards
  const renderUsersTable = () => {
    if (isMobile || isTablet) {
      return (
        <Box>
          {users.length === 0 ? (
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <Typography color='textSecondary'>No users found</Typography>
            </Box>
          ) : (
            users.map(renderMobileUserCard)
          )}
        </Box>
      );
    }

    return (
      <TableContainer component={Paper} sx={styles.tableContainerStyles}>
        <Table>
          <TableHead sx={styles.tableHeaderStyles}>
            <TableRow>
              <TableCell sx={styles.tableHeaderCellStyles}>Name</TableCell>
              <TableCell sx={styles.tableHeaderCellStyles}>Email</TableCell>
              <TableCell sx={styles.tableHeaderCellStyles}>Role</TableCell>
              <TableCell sx={styles.tableHeaderCellStyles}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user._id} sx={styles.tableRowStyles}>
                <TableCell>
                  <Typography variant='body1' sx={{ fontWeight: 600 }}>
                    {user.firstName} {user.lastName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='body2'>{user.email}</Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.role}
                    color={user.role === 'admin' ? 'error' : 'primary'}
                    size='small'
                    sx={{ fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size='small'
                      onClick={() => handleUserDialogOpen('edit', user)}
                      sx={{ color: theme.palette.primary.main }}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      size='small'
                      disabled={!user.isDefaultPassword && user.isVerified}
                      onClick={() => handleInviteUser(user._id)}
                      sx={{
                        color: theme.palette.success.main,
                        '&:hover': {
                          backgroundColor: theme.palette.success.light + '20',
                        },
                        '&:disabled': {
                          color: theme.palette.primary.main + ' !important',
                          opacity: 0.5,
                        },
                      }}
                    >
                      {!user.isDefaultPassword && user.isVerified ? (
                        <VerifiedIcon />
                      ) : (
                        <NotificationsIcon />
                      )}
                    </IconButton>
                    <IconButton
                      size='small'
                      onClick={() => handleDeleteUser(user._id)}
                      sx={{ color: theme.palette.error.main }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box sx={styles.sectionStyles}>
      <Stack
        direction={isMobile ? 'column' : 'row'}
        justifyContent='space-between'
        alignItems={isMobile ? 'stretch' : 'center'}
        mb={3}
        spacing={2}
      >
        <Typography variant={isMobile ? 'h6' : 'h5'} sx={styles.titleStyles}>
          Manage Users
        </Typography>
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          onClick={() => handleUserDialogOpen('add')}
          size={isMobile ? 'medium' : 'small'}
          sx={{
            ...styles.buttonStyles,
            height: isMobile ? 48 : 32,
            px: isMobile ? 3 : 2,
            fontSize: isMobile ? '1rem' : '0.75rem',
          }}
        >
          Add User
        </Button>
      </Stack>

      {/* Users Table */}
      {renderUsersTable()}

      {/* User Dialog */}
      <Dialog
        open={userDialogOpen}
        onClose={handleUserDialogClose}
        maxWidth={isMobile ? false : 'md'}
        fullWidth
        fullScreen={isMobile}
        slotProps={{
          paper: {
            sx: {
              boxShadow: theme.shadows[8],
              maxWidth: isMobile ? '100%' : '600px',
              width: isMobile ? '100%' : '90%',
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
            color: theme.palette.common.white,
            fontWeight: 700,
            borderRadius: isMobile
              ? 0
              : `${theme.shape.borderRadius * 2.67}px ${theme.shape.borderRadius * 2.67}px 0 0`,
            position: 'relative',
          }}
        >
          {userDialogMode === 'add' ? 'Add User' : 'Edit User'}
          {isMobile && (
            <IconButton
              onClick={handleUserDialogClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: theme.palette.common.white,
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            background: theme.palette.background.paper,
            p: isMobile ? 2 : 3,
            minHeight: isMobile ? 'auto' : '400px',
          }}
        >
          <Stack spacing={isMobile ? 2 : 3}>
            <TextField
              label='First Name'
              value={userDialogForm.firstName}
              onChange={e => handleUserFormChange('firstName', e.target.value)}
              fullWidth
              sx={styles.inputStyles}
            />
            <TextField
              label='Last Name'
              value={userDialogForm.lastName}
              onChange={e => handleUserFormChange('lastName', e.target.value)}
              fullWidth
              sx={styles.inputStyles}
            />
            <TextField
              label='Email'
              value={userDialogForm.email}
              onChange={e => handleUserFormChange('email', e.target.value)}
              fullWidth
              sx={styles.inputStyles}
            />
            <Select
              value={userDialogForm.role}
              onChange={e => handleUserFormChange('role', e.target.value)}
              displayEmpty
              sx={{
                ...styles.inputStyles['& .MuiOutlinedInput-root'],
                color: theme.palette.primary.main,
                fontWeight: 500,
              }}
            >
              <MenuItem value='user'>User</MenuItem>
              <MenuItem value='admin'>Admin</MenuItem>
            </Select>
          </Stack>
        </DialogContent>
        <DialogActions
          sx={{
            background: theme.palette.background.paper,
            p: 2,
            borderRadius: isMobile
              ? 0
              : `0 0 ${theme.shape.borderRadius * 2.67}px ${theme.shape.borderRadius * 2.67}px`,
            justifyContent: isMobile ? 'stretch' : 'flex-end',
            gap: 1,
          }}
        >
          <Button
            onClick={handleUserDialogClose}
            sx={{
              color: theme.palette.primary.main,
              border: `1px solid ${theme.palette.primary.main}`,
              borderRadius: theme.shape.borderRadius * 1.33,
              px: 3,
              flex: isMobile ? 1 : 'none',
              '&:hover': {
                background: theme.palette.action.hover,
                borderColor: theme.palette.primary.light,
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUserDialogSave}
            variant='contained'
            sx={{
              ...styles.buttonStyles,
              px: 3,
              flex: isMobile ? 1 : 'none',
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;

UserManagement.propTypes = {
  users: PropTypes.array.isRequired,
  onUserUpdate: PropTypes.func.isRequired,
};
