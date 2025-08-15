import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  Chip,
  Tooltip,
  Card,
  CardContent,
} from '@mui/material';
import { Edit as EditIcon, Payment as PaymentIcon } from '@mui/icons-material';
import { useFoldableDisplay } from '../../../hooks/useFoldableDisplay';
import Loading from '../../Loading';

const OrderTable = ({
  orders,
  page,
  rowsPerPage,
  totalOrders,
  isMobile,
  onPageChange,
  onRowsPerPageChange,
  onStatusUpdate,
  onPaymentUpdate,
  loading = false,
}) => {
  const { isExtraSmall, isSmall } = useFoldableDisplay();

  // Enhanced mobile order card
  const renderMobileOrderCard = order => (
    <Card
      key={order._id}
      sx={{
        mb: 2,
        background:
          'linear-gradient(135deg, var(--color-cream-light) 0%, var(--color-cream-medium) 100%)',
        border: '1px solid var(--color-primary-light)',
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(163, 130, 76, 0.1)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 16px rgba(163, 130, 76, 0.2)',
        },
      }}
      className='card-golden'
    >
      <CardContent sx={{ p: 2 }}>
        {/* Order Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 2,
            pb: 1,
            borderBottom: '1px solid rgba(163, 130, 76, 0.2)',
          }}
        >
          <Box>
            <Typography
              variant='subtitle2'
              sx={{
                fontWeight: 700,
                color: 'var(--color-primary)',
                mb: 0.5,
                textShadow: '0 1px 2px rgba(163, 130, 76, 0.2)',
              }}
            >
              #{order._id.slice(-8)}
            </Typography>
            <Typography
              variant='caption'
              sx={{
                color: 'var(--color-primary-light)',
                fontWeight: 500,
              }}
            >
              {new Date(order.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
          <Chip
            label={order.orderStatus || 'Pending'}
            color={getStatusColor(order.orderStatus)}
            size='small'
            sx={getChipStyles('orderStatus', order.orderStatus)}
          />
        </Box>

        {/* Customer Info */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant='body2'
            sx={{
              fontWeight: 600,
              color: 'var(--color-primary)',
              mb: 0.5,
            }}
          >
            {order.user?.firstName + ' ' + order.user?.lastName || 'N/A'}
          </Typography>
          <Typography
            variant='caption'
            sx={{
              color: 'var(--color-primary-light)',
              fontWeight: 500,
            }}
          >
            {order.user?.email || 'N/A'}
          </Typography>
        </Box>

        {/* Order Details */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
            p: 1.5,
            background: 'rgba(163, 130, 76, 0.05)',
            borderRadius: 1,
            border: '1px solid rgba(163, 130, 76, 0.1)',
          }}
        >
          <Typography
            variant='body2'
            sx={{
              fontWeight: 600,
              color: 'var(--color-primary)',
            }}
          >
            Amount:
          </Typography>
          <Typography
            variant='body2'
            sx={{
              fontWeight: 700,
              color: 'var(--color-accent)',
              fontSize: '1.1rem',
            }}
          >
            ₹{order.totalAmount?.toFixed(2) || '0.00'}
          </Typography>
        </Box>

        {/* Payment Method */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography
            variant='body2'
            sx={{
              fontWeight: 600,
              color: 'var(--color-primary)',
            }}
          >
            Payment Method:
          </Typography>
          <Chip
            label={order.paymentMethod || 'Pending'}
            color={getPaymentStatusColor(order.paymentMethod)}
            size='small'
            sx={getChipStyles('paymentMethod', order.paymentMethod)}
          />
        </Box>

        {/* Payment Status */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography
            variant='body2'
            sx={{
              fontWeight: 600,
              color: 'var(--color-primary)',
            }}
          >
            Payment Status:
          </Typography>
          <Chip
            label={order.paymentStatus || 'Pending'}
            color={getPaymentStatusColor(order.paymentStatus)}
            size='small'
            sx={getChipStyles('paymentStatus', order.paymentStatus)}
            variant='outlined'
          />
        </Box>

        {/* Actions */}
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            justifyContent: 'flex-end',
            pt: 1,
            borderTop: '1px solid rgba(163, 130, 76, 0.2)',
          }}
        >
          <Tooltip title='Update Status'>
            <IconButton
              size='small'
              onClick={() => onStatusUpdate(order)}
              sx={{
                color: 'var(--color-primary)',
                backgroundColor: 'rgba(163, 130, 76, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(163, 130, 76, 0.2)',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <EditIcon fontSize='small' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Update Payment'>
            <IconButton
              size='small'
              onClick={() => onPaymentUpdate(order)}
              sx={{
                color: 'var(--color-accent)',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(76, 175, 80, 0.2)',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <PaymentIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );

  // Enhanced responsive table with mobile cards
  const renderOrdersTable = () => {
    if (isMobile || isExtraSmall || isSmall) {
      return (
        <Box>
          {orders.length === 0 ? (
            <Box
              sx={{
                textAlign: 'center',
                p: 4,
                background:
                  'linear-gradient(135deg, rgba(163, 130, 76, 0.05) 0%, rgba(230, 216, 151, 0.1) 100%)',
                borderRadius: 2,
                border: '1px solid rgba(163, 130, 76, 0.2)',
              }}
            >
              <Typography
                sx={{
                  color: 'var(--color-primary)',
                  fontWeight: 500,
                  fontSize: '1.1rem',
                }}
              >
                No orders found
              </Typography>
              <Typography
                variant='body2'
                sx={{
                  color: 'var(--color-primary-light)',
                  mt: 1,
                  opacity: 0.8,
                }}
              >
                Try adjusting your filters or search criteria
              </Typography>
            </Box>
          ) : (
            orders.map(renderMobileOrderCard)
          )}
        </Box>
      );
    }

    return (
      <TableContainer
        component={Paper}
        sx={{
          background:
            'linear-gradient(135deg, var(--color-cream-light) 0%, var(--color-cream-medium) 100%)',
          border: '1px solid var(--color-primary-light)',
          borderRadius: 2,
          boxShadow: '0 3px 12px rgba(163, 130, 76, 0.15)',
          overflow: 'hidden',
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                background:
                  'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
              }}
            >
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: 'white',
                  fontSize: '0.9rem',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                }}
              >
                Order ID
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: 'white',
                  fontSize: '0.9rem',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                }}
              >
                Customer
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: 'white',
                  fontSize: '0.9rem',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                }}
              >
                Amount
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: 'white',
                  fontSize: '0.9rem',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                }}
              >
                Status
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: 'white',
                  fontSize: '0.9rem',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                }}
              >
                Payment Mode
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: 'white',
                  fontSize: '0.9rem',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                }}
              >
                Payment Status
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: 'white',
                  fontSize: '0.9rem',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                }}
              >
                Date
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: 'white',
                  fontSize: '0.9rem',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align='center'>
                  <Box
                    sx={{
                      py: 4,
                      textAlign: 'center',
                      background: 'rgba(163, 130, 76, 0.05)',
                    }}
                  >
                    <Typography
                      sx={{
                        color: 'var(--color-primary)',
                        fontWeight: 500,
                        fontSize: '1.1rem',
                      }}
                    >
                      No orders found
                    </Typography>
                    <Typography
                      variant='body2'
                      sx={{
                        color: 'var(--color-primary-light)',
                        mt: 1,
                        opacity: 0.8,
                      }}
                    >
                      Try adjusting your filters or search criteria
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              orders.map(order => (
                <TableRow
                  key={order._id}
                  hover
                  sx={{
                    '&:hover': {
                      background: 'rgba(163, 130, 76, 0.05)',
                    },
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  <TableCell>
                    <Typography
                      variant='body2'
                      sx={{
                        fontWeight: 600,
                        color: 'var(--color-primary)',
                        fontFamily: 'monospace',
                      }}
                    >
                      #{order._id.slice(-8)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant='body2'
                      sx={{
                        fontWeight: 600,
                        color: 'var(--color-primary)',
                      }}
                    >
                      {order.user?.firstName + ' ' + order.user?.lastName ||
                        'N/A'}
                    </Typography>
                    <Typography
                      variant='caption'
                      sx={{
                        color: 'var(--color-primary-light)',
                        fontWeight: 500,
                      }}
                    >
                      {order.user?.email || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant='body2'
                      sx={{
                        fontWeight: 700,
                        color: 'var(--color-accent)',
                        fontSize: '1.1rem',
                      }}
                    >
                      ₹{order.totalAmount?.toFixed(2) || '0.00'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.orderStatus || 'Pending'}
                      color={getStatusColor(order.orderStatus)}
                      size='small'
                      sx={getChipStyles('orderStatus', order.orderStatus)}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={(order.paymentMode || '').toUpperCase()}
                      color={getPaymentStatusColor(order.paymentMode)}
                      size='small'
                      sx={getChipStyles('paymentMode', order.paymentMode)}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.paymentStatus || 'Pending'}
                      color={getPaymentStatusColor(order.paymentStatus)}
                      size='small'
                      sx={getChipStyles('paymentStatus', order.paymentStatus)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant='body2'
                      sx={{
                        color: 'var(--color-primary)',
                        fontWeight: 500,
                      }}
                    >
                      {new Date(order.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title='Update Status'>
                        <IconButton
                          size='small'
                          onClick={() => onStatusUpdate(order)}
                          sx={{
                            color: 'var(--color-primary)',
                            backgroundColor: 'rgba(163, 130, 76, 0.1)',
                            '&:hover': {
                              backgroundColor: 'rgba(163, 130, 76, 0.2)',
                              transform: 'scale(1.1)',
                            },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <EditIcon fontSize='small' />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title='Update Payment'>
                        <IconButton
                          size='small'
                          onClick={() => onPaymentUpdate(order)}
                          sx={{
                            color: 'var(--color-accent)',
                            backgroundColor: 'rgba(76, 175, 80, 0.1)',
                            '&:hover': {
                              backgroundColor: 'rgba(76, 175, 80, 0.2)',
                              transform: 'scale(1.1)',
                            },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <PaymentIcon fontSize='small' />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  // Enhanced pagination
  const renderPagination = () => (
    <Box
      sx={{
        mt: 3,
        display: 'flex',
        justifyContent: 'center',
        background:
          'linear-gradient(135deg, rgba(163, 130, 76, 0.05) 0%, rgba(230, 216, 151, 0.1) 100%)',
        borderRadius: 2,
        border: '1px solid rgba(163, 130, 76, 0.2)',
        p: 2,
      }}
    >
      <TablePagination
        component='div'
        count={totalOrders}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25, 50]}
        sx={{
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows':
            {
              color: 'var(--color-primary)',
              fontWeight: 600,
            },
          '& .MuiTablePagination-select': {
            color: 'var(--color-primary)',
            fontWeight: 600,
          },
          '& .MuiIconButton-root': {
            color: 'var(--color-primary)',
            '&:hover': {
              backgroundColor: 'rgba(163, 130, 76, 0.1)',
            },
          },
          '& .MuiIconButton-root.Mui-disabled': {
            color: 'var(--color-primary-light)',
          },
        }}
      />
    </Box>
  );

  return (
    <Box sx={{ position: 'relative' }}>
      {renderOrdersTable()}
      {renderPagination()}

      {/* Loading overlay for filter updates */}
      {loading && (
        <Loading
          message='Loading orders...'
          size='small'
          variant='default'
          showDots={false}
          showIcon={true}
        />
      )}
    </Box>
  );
};

// Enhanced color coding functions
const getStatusColor = status => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 'warning';
    case 'processing':
      return 'info';
    case 'shipped':
      return 'primary';
    case 'delivered':
      return 'success';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};

const getPaymentStatusColor = status => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 'warning';
    case 'completed':
      return 'success';
    case 'failed':
      return 'error';
    case 'refunded':
      return 'info';
    default:
      return 'default';
  }
};

const getChipStyles = (type, value) => {
  const baseStyles = {
    fontWeight: 700,
    fontSize: '0.75rem',
    textTransform: 'capitalize',
    boxShadow: '0 2px 8px rgba(163, 130, 76, 0.15)',
    border: '1px solid rgba(163, 130, 76, 0.2)',
    '& .MuiChip-label': {
      fontWeight: 700,
      fontSize: '0.75rem',
    },
  };

  if (type === 'orderStatus') {
    switch (value?.toLowerCase()) {
      case 'pending':
        return {
          ...baseStyles,
          background:
            'linear-gradient(135deg, #ffb300 0%, #f57c00 100%) !important',
          color: 'white !important',
          '& .MuiChip-label': {
            ...baseStyles['& .MuiChip-label'],
            color: 'white !important',
          },
        };
      case 'processing':
        return {
          ...baseStyles,
          background:
            'linear-gradient(135deg, #a3824c 0%, #866422 100%) !important',
          color: 'white !important',
          '& .MuiChip-label': {
            ...baseStyles['& .MuiChip-label'],
            color: 'white !important',
          },
        };
      case 'shipped':
        return {
          ...baseStyles,
          background:
            'linear-gradient(135deg, #e6d897 0%, #b59961 100%) !important',
          color: '#2e3a1b !important',
          '& .MuiChip-label': {
            ...baseStyles['& .MuiChip-label'],
            color: '#2e3a1b !important',
          },
        };
      case 'delivered':
        return {
          ...baseStyles,
          background:
            'linear-gradient(135deg, #388e3c 0%, #1b5e20 100%) !important',
          color: 'white !important',
          '& .MuiChip-label': {
            ...baseStyles['& .MuiChip-label'],
            color: 'white !important',
          },
        };
      case 'cancelled':
        return {
          ...baseStyles,
          background:
            'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%) !important',
          color: 'white !important',
          '& .MuiChip-label': {
            ...baseStyles['& .MuiChip-label'],
            color: 'white !important',
          },
        };
      default:
        return baseStyles;
    }
  }

  if (type === 'paymentStatus') {
    switch (value?.toLowerCase()) {
      case 'pending':
        return {
          ...baseStyles,
          background:
            'linear-gradient(135deg, #ffb300 0%, #f57c00 100%) !important',
          color: 'white !important',
          '& .MuiChip-label': {
            ...baseStyles['& .MuiChip-label'],
            color: 'white !important',
          },
        };
      case 'completed':
        return {
          ...baseStyles,
          background:
            'linear-gradient(135deg, #388e3c 0%, #1b5e20 100%) !important',
          color: 'white !important',
          '& .MuiChip-label': {
            ...baseStyles['& .MuiChip-label'],
            color: 'white !important',
          },
        };
      case 'failed':
        return {
          ...baseStyles,
          background:
            'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%) !important',
          color: 'white !important',
          '& .MuiChip-label': {
            ...baseStyles['& .MuiChip-label'],
            color: 'white !important',
          },
        };
      case 'refunded':
        return {
          ...baseStyles,
          background:
            'linear-gradient(135deg, #0288d1 0%, #01579b 100%) !important',
          color: 'white !important',
          '& .MuiChip-label': {
            ...baseStyles['& .MuiChip-label'],
            color: 'white !important',
          },
        };
      default:
        return baseStyles;
    }
  }

  if (type === 'paymentMode') {
    switch (value?.toLowerCase()) {
      case 'cod':
        return {
          ...baseStyles,
          background:
            'linear-gradient(135deg, #388e3c 0%, #1b5e20 100%) !important',
          color: 'white !important',
          '& .MuiChip-label': {
            ...baseStyles['& .MuiChip-label'],
            color: 'white !important',
          },
        };
      case 'upi':
        return {
          ...baseStyles,
          background:
            'linear-gradient(135deg, #a3824c 0%, #866422 100%) !important',
          color: 'white !important',
          '& .MuiChip-label': {
            ...baseStyles['& .MuiChip-label'],
            color: 'white !important',
          },
        };
      case 'card':
        return {
          ...baseStyles,
          background:
            'linear-gradient(135deg, #e6d897 0%, #b59961 100%) !important',
          color: '#2e3a1b !important',
          '& .MuiChip-label': {
            ...baseStyles['& .MuiChip-label'],
            color: '#2e3a1b !important',
          },
        };
      case 'bank':
        return {
          ...baseStyles,
          background:
            'linear-gradient(135deg, #0288d1 0%, #01579b 100%) !important',
          color: 'white !important',
          '& .MuiChip-label': {
            ...baseStyles['& .MuiChip-label'],
            color: 'white !important',
          },
        };
      case 'wallet':
        return {
          ...baseStyles,
          background:
            'linear-gradient(135deg, #a3824c 0%, #866422 100%) !important',
          color: 'white !important',
          '& .MuiChip-label': {
            ...baseStyles['& .MuiChip-label'],
            color: 'white !important',
          },
        };
      default:
        return baseStyles;
    }
  }

  return baseStyles;
};

export default OrderTable;
