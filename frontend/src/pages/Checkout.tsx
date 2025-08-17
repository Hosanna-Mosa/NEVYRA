import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { MapPin, Plus, CreditCard, Smartphone, Banknote, Shield, CheckCircle, Save, X } from "lucide-react";
import phoneProduct from "@/assets/phone-product.jpg";
import shoesProduct from "@/assets/shoes-product.jpg";

const orderItems = [
  {
    id: 1,
    name: "Latest Smartphone Pro Max",
    image: phoneProduct,
    price: 29999,
    quantity: 1,
    color: "Space Black"
  },
  {
    id: 2,
    name: "Premium Running Shoes",
    image: shoesProduct,
    price: 2999,
    quantity: 2,
    size: "UK 8",
    color: "White"
  }
];

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newAddress, setNewAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: ""
  });

  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await apiService.getAddresses();
      if (response.success) {
        setAddresses(response.data || []);
        // Set first address as default if available
        if (response.data && response.data.length > 0) {
          setSelectedAddress("0");
        }
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    }
  };

  const handleAddAddress = async () => {
    if (!newAddress.firstName || !newAddress.lastName || !newAddress.email || 
        !newAddress.phone || !newAddress.address || !newAddress.city || !newAddress.zipCode) {
      toast({
        title: "Error",
        description: "Please fill in all address fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.addAddress(newAddress);
      if (response.success) {
        setAddresses(response.data);
        setNewAddress({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          address: "",
          city: "",
          zipCode: ""
        });
        setShowNewAddress(false);
        setSelectedAddress((response.data.length - 1).toString());
        toast({
          title: "Success",
          description: "Address added successfully!",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add address",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = 0; // Free shipping
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + shippingFee + gst;

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      toast({
        title: "Error",
        description: "Please select a delivery address",
        variant: "destructive",
      });
      return;
    }
    // Order placement logic here
    toast({
      title: "Success",
      description: "Order placed successfully!",
    });
    navigate("/orders");
  };

  const selectedAddressData = addresses[parseInt(selectedAddress)];

  return (
    <div className="min-h-screen bg-background font-roboto">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Checkout</h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {currentStep > step ? <CheckCircle className="h-5 w-5" /> : step}
                </div>
                <span className={`ml-2 text-sm ${
                  currentStep >= step ? 'text-foreground font-medium' : 'text-muted-foreground'
                }`}>
                  {step === 1 ? 'Address' : step === 2 ? 'Payment' : 'Review'}
                </span>
                {step < 3 && <div className="w-16 h-px bg-border ml-4" />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Delivery Address */}
            {currentStep >= 1 && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-foreground flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Delivery Address
                    </h2>
                    {currentStep > 1 && (
                      <Button variant="outline" size="sm" onClick={() => setCurrentStep(1)}>
                        Change
                      </Button>
                    )}
                  </div>

                  {currentStep === 1 ? (
                    <div className="space-y-4">
                      {addresses.length === 0 ? (
                        <div className="text-center py-8">
                          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">No addresses saved</h3>
                          <p className="text-muted-foreground mb-4">Add your first address to continue</p>
                          <Button onClick={() => setShowNewAddress(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Address
                          </Button>
                        </div>
                      ) : (
                        <>
                          <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                            {addresses.map((address, index) => (
                              <div key={index} className="flex items-start space-x-3 border border-border rounded-lg p-4">
                                <RadioGroupItem value={index.toString()} id={index.toString()} className="mt-1" />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Label htmlFor={index.toString()} className="font-medium">
                                      {address.firstName} {address.lastName}
                                    </Label>
                                    {index === 0 && (
                                      <Badge variant="secondary">Default</Badge>
                                    )}
                                  </div>
                                  <p className="text-muted-foreground text-sm mb-1">{address.address}</p>
                                  <p className="text-muted-foreground text-sm mb-1">{address.city}, {address.zipCode}</p>
                                  <p className="text-muted-foreground text-sm">{address.phone}</p>
                                </div>
                              </div>
                            ))}
                          </RadioGroup>

                          <Button
                            variant="outline"
                            onClick={() => setShowNewAddress(!showNewAddress)}
                            className="w-full"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Address
                          </Button>
                        </>
                      )}

                      {showNewAddress && (
                        <Card className="border-2 border-dashed border-border">
                          <CardContent className="p-4 space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold">Add New Address</h3>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowNewAddress(false)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="addr-firstName">First Name</Label>
                                <Input 
                                  id="addr-firstName"
                                  value={newAddress.firstName}
                                  onChange={(e) => setNewAddress({...newAddress, firstName: e.target.value})}
                                  placeholder="Enter first name"
                                />
                              </div>
                              <div>
                                <Label htmlFor="addr-lastName">Last Name</Label>
                                <Input 
                                  id="addr-lastName"
                                  value={newAddress.lastName}
                                  onChange={(e) => setNewAddress({...newAddress, lastName: e.target.value})}
                                  placeholder="Enter last name"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="addr-email">Email</Label>
                                <Input 
                                  id="addr-email"
                                  type="email"
                                  value={newAddress.email}
                                  onChange={(e) => setNewAddress({...newAddress, email: e.target.value})}
                                  placeholder="Enter email"
                                />
                              </div>
                              <div>
                                <Label htmlFor="addr-phone">Phone</Label>
                                <Input 
                                  id="addr-phone"
                                  type="tel"
                                  value={newAddress.phone}
                                  onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                                  placeholder="Enter phone number"
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="addr-address">Address</Label>
                              <Textarea 
                                id="addr-address"
                                value={newAddress.address}
                                onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                                placeholder="Enter complete address"
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="addr-city">City</Label>
                                <Input 
                                  id="addr-city"
                                  value={newAddress.city}
                                  onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                                  placeholder="City"
                                />
                              </div>
                              <div>
                                <Label htmlFor="addr-zipCode">Zip Code</Label>
                                <Input 
                                  id="addr-zipCode"
                                  value={newAddress.zipCode}
                                  onChange={(e) => setNewAddress({...newAddress, zipCode: e.target.value})}
                                  placeholder="Zip code"
                                />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button onClick={handleAddAddress} disabled={isLoading}>
                                {isLoading ? "Saving..." : "Save Address"}
                              </Button>
                              <Button variant="outline" onClick={() => setShowNewAddress(false)}>
                                Cancel
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {addresses.length > 0 && (
                        <Button 
                          className="w-full bg-primary hover:bg-primary-hover text-primary-foreground"
                          onClick={() => setCurrentStep(2)}
                          disabled={!selectedAddress}
                        >
                          Continue to Payment
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      {selectedAddressData ? (
                        <div>
                          <p className="font-medium">{selectedAddressData.firstName} {selectedAddressData.lastName}</p>
                          <p>{selectedAddressData.address}</p>
                          <p>{selectedAddressData.city}, {selectedAddressData.zipCode}</p>
                          <p>{selectedAddressData.phone}</p>
                        </div>
                      ) : (
                        "No address selected"
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 2: Payment Method */}
            {currentStep >= 2 && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-foreground flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Payment Method
                    </h2>
                    {currentStep > 2 && (
                      <Button variant="outline" size="sm" onClick={() => setCurrentStep(2)}>
                        Change
                      </Button>
                    )}
                  </div>

                  {currentStep === 2 ? (
                    <div className="space-y-4">
                      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                        <div className="border border-border rounded-lg p-4">
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="upi" id="upi" />
                            <Label htmlFor="upi" className="flex items-center font-medium">
                              <Smartphone className="h-4 w-4 mr-2" />
                              UPI Payment
                            </Label>
                          </div>
                          <p className="text-sm text-muted-foreground ml-6 mt-1">
                            Pay using Google Pay, PhonePe, Paytm, or any UPI app
                          </p>
                        </div>

                        <div className="border border-border rounded-lg p-4">
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="card" id="card" />
                            <Label htmlFor="card" className="flex items-center font-medium">
                              <CreditCard className="h-4 w-4 mr-2" />
                              Credit/Debit Card
                            </Label>
                          </div>
                          <p className="text-sm text-muted-foreground ml-6 mt-1">
                            Visa, MasterCard, American Express, RuPay
                          </p>
                        </div>

                        <div className="border border-border rounded-lg p-4">
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="cod" id="cod" />
                            <Label htmlFor="cod" className="flex items-center font-medium">
                              <Banknote className="h-4 w-4 mr-2" />
                              Cash on Delivery
                            </Label>
                          </div>
                          <p className="text-sm text-muted-foreground ml-6 mt-1">
                            Pay when your order is delivered
                          </p>
                        </div>
                      </RadioGroup>

                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Shield className="h-4 w-4" />
                        <span>Your payment information is secure and encrypted</span>
                      </div>

                      <Button 
                        className="w-full bg-primary hover:bg-primary-hover text-primary-foreground"
                        onClick={() => setCurrentStep(3)}
                      >
                        Review Order
                      </Button>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      {paymentMethod === 'upi' ? 'UPI Payment' : 
                       paymentMethod === 'card' ? 'Credit/Debit Card' : 'Cash on Delivery'}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 3: Review Order */}
            {currentStep === 3 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Review Your Order</h2>
                  
                  <div className="space-y-4 mb-6">
                    {orderItems.map((item) => (
                      <div key={item.id} className="flex gap-4 border-b border-border pb-4 last:border-b-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{item.name}</h4>
                          <div className="text-sm text-muted-foreground">
                            {item.color && <span>Color: {item.color}</span>}
                            {item.size && <span className="ml-2">Size: {item.size}</span>}
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-sm">Qty: {item.quantity}</span>
                            <span className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className="w-full bg-success hover:bg-success/90 text-success-foreground font-medium text-lg py-6"
                    onClick={handlePlaceOrder}
                  >
                    Place Order - ₹{total.toLocaleString()}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Order Summary</h3>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({orderItems.length} items)</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-success">FREE</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span>₹{gst.toLocaleString()}</span>
                  </div>
                </div>

                <div className="border-t border-border pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-4 text-sm text-muted-foreground">
                  <p>Estimated delivery: 2-3 business days</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;