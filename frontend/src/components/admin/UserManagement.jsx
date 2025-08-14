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
  CardActions,
  Stack,
  Grid,
  Chip,
  Select,
  MenuItem,
  Divider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { createAdminStyles } from './adminStyles';

const UserManagement = ({ users, onUserUpdate }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

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
  const styles = useMemo(() => createAdminStyles(isMobile), [isMobile]);

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
    onUserUpdate(userDialogMode, userDialogForm, editUser?._id);
    handleUserDialogClose();
  }, [
    userDialogMode,
    userDialogForm,
    editUser,
    handleUserDialogClose,
    onUserUpdate,
  ]);

  const handleDeleteUser = useCallback(
    (id) => {
      onUserUpdate('delete', null, id);
    },
    [onUserUpdate]
  );

  const handleInviteUser = useCallback(
    (userId) => {
      onUserUpdate('invite', null, userId);
    },
    [onUserUpdate]
  );

  // Form change handlers
  const handleUserFormChange = useCallback((field, value) => {
    setUserDialogForm((f) => ({ ...f, [field]: value }));
  }, []);

  // Enhanced mobile user card rendering
  const renderMobileUserCard = (user) => (
    <Card
      key={user._id}
      sx={{
        mb: 2,
        background:
          'linear-gradient(135deg, var(--color-cream-light) 0%, var(--color-cream-medium) 100%)',
        border: '1px solid var(--color-primary-light)',
        borderRadius: 2,
      }}
      className="card-golden"
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
              variant="h6"
              sx={{ color: 'var(--color-primary)', fontWeight: 600 }}
            >
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {user.email}
            </Typography>
          </Box>
          <Chip
            label={user.role}
            color={user.role === 'admin' ? 'error' : 'primary'}
            size="small"
            sx={{ fontWeight: 600 }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => handleUserDialogOpen('edit', user)}
            sx={{
              borderColor: 'var(--color-primary)',
              color: 'var(--color-primary)',
              '&:hover': {
                borderColor: 'var(--color-primary-dark)',
                backgroundColor: 'rgba(163,130,76,0.1)',
              },
            }}
          >
            Edit
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<NotificationsIcon />}
            onClick={() => handleInviteUser(user._id)}
            sx={{
              borderColor: 'var(--color-accent)',
              color: 'var(--color-accent)',
              '&:hover': {
                borderColor: 'var(--color-accent-dark)',
                backgroundColor: 'rgba(56,142,60,0.1)',
              },
            }}
          >
            Invite
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => handleDeleteUser(user._id)}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(211,47,47,0.1)',
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
              <Typography color="textSecondary">No users found</Typography>
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
            {users.map((user) => (
              <TableRow key={user._id} sx={styles.tableRowStyles}>
                <TableCell>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {user.firstName} {user.lastName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{user.email}</Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.role}
                    color={user.role === 'admin' ? 'error' : 'primary'}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleUserDialogOpen('edit', user)}
                      sx={{ color: 'var(--color-primary)' }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleInviteUser(user._id)}
                      sx={{ color: 'var(--color-accent)' }}
                    >
                      <NotificationsIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteUser(user._id)}
                      sx={{ color: 'var(--color-error)' }}
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
        justifyContent="space-between"
        alignItems={isMobile ? 'stretch' : 'center'}
        mb={3}
        spacing={2}
      >
        <Typography variant={isMobile ? 'h6' : 'h5'} sx={styles.titleStyles}>
          Manage Users
        </Typography>
        <Button
          variant="contained"
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
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 3,
            boxShadow: '0 8px 32px 0 rgba(163,130,76,0.25)',
            border: isMobile ? 'none' : '1px solid #e6d897',
            maxWidth: isMobile ? '100%' : '600px',
            width: isMobile ? '100%' : '90%',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(90deg, #a3824c 0%, #e6d897 100%)',
            color: '#fff',
            fontWeight: 700,
            borderRadius: isMobile ? 0 : '12px 12px 0 0',
            position: 'relative',
          }}
        >
          {userDialogMode === 'add' ? 'Add User' : 'Edit User'}
          {isMobile && (
            <IconButton
              onClick={handleUserDialogClose}
              sx={{ position: 'absolute', right: 8, top: 8, color: '#fff' }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
            p: isMobile ? 2 : 3,
            minHeight: isMobile ? 'auto' : '400px',
          }}
        >
          <Stack spacing={isMobile ? 2 : 3}>
            <TextField
              label="First Name"
              value={userDialogForm.firstName}
              onChange={(e) =>
                handleUserFormChange('firstName', e.target.value)
              }
              fullWidth
              sx={styles.inputStyles}
            />
            <TextField
              label="Last Name"
              value={userDialogForm.lastName}
              onChange={(e) => handleUserFormChange('lastName', e.target.value)}
              fullWidth
              sx={styles.inputStyles}
            />
            <TextField
              label="Email"
              value={userDialogForm.email}
              onChange={(e) => handleUserFormChange('email', e.target.value)}
              fullWidth
              sx={styles.inputStyles}
            />
            <Select
              value={userDialogForm.role}
              onChange={(e) => handleUserFormChange('role', e.target.value)}
              displayEmpty
              sx={{
                ...styles.inputStyles['& .MuiOutlinedInput-root'],
                color: '#a3824c',
                fontWeight: 500,
              }}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </Stack>
        </DialogContent>
        <DialogActions
          sx={{
            background: 'linear-gradient(90deg, #f7e7c1 0%, #fffbe6 100%)',
            p: 2,
            borderRadius: isMobile ? 0 : '0 0 12px 12px',
            justifyContent: isMobile ? 'stretch' : 'flex-end',
            gap: 1,
          }}
        >
          <Button
            onClick={handleUserDialogClose}
            sx={{
              color: '#a3824c',
              border: '1px solid #a3824c',
              borderRadius: 1,
              px: 3,
              flex: isMobile ? 1 : 'none',
              '&:hover': {
                background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c4 100%)',
                borderColor: '#e6d897',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUserDialogSave}
            variant="contained"
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
