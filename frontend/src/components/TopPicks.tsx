import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { apiService, type Product } from "@/lib/api";

const TopPicks = () => {
  const isMobile = useIsMobile();
  const [topPicks, setTopPicks] = useState<Product[]>([]);
  const [topPicksLoaded, setTopPicksLoaded] = useState<boolean>(false);

  const getDiscount = (p: Product) => {
    const sale = (p.attributes as any)?.salePrice;
    return sale && sale < p.price
      ? Math.round(((p.price - sale) / p.price) * 100)
      : 0;
  };

  const getDisplayPrice = (p: Product) => (p.attributes as any)?.salePrice || p.price;

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
    <section id="top-picks-section" className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 md:p-6 border border-blue-100">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-blue-900 font-roboto mb-1">Top Picks for You</h2>
          <p className="text-blue-600 text-[11px] md:text-xs">Handpicked products just for you</p>
        </div>
        <Link to="/bestseller" className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 md:px-3 py-1 md:py-1.5 rounded-lg flex items-center gap-1 transition-colors text-xs md:text-sm">
          View More
        </Link>
      </div>
      <div className={`flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth`} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {(topPicks || []).map((product) => {
          const discount = getDiscount(product);
          const displayPrice = getDisplayPrice(product);
          return (
            <Link key={product.id} to={`/product/${product.id}`}>
              <Card className={`${isMobile ? 'min-w-[150px]' : 'min-w-[200px]'} flex-shrink-0 bg-white border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1`}>
                <CardContent className={`${isMobile ? 'p-3' : 'p-4'}`}>
                  <div className="relative mb-3">
                    <img
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.title}
                      className={`w-full ${isMobile ? 'h-24' : 'h-32'} object-cover rounded-lg`}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.svg";
                      }}
                    />
                    {discount > 0 && (
                      <Badge className="absolute top-2 left-2 bg-red-500 text-white text-[10px] md:text-xs font-semibold px-1.5 md:px-2 py-0.5">
                        {discount}% OFF
                      </Badge>
                    )}
                    <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-[10px] md:text-xs font-bold px-1.5 py-0.5 rounded-full">
                      ⭐ TOP
                    </div>
                  </div>
                  <h3 className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'} text-gray-800 mb-1 line-clamp-2`}>
                    {product.title}
                  </h3>
                  <div className="flex items-center gap-1 mb-2">
                    <span className={`${isMobile ? 'text-[13px]' : 'text-sm'} font-bold text-blue-600`}>₹{displayPrice.toLocaleString()}</span>
                    {discount > 0 && (
                      <span className={`${isMobile ? 'text-[11px]' : 'text-xs'} text-gray-500 line-through`}>₹{product.price.toLocaleString()}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`${isMobile ? 'h-2.5 w-2.5' : 'h-3 w-3'} ${i < Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <span className={`${isMobile ? 'text-[11px]' : 'text-xs'} text-gray-600 ml-1`}>({product.rating.toFixed(1)})</span>
                  </div>
                  <Button className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium ${isMobile ? 'text-[11px] py-1' : 'text-xs py-1.5'}`}>
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default TopPicks;


