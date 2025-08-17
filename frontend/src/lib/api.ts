const API_BASE_URL = 'http://localhost:8000/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  address?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token?: string;
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  } | null;
}

export interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  isAdmin: boolean;
  addresses?: Array<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
  }>;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  subCategory: string;
  images: string[];
  inStock: boolean;
  rating: number;
  reviews: number;
  stockQuantity: number;
  soldCount: number;
  attributes: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductsResponse {
  success: boolean;
  message: string;
  data: Product[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ProductResponse {
  success: boolean;
  message: string;
  data: Product | null;
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Handle specific HTTP status codes
        if (response.status === 401) {
          // Unauthorized - clear token
          localStorage.removeItem('token');
        }
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred. Please check your connection.');
    }
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getProfile(): Promise<{ success: boolean; message: string; data: UserProfile }> {
    return this.request<{ success: boolean; message: string; data: UserProfile }>('/auth/profile');
  }

  async updateProfile(profileData: Partial<UserProfile>): Promise<{ success: boolean; message: string; data: UserProfile }> {
    return this.request<{ success: boolean; message: string; data: UserProfile }>('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });
  }

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verifyOTP(email: string, otp: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  }

  async resetPassword(email: string, otp: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, otp, newPassword }),
    });
  }

  // Address management methods
  async getAddresses(): Promise<{ success: boolean; message: string; data: any[] }> {
    return this.request<{ success: boolean; message: string; data: any[] }>('/auth/addresses');
  }

  async addAddress(addressData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
  }): Promise<{ success: boolean; message: string; data: any[] }> {
    return this.request<{ success: boolean; message: string; data: any[] }>('/auth/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData),
    });
  }

  async updateAddressByIndex(index: number, addressData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
  }): Promise<{ success: boolean; message: string; data: any[] }> {
    return this.request<{ success: boolean; message: string; data: any[] }>(`/auth/addresses/${index}`, {
      method: 'PATCH',
      body: JSON.stringify(addressData),
    });
  }

  async deleteAddressByIndex(index: number): Promise<{ success: boolean; message: string; data: any[] }> {
    return this.request<{ success: boolean; message: string; data: any[] }>(`/auth/addresses/${index}`, {
      method: 'DELETE',
    });
  }

  // Product management methods
  async getProducts(page: number = 1, limit: number = 10, category?: string): Promise<ProductsResponse> {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (category) params.append('category', category);

    return this.request<ProductsResponse>(`/products?${params.toString()}`);
  }

  async getProduct(id: string): Promise<ProductResponse> {
    return this.request<ProductResponse>(`/products/${id}`);
  }

  async createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductResponse> {
    return this.request<ProductResponse>('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id: string, productData: Partial<Product>): Promise<ProductResponse> {
    return this.request<ProductResponse>(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Health check method
  async healthCheck(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      if (response.ok) {
        return { success: true, message: 'API is healthy' };
      } else {
        return { success: false, message: 'API is not responding properly' };
      }
    } catch (error) {
      return { success: false, message: 'Cannot connect to API server' };
    }
  }
}

export const apiService = new ApiService(API_BASE_URL);

// Auth utilities
export const authUtils = {
  setToken: (token: string) => {
    localStorage.setItem('token', token);
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  removeToken: () => {
    localStorage.removeItem('token');
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  // Clear all auth data
  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
}; 