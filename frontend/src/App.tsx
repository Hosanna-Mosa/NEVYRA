import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/hooks/useCart";
import RequireAuth from "@/components/RequireAuth";
import { useScrollToTop } from "./hooks/use-scroll-to-top";
import Index from "./pages/Index";
import ProductListing from "./pages/ProductListing";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import AdminDashboard from "./pages/AdminDashboard";
import SearchSuggestions from "./pages/SearchSuggestions";
import SearchResults from "./pages/SearchResults";
import Wishlist from "./pages/Wishlist";
import BestSeller from "./pages/BestSeller";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  useScrollToTop();
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/category/:categoryName" element={<ProductListing />} />
      <Route path="/product/:productId" element={<ProductDetail />} />
      <Route path="/cart" element={<RequireAuth><Cart /></RequireAuth>} />
      <Route path="/checkout" element={<RequireAuth><Checkout /></RequireAuth>} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
      <Route path="/orders" element={<RequireAuth><Orders /></RequireAuth>} />
      <Route path="/order/:orderId" element={<RequireAuth><OrderDetails /></RequireAuth>} />
      <Route path="/admin" element={<RequireAuth requireAdmin><AdminDashboard /></RequireAuth>} />
      <Route path="/search-suggestions" element={<SearchSuggestions />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/wishlist" element={<RequireAuth><Wishlist /></RequireAuth>} />
      <Route path="/bestseller" element={<BestSeller />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
