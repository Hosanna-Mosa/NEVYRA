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
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

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

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    if (!product) return;

    setAddingToCart(true);
    try {
      const result = await addToCart({
        productId: product.id,
        quantity,
        // Add size and color if they exist in product attributes
        size: product.attributes?.size,
        color: product.attributes?.color,
        selectedAttributes: {
          // Add any other selected attributes here
        }
      });

      if (result.success) {
        // Optionally navigate to cart or show success message
        // navigate('/cart');
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setAddingToCart(false);
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
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <a href="/" className="hover:text-foreground">Home</a>
          <span>/</span>
          <a href={`/category/${product.category}`} className="hover:text-foreground capitalize">
            {product.category}
          </a>
          <span>/</span>
          <span className="text-foreground">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border border-border">
              <img
                src={product.images[selectedImage] || product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                      selectedImage === index
                        ? "border-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {product.title}
              </h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
                
                <Badge variant="secondary" className="capitalize">
                  {product.category}
                </Badge>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold text-price">
                  ₹{displayPrice.toLocaleString()}
                </span>
                {discount > 0 && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      ₹{product.price.toLocaleString()}
                    </span>
                    <Badge variant="destructive" className="text-sm">
                      {discount}% OFF
                    </Badge>
                  </>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Stock: {product.stockQuantity} units</span>
                <span>Sold: {product.soldCount} units</span>
              </div>
            </div>

            {/* Delivery Check */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-3">
                  Check Delivery
                </h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline">Check</Button>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-3">
                  Features
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-primary" />
                    <span>Free delivery on orders above ₹499</span>
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
                  disabled={!product.inStock || addingToCart}
                  onClick={handleAddToCart}
                >
                  {addingToCart ? (
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  ) : (
                    <ShoppingCart className="h-5 w-5 mr-2" />
                  )}
                  {addingToCart ? 'Adding...' : 'Add to Cart'}
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
        <Tabs defaultValue="description" className="w-full mt-12">
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
                  {product.attributes && Object.entries(product.attributes).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-border">
                      <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span className="text-muted-foreground">{String(value)}</span>
                    </div>
                  ))}
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