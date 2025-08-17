import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, ShoppingCart, SlidersHorizontal, Loader2 } from "lucide-react";
import { apiService, Product } from "@/lib/api";

const brands = ["TechCorp", "SportBrand", "GameTech", "FashionHub"];

const ProductListing = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("popularity");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.getProducts(1, 50, categoryName);
        
        if (response.success && response.data) {
          setProducts(response.data);
        } else {
          setError("Failed to fetch products");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName]);

  const handleBrandChange = (brand: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brand]);
    } else {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    }
  };

  const filteredProducts = products.filter((product) => {
    const inPriceRange =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    const brandMatch =
      selectedBrands.length === 0 ||
      selectedBrands.includes(product.attributes?.brand || "");
    return inPriceRange && brandMatch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "reviews":
        return b.reviews - a.reviews;
      default:
        return b.soldCount - a.soldCount; // popularity
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background font-roboto">
        <Navbar />
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-96">
            <div className="flex items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="text-lg">Loading products...</span>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background font-roboto">
        <Navbar />
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-center h-96">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {error}
            </h2>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-roboto">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              {categoryName ? `${categoryName} Products` : "All Products"}
            </h1>
            <p className="text-muted-foreground">
              {sortedProducts.length} products found
            </p>
          </div>
          
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="reviews">Most Reviewed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-4">Filters</h3>
                
                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-medium text-foreground mb-3">
                    Price Range
                  </h4>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={100000}
                    step={1000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>₹{priceRange[0].toLocaleString()}</span>
                    <span>₹{priceRange[1].toLocaleString()}</span>
                  </div>
                </div>

                {/* Brand Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-foreground mb-3">
                    Brand
                  </h4>
                  <div className="space-y-2">
                    {brands.map((brand) => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox
                          id={brand}
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={(checked) =>
                            handleBrandChange(brand, checked as boolean)
                          }
                        />
                        <label
                          htmlFor={brand}
                          className="text-sm text-foreground cursor-pointer"
                        >
                          {brand}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-foreground mb-3">
                    Customer Rating
                  </h4>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center space-x-2">
                        <Checkbox id={`rating-${rating}`} />
                        <label
                          htmlFor={`rating-${rating}`}
                          className="text-sm text-foreground cursor-pointer flex items-center"
                        >
                          {rating}
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 ml-1" />
                          & above
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h4 className="font-medium text-foreground mb-3">
                    Availability
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="in-stock" />
                      <label
                        htmlFor="in-stock"
                        className="text-sm text-foreground cursor-pointer"
                      >
                        In Stock
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="fast-delivery" />
                      <label
                        htmlFor="fast-delivery"
                        className="text-sm text-foreground cursor-pointer"
                      >
                        Fast Delivery
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {sortedProducts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No products found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or search criteria
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                {sortedProducts.map((product) => {
                  // Calculate discount if there's a sale price
                  const discount = product.attributes?.salePrice && product.attributes.salePrice < product.price
                    ? Math.round(((product.price - product.attributes.salePrice) / product.price) * 100)
                    : 0;
                  
                  const displayPrice = product.attributes?.salePrice || product.price;
                  
                  return (
                    <Card
                      key={product.id}
                      className="group hover:shadow-lg transition-shadow duration-300 bg-card border border-border"
                    >
                      <CardContent className="p-3 md:p-4">
                        <Link to={`/product/${product.id}`}>
                          <div className="relative mb-3 md:mb-4">
                            <img
                              src={product.images[0] || "/placeholder.svg"}
                              alt={product.title}
                              className="w-full h-32 md:h-48 object-cover rounded-lg"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/placeholder.svg";
                              }}
                            />
                            {discount > 0 && (
                              <Badge className="absolute top-1 md:top-2 left-1 md:left-2 bg-discount text-white text-xs md:text-sm">
                                {discount}% OFF
                              </Badge>
                            )}
                          </div>

                          <h3 className="font-semibold text-card-foreground mb-2 font-roboto group-hover:text-primary transition-colors line-clamp-2 text-sm md:text-base">
                            {product.title}
                          </h3>

                          <div className="flex items-center gap-1 md:gap-2 mb-2">
                            <div className="flex items-center">
                              <Star className="h-3 w-3 md:h-4 md:w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs md:text-sm font-medium ml-1">
                                {product.rating.toFixed(1)}
                              </span>
                            </div>
                            <span className="text-xs md:text-sm text-muted-foreground">
                              ({product.reviews})
                            </span>
                          </div>

                          <div className="flex items-center gap-1 md:gap-2 mb-3 md:mb-4">
                            <span className="text-lg md:text-xl font-bold text-price">
                              ₹{displayPrice.toLocaleString()}
                            </span>
                            {discount > 0 && (
                              <span className="text-xs md:text-sm text-muted-foreground line-through">
                                ₹{product.price.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </Link>

                        <Button 
                          className="w-full bg-primary hover:bg-primary-hover text-primary-foreground text-xs md:text-sm py-2 md:py-2"
                          disabled={!product.inStock}
                        >
                          <ShoppingCart className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Load More */}
            {sortedProducts.length > 0 && (
              <div className="text-center mt-8">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Load More Products
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductListing;
