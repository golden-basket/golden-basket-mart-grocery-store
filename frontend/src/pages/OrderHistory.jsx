import { useEffect, useState, useMemo } from 'react';
import ApiService from '../services/api';
import {
  Box,
  Typography,
  Paper,
  Alert,
  Stack,
  Chip,
  useTheme,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import Loading from '../components/Loading';
import CircularProgress from '@mui/material/CircularProgress';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PaymentIcon from '@mui/icons-material/Payment';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DownloadIcon from '@mui/icons-material/Download';
import FilterStatusBar from '../components/FilterStatusBar';
import ReusableFilterControls from '../components/ReusableFilterControls';
import { useToastNotifications } from '../hooks/useToast';

const OrderHistory = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { showError } = useToastNotifications();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadingInvoices, setDownloadingInvoices] = useState(new Set());

  // Filter states - managed at parent level like OrderManagement
  const [filters, setFilters] = useState({
    searchQuery: '',
    orderStatus: '',
    paymentStatus: '',
    paymentMethod: '',
    amountRange: [0, 1000],
    startDate: null,
    endDate: null,
    hasInvoice: false,
  });

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Handle filter changes - consistent with OrderManagement pattern
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  // Handle date range changes with validation
  const handleDateRangeChange = (index, date) => {
    if (index === 0) {
      // Start date selected
      if (filters.endDate && date && date > filters.endDate) {
        // If start date is after end date, show error and don't update
        showError('Start date cannot be after end date');
        return;
      }
      handleFilterChange('startDate', date);
    } else {
      // End date selected
      if (filters.startDate && date && date < filters.startDate) {
        // If end date is before start date, show error and don't update
        showError('End date cannot be before start date');
        return;
      }
      handleFilterChange('endDate', date);
    }
  };

  // Clear all filters - consistent with OrderManagement pattern
  const clearFilters = () => {
    setFilters({
      searchQuery: '',
      orderStatus: '',
      paymentStatus: '',
      paymentMethod: '',
      amountRange: [0, 1000],
      startDate: null,
      endDate: null,
      hasInvoice: false,
    });
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Search filter
      if (filters.searchQuery) {
        const searchLower = filters.searchQuery.toLowerCase();
        const orderId = order._id.slice(-8).toLowerCase();
        const productNames =
          order.items
            ?.map(item => item.product?.name?.toLowerCase() || '')
            .join(' ') || '';

        if (
          !orderId.includes(searchLower) &&
          !productNames.includes(searchLower)
        ) {
          return false;
        }
      }

      // Order status filter
      if (
        filters.orderStatus &&
        order.orderStatus?.toLowerCase() !== filters.orderStatus.toLowerCase()
      ) {
        return false;
      }

      // Payment status filter
      if (
        filters.paymentStatus &&
        order.paymentStatus?.toLowerCase() !==
          filters.paymentStatus.toLowerCase()
      ) {
        return false;
      }

      // Payment method filter
      if (
        filters.paymentMethod &&
        order.paymentMode?.toLowerCase() !== filters.paymentMethod.toLowerCase()
      ) {
        return false;
      }

      // Amount range filter
      const orderAmount = order.totalAmount || 0;
      if (
        orderAmount < filters.amountRange[0] ||
        orderAmount > filters.amountRange[1]
      ) {
        return false;
      }

      // Date range filter
      if (filters.startDate || filters.endDate) {
        const orderDate = new Date(order.createdAt);
        if (filters.startDate && orderDate < filters.startDate) {
          return false;
        }
        if (filters.endDate && orderDate > filters.endDate) {
          return false;
        }
      }

      // Invoice filter
      if (filters.hasInvoice && (!order.invoice || !order.invoice._id)) {
        return false;
      }

      return true;
    });
  }, [orders, filters]);

  const handleDownloadInvoice = async invoiceId => {
    try {
      setDownloadingInvoices(prev => new Set(prev).add(invoiceId));
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
      setDownloadingInvoices(prev => {
        const newSet = new Set(prev);
        newSet.delete(invoiceId);
        return newSet;
      });
    }
  };

  const getStatusColor = status => {
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

  const getPaymentStatusColor = status => {
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
      .then(orderList => {
        setOrders(orderList || []);
      })
      .catch(err => {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Box sx={{ maxWidth: '100%', width: '90%', mx: 'auto', pt: 2, mt: 2 }}>
        <Typography
          variant='h4'
          fontWeight={700}
          mb={3}
          align='center'
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
          Orders
        </Typography>

        <Box sx={{ mx: 'auto', pt: 2, my: 3 }}>
          {/* Filter Controls */}
          <ReusableFilterControls
            isMobile={isMobile}
            filterConfig={{
              search: {
                placeholder: 'Search Orders...',
                width: 150,
                maxWidth: 180,
              },
              orderStatus: {
                type: 'select',
                options: [
                  { value: '', label: 'All Statuses' },
                  { value: 'processing', label: 'Processing' },
                  { value: 'shipped', label: 'Shipped' },
                  { value: 'delivered', label: 'Delivered' },
                  { value: 'cancelled', label: 'Cancelled' },
                ],
                width: 120,
                maxWidth: 120,
              },
              paymentStatus: {
                type: 'select',
                options: [
                  { value: '', label: 'All Payment Statuses' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'paid', label: 'Paid' },
                  { value: 'failed', label: 'Failed' },
                ],
                width: 120,
                maxWidth: 120,
              },
              paymentMethod: {
                type: 'select',
                options: [
                  { value: '', label: 'All Methods' },
                  { value: 'cod', label: 'COD' },
                  { value: 'upi', label: 'UPI' },
                  { value: 'card', label: 'Card' },
                  { value: 'paypal', label: 'PayPal' },
                  { value: 'net_banking', label: 'Net Banking' },
                ],
                width: 120,
                maxWidth: 120,
              },
              priceRange: {
                type: 'range',
                min: 0,
                max: 10000,
                step: 1,
              },
              startDate: {
                type: 'date',
                label: 'Start Date',
                width: 140,
                maxWidth: 140,
              },
              endDate: {
                type: 'date',
                label: 'End Date',
                width: 140,
                maxWidth: 140,
              },
              hasInvoice: {
                type: 'checkbox',
                label: 'Has Invoice',
              },
            }}
            filterValues={{
              searchQuery: filters.searchQuery,
              orderStatus: filters.orderStatus,
              paymentStatus: filters.paymentStatus,
              paymentMethod: filters.paymentMethod,
              priceRange: filters.amountRange,
              startDate: filters.startDate,
              endDate: filters.endDate,
              hasInvoice: filters.hasInvoice,
            }}
            onFilterChange={(field, value) => {
              switch (field) {
                case 'searchQuery':
                  handleFilterChange('searchQuery', value);
                  break;
                case 'orderStatus':
                  handleFilterChange('orderStatus', value);
                  break;
                case 'paymentStatus':
                  handleFilterChange('paymentStatus', value);
                  break;
                case 'paymentMethod':
                  handleFilterChange('paymentMethod', value);
                  break;
                case 'priceRange':
                  if (Array.isArray(value)) {
                    handleFilterChange('amountRange', value);
                  }
                  break;
                case 'startDate':
                  handleDateRangeChange(0, value);
                  break;
                case 'endDate':
                  handleDateRangeChange(1, value);
                  break;
                case 'hasInvoice':
                  handleFilterChange('hasInvoice', value);
                  break;
                default:
                  break;
              }
            }}
            onClearFilters={clearFilters}
            filterDrawerOpen={filterDrawerOpen}
            setFilterDrawerOpen={setFilterDrawerOpen}
            drawerTitle='Filter Orders'
          />
        </Box>

        {/* Filter Summary */}
        {!loading && orders.length > 0 && (
          <FilterStatusBar
            showing={filteredOrders.length}
            total={orders.length}
            itemType='orders'
            filters={filters}
            customActiveCheck={
              filters.searchQuery ||
              filters.orderStatus ||
              filters.paymentStatus ||
              filters.paymentMethod ||
              filters.amountRange[0] > 0 ||
              filters.amountRange[1] < 1000 ||
              filters.startDate ||
              filters.endDate ||
              filters.hasInvoice
            }
          />
        )}
      </Box>
      <Box
        sx={{
          maxWidth: '100%',
          width: '90%',
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
        {error && (
          <Alert
            severity='error'
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
        ) : filteredOrders.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 2,
              background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c4 100%)',
              borderRadius: 2,
              border: '1px solid #e6d897',
            }}
          >
            <ShoppingBagIcon sx={{ fontSize: 64, color: '#a3824c', mb: 2 }} />
            <Typography variant='h6' color='#a3824c' fontWeight={600} mb={1}>
              {orders.length === 0
                ? 'No Orders Found'
                : 'No Orders Match Filters'}
            </Typography>
            <Typography color='#b59961'>
              {orders.length === 0
                ? 'Start shopping to see your order history here'
                : 'Try adjusting your filters to see more orders'}
            </Typography>
          </Box>
        ) : (
          <Stack spacing={3}>
            {filteredOrders.map(order => (
              <Paper
                key={order._id}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  background:
                    'linear-gradient(90deg, #fffbe6 0%, #f7e7c4 100%)',
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
                    direction='row'
                    justifyContent='space-between'
                    alignItems='flex-start'
                    flexWrap='wrap'
                    gap={2}
                  >
                    <Box>
                      <Stack direction='row' alignItems='center' gap={1} mb={1}>
                        <Typography
                          variant='h6'
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
                        {/* Invoice Download */}
                        {order.invoice && order.invoice._id ? (
                          <Box sx={{ textAlign: 'center' }}>
                            <IconButton
                              size='small'
                              onClick={() =>
                                handleDownloadInvoice(order.invoice._id)
                              }
                              disabled={downloadingInvoices.has(
                                order.invoice._id
                              )}
                              sx={{
                                minWidth: 28,
                                width: 28,
                                height: 28,
                                borderRadius: '4px',
                                color: '#a3824c',
                                transition: 'all 0.3s ease',
                                '&:disabled': {
                                  background:
                                    'linear-gradient(90deg, #f5f5f5 0%, #e0e0e0 100%)',
                                  color: '#999',
                                  borderColor: '#ccc',
                                  transform: 'none',
                                  boxShadow: 'none',
                                },
                              }}
                              title={
                                downloadingInvoices.has(order.invoice._id)
                                  ? 'Downloading...'
                                  : 'Download Invoice'
                              }
                            >
                              {downloadingInvoices.has(order.invoice._id) ? (
                                <CircularProgress
                                  size={15}
                                  sx={{ color: '#a3824c' }}
                                />
                              ) : (
                                <DownloadIcon sx={{ fontSize: 16 }} />
                              )}
                            </IconButton>
                          </Box>
                        ) : (
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography
                              variant='body2'
                              color='#b59961'
                              fontStyle='italic'
                            >
                              Invoice pending payment
                            </Typography>
                          </Box>
                        )}
                      </Stack>

                      <Stack direction='row' alignItems='center' gap={1} mb={1}>
                        <CalendarTodayIcon
                          sx={{ fontSize: 16, color: '#a3824c' }}
                        />
                        <Typography variant='body2' color='#b59961'>
                          {new Date(order.createdAt).toLocaleDateString(
                            'en-IN',
                            {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            }
                          )}
                        </Typography>
                      </Stack>

                      <Stack direction='row' gap={2} flexWrap='wrap'>
                        <Chip
                          icon={<LocalShippingIcon />}
                          label={
                            order.orderStatus.charAt(0).toUpperCase() +
                              order.orderStatus.slice(1) || 'Processing'
                          }
                          size='small'
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
                          label={`${
                            order.paymentStatus.charAt(0).toUpperCase() +
                              order.paymentStatus.slice(1) || 'Pending'
                          }`}
                          size='small'
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
                        <Chip
                          icon={<PaymentIcon />}
                          label={order.paymentMode.toUpperCase() || 'COD'}
                          size='small'
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
                      <Typography variant='caption' color='#b59961'>
                        Total Amount
                      </Typography>
                      <Typography
                        variant='h5'
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
                    </Box>
                  </Stack>
                </Box>

                {/* Order Items */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant='subtitle1'
                    fontWeight={600}
                    mb={2}
                    sx={{
                      color: '#a3824c',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      gap: 1,
                    }}
                  >
                    Particulars
                  </Typography>

                  <Stack spacing={{ xs: 1, sm: 1.5, md: 2 }}>
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, index) => (
                        <Box
                          key={item.product?._id || index}
                          sx={{
                            borderBottom: '1px solid #e6d897',
                            background:
                              'linear-gradient(90deg, #fffbe6 0%, #f7e7c4 100%)',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: { xs: 'flex-start', sm: 'center' },
                          }}
                        >
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              fontWeight={500}
                              color='#a3824c'
                              sx={{
                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                              }}
                            >
                              {item.product?.name || 'Product Name Unavailable'}
                            </Typography>
                            <Typography
                              variant='body2'
                              color='#b59961'
                              sx={{
                                fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                              }}
                            >
                              Quantity: {item.quantity || 0}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                            <Typography
                              variant='body2'
                              color='#b59961'
                              sx={{
                                fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                              }}
                            >
                              Price: ₹{item.price || 0}
                            </Typography>
                            <Typography
                              fontWeight={600}
                              sx={{
                                background:
                                  'linear-gradient(90deg, #a3824c 0%, #b59961 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                              }}
                            >
                              Total: ₹{(item.price || 0) * (item.quantity || 0)}
                            </Typography>
                          </Box>
                        </Box>
                      ))
                    ) : (
                      <Typography
                        color='#b59961'
                        textAlign='center'
                        py={{ xs: 1.5, sm: 2 }}
                        sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                      >
                        No items found for this order
                      </Typography>
                    )}
                  </Stack>
                </Box>
              </Paper>
            ))}
          </Stack>
        )}
      </Box>
    </>
  );
};

export default OrderHistory;
