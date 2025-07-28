import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Alert,
  IconButton,
  Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Loading from '../components/Loading';
import ApiService from '../services/api';

const AddressBook = () => {
  const { token } = useAuth();
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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAddresses = () => {
    setLoading(true);
    ApiService.getAddresses()
      .then((data) => setAddresses(data))
      .catch(() => setError('Failed to load addresses.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (token) fetchAddresses();
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const method = editingId ? 'updateAddress' : 'addAddress';
    const args = editingId ? [editingId, form] : [form];
    ApiService[method](...args)
      .then(() => {
        setSuccess(editingId ? 'Address updated.' : 'Address added.');
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
      .catch(() => setError('Failed to save address.'));
  };

  const handleEdit = (address) => {
    setForm(address);
    setEditingId(address._id);
  };

  const handleDelete = (id) => {
    ApiService.deleteAddress(id)
      .then(() => {
        setSuccess('Address deleted.');
        fetchAddresses();
      })
      .catch(() => setError('Failed to delete address.'));
  };

  // Extracted ternary logic for clarity
  let addressContent;
  if (loading) {
    addressContent = <Loading />;
  } else if (addresses.length === 0) {
    addressContent = (
      <Typography
        align="center"
        sx={{
          background:
            'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 600,
          mt: 2,
          p: 3,
        }}
      >
        No addresses found.
      </Typography>
    );
  } else {
    addressContent = addresses.map((addr) => (
      <Paper
        key={addr._id}
        sx={{
          p: 2,
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: '2px solid #e6d897',
          boxShadow: '0 2px 8px #a3824c22',
          borderRadius: 3,
          background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
        }}
      >
        <Box>
          <Typography fontWeight={700} sx={{ color: '#a3824c', mb: 0.5 }}>
            {addr.addressLine1}
          </Typography>
          {addr.addressLine2 && (
            <Typography sx={{ color: '#7d6033', mb: 0.5 }}>
              {addr.addressLine2}
            </Typography>
          )}
          <Typography sx={{ color: '#866422', mb: 0.5 }}>
            {addr.city}, {addr.state}, {addr.country} - {addr.pinCode}
          </Typography>
          <Typography sx={{ color: '#866422', fontSize: '0.95rem' }}>
            Phone: {addr.phoneNumber}
          </Typography>
        </Box>
        <Box>
          <Button
            size="small"
            onClick={() => handleEdit(addr)}
            sx={{
              mr: 1,
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
            }}
          >
            Edit
          </Button>
          <IconButton
            color="error"
            onClick={() => handleDelete(addr._id)}
            sx={{
              background: '#fffbe6',
              borderRadius: 2,
              '&:hover': { background: '#e6d897' },
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Paper>
    ));
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography
        variant="h5"
        fontWeight={700}
        mb={2}
        align="center"
        sx={{
          background:
            'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        My Shipping Addresses
      </Typography>
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c4 100%)',
            color: '#a3824c',
            border: '1px solid #e6d897',
          }}
        >
          {error}
        </Alert>
      )}
      {success && (
        <Alert
          severity="success"
          sx={{
            mb: 2,
            background: 'linear-gradient(90deg, #e6d897 0%, #b59961 100%)',
            color: '#fff',
            border: '1px solid #a3824c',
          }}
        >
          {success}
        </Alert>
      )}
      <Paper
        sx={{
          p: { xs: 3, md: 4 },
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
              label="Address Line 1"
              name="addressLine1"
              value={form.addressLine1}
              onChange={handleChange}
              required
              size="small"
              fullWidth
              sx={{
                '& .MuiInputBase-root': { borderRadius: 2 },
                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#e6d897',
                  boxShadow: '0 0 0 2px #e6d89744',
                },
              }}
            />
            <TextField
              label="Address Line 2"
              name="addressLine2"
              value={form.addressLine2}
              onChange={handleChange}
              size="small"
              fullWidth
              sx={{
                '& .MuiInputBase-root': { borderRadius: 2 },
                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#e6d897',
                  boxShadow: '0 0 0 2px #e6d89744',
                },
              }}
            />
            <TextField
              label="City"
              name="city"
              value={form.city}
              onChange={handleChange}
              required
              size="small"
              fullWidth
              sx={{
                '& .MuiInputBase-root': { borderRadius: 2 },
                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#e6d897',
                  boxShadow: '0 0 0 2px #e6d89744',
                },
              }}
            />
            <TextField
              label="State"
              name="state"
              value={form.state}
              onChange={handleChange}
              required
              size="small"
              fullWidth
              sx={{
                '& .MuiInputBase-root': { borderRadius: 2 },
                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#e6d897',
                  boxShadow: '0 0 0 2px #e6d89744',
                },
              }}
            />
            <TextField
              label="Country"
              name="country"
              value={form.country}
              onChange={handleChange}
              required
              size="small"
              fullWidth
              sx={{
                '& .MuiInputBase-root': { borderRadius: 2 },
                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#e6d897',
                  boxShadow: '0 0 0 2px #e6d89744',
                },
              }}
            />
            <TextField
              label="Pin Code"
              name="pinCode"
              value={form.pinCode}
              onChange={handleChange}
              required
              size="small"
              fullWidth
              inputProps={{ maxLength: 6 }}
              sx={{
                '& .MuiInputBase-root': { borderRadius: 2 },
                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#e6d897',
                  boxShadow: '0 0 0 2px #e6d89744',
                },
              }}
            />
            <TextField
              label="Phone Number"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              required
              size="small"
              fullWidth
              inputProps={{ maxLength: 10 }}
              sx={{
                '& .MuiInputBase-root': { borderRadius: 2 },
                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#e6d897',
                  boxShadow: '0 0 0 2px #e6d89744',
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              sx={{
                fontWeight: 600,
                background:
                  'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
                color: '#fff',
                textTransform: 'none',
                borderRadius: 2,
                px: 2,
                '&:hover': {
                  background:
                    'linear-gradient(90deg, #e6d897 0%, #a3824c 100%)',
                  color: '#000',
                },
              }}
            >
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
