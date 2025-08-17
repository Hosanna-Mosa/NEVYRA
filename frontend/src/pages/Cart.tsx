import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus, Trash2, ShoppingBag, Truck, Shield } from "lucide-react";
import phoneProduct from "@/assets/phone-product.jpg";
import shoesProduct from "@/assets/shoes-product.jpg";
import laptopProduct from "@/assets/laptop-product.jpg";

interface CartItem {
  id: number;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  quantity: number;
  size?: string;
  color?: string;
}

const initialCartItems: CartItem[] = [
  {
    id: 1,
    name: "Latest Smartphone Pro Max",
    image: phoneProduct,
    price: 29999,
    originalPrice: 35999,
    quantity: 1,
    color: "Space Black",
  },
  {
    id: 2,
    name: "Premium Running Shoes",
    image: shoesProduct,
    price: 2999,
    originalPrice: 4999,
    quantity: 2,
    size: "UK 8",
    color: "White",
  },
  {
    id: 3,
    name: "Gaming Laptop Ultra",
    image: laptopProduct,
    price: 69999,
    originalPrice: 89999,
    quantity: 1,
    color: "Silver",
  },
];

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [promoCode, setPromoCode] = useState("");

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const originalTotal = cartItems.reduce(
    (sum, item) => sum + item.originalPrice * item.quantity,
    0
  );
  const totalSavings = originalTotal - subtotal;
  const shippingFee = subtotal > 499 ? 0 : 99;
  const finalTotal = subtotal + shippingFee;

  if (cartItems.length === 0) {
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
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
          Shopping Cart ({cartItems.length} items)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="p-4">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full md:w-32 h-32 object-cover rounded-lg"
                    />

                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-foreground text-lg">
                        {item.name}
                      </h3>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        {item.color && <span>Color: {item.color}</span>}
                        {item.size && <span>Size: {item.size}</span>}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-price">
                          ₹{item.price.toLocaleString()}
                        </span>
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{item.originalPrice.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-border rounded">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="px-4 py-2 border-x border-border">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-destructive hover:text-destructive"
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

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Subtotal ({cartItems.length} items)
                    </span>
                    <span className="font-medium">
                      ₹{subtotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping Fee</span>
                    <span className="font-medium">
                      {shippingFee === 0 ? (
                        <span className="text-success">FREE</span>
                      ) : (
                        `₹${shippingFee}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-success">
                    <span>Total Savings</span>
                    <span className="font-medium">
                      -₹{totalSavings.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="border-t border-border pt-3 mb-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                <Link to="/checkout">
                  <Button className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-medium text-lg py-6 mb-4">
                    Proceed to Checkout
                  </Button>
                </Link>

                {/* Delivery Info */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Truck className="h-4 w-4 text-success" />
                    <span>
                      {shippingFee === 0
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
