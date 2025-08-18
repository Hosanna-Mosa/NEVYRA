import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService, authUtils, UserProfile } from '@/lib/api';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password: string;
    address?: string;
  }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
  wishlistIds: Set<string>;
  refreshWishlist: () => Promise<void>;
  toggleWishlist: (productId: string) => Promise<'added' | 'removed' | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());

  const isAuthenticated = !!user;

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      const token = authUtils.getToken();
      if (token) {
        try {
          await refreshUser();
        } catch (error) {
          console.error('Failed to initialize auth:', error);
          authUtils.removeToken();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // Refresh user profile
  const refreshUser = async () => {
    try {
      const response = await apiService.getProfile();
      if (response.success) {
        setUser(response.data);
        const ids = new Set<string>(((response.data as any)?.wishlist || []).map((p: any) => p.id || p._id));
        setWishlistIds(ids);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      authUtils.removeToken();
      setUser(null);
      setWishlistIds(new Set());
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login({ email, password });
      if (response.success && response.data?.token) {
        // Store token
        authUtils.setToken(response.data.token);
        
        // Fetch user profile
        try {
          await refreshUser();
          return { success: true, message: response.message };
        } catch (profileError) {
          // If profile fetch fails, remove token and return error
          authUtils.removeToken();
          return { 
            success: false, 
            message: 'Login successful but failed to load profile. Please try again.' 
          };
        }
      } else {
        return { success: false, message: response.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Login failed. Please try again.' 
      };
    }
  };

  const register = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password: string;
    address?: string;
  }) => {
    try {
      const response = await apiService.register(userData);
      if (response.success) {
        // Registration successful - don't auto-login
        // Just return success message
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Registration failed. Please try again.' 
      };
    }
  };

  const logout = () => {
    authUtils.removeToken();
    setUser(null);
    setWishlistIds(new Set());
  };

  const refreshWishlist = async () => {
    try {
      const res = await apiService.getWishlist();
      if (res.success) {
        const ids = new Set<string>((res.data || []).map((p: any) => p.id || p._id));
        setWishlistIds(ids);
      }
    } catch (e) {
      // ignore
    }
  };

  const toggleWishlist = async (productId: string): Promise<'added' | 'removed' | null> => {
    try {
      const res = await apiService.toggleWishlist(productId);
      if (res.success) {
        const next = new Set(wishlistIds);
        if (res.data.action === 'added') next.add(productId); else next.delete(productId);
        setWishlistIds(next);
        return res.data.action;
      }
    } catch (e) {
      // ignore
    }
    return null;
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated,
    refreshUser,
    wishlistIds,
    refreshWishlist,
    toggleWishlist,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 