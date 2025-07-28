import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import ApiService from '../services/api';
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel,
  Divider,
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
    let isMounted = true;
    setLoading(true);
    Promise.all([ApiService.getAddresses(), ApiService.getCart()])
      .then(([addrRes, cartRes]) => {
        if (isMounted) {
          setAddresses(addrRes);
          setCart(cartRes.items || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError('Failed to load addresses or cart.');
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [token]);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setError('Please select a shipping address.');
      return;
    }
    setPlacing(true);
    setError('');
    setSuccess('');
    try {
      const res = await ApiService.placeOrder({
        shippingAddressId: selectedAddress,
      });
      setSuccess('Order placed successfully!');
      setInvoice(res.invoice);
      setCart([]);
    } catch (err) {
      setError(err.message || 'Failed to place order.');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography
        variant="h5"
        fontWeight={700}
        align="center"
        sx={{
          background:
            'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 2,
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
          <Paper
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
              border: '1px solid #e6d897',
              boxShadow: '0 2px 12px 0 rgba(163,130,76,0.10)',
            }}
          >
            <Typography fontWeight={600} mb={1} sx={{ color: '#a3824c' }}>
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
                  control={<Radio sx={{ color: '#a3824c' }} />}
                  label={
                    <Box>
                      <Typography fontWeight={600} sx={{ color: '#a3824c' }}>
                        {addr.addressLine1}
                      </Typography>
                      {addr.addressLine2 && (
                        <Typography sx={{ color: '#7d6033' }}>
                          {addr.addressLine2}
                        </Typography>
                      )}
                      <Typography sx={{ color: '#866422' }}>
                        {addr.city}, {addr.state}, {addr.country} -{' '}
                        {addr.pinCode}
                      </Typography>
                      <Typography sx={{ color: '#866422' }}>
                        Phone: {addr.phoneNumber}
                      </Typography>
                    </Box>
                  }
                  sx={{
                    mb: 1,
                    alignItems: 'flex-start',
                  }}
                />
              ))}
            </RadioGroup>
            <Button
              variant="outlined"
              sx={{
                mt: 2,
                textTransform: 'none',
                fontWeight: 600,
                borderColor: '#a3824c',
                color: '#a3824c',
                background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c4 100%)',
                borderRadius: 2,
                '&:hover': {
                  borderColor: '#e6d897',
                  background:
                    'linear-gradient(90deg, #e6d897 0%, #fffbe6 100%)',
                  color: '#866422',
                },
              }}
              onClick={() => navigate('/addresses')}
            >
              Manage Addresses
            </Button>
          </Paper>
          <Paper
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
              border: '1px solid #e6d897',
              boxShadow: '0 2px 12px 0 rgba(163,130,76,0.10)',
            }}
          >
            <Typography fontWeight={600} mb={1} sx={{ color: '#a3824c' }}>
              Cart Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {cart.length === 0 ? (
              <Typography sx={{ color: '#866422' }}>
                No items in cart.
              </Typography>
            ) : (
              cart.map((item) => (
                <Box
                  key={item.product._id}
                  sx={{
                    mb: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography sx={{ color: '#a3824c', fontWeight: 600 }}>
                    {item.product.name} × {item.quantity}
                  </Typography>
                  <Typography sx={{ color: '#7d6033', fontWeight: 600 }}>
                    ₹{item.product.price * item.quantity}
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
              fontWeight: 700,
              background:
                'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
              color: '#fff',
              textTransform: 'none',
              borderRadius: 2,
              fontSize: '1rem',
              boxShadow: '0 2px 8px rgba(163,130,76,0.10)',
              mt: 2,
              '&:hover': {
                background: 'linear-gradient(90deg, #e6d897 0%, #a3824c 100%)',
                color: '#866422',
                boxShadow: '0 4px 16px rgba(163,130,76,0.18)',
              },
              transition: 'all 0.3s ease',
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
                borderRadius: 2,
                mt: 2,
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
