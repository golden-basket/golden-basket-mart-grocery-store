import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
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
      const message = error.response?.data?.error || 'Network error occurred';
      throw new Error(message);
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
    return this.request(`/auth/verify/${token}`, {
      method: 'GET',
    });
  }

  static async changePassword(passwordData) {
    return this.request('/auth/change-password', {
      method: 'POST',
      data: passwordData,
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
    return this.request('/cart/remove', {
      method: 'DELETE',
      data: { productId },
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

  static async getAllOrders() {
    return this.request('/orders/all');
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
      const message = error.response?.data?.error || 'Failed to download invoice';
      throw new Error(message);
    }
  }

  // Address endpoints
  static async getAddresses() {
    return this.request('/addresses');
  }

  static async addAddress(addressData) {
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
