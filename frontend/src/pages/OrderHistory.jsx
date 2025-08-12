import { useEffect, useState } from 'react';
import ApiService from '../services/api';
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  Stack,
  Chip,
  Divider,
} from '@mui/material';
import Loading from '../components/Loading';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PaymentIcon from '@mui/icons-material/Payment';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadingInvoices, setDownloadingInvoices] = useState(new Set());

  const handleDownloadInvoice = async (invoiceId) => {
    try {
      setDownloadingInvoices((prev) => new Set(prev).add(invoiceId));
      const response = await ApiService.downloadInvoice(invoiceId);
      // Create a blob from the PDF data
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoiceId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download invoice:', error);
      setError('Failed to download invoice. Please try again.');
    } finally {
      setDownloadingInvoices((prev) => {
        const newSet = new Set(prev);
        newSet.delete(invoiceId);
        return newSet;
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return '#ff9800';
      case 'processing':
        return '#2196f3';
      case 'shipped':
        return '#4caf50';
      case 'delivered':
        return '#4caf50';
      case 'cancelled':
        return '#f44336';
      default:
        return '#a3824c';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return '#ff9800';
      case 'paid':
        return '#4caf50';
      case 'failed':
        return '#f44336';
      default:
        return '#a3824c';
    }
  };

  useEffect(() => {
    setLoading(true);
    ApiService.getUserOrders()
      .then((orderList) => {
        setOrders(orderList || []);
      })
      .catch((err) => {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: 'auto',
        mt: 1,
        mb: 1,
        px: 2,
        background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
        borderRadius: 3,
        py: 3,
        boxShadow: '0 2px 12px 0 rgba(163,130,76,0.10)',
      }}
    >
      <Typography
        variant="h4"
        fontWeight={700}
        mb={3}
        align="center"
        sx={{
          background:
            'linear-gradient(90deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: 1,
          textShadow: '0 2px 8px rgba(163,130,76,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
        }}
      >
        <ShoppingBagIcon sx={{ fontSize: 32, color: '#a3824c' }} />
        My Orders
      </Typography>

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c4 100%)',
            color: '#a3824c',
            border: '1px solid #e6d897',
            borderRadius: 2,
            '& .MuiAlert-icon': {
              color: '#a3824c',
            },
          }}
        >
          {error}
        </Alert>
      )}

      {loading ? (
        <Loading />
      ) : orders.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 6,
            background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c4 100%)',
            borderRadius: 2,
            border: '1px solid #e6d897',
          }}
        >
          <ShoppingBagIcon sx={{ fontSize: 64, color: '#a3824c', mb: 2 }} />
          <Typography variant="h6" color="#a3824c" fontWeight={600} mb={1}>
            No Orders Found
          </Typography>
          <Typography color="#b59961">
            Start shopping to see your order history here
          </Typography>
        </Box>
      ) : (
        <Stack spacing={3}>
          {orders.map((order) => (
            <Paper
              key={order._id}
              sx={{
                p: 3,
                borderRadius: 2,
                background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c4 100%)',
                border: '1px solid #e6d897',
                boxShadow: '0 1px 6px 0 rgba(163,130,76,0.10)',
                transition: 'box-shadow 0.3s, border-color 0.3s',
                '&:hover': {
                  boxShadow: '0 4px 16px 0 rgba(163,130,76,0.18)',
                  borderColor: '#a3824c',
                },
              }}
            >
              {/* Order Header */}
              <Box sx={{ mb: 2 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  flexWrap="wrap"
                  gap={2}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      sx={{
                        background:
                          'linear-gradient(90deg, #a3824c 0%, #b59961 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 1,
                      }}
                    >
                      Order #{order._id.slice(-8).toUpperCase()}
                    </Typography>

                    <Stack direction="row" alignItems="center" gap={1} mb={1}>
                      <CalendarTodayIcon
                        sx={{ fontSize: 16, color: '#a3824c' }}
                      />
                      <Typography variant="body2" color="#b59961">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </Typography>
                    </Stack>

                    <Stack direction="row" gap={2} flexWrap="wrap">
                      <Chip
                        icon={<LocalShippingIcon />}
                        label={order.orderStatus || 'Processing'}
                        size="small"
                        sx={{
                          background: `linear-gradient(90deg, ${getStatusColor(
                            order.orderStatus
                          )}20 0%, ${getStatusColor(
                            order.orderStatus
                          )}40 100%)`,
                          color: getStatusColor(order.orderStatus),
                          border: `1px solid ${getStatusColor(
                            order.orderStatus
                          )}`,
                          fontWeight: 600,
                        }}
                      />
                      <Chip
                        icon={<PaymentIcon />}
                        label={`${order.paymentStatus || 'Pending'} (${order.paymentMode || 'COD'})`}
                        size="small"
                        sx={{
                          background: `linear-gradient(90deg, ${getPaymentStatusColor(
                            order.paymentStatus
                          )}20 0%, ${getPaymentStatusColor(
                            order.paymentStatus
                          )}40 100%)`,
                          color: getPaymentStatusColor(order.paymentStatus),
                          border: `1px solid ${getPaymentStatusColor(
                            order.paymentStatus
                          )}`,
                          fontWeight: 600,
                        }}
                      />
                    </Stack>
                  </Box>

                  <Box sx={{ textAlign: 'right' }}>
                    <Typography
                      variant="h5"
                      fontWeight={700}
                      sx={{
                        background:
                          'linear-gradient(90deg, #a3824c 0%, #b59961 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      ₹{order.totalAmount || 0}
                    </Typography>
                    <Typography variant="caption" color="#b59961">
                      Total Amount
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Divider sx={{ borderColor: '#e6d897', my: 2 }} />

              {/* Order Items */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  mb={2}
                  sx={{
                    color: '#a3824c',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <ShoppingBagIcon sx={{ fontSize: 20 }} />
                  Order Items
                </Typography>

                <Stack spacing={1}>
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, index) => (
                      <Box
                        key={item.product?._id || index}
                        sx={{
                          p: 2,
                          background:
                            'linear-gradient(90deg, #fffbe6 0%, #f7e7c4 100%)',
                          borderRadius: 1,
                          border: '1px solid #e6d897',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Box>
                          <Typography fontWeight={600} color="#a3824c">
                            {item.product?.name || 'Product Name Unavailable'}
                          </Typography>
                          <Typography variant="body2" color="#b59961">
                            Quantity: {item.quantity || 0} × ₹{item.price || 0}
                          </Typography>
                        </Box>
                        <Typography
                          fontWeight={600}
                          sx={{
                            background:
                              'linear-gradient(90deg, #a3824c 0%, #b59961 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}
                        >
                          ₹{(item.price || 0) * (item.quantity || 0)}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography color="#b59961" textAlign="center" py={2}>
                      No items found for this order
                    </Typography>
                  )}
                </Stack>
              </Box>

              {/* Invoice Download */}
              {order.invoice && order.invoice._id ? (
                <Box sx={{ textAlign: 'center' }}>
                  <Button
                    variant="outlined"
                    onClick={() => handleDownloadInvoice(order.invoice._id)}
                    disabled={downloadingInvoices.has(order.invoice._id)}
                    startIcon={<ReceiptIcon />}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 3,
                      py: 1.5,
                      background:
                        'linear-gradient(90deg, #fffbe6 0%, #f7e7c4 100%)',
                      color: '#a3824c',
                      border: '2px solid #e6d897',
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background:
                          'linear-gradient(90deg, #e6d897 0%, #b59961 100%)',
                        color: '#fff',
                        borderColor: '#a3824c',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(163,130,76,0.3)',
                      },
                      '&:disabled': {
                        background:
                          'linear-gradient(90deg, #f5f5f5 0%, #e0e0e0 100%)',
                        color: '#999',
                        borderColor: '#ccc',
                        transform: 'none',
                        boxShadow: 'none',
                      },
                    }}
                  >
                    {downloadingInvoices.has(order.invoice._id)
                      ? 'Downloading...'
                      : 'Download Invoice'}
                  </Button>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="#b59961" fontStyle="italic">
                    Invoice will be generated once payment is completed
                  </Typography>
                </Box>
              )}
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default OrderHistory;
