import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, ShoppingCart } from "lucide-react";
import phoneProduct from "@/assets/phone-product.jpg";
import shoesProduct from "@/assets/shoes-product.jpg";
import dressProduct from "@/assets/dress-product.jpg";
import laptopProduct from "@/assets/laptop-product.jpg";

const bestSellerProducts = [
  {
    id: 1,
    name: "iPhone 15 Pro Max - Latest Smartphone",
    image: phoneProduct,
    price: 129999,
    originalPrice: 149999,
    discount: 13,
    rating: 4.8,
    reviews: 2456,
    sold: 12500,
    inStock: true
  },
  {
    id: 2,
    name: "Nike Air Max 270 - Premium Running Shoes",
    image: shoesProduct,
    price: 8999,
    originalPrice: 12999,
    discount: 31,
    rating: 4.6,
    reviews: 1892,
    sold: 8900,
    inStock: true
  },
  {
    id: 3,
    name: "Samsung Galaxy S24 Ultra - Flagship Phone",
    image: phoneProduct,
    price: 119999,
    originalPrice: 139999,
    discount: 14,
    rating: 4.7,
    reviews: 2103,
    sold: 9800,
    inStock: true
  },
  {
    id: 4,
    name: "MacBook Pro M3 - Professional Laptop",
    image: laptopProduct,
    price: 189999,
    originalPrice: 219999,
    discount: 14,
    rating: 4.9,
    reviews: 1567,
    sold: 7200,
    inStock: true
  },
  {
    id: 5,
    name: "Adidas Ultraboost 22 - Performance Shoes",
    image: shoesProduct,
    price: 15999,
    originalPrice: 19999,
    discount: 20,
    rating: 4.5,
    reviews: 2341,
    sold: 15600,
    inStock: true
  },
  {
    id: 6,
    name: "OnePlus 12 - Premium Android Phone",
    image: phoneProduct,
    price: 69999,
    originalPrice: 79999,
    discount: 12,
    rating: 4.6,
    reviews: 1876,
    sold: 13400,
    inStock: true
  },
  {
    id: 7,
    name: "Dell XPS 13 - Ultrabook Laptop",
    image: laptopProduct,
    price: 129999,
    originalPrice: 149999,
    discount: 13,
    rating: 4.7,
    reviews: 1234,
    sold: 5600,
    inStock: true
  },
  {
    id: 8,
    name: "Puma RS-X - Retro Running Shoes",
    image: shoesProduct,
    price: 7999,
    originalPrice: 9999,
    discount: 20,
    rating: 4.4,
    reviews: 2987,
    sold: 22300,
    inStock: true
  }
];

const BestSeller = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState<number[]>([]);

  const toggleWishlist = (productId: number) => {
    setWishlistItems(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const addToCart = (productId: number) => {
    // In a real app, this would add to cart
    console.log(`Added product ${productId} to cart`);
  };

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="min-h-screen bg-background font-roboto">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Best Sellers</h1>
          <p className="text-gray-600">Discover our most popular and top-rated products</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bestSellerProducts.map((product) => (
            <Card 
              key={product.id} 
              className="group hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleProductClick(product.id)}
            >
              <CardContent className="p-4">
                <div className="relative mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  
                  {/* Discount Badge */}
                  <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs">
                    {product.discount}% OFF
                  </Badge>
                  
                  {/* Wishlist Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 text-gray-600 hover:text-red-500 bg-white/80 hover:bg-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                  >
                    <Heart 
                      className={`h-4 w-4 ${
                        wishlistItems.includes(product.id) 
                          ? "fill-red-500 text-red-500" 
                          : ""
                      }`} 
                    />
                  </Button>
                </div>

                {/* Product Info */}
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900 line-clamp-2 text-sm">
                    {product.name}
                  </h3>
                  
                  {/* Rating and Reviews */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(product.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600">
                      ({product.reviews.toLocaleString()})
                    </span>
                  </div>
                  
                  {/* Sold Count */}
                  <p className="text-xs text-green-600 font-medium">
                    {product.sold.toLocaleString()} sold
                  </p>
                  
                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      ₹{product.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  </div>
                  
                  {/* Add to Cart Button */}
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product.id);
                    }}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BestSeller; 