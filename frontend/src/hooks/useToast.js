import { useContext } from 'react';
import { ToastContext } from '../components/ToastNotifications';
import { TOAST_TYPES } from '../utils/toastConstants';

// Re-export TOAST_TYPES for convenience
export { TOAST_TYPES };

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Hook for easy toast usage
export const useToastNotifications = () => {
  const toast = useToast();

  return {
    showSuccess: (message, options) => toast.success(message, options),
    showError: (message, options) => toast.error(message, options),
    showWarning: (message, options) => toast.warning(message, options),
    showInfo: (message, options) => toast.info(message, options),
    removeToast: toast.removeToast,
    clearAll: toast.clearAllToasts,
  };
};
