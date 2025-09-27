import {
  useState,
  useCallback,
  createContext,
  useContext,
  useEffect,
  useRef,
} from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  Box,
  IconButton,
  Button,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { TOAST_TYPES } from '../utils/toastConstants';
import globalErrorHandler from '../utils/globalErrorHandler';

// Toast context
export const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast provider component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback(id => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Use ref to avoid circular dependency
  const removeToastRef = useRef(removeToast);
  removeToastRef.current = removeToast;

  const addToast = useCallback(
    (message, type = TOAST_TYPES.INFO, options = {}) => {
      // Safety check for message and title
      if (typeof message !== 'string') {
        console.warn('Toast message is not a string:', message);
        message = 'An unexpected error occurred';
      }

      if (options.title && typeof options.title !== 'string') {
        console.warn('Toast title is not a string:', options.title);
        options.title = 'Error';
      }

      const id = Date.now() + Math.random();
      const toast = {
        id,
        message,
        type,
        duration: options.duration || 6000,
        title: options.title,
        action: options.action,
        persistent: options.persistent || false,
      };

      console.log('Adding toast:', toast);
      setToasts(prev => [...prev, toast]);

      // Auto remove non-persistent toasts
      if (!toast.persistent) {
        setTimeout(() => {
          removeToastRef.current(id);
        }, toast.duration);
      }

      return id;
    },
    []
  );

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods
  const success = useCallback(
    (message, options) => addToast(message, TOAST_TYPES.SUCCESS, options),
    [addToast]
  );
  const error = useCallback(
    (message, options) => addToast(message, TOAST_TYPES.ERROR, options),
    [addToast]
  );
  const warning = useCallback(
    (message, options) => addToast(message, TOAST_TYPES.WARNING, options),
    [addToast]
  );
  const info = useCallback(
    (message, options) => addToast(message, TOAST_TYPES.INFO, options),
    [addToast]
  );

  const value = {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    success,
    error,
    warning,
    info,
  };

  // Initialize global error handler with toast methods
  useEffect(() => {
    const toastHandler = {
      success: (message, options) =>
        addToast(message, TOAST_TYPES.SUCCESS, options),
      error: (message, options) =>
        addToast(message, TOAST_TYPES.ERROR, options),
      warning: (message, options) =>
        addToast(message, TOAST_TYPES.WARNING, options),
      info: (message, options) => addToast(message, TOAST_TYPES.INFO, options),
    };

    globalErrorHandler.init(toastHandler);
  }, [addToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

// Toast container component
const ToastContainer = () => {
  const { toasts, removeToast } = useToast();
  const theme = useTheme();

  const getToastColor = type => {
    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return theme.palette.success.main;
      case TOAST_TYPES.ERROR:
        return theme.palette.error.main;
      case TOAST_TYPES.WARNING:
        return theme.palette.warning.main;
      case TOAST_TYPES.INFO:
        return theme.palette.info.main;
      default:
        return theme.palette.info.main;
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 35,
        right: 0,
        zIndex: theme.zIndex.snackbar,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        maxWidth: 400,
      }}
    >
      {toasts.map(toast => (
        <Snackbar
          key={toast.id}
          open={true}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{
            position: 'relative',
            top: 'auto',
            right: 'auto',
            transform: 'none',
          }}
        >
          <Alert
            severity={toast.type}
            onClose={() => removeToast(toast.id)}
            action={
              <IconButton
                aria-label='close'
                color='inherit'
                size='small'
                onClick={() => removeToast(toast.id)}
                sx={{
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <CloseIcon fontSize='inherit' />
              </IconButton>
            }
            sx={{
              width: '100%',
              minWidth: 300,
              maxWidth: 400,
              boxShadow: theme.shadows[8],
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${getToastColor(toast.type)}20`,
              '& .MuiAlert-icon': {
                color: getToastColor(toast.type),
              },
              '& .MuiAlert-message': {
                color: theme.palette.text.primary,
              },
              '& .MuiAlertTitle-root': {
                color: theme.palette.text.primary,
              },
              '& .MuiAlert-action': {
                '& .MuiIconButton-root': {
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                },
              },
            }}
          >
            {toast.title && typeof toast.title === 'string' && (
              <AlertTitle
                sx={{
                  fontWeight: 600,
                  mb: 0.5,
                  color: theme.palette.text.primary,
                }}
              >
                {toast.title}
              </AlertTitle>
            )}
            {typeof toast.message === 'string'
              ? toast.message
              : 'An unexpected error occurred'}
            {toast.action &&
              typeof toast.action === 'object' &&
              toast.action.label &&
              toast.action.onClick && (
                <Box sx={{ mt: 1 }}>
                  <Button
                    size='small'
                    variant='outlined'
                    onClick={toast.action.onClick}
                    sx={{
                      fontSize: '0.75rem',
                      py: 0.5,
                      px: 1.5,
                      minWidth: 'auto',
                      borderColor: getToastColor(toast.type),
                      color: getToastColor(toast.type),
                      '&:hover': {
                        borderColor: getToastColor(toast.type),
                        backgroundColor: getToastColor(toast.type) + '10',
                      },
                    }}
                  >
                    {toast.action.label}
                  </Button>
                </Box>
              )}
          </Alert>
        </Snackbar>
      ))}
    </Box>
  );
};

export default ToastProvider;
