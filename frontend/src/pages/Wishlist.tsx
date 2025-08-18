import { useEffect, useState } from "react";
import { Heart, Star, MoreVertical, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { apiService, type Product } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/components/ui/use-toast";

const computeDiscount = (p: Product) => {
  const sale = (p.attributes as any)?.salePrice;
  if (sale && sale < p.price) return Math.round(((p.price - sale) / p.price) * 100);
  return 0;
};

const Wishlist = () => {
  const [items, setItems] = useState<Product[]>([]);
  const navigate = useNavigate();
  const { refreshWishlist } = useAuth();
  const { addToCart, refreshCart, cartItems } = useCart() as any;
  const [adding, setAdding] = useState<Set<string>>(new Set());
  const [added, setAdded] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      const res = await apiService.getWishlist();
      if (res.success) setItems(res.data);
    };
    load();
  }, []);

  const removeFromWishlist = async (id: string) => {
    await apiService.removeFromWishlist(id);
    await refreshWishlist();
    setItems(items.filter(item => item.id !== id));
  };

  const handleAddToCart = async (id: string) => {
    if (adding.has(id)) return;
    setAdding((prev) => new Set(prev).add(id));
    try {
      const target = items.find(p => p.id === id);
      const size = (target?.attributes as any)?.size as string | undefined;
      const color = (target?.attributes as any)?.color as string | undefined;
      const result = await addToCart({ productId: id, quantity: 1, size, color, selectedAttributes: {} });
      if (result.success) {
        toast({ title: "Added to cart", description: target?.title });
        setAdded(prev => new Set(prev).add(id));
        await refreshCart();
        // Auto-remove from wishlist after adding to cart
        try {
          await apiService.removeFromWishlist(id);
        } catch (_) {}
        setItems(prev => prev.filter(p => p.id !== id));
        await refreshWishlist();
      } else {
        toast({ title: "Failed to add to cart", description: result.message, variant: "destructive" });
      }
    } finally {
      setAdding((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  return (
    <div className="min-h-screen bg-background font-roboto">
      <Navbar />
      
      {/* Page Title and Status */}
      <div className="p-4 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground mb-2">My Wishlist</h1>
        <div className="flex items-center space-x-2 text-muted-foreground">
          <div className="w-4 h-4 bg-muted rounded-full flex items-center justify-center">
            <span className="text-xs">🔒</span>
          </div>
          <span className="text-sm">Private · {items.length} items</span>
        </div>
      </div>

      {/* Wishlist Items */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {items.map((item) => {
            const inCart = (cartItems || []).some((ci: any) => (ci.productId?.id || ci.productId?._id || ci.productId) === item.id);
            const showGoToCart = inCart || added.has(item.id);
            return (
            <Card key={item.id} className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-3">
                <div className="relative mb-3">
                  <img
                    src={item.images?.[0] || "/placeholder.svg"}
                    alt={item.title}
                    className="max-h-40 w-auto object-contain mx-auto"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg";
                    }}
                  />
                  
                  {/* Discount Badge */}
                  {computeDiscount(item) > 0 && (
                    <Badge className="absolute top-2 left-2 bg-green-500 text-white text-xs">
                      {computeDiscount(item)}% OFF
                    </Badge>
                  )}
                  
                  {/* More Options */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 bg-white/80 hover:bg-white"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>

                {/* Delivery Status */}
                {!item.inStock && (
                  <p className="text-red-500 text-xs font-medium mb-2 text-center">Not deliverable</p>
                )}

                {/* Product Name */}
                <h3 className="font-medium text-foreground mb-2 line-clamp-2 text-sm">
                  {item.title}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.floor(item.rating)
                          ? "fill-green-500 text-green-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-bold">₹{((item.attributes as any)?.salePrice || item.price).toLocaleString()}</span>
                  {computeDiscount(item) > 0 && (
                    <span className="text-xs text-muted-foreground line-through">₹{item.price.toLocaleString()}</span>
                  )}
                </div>

                {/* Assured Badge */}
                {false && (
                  <div className="flex items-center gap-1 mb-3">
                    <Shield className="h-3 w-3 text-blue-500" />
                    <span className="text-xs text-blue-500 font-medium">Assured</span>
                  </div>
                )}

                {/* Add to Cart Button */}
                <Button 
                  className="w-full border border-gray-300 bg-white text-black hover:bg-gray-50 text-sm"
                  onClick={() => (showGoToCart ? navigate('/cart') : handleAddToCart(item.id))}
                  disabled={adding.has(item.id) || (!item.inStock && !showGoToCart)}
                >
                  {adding.has(item.id) ? 'Adding…' : (showGoToCart ? 'Go to Cart' : 'Add to Cart')}
                </Button>
              </CardContent>
            </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {items.length === 0 && (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-4">
              Start adding products to your wishlist to see them here
            </p>
            <Button onClick={() => navigate("/")}>
              Start Shopping
            </Button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Wishlist; 