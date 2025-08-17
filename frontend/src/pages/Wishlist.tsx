import { useState } from "react";
import { Heart, Star, MoreVertical, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import phoneProduct from "@/assets/phone-product.jpg";
import shoesProduct from "@/assets/shoes-product.jpg";
import dressProduct from "@/assets/dress-product.jpg";
import laptopProduct from "@/assets/laptop-product.jpg";

const wishlistItems = [
  {
    id: 1,
    name: "KAJARU Solid Men Polo Neck Sweater",
    image: phoneProduct,
    price: 259,
    originalPrice: 999,
    discount: 74,
    rating: 4.5,
    inStock: false,
    assured: true
  },
  {
    id: 2,
    name: "TRIPR Self Design Men Polo Neck Sweater",
    image: shoesProduct,
    price: 360,
    originalPrice: 999,
    discount: 63,
    rating: 3.0,
    inStock: false,
    assured: false
  },
  {
    id: 3,
    name: "Premium Running Shoes Collection",
    image: dressProduct,
    price: 1299,
    originalPrice: 2499,
    discount: 48,
    rating: 4.2,
    inStock: true,
    assured: true
  },
  {
    id: 4,
    name: "Gaming Laptop Ultra Pro",
    image: laptopProduct,
    price: 45999,
    originalPrice: 59999,
    discount: 23,
    rating: 4.7,
    inStock: true,
    assured: true
  },
  {
    id: 5,
    name: "Wireless Earbuds Pro",
    image: phoneProduct,
    price: 4999,
    originalPrice: 7999,
    discount: 38,
    rating: 4.5,
    inStock: true,
    assured: true
  },
  {
    id: 6,
    name: "Smart Watch Series 8",
    image: shoesProduct,
    price: 15999,
    originalPrice: 19999,
    discount: 20,
    rating: 4.3,
    inStock: true,
    assured: true
  }
];

const Wishlist = () => {
  const [items, setItems] = useState(wishlistItems);
  const navigate = useNavigate();

  const removeFromWishlist = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const addToCart = (id: number) => {
    // In a real app, this would add to cart
    console.log(`Added item ${id} to cart`);
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
          {items.map((item) => (
            <Card key={item.id} className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-3">
                <div className="relative mb-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  
                  {/* Discount Badge */}
                  <Badge className="absolute top-2 left-2 bg-green-500 text-white text-xs">
                    {item.discount}% ₹{item.originalPrice} ₹{item.price}
                  </Badge>
                  
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
                  <p className="text-red-500 text-sm font-medium mb-2">Not deliverable</p>
                )}

                {/* Product Name */}
                <h3 className="font-medium text-foreground mb-2 line-clamp-2 text-sm">
                  {item.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
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

                {/* Assured Badge */}
                {item.assured && (
                  <div className="flex items-center gap-1 mb-3">
                    <Shield className="h-3 w-3 text-blue-500" />
                    <span className="text-xs text-blue-500 font-medium">Assured</span>
                  </div>
                )}

                {/* Add to Cart Button */}
                <Button 
                  className="w-full border border-gray-300 bg-white text-black hover:bg-gray-50 text-sm"
                  onClick={() => addToCart(item.id)}
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
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