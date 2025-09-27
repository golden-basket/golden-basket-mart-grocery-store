import axios from 'axios';
import { handleError } from '../utils/errorHandler';
import globalErrorHandler from '../utils/globalErrorHandler';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    console.error(
      'API error:',
      error.config?.url,
      error.response?.status,
      error.response?.data
    );

    // Handle specific error types
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } else if (error.response?.status === 429) {
      // Rate limiting - show user-friendly message
      const errorInfo = handleError(error);
      console.warn('Rate limit exceeded:', errorInfo.message);

      // Store rate limit info for potential retry logic
      error.rateLimitInfo = {
        retryAfter: error.response?.data?.retryAfter || 15,
        message: errorInfo.message,
        timestamp: Date.now(),
      };

      // Use global error handler if available
      try {
        globalErrorHandler.handleApiError(error);
      } catch (handlerError) {
        console.warn('Global error handler failed:', handlerError);
      }
    } else if (error.response?.status >= 500) {
      // Server errors - log for debugging and show to user
      console.error('Server error:', error.response?.data);

      // Use global error handler if available
      try {
        globalErrorHandler.handleApiError(error);
      } catch (handlerError) {
        console.warn('Global error handler failed:', handlerError);
      }
    }

    return Promise.reject(error || 'Unknown error occurred');
  }
);

class ApiService {
  // Generic request method
  static async request(endpoint, options = {}) {
    try {
      const response = await apiClient({
        url: endpoint,
        ...options,
      });

      return response.data;
    } catch (error) {
      console.error('ApiService.request: Error occurred:', error);

      // Use global error handler if available
      try {
        globalErrorHandler.handleApiError(error, 'api');
      } catch (handlerError) {
        console.warn('Global error handler failed:', handlerError);
      }

      // Extract detailed error information from backend response
      const errorData = error.response?.data;
      const statusCode = error.response?.status;
      let errorMessage = 'Network error occurred';
      let errorType = 'network';

      if (errorData) {
        // Handle different error response formats from backend

        // 1. Validation errors with details (from validation middleware)
        if (errorData.details && Array.isArray(errorData.details)) {
          errorType = 'validation';
          const fieldErrors = errorData.details
            .map(detail => `${detail.message}`)
            .join('\n');
          errorMessage = `${errorData.message || 'Validation failed'}\n${fieldErrors}`;
        }
        // 2. Authentication errors (with additional fields like lockUntil, reason)
        else if (
          statusCode === 401 ||
          statusCode === 403 ||
          statusCode === 423
        ) {
          errorType = 'authentication';
          errorMessage =
            errorData.error || errorData.message || 'Authentication failed';
        }
        // 3. Business logic errors (duplicate, not found, etc.)
        else if (statusCode === 409 || statusCode === 404) {
          errorType = 'business';
          errorMessage =
            errorData.error || errorData.message || 'Operation failed';
        }
        // 4. Simple error objects (most common in controllers)
        else if (errorData.error) {
          errorType = 'simple';
          errorMessage = errorData.error;
        }
        // 5. Message-only errors
        else if (errorData.message) {
          errorType = 'message';
          errorMessage = errorData.message;
        }
        // 6. Database errors (MongoDB specific)
        else if (errorData.name === 'MongoError' || errorData.code === 11000) {
          errorType = 'database';
          errorMessage = errorData.message || 'Database operation failed';
        }
        // 7. Server errors (500+)
        else if (statusCode >= 500) {
          errorType = 'server';
          errorMessage = errorData.message || 'Server error occurred';
        }
      }

      // Create enhanced error object with comprehensive backend response
      console.log('errorMessage', errorMessage);
      console.log('errorData', errorData);
      console.log('statusCode', statusCode);
      console.log('errorType', errorType);

      const enhancedError = new Error(errorMessage);
      enhancedError.status = statusCode;
      enhancedError.type = errorType;
      enhancedError.details = errorData?.details;
      enhancedError.originalError = errorData;
      enhancedError.timestamp = errorData?.timestamp;
      enhancedError.path = errorData?.path;
      enhancedError.method = errorData?.method;

      // Add authentication-specific fields if present
      if (errorData?.lockUntil) enhancedError.lockUntil = errorData.lockUntil;
      if (errorData?.reason) enhancedError.reason = errorData.reason;

      throw enhancedError;
    }
  }

