import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import axios from 'axios';
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
    axios
      .get('http://localhost:3000/api/addresses', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAddresses(res.data))
      .catch(() => setError('Failed to load addresses.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (token) fetchAddresses();
    // eslint-disable-next-line
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const method = editingId ? 'put' : 'post';
    const url = editingId
      ? `http://localhost:3000/api/addresses/${editingId}`
      : 'http://localhost:3000/api/addresses';
    axios[method](url, form, { headers: { Authorization: `Bearer ${token}` } })
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
    axios
      .delete(`http://localhost:3000/api/addresses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setSuccess('Address deleted.');
        fetchAddresses();
      })
      .catch(() => setError('Failed to delete address.'));
  };

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
      <Paper sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Address Line 1"
              name="addressLine1"
              value={form.addressLine1}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Address Line 2"
              name="addressLine2"
              value={form.addressLine2}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="City"
              name="city"
              value={form.city}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="State"
              name="state"
              value={form.state}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Country"
              name="country"
              value={form.country}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Pin Code"
              name="pinCode"
              value={form.pinCode}
              onChange={handleChange}
              required
              fullWidth
              slotProps={{ input: { maxLength: 6 } }}
            />
            <TextField
              label="Phone Number"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              required
              fullWidth
              slotProps={{ input: { maxLength: 6 } }}
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
      {loading ? (
        <Loading />
      ) : addresses.length === 0 ? (
        <Typography align="center">No addresses found.</Typography>
      ) : (
        addresses.map((addr) => (
          <Paper
            key={addr._id}
            sx={{
              p: 2,
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography fontWeight={600}>{addr.addressLine1}</Typography>
              {addr.addressLine2 && (
                <Typography>{addr.addressLine2}</Typography>
              )}
              <Typography>
                {addr.city}, {addr.state}, {addr.country} - {addr.pinCode}
              </Typography>
              <Typography>Phone: {addr.phoneNumber}</Typography>
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
                  '&:hover': {
                    background:
                      'linear-gradient(90deg, #e6d897 0%, #a3824c 100%)',
                    color: '#000',
                  },
                }}
              >
                Edit
              </Button>
              <IconButton color="error" onClick={() => handleDelete(addr._id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default AddressBook;
