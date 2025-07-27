import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';
import Loading from '../components/Loading';
import { useNavigate } from 'react-router-dom';

const OrderCheckout = () => {
  const { token } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [invoice, setInvoice] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get('http://localhost:3000/api/addresses', {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get('http://localhost:3000/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])
      .then(([addrRes, cartRes]) => {
        setAddresses(addrRes.data);
        setCart(cartRes.data.items || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load addresses or cart.');
        setLoading(false);
      });
  }, [token]);

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      setError('Please select a shipping address.');
      return;
    }
    setPlacing(true);
    setError('');
    setSuccess('');
    axios
      .post(
        'http://localhost:3000/api/orders/place',
        { shippingAddressId: selectedAddress },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setSuccess('Order placed successfully!');
        setInvoice(res.data.invoice);
        setCart([]);
      })
      .catch((err) =>
        setError(err.response?.data?.error || 'Failed to place order.')
      )
      .finally(() => setPlacing(false));
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography
        variant="h5"
        fontWeight={700}
        color="primary"
        mb={2}
        align="center"
        sx={{
          background:
            'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Checkout
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
      {loading ? (
        <Loading />
      ) : (
        <>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography fontWeight={600} mb={1}>
              Select Shipping Address
            </Typography>
            <RadioGroup
              value={selectedAddress}
              onChange={(e) => setSelectedAddress(e.target.value)}
            >
              {addresses.map((addr) => (
                <FormControlLabel
                  key={addr._id}
                  value={addr._id}
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography fontWeight={600}>
                        {addr.addressLine1}
                      </Typography>
                      {addr.addressLine2 && (
                        <Typography>{addr.addressLine2}</Typography>
                      )}
                      <Typography>
                        {addr.city}, {addr.state}, {addr.country} -{' '}
                        {addr.pinCode}
                      </Typography>
                      <Typography>Phone: {addr.phoneNumber}</Typography>
                    </Box>
                  }
                />
              ))}
            </RadioGroup>
            <Button
              variant="outlined"
              sx={{ mt: 2, textTransform: 'none' }}
              onClick={() => navigate('/addresses')}
            >
              Manage Addresses
            </Button>
          </Paper>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography fontWeight={600} mb={1}>
              Cart Summary
            </Typography>
            {cart.length === 0 ? (
              <Typography>No items in cart.</Typography>
            ) : (
              cart.map((item) => (
                <Box key={item.product._id} sx={{ mb: 1 }}>
                  <Typography>
                    {item.product.name} × {item.quantity} — ₹
                    {item.product.price * item.quantity}
                  </Typography>
                </Box>
              ))
            )}
          </Paper>
          <Button
            variant="contained"
            fullWidth
            onClick={handlePlaceOrder}
            disabled={placing || cart.length === 0}
            sx={{
              fontWeight: 600,
              background:
                'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
              color: '#fff',
              textTransform: 'none',
              '&:hover': {
                background: 'linear-gradient(90deg, #e6d897 0%, #a3824c 100%)',
                color: '#000',
              },
            }}
          >
            {placing ? 'Placing Order...' : 'Place Order'}
          </Button>
          {invoice && (
            <Button
              variant="outlined"
              fullWidth
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c4 100%)',
                color: '#a3824c',
                border: '1px solid #e6d897',
                '&:hover': {
                  background:
                    'linear-gradient(90deg, #e6d897 0%, #b59961 100%)',
                  color: '#fff',
                },
              }}
              href={`http://localhost:3000/api/invoice/${invoice._id}`}
              target="_blank"
            >
              Download Invoice
            </Button>
          )}
        </>
      )}
    </Box>
  );
};

export default OrderCheckout;
