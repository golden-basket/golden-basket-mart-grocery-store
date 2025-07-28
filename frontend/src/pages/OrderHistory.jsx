import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import { Box, Typography, Paper, Button, Alert, Stack } from '@mui/material';
import Loading from '../components/Loading';

const OrderHistory = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:3000/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setOrders(res.data);
      })
      .catch(() => setError('Failed to load orders.'))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
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
        My Orders
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
      {loading ? (
        <Loading />
      ) : orders.length === 0 ? (
        <Typography align="center">No orders found.</Typography>
      ) : (
        orders.map((order) => (
          <Paper key={order._id} sx={{ p: 3, mb: 3 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography fontWeight={600}>Order ID: {order._id}</Typography>
                <Typography>
                  Date: {new Date(order.createdAt).toLocaleString()}
                </Typography>
                <Typography>Status: {order.orderStatus}</Typography>
                <Typography>
                  Payment: {order.paymentStatus} ({order.paymentMode})
                </Typography>
                <Typography>Total: ₹{order.totalAmount}</Typography>
                <Typography fontWeight={600} mt={1}>
                  Items:
                </Typography>
                {order.items.map((item) => (
                  <Typography key={item.product._id} sx={{ ml: 2 }}>
                    {item.product.name} × {item.quantity} — ₹
                    {item.price * item.quantity}
                  </Typography>
                ))}
              </Box>
              <Box>
                {order.invoice && (
                  <Button
                    variant="outlined"
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      background:
                        'linear-gradient(90deg, #fffbe6 0%, #f7e7c4 100%)',
                      color: '#a3824c',
                      border: '1px solid #e6d897',
                      '&:hover': {
                        background:
                          'linear-gradient(90deg, #e6d897 0%, #b59961 100%)',
                        color: '#fff',
                      },
                    }}
                    href={`http://localhost:3000/api/invoice/${order.invoice._id}`}
                    target="_blank"
                  >
                    Download Invoice
                  </Button>
                )}
              </Box>
            </Stack>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default OrderHistory;
