import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Heart, Share2, ShoppingCart, Truck, Shield, RotateCcw, Plus, Minus, Loader2 } from "lucide-react";
import { apiService, Product } from "@/lib/api";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
// Dummy images were used earlier; now fetching real data, so no direct asset imports

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [reviews, setReviews] = useState<Product["reviewsList"]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewRating, setReviewRating] = useState<number>(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const currentUserReview = user && reviews?.find(r => r.userId === user._id);
  const [related, setRelated] = useState<Product[]>([]);
  const [relatedLoading, setRelatedLoading] = useState<boolean>(false);

  // Dialog state for per-review edit/delete actions
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [targetReviewId, setTargetReviewId] = useState<string | null>(null);
  const [editDialogRating, setEditDialogRating] = useState<number>(0);
  const [editDialogTitle, setEditDialogTitle] = useState("");
  const [editDialogComment, setEditDialogComment] = useState("");

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

  useEffect(() => {
    const fetchReviews = async () => {
      if (!productId) return;
      try {
        setReviewsLoading(true);
        const res = await apiService.getProductReviews(productId);
        setReviews(res.data || []);
      } catch (e) {
        // no-op
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, [productId]);

  // Fetch related products by category using backend endpoint
  useEffect(() => {
    const fetchRelated = async () => {
      if (!product?.category) return;
      try {
        setRelatedLoading(true);
        const res = await apiService.getTopProductsByCategory(product.category, 6, product.id);
        if (res.success && res.data) {
          setRelated(res.data);
        } else {
          setRelated([]);
        }
      } catch (_) {
        setRelated([]);
      } finally {
        setRelatedLoading(false);
      }
    };
    fetchRelated();
  }, [product?.category, product?.id]);

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

  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    if (!product) return;
    if (!reviewRating || reviewRating < 1) {
      toast({ title: 'Please select a rating', variant: 'destructive' });
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await apiService.addOrUpdateReview(product.id, {
        rating: reviewRating,
        title: reviewTitle || undefined,
        comment: reviewComment || undefined,
      });
      if (res.success && res.data) {
        setProduct(res.data);
        setReviews(res.data.reviewsList || []);
        setReviewRating(0);
        setReviewTitle("");
        setReviewComment("");
        toast({ title: 'Review submitted' });
      }
    } catch (e) {
      toast({ title: 'Failed to submit review', variant: 'destructive' });
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    if (!product) return;
    setSubmittingReview(true);
    try {
      const res = await apiService.deleteMyReview(product.id);
      if (res.success && res.data) {
        setProduct(res.data);
        setReviews(res.data.reviewsList || []);
        setReviewRating(0);
        setReviewTitle("");
        setReviewComment("");
        toast({ title: 'Review deleted' });
      }
    } catch (e) {
      toast({ title: 'Failed to delete review', variant: 'destructive' });
    } finally {
      setSubmittingReview(false);
    }
  };

  const openEditDialog = (review: NonNullable<Product["reviewsList"]>[number]) => {
    setTargetReviewId(review._id || null);
    setEditDialogRating(review.rating || 0);
    setEditDialogTitle(review.title || "");
    setEditDialogComment(review.comment || "");
    setEditDialogOpen(true);
  };

  const submitEditDialog = async () => {
    if (!product || !targetReviewId) return;
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await apiService.updateReviewById(product.id, targetReviewId, {
        rating: editDialogRating,
        title: editDialogTitle || undefined,
        comment: editDialogComment || undefined,
      });
      if (res.success && res.data) {
        setProduct(res.data);
        setReviews(res.data.reviewsList || []);
        setEditDialogOpen(false);
        toast({ title: 'Review updated' });
      }
    } catch (e) {
      toast({ title: 'Failed to update review', variant: 'destructive' });
    } finally {
      setSubmittingReview(false);
    }
  };

  const openDeleteDialog = (review: NonNullable<Product["reviewsList"]>[number]) => {
    setTargetReviewId(review._id || null);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteDialog = async () => {
    if (!product || !targetReviewId) return;
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await apiService.deleteReviewById(product.id, targetReviewId);
      if (res.success && res.data) {
        setProduct(res.data);
        setReviews(res.data.reviewsList || []);
        setDeleteDialogOpen(false);
        toast({ title: 'Review deleted' });
      }
    } catch (e) {
      toast({ title: 'Failed to delete review', variant: 'destructive' });
    } finally {
      setSubmittingReview(false);
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
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

          <TabsContent value="reviews" className="space-y-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-foreground">Customer Reviews</h3>
                {reviewsLoading ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading reviews...</div>
                ) : (
                  <div className="space-y-4">
                    {(!reviews || reviews.length === 0) ? (
                      <p className="text-muted-foreground text-sm">No reviews yet.</p>
                    ) : (
                      reviews.map((r, idx) => (
                        <div key={r._id || idx} className="border-b border-border pb-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-4 w-4 ${i < Math.floor(r.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                              ))}
                              <span className="text-sm text-muted-foreground">{r.rating?.toFixed ? r.rating.toFixed(1) : r.rating}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">{r.userName || 'Anonymous'}</span>
                              {user && (user._id === r.userId || user.isAdmin) && (
                                <>
                                  <Button size="sm" variant="outline" onClick={() => openEditDialog(r)}>Edit</Button>
                                  <Button size="sm" variant="destructive" onClick={() => openDeleteDialog(r)}>Delete</Button>
                                </>
                              )}
                            </div>
                          </div>
                          {r.title && <p className="font-medium mt-2">{r.title}</p>}
                          {r.comment && <p className="text-sm text-muted-foreground mt-1">{r.comment}</p>}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-foreground">Write a Review</h3>
                {!isAuthenticated ? (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Please login to write a review.</p>
                    <Button onClick={() => navigate('/auth')} variant="default">Login</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm text-muted-foreground mr-3">Your Rating:</span>
                      {[1,2,3,4,5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setReviewRating(val)}
                          className="inline-flex"
                          aria-label={`Rate ${val}`}
                        >
                          <Star className={`h-5 w-5 ${val <= reviewRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                        </button>
                      ))}
                    </div>
                    <Input
                      placeholder="Title (optional)"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                    />
                    <Textarea
                      placeholder="Share your thoughts (optional)"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleSubmitReview} disabled={submittingReview || reviewRating < 1}>
                        {submittingReview ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> {currentUserReview ? 'Updating...' : 'Submitting...'}</> : (currentUserReview ? 'Update Review' : 'Submit Review')}
                      </Button>
                      {currentUserReview && (
                        <Button variant="outline" onClick={handleDeleteReview} disabled={submittingReview}>
                          Delete Review
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* You Might Also Like */}
      {(relatedLoading || related.length > 0) && (
        <div className="container mx-auto px-4 pb-12">
          <h3 className="text-xl font-semibold text-foreground mb-4">You Might Also Like</h3>
          <div className="lg:hidden -mx-4 px-4">
            <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
              {relatedLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <Card key={`sk-${i}`} className="min-w-[46%] snap-start">
                      <CardContent className="p-3 space-y-2">
                        <Skeleton className="aspect-square w-full rounded-md" />
                        <Skeleton className="h-4 w-10/12" />
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-3 w-14" />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                : related.map((rp) => (
                    <Card key={rp.id} className="min-w-[46%] snap-start hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/product/${rp.id}`)}>
                      <CardContent className="p-3 space-y-2">
                        <div className="aspect-square overflow-hidden rounded-md border border-border">
                          <img src={rp.images?.[0] || "/placeholder.svg"} alt={rp.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="text-sm font-medium line-clamp-2 min-h-[2.5rem]">{rp.title}</div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold">₹{(rp.attributes?.salePrice || rp.price).toLocaleString()}</span>
                          <span className="text-xs text-muted-foreground">Sold {rp.soldCount}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
            </div>
          </div>
          <div className="hidden lg:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {relatedLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Card key={`sk-lg-${i}`}>
                    <CardContent className="p-3 space-y-2">
                      <Skeleton className="aspect-square w-full rounded-md" />
                      <Skeleton className="h-4 w-10/12" />
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-3 w-14" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              : related.map((rp) => (
                  <Card key={rp.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/product/${rp.id}`)}>
                    <CardContent className="p-3 space-y-2">
                      <div className="aspect-square overflow-hidden rounded-md border border-border">
                        <img src={rp.images?.[0] || "/placeholder.svg"} alt={rp.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="text-sm font-medium line-clamp-2 min-h-[2.5rem]">{rp.title}</div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold">₹{(rp.attributes?.salePrice || rp.price).toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground">Sold {rp.soldCount}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
          </div>
        </div>
      )}

      {/* Edit Review Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <span className="text-sm text-muted-foreground mr-3">Your Rating:</span>
              {[1,2,3,4,5].map((val) => (
                <button key={val} type="button" onClick={() => setEditDialogRating(val)} className="inline-flex" aria-label={`Rate ${val}`}>
                  <Star className={`h-5 w-5 ${val <= editDialogRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                </button>
              ))}
            </div>
            <Input placeholder="Title (optional)" value={editDialogTitle} onChange={(e) => setEditDialogTitle(e.target.value)} />
            <Textarea placeholder="Share your thoughts (optional)" value={editDialogComment} onChange={(e) => setEditDialogComment(e.target.value)} className="min-h-[100px]" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={submitEditDialog} disabled={submittingReview || editDialogRating < 1}>
              {submittingReview ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</> : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Review Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Review</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete this review? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteDialog} disabled={submittingReview}>
              {submittingReview ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Deleting...</> : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ProductDetail;