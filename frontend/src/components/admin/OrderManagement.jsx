import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import OrderStats from './OrderManagement/OrderStats';
import OrderTable from './OrderManagement/OrderTable';
import OrderDialogs from './OrderManagement/OrderDialogs';
import ThemeSnackbar from '../ThemeSnackbar';
import FilterStatusBar from '../FilterStatusBar';
import ReusableFilterControls from '../ReusableFilterControls';
import ApiService from '../../services/api';
import { useFoldableDisplay } from '../../hooks/useFoldableDisplay';
import Loading from '../Loading';

const OrderManagement = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { getResponsiveSpacingClasses, getResponsiveTypography } =
    useFoldableDisplay();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Main state
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);

  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    paymentStatus: '',
    paymentMethod: '',
    startDate: null,
    endDate: null,
    searchQuery: '',
  });

  // Mobile drawer state for ReusableFilterControls
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Dialog states
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Search typing state to show custom Loading component
  const [isSearching, setIsSearching] = useState(false);

  // Snackbar helper function
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Load orders with filters
  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        ...filters,
        startDate: filters.startDate
          ? filters.startDate.toISOString()
          : undefined,
        endDate: filters.endDate ? filters.endDate.toISOString() : undefined,
      };

      // Remove undefined values
      Object.keys(params).forEach((key) => {
        if (params[key] === undefined || params[key] === '') {
          delete params[key];
        }
      });

      const response = await ApiService.getFilteredOrders(params);
      setOrders(response.orders || []);
      setTotalOrders(response.total || 0);
    } catch (error) {
      console.error('Failed to load orders:', error);
      showSnackbar('Failed to load orders', 'error');
    } finally {
      setLoading(false);
      // Clear searching state when API call completes
      setIsSearching(false);
    }
  }, [page, rowsPerPage, filters]);

  // Load statistics
  const loadStats = async () => {
    try {
      const response = await ApiService.getOrderStats();
      setStats(response);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [page, rowsPerPage, filters, loadOrders]);

  useEffect(() => {
    loadStats();
  }, []);

  // Handle filter changes with date validation
  const handleFilterChange = (field, value) => {
    // Validate date range
    if (field === 'startDate') {
      if (filters.endDate && value && value > filters.endDate) {
        showSnackbar('Start date cannot be after end date', 'error');
        return;
      }
    } else if (field === 'endDate') {
      if (filters.startDate && value && value < filters.startDate) {
        showSnackbar('End date cannot be before start date', 'error');
        return;
      }
    }

    // Track search typing state
    if (field === 'searchQuery') {
      setIsSearching(true);
    }

    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(0); // Reset to first page when filters change
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      status: '',
      paymentStatus: '',
      paymentMethod: '',
      startDate: null,
      endDate: null,
      searchQuery: '',
    });
    setPage(0);
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Open status update dialog
  const openStatusDialog = (order) => {
    setSelectedOrder(order);
    setStatusDialogOpen(true);
  };

  // Open payment update dialog
  const openPaymentDialog = (order) => {
    setSelectedOrder(order);
    setPaymentDialogOpen(true);
  };

  // Handle successful updates
  const handleUpdateSuccess = (message) => {
    showSnackbar(message, 'success');
    loadOrders();
    loadStats();
  };

  return (
    <Box className={getResponsiveSpacingClasses()}>
      <Typography
        variant={getResponsiveTypography('h6')}
        gutterBottom
        sx={{
          fontWeight: 700,
          background:
            'linear-gradient(135deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 3,
          textAlign: isMobile ? 'center' : 'left',
          textShadow: '0 2px 8px rgba(163, 130, 76, 0.1)',
        }}
      >
        Order Management
      </Typography>

      {/* Statistics Section */}
      <OrderStats stats={stats} isMobile={isMobile} />

      {/* Complete Filters Section using ReusableFilterControls */}
      <ReusableFilterControls
        isMobile={isMobile}
        filterConfig={{
          search: {
            placeholder: 'Search Orders...',
            width: 150,
            maxWidth: 180,
          },
          status: {
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
              { value: 'cod', label: 'Cash on Delivery' },
              { value: 'upi', label: 'UPI' },
            ],
            width: 120,
            maxWidth: 120,
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
        }}
        filterValues={{
          searchQuery: filters.searchQuery,
          status: filters.status,
          paymentStatus: filters.paymentStatus,
          paymentMethod: filters.paymentMethod,
          startDate: filters.startDate,
          endDate: filters.endDate,
        }}
        onFilterChange={handleFilterChange}
        onClearFilters={() => {
          clearFilters();
          setFilterDrawerOpen(false);
        }}
        filterDrawerOpen={filterDrawerOpen}
        setFilterDrawerOpen={setFilterDrawerOpen}
        drawerTitle="Filter Orders"
      />

      {/* Order Count and Filter Status */}
      {orders.length > 0 && !isSearching && (
        <FilterStatusBar
          showing={orders.length}
          total={totalOrders}
          itemType="orders"
          filters={filters}
          loading={loading}
        />
      )}

      {/* Show custom Loading component when searching */}
      {isSearching ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: isMobile ? '300px' : '400px',
            flexDirection: 'column',
            gap: 1,
            px: 2,
            py: 4,
          }}
        >
          <Loading
            message={`Searching orders for "${filters.searchQuery}"...`}
            size={isMobile ? 'small' : 'medium'}
            variant="default"
          />
        </Box>
      ) : (
        /* Orders Table */
        <OrderTable
          orders={orders}
          page={page}
          rowsPerPage={rowsPerPage}
          totalOrders={totalOrders}
          isMobile={isMobile}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          onStatusUpdate={openStatusDialog}
          onPaymentUpdate={openPaymentDialog}
          loading={loading}
        />
      )}

      {/* Dialogs */}
      <OrderDialogs
        statusDialogOpen={statusDialogOpen}
        paymentDialogOpen={paymentDialogOpen}
        selectedOrder={selectedOrder}
        isMobile={isMobile}
        onStatusDialogClose={() => setStatusDialogOpen(false)}
        onPaymentDialogClose={() => setPaymentDialogOpen(false)}
        onUpdateSuccess={handleUpdateSuccess}
      />

      {/* Snackbar */}
      <ThemeSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
      />
    </Box>
  );
};

export default OrderManagement;
