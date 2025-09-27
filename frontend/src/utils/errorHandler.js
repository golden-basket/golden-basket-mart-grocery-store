/**
 * Comprehensive Error Handling Utility for Golden Basket Mart
 * Provides consistent error handling across the application
 */

// Error categories for consistent handling
export const ERROR_CATEGORIES = {
  NETWORK: 'network',
  AUTHENTICATION: 'authentication',
  AUTHORIZATION: 'authorization',
  VALIDATION: 'validation',
  RATE_LIMIT: 'rate_limit',
  SERVER: 'server',
  CLIENT: 'client',
  UNKNOWN: 'unknown',
};

// HTTP status code mappings
export const HTTP_STATUS_MESSAGES = {
  400: 'Bad Request - Please check your input and try again.',
  401: 'Unauthorized - Please log in to continue.',
  403: "Access Denied - You don't have permission to perform this action.",
  404: 'Not Found - The requested resource was not found.',
  409: 'Conflict - This resource already exists.',
  422: 'Validation Error - Please check your input and try again.',
  423: 'Account Locked - Your account is temporarily locked due to multiple failed attempts.',
  429: 'Too Many Requests - Please wait a moment before trying again.',
  500: 'Server Error - Something went wrong on our end. Please try again later.',
  502: 'Bad Gateway - Service temporarily unavailable. Please try again later.',
  503: "Service Unavailable - We're experiencing high traffic. Please try again later.",
  504: 'Gateway Timeout - Request timed out. Please try again.',
};

// Error severity levels
export const ERROR_SEVERITY = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  SUCCESS: 'success',
};

/**
 * Categorize error based on response status and error type
 */
export const categorizeError = error => {
  if (!error) return ERROR_CATEGORIES.UNKNOWN;

  // Network errors
  if (
    error.code === 'NETWORK_ERROR' ||
    error.message?.includes('Network Error')
  ) {
    return ERROR_CATEGORIES.NETWORK;
  }

  // Rate limiting
  if (error.response?.status === 429) {
    return ERROR_CATEGORIES.RATE_LIMIT;
  }

  // Authentication errors
  if (error.response?.status === 401) {
    return ERROR_CATEGORIES.AUTHENTICATION;
  }

  // Authorization errors
  if (error.response?.status === 403) {
    return ERROR_CATEGORIES.AUTHORIZATION;
  }

  // Validation errors
  if (error.response?.status === 400 || error.response?.status === 422) {
    return ERROR_CATEGORIES.VALIDATION;
  }

  // Server errors
  if (error.response?.status >= 500) {
    return ERROR_CATEGORIES.SERVER;
  }

  // Client errors
  if (error.response?.status >= 400 && error.response?.status < 500) {
    return ERROR_CATEGORIES.CLIENT;
  }

  return ERROR_CATEGORIES.UNKNOWN;
};

/**
 * Get appropriate severity level for error category
 */
export const getErrorSeverity = (category, status) => {
  switch (category) {
    case ERROR_CATEGORIES.RATE_LIMIT:
      return ERROR_SEVERITY.WARNING;
    case ERROR_CATEGORIES.VALIDATION:
      return ERROR_SEVERITY.INFO;
    case ERROR_CATEGORIES.AUTHENTICATION:
      return ERROR_SEVERITY.WARNING;
    case ERROR_CATEGORIES.AUTHORIZATION:
      return ERROR_SEVERITY.ERROR;
    case ERROR_CATEGORIES.NETWORK:
      return ERROR_SEVERITY.WARNING;
    case ERROR_CATEGORIES.SERVER:
      return ERROR_SEVERITY.ERROR;
    case ERROR_CATEGORIES.CLIENT:
      return status === 409 ? ERROR_SEVERITY.INFO : ERROR_SEVERITY.ERROR;
    default:
      return ERROR_SEVERITY.ERROR;
  }
};

/**
 * Get user-friendly error message
 */
