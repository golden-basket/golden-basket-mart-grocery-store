// Order status options
export const ORDER_STATUS_OPTIONS = [
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

// Payment status options
export const PAYMENT_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'failed', label: 'Failed' },
];

// Payment method options
export const PAYMENT_METHOD_OPTIONS = [
  { value: 'cod', label: 'Cash on Delivery' },
  { value: 'upi', label: 'UPI' },
];

// Rows per page options
export const ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 50];

// Default pagination values
export const DEFAULT_PAGE = 0;
export const DEFAULT_ROWS_PER_PAGE = 10;

// Filter default values
export const DEFAULT_FILTERS = {
  status: '',
  paymentStatus: '',
  paymentMethod: '',
  startDate: null,
  endDate: null,
  searchQuery: '',
};

// Status colors mapping
export const STATUS_COLORS = {
  processing: 'warning',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'error',
  default: 'default',
};

// Payment status colors mapping
export const PAYMENT_STATUS_COLORS = {
  pending: 'warning',
  paid: 'success',
  failed: 'error',
  default: 'default',
};

// Chip styles configuration
export const CHIP_STYLES = {
  base: {
    fontWeight: 600,
    fontSize: '0.75rem',
    height: 24,
    borderRadius: '12px',
    '& .MuiChip-label': {
      px: 1.5,
      py: 0.5,
    },
  },
  orderStatus: {
    processing: {
      backgroundColor: '#fff3cd',
      color: '#856404',
      border: '1px solid #ffeaa7',
      hover: {
        backgroundColor: '#ffeaa7',
        transform: 'translateY(-1px)',
        boxShadow: '0 2px 8px rgba(255, 193, 7, 0.3)',
      },
    },
    shipped: {
      backgroundColor: '#d1ecf1',
      color: '#0c5460',
      border: '1px solid #bee5eb',
      hover: {
        backgroundColor: '#bee5eb',
        transform: 'translateY(-1px)',
        boxShadow: '0 2px 8px rgba(13, 202, 240, 0.3)',
      },
    },
    delivered: {
      backgroundColor: '#d4edda',
      color: '#155724',
      border: '1px solid #c3e6cb',
      hover: {
        backgroundColor: '#c3e6cb',
        transform: 'translateY(-1px)',
        boxShadow: '0 2px 8px rgba(40, 167, 69, 0.3)',
      },
    },
    cancelled: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      border: '1px solid #f5c6cb',
      hover: {
        backgroundColor: '#f5c6cb',
        transform: 'translateY(-1px)',
        boxShadow: '0 2px 8px rgba(220, 53, 69, 0.3)',
      },
    },
    default: {
      backgroundColor: '#e9ecef',
      color: '#495057',
      border: '1px solid #dee2e6',
      hover: {
        backgroundColor: '#dee2e6',
        transform: 'translateY(-1px)',
        boxShadow: '0 2px 8px rgba(108, 117, 125, 0.3)',
      },
    },
  },
  paymentStatus: {
    pending: {
      backgroundColor: '#fff3cd',
      color: '#856404',
      border: '1px solid #ffeaa7',
      hover: {
        backgroundColor: '#ffeaa7',
        transform: 'translateY(-1px)',
        boxShadow: '0 2px 8px rgba(255, 193, 7, 0.3)',
      },
    },
    paid: {
      backgroundColor: '#d4edda',
      color: '#155724',
      border: '1px solid #c3e6cb',
      hover: {
        backgroundColor: '#c3e6cb',
        transform: 'translateY(-1px)',
        boxShadow: '0 2px 8px rgba(40, 167, 69, 0.3)',
      },
    },
    failed: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      border: '1px solid #f5c6cb',
      hover: {
        backgroundColor: '#f5c6cb',
        transform: 'translateY(-1px)',
        boxShadow: '0 2px 8px rgba(220, 53, 69, 0.3)',
      },
    },
    default: {
      backgroundColor: '#e9ecef',
      color: '#495057',
      border: '1px solid #dee2e6',
      hover: {
        backgroundColor: '#dee2e6',
        transform: 'translateY(-1px)',
        boxShadow: '0 2px 8px rgba(108, 117, 125, 0.3)',
      },
    },
  },
};

// Theme colors
export const THEME_COLORS = {
  primary: '#a3824c',
  primaryLight: '#e6d897',
  primaryDark: '#8b6f3a',
  accent: '#b59961',
  accentDark: '#9a7f4a',
  creamLight: '#fffbe6',
  creamMedium: '#f7e7c1',
  success: '#28a745',
  successLight: '#d4edda',
  successDark: '#1e7e34',
  warning: '#ffc107',
  warningDark: '#e0a800',
  info: '#17a2b8',
  error: '#dc3545',
};

// Responsive breakpoints
export const RESPONSIVE_BREAKPOINTS = {
  extraSmall: 'xs',
  small: 'sm',
  medium: 'md',
  large: 'lg',
  extraLarge: 'xl',
};

// Spacing values
export const SPACING = {
  mobile: 2,
  desktop: 3,
  small: 1,
  medium: 2,
  large: 3,
};

// Border radius values
export const BORDER_RADIUS = {
  mobile: 2,
  desktop: 1.5,
  small: 1,
  medium: 2,
  large: 3,
};

// Box shadow values
export const BOX_SHADOWS = {
  light: '0 1px 4px 0 rgba(163,130,76,0.07)',
  medium: '0 2px 8px rgba(163,130,76,0.15)',
  heavy: '0 8px 32px 0 rgba(163,130,76,0.25)',
  button: '0 4px 12px rgba(163,130,76,0.3)',
  buttonHover: '0 6px 20px rgba(163,130,76,0.4)',
};

// Gradient backgrounds
export const GRADIENTS = {
  primary: 'linear-gradient(135deg, #a3824c 0%, #e6d897 50%, #b59961 100%)',
  primaryHover: 'linear-gradient(135deg, #e6d897 0%, #a3824c 100%)',
  cream: 'linear-gradient(135deg, var(--color-cream-light) 0%, var(--color-cream-medium) 100%)',
  creamLight: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
  creamMedium: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c4 100%)',
  dialogHeader: 'linear-gradient(90deg, #a3824c 0%, #e6d897 100%)',
  dialogContent: 'linear-gradient(90deg, #fffbe6 0%, #f7e7c1 100%)',
  dialogActions: 'linear-gradient(90deg, #f7e7c1 0%, #fffbe6 100%)',
};
