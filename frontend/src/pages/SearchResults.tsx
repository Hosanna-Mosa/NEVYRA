import { useState, useEffect } from "react";
import { Search, ArrowLeft, Filter, Grid, List, Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { apiService, type Product } from "@/lib/api";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";

const SearchResults = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const { wishlistIds, toggleWishlist, isAuthenticated } = useAuth();
  const { addToCart, cartItems, refreshCart } = useCart() as any;
  const [adding, setAdding] = useState<Set<string>>(new Set());

  // Fetch results from API when query changes
  useEffect(() => {
    const query = searchParams.get("q") || "";
    setSearchQuery(query);
    const fetchResults = async () => {
      const q = query.trim();
      if (!q) {
        setResults([]);
        setTotal(0);
        return;
      }
      setLoading(true);
      try {
        const res = await apiService.searchProducts(q, 1, 24);
        setResults(res.data || []);
        setTotal(res.pagination?.total || (res.data?.length ?? 0));
      } catch (e) {
        setResults([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [searchParams]);

  const handleSearch = (query: string) => {
    const q = query.trim();
    if (!q) return;
    apiService.addRecentSearch(q).catch(() => {});
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="flex items-center p-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="mr-2 p-1"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Search for products, brands and more"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearch(searchQuery);
                }
              }}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          
          {/* Logo */}
          <Link to="/" className="ml-2">
            <img 
              src="/logo.jpg" 
              alt="Nevyra Logo" 
              className="h-7 w-auto mix-blend-multiply filter drop-shadow-sm"
            />
          </Link>
        </div>
      </div>

      {/* Results Header */}
      <div className="px-3 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-base font-semibold text-foreground">
              Search Results for "{searchQuery}"
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              {total} results found
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center space-x-1 text-xs px-2 py-1"
            >
              <Filter className="h-3 w-3" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
            
            <div className="flex border border-border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none p-1"
              >
                <Grid className="h-3 w-3" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none p-1"
              >
                <List className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="p-3">
        {loading ? (
          <div className="text-center py-8 px-4">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h2 className="text-lg font-semibold mb-2 text-foreground">Searching…</h2>
          </div>
        ) : results.length > 0 ? (
          <div className={viewMode === "grid" ? "grid grid-cols-2 gap-3" : "space-y-3"}>
            {results.map((product) => (
              <Card
                key={product.id}
                className="cursor-pointer hover:shadow-md transition-shadow border border-border"
                onClick={() => handleProductClick(product.id)}
              >
                <CardContent className="p-3">
                  <div className={viewMode === "grid" ? "space-y-2" : "flex space-x-3"}>
                    <div className={viewMode === "grid" ? "aspect-square relative" : "w-20 h-20 flex-shrink-0 relative"}>
                      <img
                        src={product.images?.[0] || "/placeholder.svg"}
                        alt={product.title}
                        className="w-full h-full object-cover rounded-md"
                      />
                      <button
                        className="absolute top-1 right-1 bg-white/80 hover:bg-white rounded p-1"
                        onClick={async (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!isAuthenticated) return;
                          await toggleWishlist(product.id);
                        }}
                        aria-label="Toggle wishlist"
                      >
                        <Heart className={`h-4 w-4 ${wishlistIds.has(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                      </button>
                    </div>
                    
                    <div className={viewMode === "grid" ? "space-y-1" : "flex-1 space-y-1"}>
                      <h3 className="font-medium text-sm line-clamp-2 text-foreground leading-tight">
                        {product.title}
                      </h3>
                      
                      <div className="flex items-center space-x-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(product.rating || 0)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground ml-1">
                          ({product.reviews || 0})
                        </span>
                      </div>
                      
                      <p className="text-xs text-muted-foreground">
                        {product.category}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-base text-foreground">
                          ${product.price}
                        </p>
                        {(() => {
                          const inCart = (cartItems || []).some((ci: any) => (ci.productId?.id || ci.productId?._id || ci.productId) === product.id);
                          const showGoToCart = inCart;
                          return (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (showGoToCart) { navigate('/cart'); return; }
                                setAdding(prev => new Set(prev).add(product.id));
                                try {
                                  const res = await addToCart({ productId: product.id, quantity: 1, selectedAttributes: {} });
                                  if (res.success) await refreshCart();
                                } finally {
                                  setAdding(prev => { const n = new Set(prev); n.delete(product.id); return n; });
                                }
                              }}
                              disabled={adding.has(product.id)}
                            >
                              {adding.has(product.id) ? 'Adding…' : (showGoToCart ? 'Go to Cart' : 'Add to Cart')}
                            </Button>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 px-4">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h2 className="text-lg font-semibold mb-2 text-foreground">No results found</h2>
            <p className="text-sm text-muted-foreground mb-4">
              We couldn't find any products matching "{searchQuery}"
            </p>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Try:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Using different keywords</li>
                <li>• Checking your spelling</li>
                <li>• Using more general terms</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults; 