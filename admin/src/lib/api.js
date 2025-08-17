// API Base URL - Update to your deployed backend URL
const API_BASE_URL = 'http://localhost:8000/api';

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
    return apiRequest('/admins/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  // You can add signup or other admin APIs here as needed
};

export default {
  admin: adminAPI,
}; 