export const getErrorMessage = (error, context = '') => {
  if (!error) return 'An unexpected error occurred.';

  // Check for custom error message first
  if (error.response?.data?.error) {
    // Handle rate limiting specifically
    if (error.response?.status === 429) {
      const retryAfter = error.response.data.retryAfter || 15;
      if (retryAfter > 60) {
        const minutes = Math.ceil(retryAfter / 60);
        return `Too many requests. Please wait ${minutes} minute${minutes > 1 ? 's' : ''} before trying again.`;
      } else if (retryAfter > 0) {
        return `Too many requests. Please wait ${retryAfter} second${retryAfter > 1 ? 's' : ''} before trying again.`;
      }
      return 'Too many requests. Please wait a moment before trying again.';
    }
    return error.response.data.error;
  }

  // Check for specific error messages based on context
  if (context === 'login') {
    if (error.response?.status === 429) {
      const retryAfter = error.response.data.retryAfter || 15;
      if (retryAfter > 60) {
        const minutes = Math.ceil(retryAfter / 60);
        return `Too many login attempts. Please wait ${minutes} minute${minutes > 1 ? 's' : ''} before trying again.`;
      } else if (retryAfter > 0) {
        return `Too many login attempts. Please wait ${retryAfter} second${retryAfter > 1 ? 's' : ''} before trying again.`;
      }
      return 'Too many login attempts. Please wait a moment before trying again.';
    }
    if (error.response?.status === 423) {
      return 'Account is temporarily locked due to multiple failed attempts. Please try again later.';
    }
    if (
      error.response?.status === 403 &&
      error.response?.data?.error?.includes('verify')
    ) {
      return 'Please verify your email before logging in.';
    }
  }

  if (context === 'register') {
    if (error.response?.status === 429) {
      const retryAfter = error.response.data.retryAfter || 15;
      if (retryAfter > 60) {
        const minutes = Math.ceil(retryAfter / 60);
        return `Too many registration attempts. Please wait ${minutes} minute${minutes > 1 ? 's' : ''} before trying again.`;
      } else if (retryAfter > 0) {
        return `Too many registration attempts. Please wait ${retryAfter} second${retryAfter > 1 ? 's' : ''} before trying again.`;
      }
      return 'Too many registration attempts. Please wait a moment before trying again.';
    }
    if (error.response?.status === 409) {
      return 'An account with this email already exists. Please try logging in instead.';
    }
  }

  if (context === 'forgot-password') {
    if (error.response?.status === 429) {
      const retryAfter = error.response.data.retryAfter || 15;
      if (retryAfter > 60) {
        const minutes = Math.ceil(retryAfter / 60);
        return `Too many password reset attempts. Please wait ${minutes} minute${minutes > 1 ? 's' : ''} before trying again.`;
      } else if (retryAfter > 0) {
        return `Too many password reset attempts. Please wait ${retryAfter} second${retryAfter > 1 ? 's' : ''} before trying again.`;
      }
      return 'Too many password reset attempts. Please wait a moment before trying again.';
    }
  }

  // Check for HTTP status messages
  if (error.response?.status && HTTP_STATUS_MESSAGES[error.response.status]) {
    return HTTP_STATUS_MESSAGES[error.response.status];
  }

  // Network errors
  if (
    error.code === 'NETWORK_ERROR' ||
    error.message?.includes('Network Error')
  ) {
    return 'Network connection error. Please check your internet connection and try again.';
  }

  // Timeout errors
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }

  // Generic error messages
  if (error.message) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
};

/**
 * Enhanced error handler that returns structured error information
 */
export const handleError = (error, context = '') => {
  const category = categorizeError(error);
  const severity = getErrorSeverity(category, error.response?.status);
  const message = getErrorMessage(error, context);

  // Log error for debugging (in development)
  if (import.meta.env.NODE_ENV === 'development') {
    console.error('Error Details:', {
      category,
      severity,
      message,
      context,
      originalError: error,
      status: error.response?.status,
      data: error.response?.data,
    });
  }

  return {
    category,
    severity,
    message,
    status: error.response?.status,
    data: error.response?.data,
    originalError: error,
  };
};

