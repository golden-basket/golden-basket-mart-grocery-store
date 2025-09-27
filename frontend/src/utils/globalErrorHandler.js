import { handleError } from './errorHandler';

// Global error handler for API errors
class GlobalErrorHandler {
  constructor() {
    this.toastHandler = null;
    this.isInitialized = false;
  }

  // Initialize with toast handler
  init(toastHandler) {
    this.toastHandler = toastHandler;
    this.isInitialized = true;
  }

  // Handle API errors globally
  handleApiError(error, context = '') {
    if (!this.isInitialized || !this.toastHandler) {
      console.warn('GlobalErrorHandler not initialized with toast handler');
      return;
    }

    try {
      const errorInfo = handleError(error, context);
      
      // Ensure message is a string
      if (typeof errorInfo.message !== 'string') {
        console.warn('Error message is not a string:', errorInfo.message);
        errorInfo.message = 'An unexpected error occurred';
      }
      
      // Handle rate limiting specifically
      if (errorInfo.category === 'rate_limit') {
        this.handleRateLimitError(error, errorInfo);
        return;
      }

      // Handle other errors based on severity
      switch (errorInfo.severity) {
        case 'error':
          this.toastHandler.error(errorInfo.message, {
            title: 'Error',
            persistent: errorInfo.category === 'server',
            duration: errorInfo.category === 'rate_limit' ? 8000 : 6000,
          });
          break;
        
        case 'warning':
          this.toastHandler.warning(errorInfo.message, {
            title: 'Warning',
            duration: 5000,
          });
          break;
        
        case 'info':
          this.toastHandler.info(errorInfo.message, {
            title: 'Information',
            duration: 4000,
          });
          break;
        
        default:
          this.toastHandler.error(errorInfo.message, {
            title: 'Error',
            duration: 6000,
          });
      }
    } catch (handlerError) {
      console.error('Error in global error handler:', handlerError);
    }
  }

  // Special handling for rate limit errors
  handleRateLimitError(error, errorInfo) {
    const retryAfter = error.response?.data?.retryAfter || 15;
    const minutes = Math.ceil(retryAfter / 60);
    
    let message = errorInfo.message;
    if (retryAfter > 60) {
      message = `Too many requests. Please wait ${minutes} minute${minutes > 1 ? 's' : ''} before trying again.`;
    } else if (retryAfter > 0) {
      message = `Too many requests. Please wait ${retryAfter} second${retryAfter > 1 ? 's' : ''} before trying again.`;
    }

    this.toastHandler.error(message, {
      title: 'Too Many Requests',
      persistent: true,
      duration: 10000,
    });
  }

  // Handle network errors
  handleNetworkError() {
    if (!this.isInitialized || !this.toastHandler) return;

    this.toastHandler.error(
      'Network connection error. Please check your internet connection and try again.',
      {
        title: 'Connection Error',
        persistent: false,
        duration: 8000,
      }
    );
  }

  // Handle validation errors
  handleValidationError(error, context = '') {
    if (!this.isInitialized || !this.toastHandler) return;

    const errorInfo = handleError(error, context);
    
    if (errorInfo.category === 'validation') {
      this.toastHandler.warning(errorInfo.message, {
        title: 'Validation Error',
        duration: 6000,
      });
    }
  }

  // Handle authentication errors
  handleAuthError(error) {
    if (!this.isInitialized || !this.toastHandler) return;

    const errorInfo = handleError(error, 'authentication');
    
    this.toastHandler.error(errorInfo.message, {
      title: 'Authentication Error',
      persistent: false,
      duration: 6000,
    });
  }

  // Handle server errors
  handleServerError(error) {
    if (!this.isInitialized || !this.toastHandler) return;

    const errorInfo = handleError(error);
    
    if (errorInfo.category === 'server') {
      this.toastHandler.error(
        'Server error occurred. Please try again later or contact support if the problem persists.',
        {
          title: 'Server Error',
          persistent: true,
          duration: 10000,
        }
      );
    }
  }
}

// Create singleton instance
const globalErrorHandler = new GlobalErrorHandler();

export default globalErrorHandler;
