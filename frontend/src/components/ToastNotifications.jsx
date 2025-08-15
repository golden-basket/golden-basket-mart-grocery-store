import { useState, useCallback, createContext, useContext } from 'react';
import { Snackbar, Alert, AlertTitle, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { TOAST_TYPES } from '../utils/toastConstants';

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

  const addToast = useCallback(
    (message, type = TOAST_TYPES.INFO, options = {}) => {
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

      setToasts(prev => [...prev, toast]);

      // Auto remove non-persistent toasts
      if (!toast.persistent) {
        setTimeout(() => {
          removeToast(id);
        }, toast.duration);
      }

      return id;
    },
    []
  );

  const removeToast = useCallback(id => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

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

  const getToastColor = type => {
    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return '#2e7d32';
      case TOAST_TYPES.ERROR:
        return '#d32f2f';
      case TOAST_TYPES.WARNING:
        return '#ed6c02';
      case TOAST_TYPES.INFO:
        return '#0288d1';
      default:
        return '#0288d1';
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 9999,
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
                sx={{ color: 'inherit' }}
              >
                <CloseIcon fontSize='inherit' />
              </IconButton>
            }
            sx={{
              width: '100%',
              minWidth: 300,
              maxWidth: 400,
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              borderRadius: 2,
              '& .MuiAlert-icon': {
                color: getToastColor(toast.type),
              },
            }}
          >
            {toast.title && (
              <AlertTitle sx={{ fontWeight: 600, mb: 0.5 }}>
                {toast.title}
              </AlertTitle>
            )}
            {toast.message}
            {toast.action && <Box sx={{ mt: 1 }}>{toast.action}</Box>}
          </Alert>
        </Snackbar>
      ))}
    </Box>
  );
};

export default ToastProvider;