/**
 * Handle authentication-specific errors
 */
export const handleAuthError = error => {
  return handleError(error, 'authentication');
};

/**
 * Handle form validation errors
 */
export const handleValidationError = error => {
  return handleError(error, 'validation');
};

/**
 * Handle API errors with retry logic
 */
export const handleApiError = (error, retryCount = 0, maxRetries = 3) => {
  const errorInfo = handleError(error);

  // Auto-retry for network errors (up to maxRetries)
  if (
    errorInfo.category === ERROR_CATEGORIES.NETWORK &&
    retryCount < maxRetries
  ) {
    return {
      ...errorInfo,
      shouldRetry: true,
      retryCount: retryCount + 1,
    };
  }

  return {
    ...errorInfo,
    shouldRetry: false,
    retryCount,
  };
};

/**
 * Create snackbar configuration from error
 */
export const createSnackbarConfig = (error, context = '') => {
  const errorInfo = handleError(error, context);

  return {
    open: true,
    message: errorInfo.message,
    severity: errorInfo.severity,
    autoHideDuration:
      errorInfo.category === ERROR_CATEGORIES.RATE_LIMIT ? 8000 : 6000,
    persistent: errorInfo.category === ERROR_CATEGORIES.SERVER,
  };
};

/**
 * Handle success messages
 */
export const createSuccessConfig = (message, autoHideDuration = 4000) => {
  return {
    open: true,
    message,
    severity: ERROR_SEVERITY.SUCCESS,
    autoHideDuration,
  };
};

/**
 * Handle info messages
 */
export const createInfoConfig = (message, autoHideDuration = 5000) => {
  return {
    open: true,
    message,
    severity: ERROR_SEVERITY.INFO,
    autoHideDuration,
  };
};

/**
 * Handle warning messages
 */
export const createWarningConfig = (message, autoHideDuration = 7000) => {
  return {
    open: true,
    message,
    severity: ERROR_SEVERITY.WARNING,
    autoHideDuration,
  };
};

/**
 * Check if error is retryable
 */
export const isRetryableError = error => {
  const category = categorizeError(error);
  return (
    category === ERROR_CATEGORIES.NETWORK ||
    category === ERROR_CATEGORIES.SERVER ||
    error.response?.status === 503
  );
};

/**
 * Get retry delay based on error type and retry count
 */
export const getRetryDelay = (error, retryCount) => {
  const category = categorizeError(error);

  if (category === ERROR_CATEGORIES.RATE_LIMIT) {
    return Math.min(1000 * Math.pow(2, retryCount), 30000); // Exponential backoff, max 30s
  }

  if (category === ERROR_CATEGORIES.NETWORK) {
    return Math.min(1000 * Math.pow(2, retryCount), 10000); // Exponential backoff, max 10s
  }

  return 1000; // Default 1 second
};

/**
 * Enhanced error boundary error handler
 */
export const handleBoundaryError = (error, errorInfo) => {
  console.error('Error Boundary Caught Error:', error, errorInfo);

  return {
    category: ERROR_CATEGORIES.UNKNOWN,
    severity: ERROR_SEVERITY.ERROR,
    message: 'Something went wrong. Please refresh the page and try again.',
    shouldReport: true,
  };
};

export default {
  ERROR_CATEGORIES,
  ERROR_SEVERITY,
  HTTP_STATUS_MESSAGES,
  categorizeError,
  getErrorSeverity,
  getErrorMessage,
  handleError,
  handleAuthError,
  handleValidationError,
  handleApiError,
  createSnackbarConfig,
  createSuccessConfig,
  createInfoConfig,
  createWarningConfig,
  isRetryableError,
  getRetryDelay,
  handleBoundaryError,
};