  // Auth endpoints
  static async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      data: userData,
    });
  }

  static async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      data: credentials,
    });
  }

  static async verifyEmail(token) {
    try {
      const result = await this.request(`/auth/verify/${token}`, {
        method: 'GET',
      });

      return result;
    } catch (error) {
      console.error('ApiService.verifyEmail: Error:', error);
      throw error;
    }
  }

  static async resendVerification(email) {
    return this.request('/auth/resend-verification', {
      method: 'POST',
      data: { email },
    });
  }

  static async changePassword(passwordData) {
    return this.request('/auth/change-password', {
      method: 'POST',
      data: passwordData,
    });
  }

  static async forgotPassword(email) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      data: { email },
    });
  }

  static async resetPassword(token, password) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      data: { token, password },
    });
  }

  static async getProfile() {
    return this.request('/auth/profile');
  }

  static async updateProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      data: profileData,
    });
  }

  // Product endpoints
  static async getProducts(queryParams = '') {
    const endpoint = queryParams ? `/products?${queryParams}` : '/products';
    const products = await this.request(endpoint);
    return products;
  }

  static async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  static async searchProducts(params) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/products/search?${queryString}`);
  }

  static async createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      data: productData,
    });
  }

  static async updateProduct(id, productData) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      data: productData,
    });
  }

  static async deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Cart endpoints
  static async getCart() {
    return this.request('/cart');
  }

  static async addToCart(productId, quantity) {
    return this.request('/cart/add', {
      method: 'POST',
      data: { productId, quantity },
    });
  }

  static async updateCartItem(productId, quantity) {
    return this.request('/cart/update', {
      method: 'PUT',
      data: { productId, quantity },
    });
  }

  static async removeFromCart(productId) {
    return this.request(`/cart/remove/${productId}`, {
      method: 'DELETE',
    });
  }

  static async clearCart() {
    return this.request('/cart/clear', {
      method: 'POST',
    });
  }

  // Order endpoints
  static async placeOrder(orderData) {
    return this.request('/orders/place', {
      method: 'POST',
      data: orderData,
    });
  }

  static async getUserOrders() {
    return this.request('/orders');
  }

  static async getUserOrderStats() {
    return this.request('/orders/stats');
  }

  static async getAllOrders() {
    return this.request('/orders/all');
  }

  static async getFilteredOrders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/orders/filtered?${queryString}`);
  }

  static async getOrderStats() {
    return this.request('/orders/stats/admin');
  }

  static async updateOrderStatus(orderId, statusData) {
    return this.request(`/orders/${orderId}/status`, {
      method: 'PUT',
      data: statusData,
    });
  }

  static async updatePaymentStatus(orderId, paymentData) {
    return this.request(`/orders/${orderId}/payment`, {
      method: 'PUT',
      data: paymentData,
    });
  }

  static async getUserInvoices() {
    return this.request('/invoices');
  }

  static async downloadInvoice(invoiceId) {
    try {
      const response = await apiClient({
        url: `/invoice/${invoiceId}`,
        method: 'GET',
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.error || 'Failed to download invoice';
      throw new Error(message);
    }
  }

  // Address endpoints
  static async getAddresses() {
    return this.request('/addresses');
  }

  static async addAddress(addressData) {
    console.log('addressData', addressData);
    return this.request('/addresses', {
      method: 'POST',
      data: addressData,
    });
  }

  static async updateAddress(id, addressData) {
    return this.request(`/addresses/${id}`, {
      method: 'PUT',
      data: addressData,
    });
  }

  static async deleteAddress(id) {
    return this.request(`/addresses/${id}`, {
      method: 'DELETE',
    });
  }

  static async getCategories() {
    return this.request('/categories');
  }

  static async createOrUpdateCategory(categoryData) {
    return this.request('/categories', {
      method: 'POST',
      data: categoryData,
    });
  }

  // User endpoints
  static async createUser(userData) {
    return this.request('/users', {
      method: 'POST',
      data: userData,
    });
  }
}

export default ApiService;
