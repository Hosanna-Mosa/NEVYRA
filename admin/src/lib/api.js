// API Base URL - Update to your deployed backend URL
const API_BASE_URL = 'http://localhost:8000/api';

// Auth utilities for admin
export const adminAuthUtils = {
  setToken: (token) => {
    localStorage.setItem('admin_token', token);
  },

  getToken: () => {
    return localStorage.getItem('admin_token');
  },

  removeToken: () => {
    localStorage.removeItem('admin_token');
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('admin_token');
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.isAdmin && payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },

  clearAuth: () => {
    localStorage.removeItem('admin_token');
  },
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }
  try {
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Invalid JSON response from server');
  }
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };
  
  // Add auth token if available
  const token = adminAuthUtils.getToken();
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  
  try {
    const response = await fetch(url, config);
    return handleResponse(response);
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server. Please check your internet connection.');
    }
    throw error;
  }
};

// ==================== ADMIN AUTH APIs ====================
export const adminAPI = {
  // Admin login
  login: async (credentials) => {
    const response = await apiRequest('/admins/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // If login is successful, store the token
    if (response.success && response.data?.token) {
      adminAuthUtils.setToken(response.data.token);
    }
    
    return response;
  },

  // Admin logout
  logout: () => {
    adminAuthUtils.clearAuth();
  },

  // Check if admin is authenticated
  isAuthenticated: () => {
    return adminAuthUtils.isAuthenticated();
  },

  // Get current token
  getToken: () => {
    return adminAuthUtils.getToken();
  },

  // Get all orders
  getOrders: async () => {
    return apiRequest('/orders/admin/all');
  },

  // Update order status
  updateOrderStatus: async (orderId, updateData) => {
    return apiRequest(`/orders/admin/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  // ==================== ADMIN PASSWORD RESET FLOW ====================
  // Step 1: Request OTP to email
  forgotPassword: async ({ email }) => {
    return apiRequest('/admins/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Step 2: Verify OTP
  verifyOTP: async ({ email, otp }) => {
    return apiRequest('/admins/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  },

  // Step 3: Reset password
  resetPassword: async ({ email, otp, newPassword }) => {
    return apiRequest('/admins/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, otp, newPassword }),
    });
  },
};

export default {
  admin: adminAPI,
  adminAuth: adminAuthUtils,
}; 