import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Star, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { apiService, Product } from "@/lib/api";

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
  const [topPicks, setTopPicks] = useState<Product[]>([]);
  const [topPicksLoaded, setTopPicksLoaded] = useState<boolean>(false);

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

  // Lazy-load Top Picks when it is near viewport
  useEffect(() => {
    if (topPicksLoaded) return;
    const section = document.getElementById("top-picks-section");
    if (!section) return;
    const observer = new IntersectionObserver(
      async (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting || entry.intersectionRatio > 0) {
          try {
            const res = await apiService.getTopPicks(isMobile ? 8 : 12);
            if (res.success) {
              setTopPicks(res.data);
              setTopPicksLoaded(true);
              observer.disconnect();
            }
          } catch (_) {
            observer.disconnect();
          }
        }
      },
      { root: null, rootMargin: "200px 0px", threshold: 0.01 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [isMobile, topPicksLoaded]);

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

        {/* Top Picks for You Section */}
        <div id="top-picks-section" className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-blue-900 font-roboto mb-1">Top Picks for You</h2>
              <p className="text-blue-600 text-xs">Handpicked products just for you</p>
            </div>
            <Link to="/bestseller" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors text-sm">
              View More <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className={`${isMobile ? 'grid grid-cols-2 gap-3' : 'flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth'}`} style={!isMobile ? { scrollbarWidth: 'none', msOverflowStyle: 'none' } : {}}>
            {(topPicks || []).map((product) => {
              const discount = getDiscount(product);
              const displayPrice = getDisplayPrice(product);
              return (
                <Link key={product.id} to={`/product/${product.id}`}>
                  <Card className={`${isMobile ? 'w-full' : 'min-w-[200px] flex-shrink-0'} bg-white border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1`}>
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
                        {discount > 0 && (
                          <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5">
                            {discount}% OFF
                          </Badge>
                        )}
                        <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-1.5 py-0.5 rounded-full">
                          ⭐ TOP
                        </div>
                      </div>
                      <h3 className="font-medium text-sm text-gray-800 mb-1 line-clamp-2">
                        {product.title}
                      </h3>
                      <div className="flex items-center gap-1 mb-2">
                        <span className="text-sm font-bold text-blue-600">₹{displayPrice.toLocaleString()}</span>
                        {discount > 0 && (
                          <span className="text-xs text-gray-500 line-through">₹{product.price.toLocaleString()}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-3 w-3 ${i < Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className="text-xs text-gray-600 ml-1">({product.rating.toFixed(1)})</span>
                      </div>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs py-1.5">
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default CategoryCards; 