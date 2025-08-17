import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService, CartItem, CartSummary, AddToCartRequest, UpdateCartItemRequest } from '@/lib/api';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface CartContextType {
  cartItems: CartItem[];
  cartSummary: CartSummary | null;
  isLoading: boolean;
  addToCart: (data: AddToCartRequest) => Promise<{ success: boolean; message: string }>;
  updateCartItem: (itemId: string, data: UpdateCartItemRequest) => Promise<{ success: boolean; message: string }>;
  removeFromCart: (itemId: string) => Promise<{ success: boolean; message: string }>;
  clearCart: () => Promise<{ success: boolean; message: string }>;
  refreshCart: () => Promise<void>;
  getCartItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartSummary, setCartSummary] = useState<CartSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const refreshCart = async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      setCartSummary(null);
      return;
    }

    try {
      setIsLoading(true);
      const [cartResponse, summaryResponse] = await Promise.all([
        apiService.getCart(),
        apiService.getCartSummary()
      ]);

      if (cartResponse.success) {
        setCartItems(cartResponse.data);
      }

      if (summaryResponse.success) {
        setCartSummary(summaryResponse.data);
      }
    } catch (error) {
      console.error('Failed to refresh cart:', error);
      toast({
        title: "Error",
        description: "Failed to load cart items",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (data: AddToCartRequest): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiService.addToCart(data);
      if (response.success) {
        await refreshCart();
        toast({
          title: "Success",
          description: response.message,
        });
        return { success: true, message: response.message };
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add item to cart';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      return { success: false, message };
    }
  };

  const updateCartItem = async (itemId: string, data: UpdateCartItemRequest): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiService.updateCartItem(itemId, data);
      if (response.success) {
        await refreshCart();
        toast({
          title: "Success",
          description: response.message,
        });
        return { success: true, message: response.message };
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update cart item';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      return { success: false, message };
    }
  };

  const removeFromCart = async (itemId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiService.removeFromCart(itemId);
      if (response.success) {
        await refreshCart();
        toast({
          title: "Success",
          description: response.message,
        });
        return { success: true, message: response.message };
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to remove item from cart';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      return { success: false, message };
    }
  };

  const clearCart = async (): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiService.clearCart();
      if (response.success) {
        setCartItems([]);
        setCartSummary(null);
        toast({
          title: "Success",
          description: response.message,
        });
        return { success: true, message: response.message };
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to clear cart';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      return { success: false, message };
    }
  };

  const getCartItemCount = (): number => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Refresh cart when authentication state changes
  useEffect(() => {
    refreshCart();
  }, [isAuthenticated]);

  const value: CartContextType = {
    cartItems,
    cartSummary,
    isLoading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart,
    getCartItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
