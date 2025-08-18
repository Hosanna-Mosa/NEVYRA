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
  reviewsList?: Array<{
    _id?: string;
    userId: string;
    userName?: string;
    rating: number;
    title?: string;
    comment?: string;
    createdAt?: string;
    updatedAt?: string;
  }>;
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

export interface SectionsResponse {
  success: boolean;
  message: string;
  data: { byCategory: Record<string, Product[]>; topPicks: Product[] };
}

export interface CartItem {
  _id: string;
  userId: string;
  productId: Product;
  quantity: number;
  size?: string;
  color?: string;
  price: number;
  originalPrice?: number;
  selectedAttributes: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CartSummary {
  items: CartItem[];
  summary: {
    subtotal: number;
    totalItems: number;
    totalSavings: number;
    shippingFee: number;
    finalTotal: number;
  };
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
  selectedAttributes?: Record<string, any>;
}

export interface UpdateCartItemRequest {
  quantity?: number;
  size?: string;
  color?: string;
  selectedAttributes?: Record<string, any>;
}

export interface OrderItem {
  _id: string;
  orderId: string;
  productId: Product;
  quantity: number;
  price: number;
  originalPrice?: number;
  size?: string;
  color?: string;
  selectedAttributes: Record<string, any>;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  subtotal: number;
  shippingFee: number;
  taxAmount: number;
  discountAmount: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
    state: string;
    country: string;
  };
  billingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
    state: string;
    country: string;
  };
  estimatedDelivery: string;
  actualDelivery?: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  paymentMethod: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
    state: string;
    country: string;
  };
  billingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
    state: string;
    country: string;
  };
  notes?: string;
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
    state: string;
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
    state: string;
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

  async searchProducts(query: string, page: number = 1, limit: number = 12): Promise<ProductsResponse> {
    const params = new URLSearchParams();
    if (query) params.append('search', query);
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    return this.request<ProductsResponse>(`/products?${params.toString()}`);
  }

  async suggest(query: string, limit: number = 8): Promise<{ success: boolean; message: string; data: { suggestions: string[]; products: Product[] } }> {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (limit) params.append('limit', limit.toString());
    return this.request<{ success: boolean; message: string; data: { suggestions: string[]; products: Product[] } }>(`/products/suggest?${params.toString()}`);
  }

  async getSections(
    categories: string[],
    limit: number = 10,
    topLimit: number = 12
  ): Promise<SectionsResponse> {
    const params = new URLSearchParams();
    if (categories?.length) params.append('categories', categories.join(','));
    if (limit) params.append('limit', limit.toString());
    if (topLimit) params.append('topLimit', topLimit.toString());
    return this.request<SectionsResponse>(`/products/sections?${params.toString()}`);
  }

  async getTopPicks(limit: number = 12): Promise<{ success: boolean; message: string; data: Product[] }> {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    return this.request<{ success: boolean; message: string; data: Product[] }>(`/products/top-picks?${params.toString()}`);
  }

  async getProduct(id: string): Promise<ProductResponse> {
    return this.request<ProductResponse>(`/products/${id}`);
  }

  async getTopProductsByCategory(category: string, limit: number = 6, excludeId?: string): Promise<ProductsResponse> {
    const params = new URLSearchParams();
    params.append('category', category);
    params.append('limit', limit.toString());
    if (excludeId) params.append('excludeId', excludeId);
    return this.request<ProductsResponse>(`/products/top?${params.toString()}`);
  }

  async getProductReviews(id: string): Promise<{ success: boolean; message: string; data: Product['reviewsList'] }>{
    return this.request<{ success: boolean; message: string; data: Product['reviewsList'] }>(`/products/${id}/reviews`);
  }

  async addOrUpdateReview(id: string, review: { rating: number; title?: string; comment?: string }): Promise<ProductResponse> {
    return this.request<ProductResponse>(`/products/${id}/reviews`, {
      method: 'POST',
      body: JSON.stringify(review),
    });
  }

  async deleteMyReview(id: string): Promise<ProductResponse> {
    return this.request<ProductResponse>(`/products/${id}/reviews`, {
      method: 'DELETE',
    });
  }

  async updateReviewById(productId: string, reviewId: string, review: { rating?: number; title?: string; comment?: string }): Promise<ProductResponse> {
    return this.request<ProductResponse>(`/products/${productId}/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(review),
    });
  }

  async deleteReviewById(productId: string, reviewId: string): Promise<ProductResponse> {
    return this.request<ProductResponse>(`/products/${productId}/reviews/${reviewId}`, {
      method: 'DELETE',
    });
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

  // Cart management methods
  async getCart(): Promise<{ success: boolean; message: string; data: CartItem[] }> {
    return this.request<{ success: boolean; message: string; data: CartItem[] }>('/cart');
  }

  async getCartSummary(): Promise<{ success: boolean; message: string; data: CartSummary }> {
    return this.request<{ success: boolean; message: string; data: CartSummary }>('/cart/summary');
  }

  async addToCart(cartData: AddToCartRequest): Promise<{ success: boolean; message: string; data: CartItem }> {
    return this.request<{ success: boolean; message: string; data: CartItem }>('/cart', {
      method: 'POST',
      body: JSON.stringify(cartData),
    });
  }

  async updateCartItem(itemId: string, updateData: UpdateCartItemRequest): Promise<{ success: boolean; message: string; data: CartItem }> {
    return this.request<{ success: boolean; message: string; data: CartItem }>(`/cart/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async removeFromCart(itemId: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/cart/${itemId}`, {
      method: 'DELETE',
    });
  }

  async clearCart(): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>('/cart', {
      method: 'DELETE',
    });
  }

  // Order management methods
  async createOrder(orderData: CreateOrderRequest): Promise<{ success: boolean; message: string; data: Order }> {
    return this.request<{ success: boolean; message: string; data: Order }>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getUserOrders(): Promise<{ success: boolean; message: string; data: Order[] }> {
    return this.request<{ success: boolean; message: string; data: Order[] }>('/orders');
  }

  async getOrderById(orderId: string): Promise<{ success: boolean; message: string; data: Order }> {
    return this.request<{ success: boolean; message: string; data: Order }>(`/orders/${orderId}`);
  }

  async getOrderByNumber(orderNumber: string): Promise<{ success: boolean; message: string; data: Order }> {
    return this.request<{ success: boolean; message: string; data: Order }>(`/orders/number/${orderNumber}`);
  }

  async cancelOrder(orderId: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/orders/${orderId}/cancel`, {
      method: 'PUT',
    });
  }

  // Admin order management methods
  async getAllOrders(): Promise<{ success: boolean; message: string; data: Order[] }> {
    return this.request<{ success: boolean; message: string; data: Order[] }>('/orders/admin/all');
  }

  async updateOrderStatus(orderId: string, updateData: { status: string; trackingNumber?: string; notes?: string }): Promise<{ success: boolean; message: string; data: Order }> {
    return this.request<{ success: boolean; message: string; data: Order }>(`/orders/admin/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
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

  // Search utilities
  async getRecentSearches(): Promise<{ success: boolean; message: string; data: string[] }> {
    return this.request<{ success: boolean; message: string; data: string[] }>(`/users/recent-searches`);
  }

  async addRecentSearch(term: string): Promise<{ success: boolean; message: string; data: string[] }> {
    return this.request<{ success: boolean; message: string; data: string[] }>(`/users/recent-searches`, {
      method: 'POST',
      body: JSON.stringify({ term }),
    });
  }

  async getPopularSearches(): Promise<{ success: boolean; message: string; data: string[] }> {
    return this.request<{ success: boolean; message: string; data: string[] }>(`/users/popular-searches`);
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