import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus, Trash2, ShoppingBag, Truck, Shield, Loader2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { CartItem } from "@/lib/api";

const Cart = () => {
  const { 
    cartItems, 
    cartSummary, 
    isLoading, 
    updateCartItem, 
    removeFromCart, 
    clearCart 
  } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  const handleQuantityChange = async (item: CartItem, change: number) => {
    const newQuantity = item.quantity + change;
    if (newQuantity <= 0) {
      await removeFromCart(item._id);
      return;
    }

    setUpdatingItems(prev => new Set(prev).add(item._id));
    try {
      await updateCartItem(item._id, { quantity: newQuantity });
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(item._id);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    await removeFromCart(itemId);
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      await clearCart();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background font-roboto">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-center h-96">
            <div className="flex items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="text-lg">Loading cart...</span>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background font-roboto">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Your cart is empty
            </h1>
            <p className="text-muted-foreground mb-6">
              Add some products to get started!
            </p>
            <Link to="/">
              <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
                Continue Shopping
              </Button>
            </Link>
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Shopping Cart ({cartItems.length} items)
          </h1>
          <Button 
            variant="outline" 
            onClick={handleClearCart}
            className="text-destructive hover:text-destructive"
          >
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item._id} className="p-4">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row gap-4">
                    <img
                      src={item.productId.images?.[0] || "/placeholder.svg"}
                      alt={item.productId.title}
                      className="w-full md:w-32 h-32 object-cover rounded-lg"
                    />

                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-foreground text-lg">
                        {item.productId.title}
                      </h3>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        {item.color && <span>Color: {item.color}</span>}
                        {item.size && <span>Size: {item.size}</span>}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-price">
                          ₹{item.price.toLocaleString()}
                        </span>
                        {item.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ₹{item.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-border rounded">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleQuantityChange(item, -1)}
                            disabled={updatingItems.has(item._id)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="px-4 py-2 border-x border-border">
                            {updatingItems.has(item._id) ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              item.quantity
                            )}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleQuantityChange(item, 1)}
                            disabled={updatingItems.has(item._id)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item._id)}
                          className="text-destructive hover:text-destructive"
                          disabled={updatingItems.has(item._id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Promo Code */}
            <Card className="p-4">
              <CardContent className="p-0">
                <h3 className="font-semibold text-foreground mb-3">
                  Apply Promo Code
                </h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline">Apply</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Price Summary */}
          <div className="space-y-4">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">
                  Order Summary
                </h3>

                {cartSummary ? (
                  <>
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Subtotal ({cartSummary.summary.totalItems} items)
                        </span>
                        <span className="font-medium">
                          ₹{cartSummary.summary.subtotal.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping Fee</span>
                        <span className="font-medium">
                          {cartSummary.summary.shippingFee === 0 ? (
                            <span className="text-success">FREE</span>
                          ) : (
                            `₹${cartSummary.summary.shippingFee}`
                          )}
                        </span>
                      </div>

                      {cartSummary.summary.totalSavings > 0 && (
                        <div className="flex justify-between text-success">
                          <span>Total Savings</span>
                          <span className="font-medium">
                            -₹{cartSummary.summary.totalSavings.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-border pt-3 mb-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>₹{cartSummary.summary.finalTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                    <span className="text-sm text-muted-foreground">Calculating...</span>
                  </div>
                )}

                <Link to="/checkout">
                  <Button 
                    className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-medium text-lg py-6 mb-4"
                    disabled={!cartSummary}
                  >
                    Proceed to Checkout
                  </Button>
                </Link>

                {/* Delivery Info */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Truck className="h-4 w-4 text-success" />
                    <span>
                      {cartSummary?.summary.shippingFee === 0
                        ? "Free delivery on this order"
                        : "Free delivery on orders above ₹499"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Shield className="h-4 w-4 text-primary" />
                    <span>Secure checkout with multiple payment options</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Continue Shopping */}
            <Link to="/">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
