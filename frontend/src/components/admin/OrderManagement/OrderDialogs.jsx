import React, { useState, useEffect } from 'react';
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
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 3,
            boxShadow: '0 8px 32px 0 rgba(163,130,76,0.25)',
            border: isMobile ? 'none' : '1px solid #e6d897',
            maxWidth: isMobile ? '100%' : '600px',
            width: isMobile ? '100%' : '90%',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(90deg, #a3824c 0%, #e6d897 100%)',
            color: '#fff',
            fontWeight: 700,
            borderRadius: isMobile ? 0 : '12px 12px 0 0',
            position: 'relative',
          }}
        >
          Update Order Status
          {isMobile && (
            <IconButton
              onClick={onStatusDialogClose}
              sx={{ position: 'absolute', right: 8, top: 8, color: '#fff' }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background:
                      'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                    borderRadius: isMobile ? 2 : 1.5,
                    boxShadow: '0 1px 4px 0 rgba(163,130,76,0.07)',
                    '&:hover fieldset': { borderColor: '#a3824c' },
                    '&.Mui-focused fieldset': { borderColor: '#a3824c' },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#a3824c',
                    fontWeight: 500,
                    '&.Mui-focused': {
                      color: '#a3824c',
                    },
                  },
                  '& .MuiSelect-icon': {
                    color: '#a3824c',
                  },
                }}
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  background:
                    'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                  borderRadius: isMobile ? 2 : 1.5,
                  boxShadow: '0 1px 4px 0 rgba(163,130,76,0.07)',
                  '&:hover fieldset': { borderColor: '#a3824c' },
                  '&.Mui-focused fieldset': { borderColor: '#a3824c' },
                },
                '& .MuiInputLabel-root': {
                  color: '#a3824c',
                  fontWeight: 500,
                  '&.Mui-focused': {
                    color: '#a3824c',
                  },
                },
              }}
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  background:
                    'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                  borderRadius: isMobile ? 2 : 1.5,
                  boxShadow: '0 1px 4px 0 rgba(163,130,76,0.07)',
                  '&:hover fieldset': { borderColor: '#a3824c' },
                  '&.Mui-focused fieldset': { borderColor: '#a3824c' },
                },
                '& .MuiInputLabel-root': {
                  color: '#a3824c',
                  fontWeight: 500,
                  '&.Mui-focused': {
                    color: '#a3824c',
                  },
                },
              }}
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  background:
                    'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                  borderRadius: isMobile ? 2 : 1.5,
                  boxShadow: '0 1px 4px 0 rgba(163,130,76,0.07)',
                  '&:hover fieldset': { borderColor: '#a3824c' },
                  '&.Mui-focused fieldset': { borderColor: '#a3824c' },
                },
                '& .MuiInputLabel-root': {
                  color: '#a3824c',
                  fontWeight: 500,
                  '&.Mui-focused': {
                    color: '#a3824c',
                  },
                },
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions
          sx={{
            background: 'linear-gradient(90deg, #f7e7c1 0%, #fffbe6 100%)',
            p: 2,
            borderRadius: isMobile ? 0 : '0 0 12px 12px',
            justifyContent: isMobile ? 'stretch' : 'flex-end',
            gap: 1,
          }}
        >
          <Button
            onClick={onStatusDialogClose}
            sx={{
              color: '#a3824c',
              border: '1px solid #a3824c',
              borderRadius: 1,
              px: 3,
              flex: isMobile ? 1 : 'none',
              '&:hover': {
                background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c4 100%)',
                borderColor: '#e6d897',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleStatusUpdate}
            variant='contained'
            sx={{
              background:
                'linear-gradient(135deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
              color: '#fff',
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(163,130,76,0.3)',
              borderRadius: isMobile ? 1 : 2,
              px: 3,
              flex: isMobile ? 1 : 'none',
              '&:hover': {
                background: 'linear-gradient(135deg, #e6d897 0%, #a3824c 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(163,130,76,0.4)',
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
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 3,
            boxShadow: '0 8px 32px 0 rgba(163,130,76,0.25)',
            border: isMobile ? 'none' : '1px solid #e6d897',
            maxWidth: isMobile ? '100%' : '600px',
            width: isMobile ? '100%' : '90%',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(90deg, #a3824c 0%, #e6d897 100%)',
            color: '#fff',
            fontWeight: 700,
            borderRadius: isMobile ? 0 : '12px 12px 0 0',
            position: 'relative',
          }}
        >
          Update Payment Status
          {isMobile && (
            <IconButton
              onClick={onPaymentDialogClose}
              sx={{ position: 'absolute', right: 8, top: 8, color: '#fff' }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background:
                      'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                    borderRadius: isMobile ? 2 : 1.5,
                    boxShadow: '0 1px 4px 0 rgba(163,130,76,0.07)',
                    '&:hover fieldset': { borderColor: '#a3824c' },
                    '&.Mui-focused fieldset': { borderColor: '#a3824c' },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#a3824c',
                    fontWeight: 500,
                    '&.Mui-focused': {
                      color: '#a3824c',
                    },
                  },
                  '& .MuiSelect-icon': {
                    color: '#a3824c',
                  },
                }}
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background:
                      'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                    borderRadius: isMobile ? 2 : 1.5,
                    boxShadow: '0 1px 4px 0 rgba(163,130,76,0.07)',
                    '&:hover fieldset': { borderColor: '#a3824c' },
                    '&.Mui-focused fieldset': { borderColor: '#a3824c' },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#a3824c',
                    fontWeight: 500,
                    '&.Mui-focused': {
                      color: '#a3824c',
                    },
                  },
                  '& .MuiSelect-icon': {
                    color: '#a3824c',
                  },
                }}
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  background:
                    'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
                  borderRadius: isMobile ? 2 : 1.5,
                  boxShadow: '0 1px 4px 0 rgba(163,130,76,0.07)',
                  '&:hover fieldset': { borderColor: '#a3824c' },
                  '&.Mui-focused fieldset': { borderColor: '#a3824c' },
                },
                '& .MuiInputLabel-root': {
                  color: '#a3824c',
                  fontWeight: 500,
                  '&.Mui-focused': {
                    color: '#a3824c',
                  },
                },
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions
          sx={{
            background: 'linear-gradient(90deg, #f7e7c1 0%, #fffbe6 100%)',
            p: 2,
            borderRadius: isMobile ? 0 : '0 0 12px 12px',
            justifyContent: isMobile ? 'stretch' : 'flex-end',
            gap: 1,
          }}
        >
          <Button
            onClick={onPaymentDialogClose}
            sx={{
              color: '#a3824c',
              border: '1px solid #a3824c',
              borderRadius: 1,
              px: 3,
              flex: isMobile ? 1 : 'none',
              '&:hover': {
                background: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c4 100%)',
                borderColor: '#e6d897',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePaymentUpdate}
            variant='contained'
            sx={{
              background:
                'linear-gradient(135deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
              color: '#fff',
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(163,130,76,0.3)',
              borderRadius: isMobile ? 1 : 2,
              px: 3,
              flex: isMobile ? 1 : 'none',
              '&:hover': {
                background: 'linear-gradient(135deg, #e6d897 0%, #a3824c 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(163,130,76,0.4)',
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

export default OrderDialogs;
