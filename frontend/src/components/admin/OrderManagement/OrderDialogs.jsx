import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton,
  Stack,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Close as CloseIcon } from '@mui/icons-material';
import ApiService from '../../../services/api';
import { useToastNotifications } from '../../../hooks/useToast';

const OrderDialogs = ({
  statusDialogOpen,
  paymentDialogOpen,
  selectedOrder,
  isMobile,
  onStatusDialogClose,
  onPaymentDialogClose,
  onUpdateSuccess,
}) => {
  const { showError } = useToastNotifications();
  const theme = useTheme();

  // Standard TextField styling to match project theme
  const getTextFieldStyles = () => ({
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main,
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.main,
      },
      '&.Mui-error fieldset': {
        borderColor: theme.palette.error.main,
        borderWidth: '2px',
      },
    },
    '& .MuiInputLabel-root': {
      '&.Mui-focused': { color: theme.palette.primary.main },
      '&.Mui-error': { color: theme.palette.error.main },
    },
    '& .MuiFormHelperText-root': {
      '&.Mui-error': {
        color: theme.palette.error.main,
      },
    },
  });

  // Standard Select styling to match project theme
  const getSelectStyles = () => ({
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main,
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.main,
      },
      '&.Mui-error fieldset': {
        borderColor: theme.palette.error.main,
        borderWidth: '2px',
      },
    },
    '& .MuiInputLabel-root': {
      '&.Mui-focused': { color: theme.palette.primary.main },
      '&.Mui-error': { color: theme.palette.error.main },
    },
    '& .MuiSelect-icon': {
      color: theme.palette.primary.main,
    },
  });
  const [statusForm, setStatusForm] = useState({
    orderStatus: '',
    trackingNumber: '',
    trackingUrl: '',
    notes: '',
  });

  const [paymentForm, setPaymentForm] = useState({
    paymentStatus: '',
    paymentMethod: '',
    transactionId: '',
  });

  // Reset forms when dialogs open/close
  useEffect(() => {
    if (statusDialogOpen && selectedOrder) {
      setStatusForm({
        orderStatus: selectedOrder.orderStatus || '',
        trackingNumber: selectedOrder.tracking?.number || '',
        trackingUrl: selectedOrder.tracking?.url || '',
        notes: '',
      });
    }
  }, [statusDialogOpen, selectedOrder]);

  useEffect(() => {
    if (paymentDialogOpen && selectedOrder) {
      setPaymentForm({
        paymentStatus: selectedOrder.paymentStatus || '',
        paymentMethod: selectedOrder.paymentMode || '',
        transactionId: selectedOrder.transactionId || '',
      });
    }
  }, [paymentDialogOpen, selectedOrder]);

  // Update order status
  const handleStatusUpdate = async () => {
    try {
      await ApiService.updateOrderStatus(selectedOrder._id, statusForm);
      onUpdateSuccess('Order status updated successfully');
      onStatusDialogClose();
    } catch (error) {
      console.error('Failed to update order status:', error);
      showError('Failed to update order status. Please try again.');
    }
  };

  // Update payment status
  const handlePaymentUpdate = async () => {
    try {
      await ApiService.updateOrderStatus(selectedOrder._id, paymentForm);
      onUpdateSuccess('Payment status updated successfully');
      onPaymentDialogClose();
    } catch (error) {
      console.error('Failed to update payment status:', error);
      showError('Failed to update payment status. Please try again.');
    }
  };

  return (
    <>
      {/* Status Update Dialog */}
      <Dialog
        open={statusDialogOpen}
        onClose={onStatusDialogClose}
        maxWidth={isMobile ? false : 'sm'}
        fullWidth
        fullScreen={isMobile}
        slotProps={{
          paper: {
            sx: {
              boxShadow: theme.shadows[8],
              maxWidth: isMobile ? '100%' : '600px',
              width: isMobile ? '100%' : '90%',
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
            color: theme.palette.primary.contrastText,
            fontWeight: 700,
            borderRadius: isMobile ? 0 : '12px 12px 0 0',
            position: 'relative',
          }}
        >
          Update Order Status
          {isMobile && (
            <IconButton
              onClick={onStatusDialogClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: theme.palette.primary.contrastText,
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            background: theme.palette.background.paper,
            p: isMobile ? 2 : 3,
            minHeight: isMobile ? 'auto' : '400px',
          }}
        >
          <Stack spacing={isMobile ? 2 : 3}>
            <FormControl fullWidth>
              <InputLabel>Order Status</InputLabel>
              <Select
                value={statusForm.orderStatus}
                onChange={e =>
                  setStatusForm(prev => ({
                    ...prev,
                    orderStatus: e.target.value,
                  }))
                }
                label='Order Status'
                sx={getSelectStyles()}
              >
                <MenuItem value='processing'>Processing</MenuItem>
                <MenuItem value='shipped'>Shipped</MenuItem>
                <MenuItem value='delivered'>Delivered</MenuItem>
                <MenuItem value='cancelled'>Cancelled</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label='Tracking Number'
              value={statusForm.trackingNumber}
              onChange={e =>
                setStatusForm(prev => ({
                  ...prev,
                  trackingNumber: e.target.value,
                }))
              }
              placeholder='Enter tracking number'
              sx={getTextFieldStyles()}
            />

            <TextField
              fullWidth
              label='Tracking URL'
              value={statusForm.trackingUrl}
              onChange={e =>
                setStatusForm(prev => ({
                  ...prev,
                  trackingUrl: e.target.value,
                }))
              }
              placeholder='Enter tracking URL'
              sx={getTextFieldStyles()}
            />

            <TextField
              fullWidth
              label='Admin Notes'
              value={statusForm.notes}
              onChange={e =>
                setStatusForm(prev => ({ ...prev, notes: e.target.value }))
              }
              placeholder='Add notes (optional)'
              multiline
              rows={isMobile ? 2 : 3}
              sx={getTextFieldStyles()}
            />
          </Stack>
        </DialogContent>
        <DialogActions
          sx={{
            background: theme.palette.background.paper,
            p: 2,
            borderRadius: isMobile ? 0 : '0 0 12px 12px',
            justifyContent: isMobile ? 'stretch' : 'flex-end',
            gap: 1,
          }}
        >
          <Button
            onClick={onStatusDialogClose}
            sx={{
              color: theme.palette.primary.main,
              border: `1px solid ${theme.palette.primary.main}`,
              borderRadius: 2,
              px: 3,
              flex: isMobile ? 1 : 'none',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                borderColor: theme.palette.primary.dark,
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleStatusUpdate}
            variant='contained'
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: theme.palette.primary.contrastText,
              textTransform: 'none',
              boxShadow: theme.shadows[4],
              borderRadius: 2,
              px: 3,
              flex: isMobile ? 1 : 'none',
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[6],
              },
              transition: 'all 0.3s ease',
            }}
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Update Dialog */}
      <Dialog
        open={paymentDialogOpen}
        onClose={onPaymentDialogClose}
        maxWidth={isMobile ? false : 'sm'}
        fullWidth
        fullScreen={isMobile}
        slotProps={{
          paper: {
            sx: {
              boxShadow: theme.shadows[8],
              maxWidth: isMobile ? '100%' : '600px',
              width: isMobile ? '100%' : '90%',
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
            color: theme.palette.primary.contrastText,
            fontWeight: 700,
            borderRadius: isMobile ? 0 : '12px 12px 0 0',
            position: 'relative',
          }}
        >
          Update Payment Status
          {isMobile && (
            <IconButton
              onClick={onPaymentDialogClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: theme.palette.primary.contrastText,
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            background: theme.palette.background.paper,
            p: isMobile ? 2 : 3,
            minHeight: isMobile ? 'auto' : '400px',
          }}
        >
          <Stack spacing={isMobile ? 2 : 3}>
            <FormControl fullWidth>
              <InputLabel>Payment Status</InputLabel>
              <Select
                value={paymentForm.paymentStatus}
                onChange={e =>
                  setPaymentForm(prev => ({
                    ...prev,
                    paymentStatus: e.target.value,
                  }))
                }
                label='Payment Status'
                sx={getSelectStyles()}
              >
                <MenuItem value='pending'>Pending</MenuItem>
                <MenuItem value='paid'>Paid</MenuItem>
                <MenuItem value='failed'>Failed</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Payment Method</InputLabel>
              <Select
                value={paymentForm.paymentMethod}
                onChange={e =>
                  setPaymentForm(prev => ({
                    ...prev,
                    paymentMethod: e.target.value,
                  }))
                }
                label='Payment Method'
                sx={getSelectStyles()}
              >
                <MenuItem value='cod'>Cash on Delivery</MenuItem>
                <MenuItem value='upi'>UPI</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label='Transaction ID'
              value={paymentForm.transactionId}
              onChange={e =>
                setPaymentForm(prev => ({
                  ...prev,
                  transactionId: e.target.value,
                }))
              }
              placeholder='Enter transaction ID (optional)'
              sx={getTextFieldStyles()}
            />
          </Stack>
        </DialogContent>
        <DialogActions
          sx={{
            background: theme.palette.background.paper,
            p: 2,
            borderRadius: isMobile ? 0 : '0 0 12px 12px',
            justifyContent: isMobile ? 'stretch' : 'flex-end',
            gap: 1,
          }}
        >
          <Button
            onClick={onPaymentDialogClose}
            sx={{
              color: theme.palette.primary.main,
              border: `1px solid ${theme.palette.primary.main}`,
              borderRadius: 2,
              px: 3,
              flex: isMobile ? 1 : 'none',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                borderColor: theme.palette.primary.dark,
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePaymentUpdate}
            variant='contained'
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: theme.palette.primary.contrastText,
              textTransform: 'none',
              boxShadow: theme.shadows[4],
              borderRadius: 2,
              px: 3,
              flex: isMobile ? 1 : 'none',
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[6],
              },
              transition: 'all 0.3s ease',
            }}
          >
            Update Payment
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

OrderDialogs.propTypes = {
  statusDialogOpen: PropTypes.bool.isRequired,
  paymentDialogOpen: PropTypes.bool.isRequired,
  selectedOrder: PropTypes.object,
  isMobile: PropTypes.bool.isRequired,
  onStatusDialogClose: PropTypes.func.isRequired,
  onPaymentDialogClose: PropTypes.func.isRequired,
  onUpdateSuccess: PropTypes.func.isRequired,
};

export default OrderDialogs;
