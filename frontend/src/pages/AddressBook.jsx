import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  IconButton,
  Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Loading from '../components/Loading';
import ApiService from '../services/api';
import { useToastNotifications } from '../hooks/useToast';
import EditIcon from '@mui/icons-material/Edit';

const AddressBook = () => {
  const { token } = useAuth();
  const { showSuccess, showError } = useToastNotifications();
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    pinCode: '',
    phoneNumber: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Reusable styles to eliminate duplications
  const styles = {
    gradientText: {
      background:
        'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    textField: {
      '& .MuiInputBase-root': { borderRadius: 2 },
      '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#e6d897',
        boxShadow: '0 0 0 2px #e6d89744',
      },
    },
    iconButton: {
      background: '#fffbe6',
      borderRadius: 2,
      width: { xs: 32, sm: 36 },
      height: { xs: 32, sm: 36 },
      '&:hover': {
        background: '#e6d897',
        transform: 'scale(1.05)',
        boxShadow: '0 2px 4px rgba(163,130,76,0.3)',
      },
    },
    submitButton: {
      fontWeight: 600,
      background:
        'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
      color: '#fff',
      textTransform: 'none',
      borderRadius: 2,
      px: 2,
      '&:hover': {
        background: 'linear-gradient(90deg, #e6d897 0%, #a3824c 100%)',
        color: '#000',
      },
    },
  };

  const fetchAddresses = () => {
    setLoading(true);
    ApiService.getAddresses()
      .then(data => setAddresses(data))
      .catch(() => showError('Failed to load addresses. Please try again.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (token) fetchAddresses();
  }, [token]); // Only depend on token

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const method = editingId ? 'updateAddress' : 'addAddress';
    const args = editingId ? [editingId, form] : [form];
    ApiService[method](...args)
      .then(() => {
        showSuccess(
          editingId
            ? 'Address updated successfully!'
            : 'Address added successfully!'
        );
        setForm({
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          country: '',
          pinCode: '',
          phoneNumber: '',
        });
        setEditingId(null);
        fetchAddresses();
      })
      .catch(() => showError('Failed to save address. Please try again.'));
  };

  const handleEdit = address => {
    setForm(address);
    setEditingId(address._id);
  };

  const handleDelete = id => {
    ApiService.deleteAddress(id)
      .then(() => {
        showSuccess('Address deleted successfully!');
        fetchAddresses();
      })
      .catch(() => showError('Failed to delete address. Please try again.'));
  };

  // Extracted ternary logic for clarity
  let addressContent;
  if (loading) {
    addressContent = <Loading />;
  } else if (addresses.length === 0) {
    addressContent = (
      <Typography
        align='center'
        sx={{
          ...styles.gradientText,
          fontWeight: 600,
          mt: 2,
          p: 3,
        }}
      >
        No addresses found.
      </Typography>
    );
  } else {
    addressContent = addresses.map(addr => (
      <Paper
        key={addr._id}
        sx={{
          p: { xs: 2, sm: 3 },
          my: 1,
          mx: 2,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'flex-start' },
          justifyContent: 'space-between',
          border: '2px solid #e6d897',
          boxShadow: '0 2px 8px #a3824c22',
          borderRadius: 3,
          background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
          minHeight: { xs: 'auto', sm: 120 },
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Box sx={{ flex: 1, pr: { xs: 0, sm: 2 } }}>
          <Typography
            fontWeight={700}
            sx={{
              color: '#a3824c',
              mb: 1,
              fontSize: '1.1rem',
              lineHeight: 1.3,
            }}
          >
            {addr.addressLine1}
          </Typography>
          {addr.addressLine2 && (
            <Typography
              sx={{
                color: '#7d6033',
                mb: 1,
                fontSize: '0.95rem',
                lineHeight: 1.3,
              }}
            >
              {addr.addressLine2}
            </Typography>
          )}
          <Typography
            sx={{
              color: '#866422',
              mb: 1,
              fontSize: '0.95rem',
              lineHeight: 1.3,
            }}
          >
            {addr.city}, {addr.state}, {addr.country} - {addr.pinCode}
          </Typography>
          <Typography
            sx={{
              color: '#866422',
              fontSize: '0.95rem',
              lineHeight: 1.3,
              fontWeight: 500,
            }}
          >
            📞 {addr.phoneNumber}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'row', sm: 'column' },
            gap: 1,
            alignItems: { xs: 'center', sm: 'flex-end' },
            justifyContent: { xs: 'space-between', sm: 'flex-start' },
            minWidth: { xs: '100%', sm: 'fit-content' },
            pt: { xs: 1, sm: 0 },
            borderTop: { xs: '1px solid #e6d897', sm: 'none' },
            mt: { xs: 1, sm: 0 },
          }}
        >
          <IconButton
            color='secondary'
            size='small'
            onClick={() => handleEdit(addr)}
            sx={styles.iconButton}
          >
            <EditIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
          </IconButton>
          <IconButton
            color='error'
            onClick={() => handleDelete(addr._id)}
            sx={styles.iconButton}
          >
            <DeleteIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
          </IconButton>
        </Box>
      </Paper>
    ));
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography
        variant='h5'
        fontWeight={700}
        mb={2}
        align='center'
        sx={styles.gradientText}
      >
        My Shipping Addresses
      </Typography>

      <Paper
        sx={{
          p: { xs: 3, md: 4 },
          mx: 2,
          borderRadius: 4,
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
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label='Address Line 1'
              name='addressLine1'
              value={form.addressLine1}
              onChange={handleChange}
              required
              size='small'
              fullWidth
              sx={styles.textField}
            />
            <TextField
              label='Address Line 2'
              name='addressLine2'
              value={form.addressLine2}
              onChange={handleChange}
              size='small'
              fullWidth
              sx={styles.textField}
            />
            <TextField
              label='City'
              name='city'
              value={form.city}
              onChange={handleChange}
              required
              size='small'
              fullWidth
              sx={styles.textField}
            />
            <TextField
              label='State'
              name='state'
              value={form.state}
              onChange={handleChange}
              required
              size='small'
              fullWidth
              sx={styles.textField}
            />
            <TextField
              label='Country'
              name='country'
              value={form.country}
              onChange={handleChange}
              required
              size='small'
              fullWidth
              sx={styles.textField}
            />
            <TextField
              label='Pin Code'
              name='pinCode'
              value={form.pinCode}
              onChange={handleChange}
              required
              size='small'
              fullWidth
              inputProps={{ maxLength: 6 }}
              sx={styles.textField}
            />
            <TextField
              label='Phone Number'
              name='phoneNumber'
              value={form.phoneNumber}
              onChange={handleChange}
              required
              size='small'
              fullWidth
              inputProps={{ maxLength: 10 }}
              sx={styles.textField}
            />
            <Button type='submit' fullWidth sx={styles.submitButton}>
              {editingId ? 'Update Address' : 'Add Address'}
            </Button>
          </Stack>
        </form>
      </Paper>
      {addressContent}
    </Box>
  );
};

export default AddressBook;
