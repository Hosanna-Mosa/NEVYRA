import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { apiService, Product } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

// Map home page sections to backend category names
const categoryBackendMap: Record<string, string> = {
  medical: "Medical",
  groceries: "Groceries",
  "fashion-beauty": "FashionBeauty",
  devices: "Devices",
  electrical: "Electrical",
  automotive: "Automotive",
  sports: "Sports",
  "home-interior": "HomeInterior",
};

const CategoryCards = () => {
  const isMobile = useIsMobile();
  const [dataByCategory, setDataByCategory] = useState<Record<string, Product[]>>({});
  const { wishlistIds, toggleWishlist, isAuthenticated } = useAuth();

  useEffect(() => {
    let isCancelled = false;
    const fetchAll = async () => {
      try {
        const backendCategories = Object.values(categoryBackendMap);
        const limit = isMobile ? 4 : 10;
        // Defer top picks; pass 0 so backend skips computing them
        const { success, data } = await apiService.getSections(backendCategories, limit, 0);
        if (!isCancelled && success) {
          // Map backend categories back to local keys
          const map: Record<string, Product[]> = {};
          Object.entries(categoryBackendMap).forEach(([key, backendName]) => {
            map[key] = data.byCategory[backendName] || [];
          });
          setDataByCategory(map);
        }
      } catch (e) {
        // silent fail
      }
    };
    fetchAll();
    return () => {
      isCancelled = true;
    };
  }, [isMobile]);

  const getDiscount = (p: Product) => {
    const sale = (p.attributes as any)?.salePrice;
    return sale && sale < p.price
      ? Math.round(((p.price - sale) / p.price) * 100)
      : 0;
  };

  const getDisplayPrice = (p: Product) => (p.attributes as any)?.salePrice || p.price;

  // Top picks moved to dedicated component on home page

  return (
    <section className="py-16 bg-background">
      <div className="w-full px-4 space-y-12">
        
        {/* Medical Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <Link to="/category/Medical" className="text-2xl font-bold text-foreground font-roboto hover:text-primary transition-colors cursor-pointer">Medical</Link>
            <Link to="/category/Medical" className="text-primary hover:text-primary-hover flex items-center gap-1">
              View More <ChevronRight className="h-4 w-4" /> 6+
            </Link>
          </div>
          <div className={`${isMobile ? 'grid grid-cols-2 gap-3' : 'flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth'}`} style={!isMobile ? { scrollbarWidth: 'none', msOverflowStyle: 'none' } : {}}>
            {(dataByCategory["medical"] || []).map((product) => {
              const discount = getDiscount(product);
              const displayPrice = getDisplayPrice(product);
              return (
                <Link key={product.id} to={`/product/${product.id}`}>
                  <Card className={`${isMobile ? 'w-full' : 'min-w-[200px] flex-shrink-0'} bg-card border border-border hover:shadow-md transition-shadow cursor-pointer`}>
                    <CardContent className="p-4">
                      <div className="relative mb-3">
                        <img
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.title}
                          className="w-full h-32 object-cover rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.svg";
                          }}
                        />
                        <button
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded p-1"
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
                        {discount > 0 && (
                          <Badge className="absolute top-2 left-2 bg-discount text-white text-xs">
                            {discount}% OFF
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-medium text-sm text-card-foreground mb-1 line-clamp-2">
                        {product.title}
                      </h3>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-price">₹{displayPrice.toLocaleString()}</span>
                        {discount > 0 && (
                          <span className="text-[10px] text-muted-foreground line-through">₹{product.price.toLocaleString()}</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Groceries Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <Link to="/category/Groceries" className="text-2xl font-bold text-foreground font-roboto hover:text-primary transition-colors cursor-pointer">Groceries</Link>
            <Link to="/category/Groceries" className="text-primary hover:text-primary-hover flex items-center gap-1">
              View More <ChevronRight className="h-4 w-4" /> 5+
            </Link>
          </div>
          <div className={`${isMobile ? 'grid grid-cols-2 gap-3' : 'flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth'}`} style={!isMobile ? { scrollbarWidth: 'none', msOverflowStyle: 'none' } : {}}>
            {(dataByCategory["groceries"] || []).map((product) => {
              const discount = getDiscount(product);
              const displayPrice = getDisplayPrice(product);
              return (
                <Link key={product.id} to={`/product/${product.id}`}>
                  <Card className={`${isMobile ? 'w-full' : 'min-w-[200px] flex-shrink-0'} bg-card border border-border hover:shadow-md transition-shadow cursor-pointer`}>
                    <CardContent className="p-4">
                      <div className="relative mb-3">
                        <img
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.title}
                          className="w-full h-32 object-cover rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.svg";
                          }}
                        />
                        <button
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded p-1"
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
                        {discount > 0 && (
                          <Badge className="absolute top-2 left-2 bg-discount text-white text-xs">
                            {discount}% OFF
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-medium text-sm text-card-foreground mb-1 line-clamp-2">
                        {product.title}
                      </h3>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-price">₹{displayPrice.toLocaleString()}</span>
                        {discount > 0 && (
                          <span className="text-[10px] text-muted-foreground line-through">₹{product.price.toLocaleString()}</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Fashion & Beauty Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <Link to="/category/FashionBeauty" className="text-2xl font-bold text-foreground font-roboto hover:text-primary transition-colors cursor-pointer">FashionBeauty</Link>
            <Link to="/category/FashionBeauty" className="text-primary hover:text-primary-hover flex items-center gap-1">
              View More <ChevronRight className="h-4 w-4" /> 4+
            </Link>
          </div>
          <div className={`${isMobile ? 'grid grid-cols-2 gap-3' : 'flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth'}`} style={!isMobile ? { scrollbarWidth: 'none', msOverflowStyle: 'none' } : {}}>
            {(dataByCategory["fashion-beauty"] || []).map((product) => {
              const discount = getDiscount(product);
              const displayPrice = getDisplayPrice(product);
              return (
                <Link key={product.id} to={`/product/${product.id}`}>
                  <Card className={`${isMobile ? 'w-full' : 'min-w-[200px] flex-shrink-0'} bg-card border border-border hover:shadow-md transition-shadow cursor-pointer`}>
                    <CardContent className="p-4">
                      <div className="relative mb-3">
                        <img
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.title}
                          className="w-full h-32 object-cover rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.svg";
                          }}
                        />
                        <button
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded p-1"
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
                        {discount > 0 && (
                          <Badge className="absolute top-2 left-2 bg-discount text-white text-xs">
                            {discount}% OFF
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-medium text-sm text-card-foreground mb-1 line-clamp-2">
                        {product.title}
                      </h3>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-price">₹{displayPrice.toLocaleString()}</span>
                        {discount > 0 && (
                          <span className="text-[10px] text-muted-foreground line-through">₹{product.price.toLocaleString()}</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Devices Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <Link to="/category/Devices" className="text-2xl font-bold text-foreground font-roboto hover:text-primary transition-colors cursor-pointer">Devices</Link>
            <Link to="/category/Devices" className="text-primary hover:text-primary-hover flex items-center gap-1">
              View More <ChevronRight className="h-4 w-4" /> 3+
            </Link>
          </div>
          <div className={`${isMobile ? 'grid grid-cols-2 gap-3' : 'flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth'}`} style={!isMobile ? { scrollbarWidth: 'none', msOverflowStyle: 'none' } : {}}>
            {(dataByCategory["devices"] || []).map((product) => {
              const discount = getDiscount(product);
              const displayPrice = getDisplayPrice(product);
              return (
                <Link key={product.id} to={`/product/${product.id}`}>
                  <Card className={`${isMobile ? 'w-full' : 'min-w-[200px] flex-shrink-0'} bg-card border border-border hover:shadow-md transition-shadow cursor-pointer`}>
                    <CardContent className="p-4">
                      <div className="relative mb-3">
                        <img
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.title}
                          className="w-full h-32 object-cover rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.svg";
                          }}
                        />
                        <button
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded p-1"
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
                        {discount > 0 && (
                          <Badge className="absolute top-2 left-2 bg-discount text-white text-xs">
                            {discount}% OFF
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-medium text-sm text-card-foreground mb-1 line-clamp-2">
                        {product.title}
                      </h3>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-price">₹{displayPrice.toLocaleString()}</span>
                        {discount > 0 && (
                          <span className="text-[10px] text-muted-foreground line-through">₹{product.price.toLocaleString()}</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Electrical Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <Link to="/category/Electrical" className="text-2xl font-bold text-foreground font-roboto hover:text-primary transition-colors cursor-pointer">Electrical</Link>
            <Link to="/category/Electrical" className="text-primary hover:text-primary-hover flex items-center gap-1">
              View More <ChevronRight className="h-4 w-4" /> 4+
            </Link>
          </div>
          <div className={`${isMobile ? 'grid grid-cols-2 gap-3' : 'flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth'}`} style={!isMobile ? { scrollbarWidth: 'none', msOverflowStyle: 'none' } : {}}>
            {(dataByCategory["electrical"] || []).map((product) => {
              const discount = getDiscount(product);
              const displayPrice = getDisplayPrice(product);
              return (
                <Link key={product.id} to={`/product/${product.id}`}>
                  <Card className={`${isMobile ? 'w-full' : 'min-w-[200px] flex-shrink-0'} bg-card border border-border hover:shadow-md transition-shadow cursor-pointer`}>
                    <CardContent className="p-4">
                      <div className="relative mb-3">
                        <img
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.title}
                          className="w-full h-32 object-cover rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.svg";
                          }}
                        />
                        <button
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded p-1"
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
                        {discount > 0 && (
                          <Badge className="absolute top-2 left-2 bg-discount text-white text-xs">
                            {discount}% OFF
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-medium text-sm text-card-foreground mb-1 line-clamp-2">
                        {product.title}
                      </h3>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-price">₹{displayPrice.toLocaleString()}</span>
                        {discount > 0 && (
                          <span className="text-[10px] text-muted-foreground line-through">₹{product.price.toLocaleString()}</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Automotive Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <Link to="/category/Automotive" className="text-2xl font-bold text-foreground font-roboto hover:text-primary transition-colors cursor-pointer">Automotive</Link>
            <Link to="/category/Automotive" className="text-primary hover:text-primary-hover flex items-center gap-1">
              View More <ChevronRight className="h-4 w-4" /> 4+
            </Link>
          </div>
          <div className={`${isMobile ? 'grid grid-cols-2 gap-3' : 'flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth'}`} style={!isMobile ? { scrollbarWidth: 'none', msOverflowStyle: 'none' } : {}}>
            {(dataByCategory["automotive"] || []).map((product) => {
              const discount = getDiscount(product);
              const displayPrice = getDisplayPrice(product);
              return (
                <Link key={product.id} to={`/product/${product.id}`}>
                  <Card className={`${isMobile ? 'w-full' : 'min-w-[200px] flex-shrink-0'} bg-card border border-border hover:shadow-md transition-shadow cursor-pointer`}>
                    <CardContent className="p-4">
                      <div className="relative mb-3">
                        <img
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.title}
                          className="w-full h-32 object-cover rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.svg";
                          }}
                        />
                        <button
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded p-1"
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
                        {discount > 0 && (
                          <Badge className="absolute top-2 left-2 bg-discount text-white text-xs">
                            {discount}% OFF
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-medium text-sm text-card-foreground mb-1 line-clamp-2">
                        {product.title}
                      </h3>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-price">₹{displayPrice.toLocaleString()}</span>
                        {discount > 0 && (
                          <span className="text-[10px] text-muted-foreground line-through">₹{product.price.toLocaleString()}</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Sports Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <Link to="/category/Sports" className="text-2xl font-bold text-foreground font-roboto hover:text-primary transition-colors cursor-pointer">Sports</Link>
            <Link to="/category/Sports" className="text-primary hover:text-primary-hover flex items-center gap-1">
              View More <ChevronRight className="h-4 w-4" /> 4+
            </Link>
          </div>
          <div className={`${isMobile ? 'grid grid-cols-2 gap-3' : 'flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth'}`} style={!isMobile ? { scrollbarWidth: 'none', msOverflowStyle: 'none' } : {}}>
            {(dataByCategory["sports"] || []).map((product) => {
              const discount = getDiscount(product);
              const displayPrice = getDisplayPrice(product);
              return (
                <Link key={product.id} to={`/product/${product.id}`}>
                  <Card className={`${isMobile ? 'w-full' : 'min-w-[200px] flex-shrink-0'} bg-card border border-border hover:shadow-md transition-shadow cursor-pointer`}>
                    <CardContent className="p-4">
                      <div className="relative mb-3">
                        <img
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.title}
                          className="w-full h-32 object-cover rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.svg";
                          }}
                        />
                        <button
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded p-1"
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
                        {discount > 0 && (
                          <Badge className="absolute top-2 left-2 bg-discount text-white text-xs">
                            {discount}% OFF
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-medium text-sm text-card-foreground mb-1 line-clamp-2">
                        {product.title}
                      </h3>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-price">₹{displayPrice.toLocaleString()}</span>
                        {discount > 0 && (
                          <span className="text-[10px] text-muted-foreground line-through">₹{product.price.toLocaleString()}</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Home Interior Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <Link to="/category/HomeInterior" className="text-2xl font-bold text-foreground font-roboto hover:text-primary transition-colors cursor-pointer">Home Interior</Link>
            <Link to="/category/HomeInterior" className="text-primary hover:text-primary-hover flex items-center gap-1">
              View More <ChevronRight className="h-4 w-4" /> 4+
            </Link>
          </div>
          <div className={`${isMobile ? 'grid grid-cols-2 gap-3' : 'flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth'}`} style={!isMobile ? { scrollbarWidth: 'none', msOverflowStyle: 'none' } : {}}>
            {(dataByCategory["home-interior"] || []).map((product) => {
              const discount = getDiscount(product);
              const displayPrice = getDisplayPrice(product);
              return (
                <Link key={product.id} to={`/product/${product.id}`}>
                  <Card className={`${isMobile ? 'w-full' : 'min-w-[200px] flex-shrink-0'} bg-card border border-border hover:shadow-md transition-shadow cursor-pointer`}>
                    <CardContent className="p-4">
                      <div className="relative mb-3">
                        <img
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.title}
                          className="w-full h-32 object-cover rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.svg";
                          }}
                        />
                        <button
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded p-1"
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
                        {discount > 0 && (
                          <Badge className="absolute top-2 left-2 bg-discount text-white text-xs">
                            {discount}% OFF
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-medium text-sm text-card-foreground mb-1 line-clamp-2">
                        {product.title}
                      </h3>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-price">₹{displayPrice.toLocaleString()}</span>
                        {discount > 0 && (
                          <span className="text-[10px] text-muted-foreground line-through">₹{product.price.toLocaleString()}</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Top Picks section removed - now rendered beneath hero banner */}

      </div>
    </section>
  );
};

export default CategoryCards; 