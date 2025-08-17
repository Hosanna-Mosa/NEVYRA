import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Heart, Share2, ShoppingCart, Truck, Shield, RotateCcw, Plus, Minus, Loader2 } from "lucide-react";
import { apiService, Product } from "@/lib/api";

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.getProduct(productId);
        
        if (response.success && response.data) {
          setProduct(response.data);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background font-roboto">
        <Navbar />
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-96">
            <div className="flex items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="text-lg">Loading product...</span>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background font-roboto">
        <Navbar />
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-center h-96">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {error || "Product not found"}
            </h2>
            <Button onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Calculate discount if there's a sale price
  const discount = product.attributes?.salePrice && product.attributes.salePrice < product.price
    ? Math.round(((product.price - product.attributes.salePrice) / product.price) * 100)
    : 0;

  const displayPrice = product.attributes?.salePrice || product.price;

  return (
    <div className="min-h-screen bg-background font-roboto">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-6">
          Home / {product.category} / {product.subCategory} / {product.title}
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative">
              <img 
                src={product.images[selectedImage] || "/placeholder.svg"} 
                alt={product.title}
                className="w-full h-96 object-cover rounded-lg border border-border"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
              {discount > 0 && (
                <Badge className="absolute top-4 left-4 bg-discount text-white text-lg px-3 py-1">
                  {discount}% OFF
                </Badge>
              )}
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image || "/placeholder.svg"}
                  alt={`${product.title} ${index + 1}`}
                  className={`w-20 h-20 object-cover rounded-lg border-2 cursor-pointer ${
                    selectedImage === index ? 'border-primary' : 'border-border'
                  }`}
                  onClick={() => setSelectedImage(index)}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {product.title}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-success text-success-foreground px-2 py-1 rounded text-sm font-medium">
                    {product.rating.toFixed(1)}
                    <Star className="h-3 w-3 fill-current ml-1" />
                  </div>
                  <span className="text-muted-foreground text-sm">
                    {product.reviews.toLocaleString()} reviews
                  </span>
                </div>
                <Badge variant="outline" className={`${product.inStock ? 'text-success border-success' : 'text-destructive border-destructive'}`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </Badge>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-price">₹{displayPrice.toLocaleString()}</span>
                {discount > 0 && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">₹{product.price.toLocaleString()}</span>
                    <Badge className="bg-discount text-white">{discount}% off</Badge>
                  </>
                )}
              </div>
              <p className="text-sm text-muted-foreground">Inclusive of all taxes</p>
            </div>

            {/* Delivery Check */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-3">Delivery Options</h3>
                <div className="flex gap-2 mb-3">
                  <Input
                    placeholder="Enter pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline">Check</Button>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-success" />
                    <span>Free delivery by tomorrow</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw className="h-4 w-4 text-primary" />
                    <span>7 days replacement policy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <span>2 year warranty</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center border border-border rounded">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 border-x border-border">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 10}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  className="flex-1 bg-warning hover:bg-warning/90 text-warning-foreground font-medium text-lg py-6"
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button 
                  className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground font-medium text-lg py-6"
                  disabled={!product.inStock}
                >
                  Buy Now
                </Button>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                  Wishlist
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Product Description</h3>
                <div className="prose prose-gray max-w-none">
                  <p className="text-muted-foreground">
                    {product.attributes?.description || `Experience the quality and performance of ${product.title}. This product from the ${product.category} category offers excellent value and features.`}
                  </p>
                  {product.attributes?.description && (
                    <p className="text-muted-foreground">
                      {product.attributes.description}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="specifications" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Product Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="font-medium">Category</span>
                      <span className="text-muted-foreground">{product.category}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="font-medium">Sub Category</span>
                      <span className="text-muted-foreground">{product.subCategory}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="font-medium">Stock Quantity</span>
                      <span className="text-muted-foreground">{product.stockQuantity}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="font-medium">Sold Count</span>
                      <span className="text-muted-foreground">{product.soldCount}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {product.attributes && Object.entries(product.attributes).map(([key, value]) => {
                      // Skip description and salePrice as they're handled elsewhere
                      if (key === 'description' || key === 'salePrice') return null;
                      
                      return (
                        <div key={key} className="flex justify-between py-2 border-b border-border">
                          <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className="text-muted-foreground">{String(value)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;