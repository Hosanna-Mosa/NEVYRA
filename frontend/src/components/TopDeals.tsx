import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Loader2, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { apiService, Product } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";

const TopDeals = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { wishlistIds, toggleWishlist, isAuthenticated } = useAuth();
  const { addToCart, cartItems, refreshCart } = useCart() as any;
  const navigate = useNavigate();
  const [adding, setAdding] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchTopDeals = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch products and sort by sold count to get top deals
        const response = await apiService.getProducts(1, 20);
        
        if (response.success && response.data) {
          // Sort by sold count to get top deals
          const sortedProducts = response.data
            .sort((a, b) => b.soldCount - a.soldCount)
            .slice(0, 8);
          setProducts(sortedProducts);
        } else {
          setError("Failed to fetch top deals");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch top deals");
      } finally {
        setLoading(false);
      }
    };

    fetchTopDeals();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-muted">
        <div className="w-full px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2 font-roboto">
                Top Deals of the Day
              </h2>
              <p className="text-muted-foreground">
                Limited time offers on bestselling products
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center h-48">
            <div className="flex items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="text-lg">Loading top deals...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || products.length === 0) {
    return (
      <section className="py-16 bg-muted">
        <div className="w-full px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2 font-roboto">
                Top Deals of the Day
              </h2>
              <p className="text-muted-foreground">
                Limited time offers on bestselling products
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center h-48">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                {error || "No top deals available at the moment"}
              </p>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-muted">
      <div className="w-full px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2 font-roboto">
              Top Deals of the Day
            </h2>
            <p className="text-muted-foreground">
              Limited time offers on bestselling products
            </p>
          </div>
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            View All Deals
          </Button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {products.map((product) => {
            // Calculate discount if there's a sale price
            const discount = product.attributes?.salePrice && product.attributes.salePrice < product.price
              ? Math.round(((product.price - product.attributes.salePrice) / product.price) * 100)
              : 0;
            
            const displayPrice = product.attributes?.salePrice || product.price;
            
            return (
              <Card
                key={product.id}
                className="min-w-[200px] flex-shrink-0 group hover:shadow-xl hover:scale-105 transition-all duration-300 bg-card border border-border transform hover:-translate-y-1 cursor-pointer"
              >
                <CardContent className="p-3">
                  <Link to={`/product/${product.id}`}>
                    <div className="relative mb-2">
                      <img
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.title}
                        className="w-full h-32 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.svg";
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-1 right-1 h-7 w-7 bg-white/80 hover:bg-white"
                        onClick={async (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!isAuthenticated) return;
                          await toggleWishlist(product.id);
                        }}
                        aria-label="Toggle wishlist"
                      >
                        <Heart className={`h-4 w-4 ${wishlistIds.has(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                      {discount > 0 && (
                        <Badge className="absolute top-1 left-1 bg-discount text-white text-xs px-1.5 py-0.5 group-hover:scale-110 transition-transform duration-300">
                          {discount}% OFF
                        </Badge>
                      )}
                    </div>

                    <h3 className="font-semibold text-card-foreground mb-1.5 font-roboto group-hover:text-primary transition-colors line-clamp-2 text-sm">
                      {product.title}
                    </h3>

                    <div className="flex items-center gap-1 mb-1.5">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 group-hover:scale-110 transition-transform duration-200" />
                        <span className="text-xs font-medium ml-1">
                          {product.rating.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ({product.reviews})
                      </span>
                    </div>

                    <div className="flex items-center gap-1 mb-2">
                      <span className="text-sm font-bold text-price group-hover:text-primary transition-colors duration-200">
                        ₹{displayPrice.toLocaleString()}
                      </span>
                      {discount > 0 && (
                        <span className="text-xs text-muted-foreground line-through">
                          ₹{product.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </Link>

                  {(() => {
                    const inCart = (cartItems || []).some((ci: any) => (ci.productId?.id || ci.productId?._id || ci.productId) === product.id);
                    const showGoToCart = inCart;
                    return (
                      <Button 
                        className="w-full bg-primary hover:bg-primary-hover text-primary-foreground text-xs py-1.5 group-hover:scale-105 transition-all duration-200 hover:shadow-md"
                        disabled={(!product.inStock && !showGoToCart) || adding.has(product.id)}
                        onClick={async () => {
                          if (showGoToCart) { navigate('/cart'); return; }
                          setAdding(prev => new Set(prev).add(product.id));
                          try {
                            const res = await addToCart({ productId: product.id, quantity: 1, selectedAttributes: {} });
                            if (res.success) await refreshCart();
                          } finally {
                            setAdding(prev => { const n = new Set(prev); n.delete(product.id); return n; });
                          }
                        }}
                      >
                        <ShoppingCart className="h-3 w-3 mr-1 group-hover:scale-110 transition-transform duration-200" />
                        {adding.has(product.id) ? 'Adding…' : (showGoToCart ? 'Go to Cart' : (product.inStock ? 'Add to Cart' : 'Out of Stock'))}
                      </Button>
                    );
                  })()}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TopDeals;
