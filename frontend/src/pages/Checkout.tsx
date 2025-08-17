import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { apiService, CreateOrderRequest } from "@/lib/api";
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
import { MapPin, Plus, CreditCard, Smartphone, Banknote, Shield, CheckCircle, Save, X, Loader2 } from "lucide-react";

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [newAddress, setNewAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    state: "",
    country: "India"
  });

  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, cartSummary, refreshCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems && cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

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
    // Validate all required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'zipCode', 'state'];
    const missingFields = requiredFields.filter(field => !newAddress[field] || newAddress[field].trim() === '');
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Required Fields",
        description: `Please fill in the following required fields: ${missingFields.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newAddress.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(newAddress.phone.replace(/\D/g, ''))) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = editingAddress 
        ? await apiService.updateAddressByIndex(addresses.findIndex(addr => addr === editingAddress), newAddress)
        : await apiService.addAddress(newAddress);
      
      if (response.success) {
        setAddresses(response.data);
        setNewAddress({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          address: "",
          city: "",
          zipCode: "",
          state: "",
          country: "India"
        });
        setShowNewAddress(false);
        setEditingAddress(null);
        toast({
          title: "Success",
          description: editingAddress ? "Address updated successfully" : "Address added successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: editingAddress ? "Failed to update address" : "Failed to add address",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAddress = (address: any) => {
    setEditingAddress(address);
    setNewAddress({
      firstName: address.firstName || "",
      lastName: address.lastName || "",
      email: address.email || "",
      phone: address.phone || "",
      address: address.address || "",
      city: address.city || "",
      zipCode: address.zipCode || "",
      state: address.state || "", // This might be undefined for existing addresses
      country: address.country || "India"
    });
    
    setShowNewAddress(true);
  };

  const handleCancelEdit = () => {
    setEditingAddress(null);
    setNewAddress({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      zipCode: "",
      state: "",
      country: "India"
    });
    setShowNewAddress(false);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress || !paymentMethod) {
      toast({
        title: "Error",
        description: "Please select address and payment method",
        variant: "destructive",
      });
      return;
    }

    if (!cartSummary) {
      toast({
        title: "Error",
        description: "Cart summary not available",
        variant: "destructive",
      });
      return;
    }

    // Validate that selected address has all required fields
    const selectedAddressData = addresses[parseInt(selectedAddress)];
    if (!selectedAddressData) {
      toast({
        title: "Error",
        description: "Selected address not found. Please select a valid address.",
        variant: "destructive",
      });
      return;
    }

    // Check if address is complete
    if (!isAddressComplete(selectedAddressData)) {
      const missingFields = getMissingFields(selectedAddressData);
      toast({
        title: "Incomplete Address",
        description: `Your selected address is missing required fields: ${missingFields.join(', ')}. Please edit the address or add a new one.`,
        variant: "destructive",
      });
      return;
    }

    setIsPlacingOrder(true);
    try {
      const orderData: CreateOrderRequest = {
        paymentMethod,
        shippingAddress: selectedAddressData,
        billingAddress: selectedAddressData, // Using same address for billing
        notes: ""
      };

      const response = await apiService.createOrder(orderData);
      
      if (response.success) {
        toast({
          title: "Success",
          description: `Order placed successfully! Order #${response.data.orderNumber}`,
        });
        
        // Refresh cart to clear it
        await refreshCart();
        
        // Navigate to order confirmation
        navigate(`/order/${response.data._id}`);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to place order",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Validate if current step can proceed
  const canProceedToNextStep = () => {
    if (currentStep === 1) {
      return selectedAddress && addresses[parseInt(selectedAddress)];
    }
    if (currentStep === 2) {
      return paymentMethod;
    }
    return true;
  };

  // Check if selected address is complete
  const isAddressComplete = (address: any) => {
    if (!address) return false;
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'zipCode', 'state'];
    return requiredFields.every(field => address[field] && address[field].trim() !== '');
  };

  // Get missing fields for an address
  const getMissingFields = (address: any) => {
    if (!address) return [];
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'zipCode', 'state'];
    return requiredFields.filter(field => !address[field] || address[field].trim() === '');
  };

  // Handle step progression with validation
  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!selectedAddress) {
        toast({
          title: "Address Required",
          description: "Please select a shipping address to continue",
          variant: "destructive",
        });
        return;
      }

      const selectedAddressData = addresses[parseInt(selectedAddress)];
      if (!selectedAddressData) {
        toast({
          title: "Address Error",
          description: "Selected address not found. Please select a valid address.",
          variant: "destructive",
        });
        return;
      }

      // Check if address is complete
      if (!isAddressComplete(selectedAddressData)) {
        const missingFields = getMissingFields(selectedAddressData);
        toast({
          title: "Incomplete Address",
          description: `Your selected address is missing required fields: ${missingFields.join(', ')}. Please edit the address or add a new one.`,
          variant: "destructive",
        });
        return;
      }
      
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!paymentMethod) {
        toast({
          title: "Payment Method Required",
          description: "Please select a payment method to continue",
          variant: "destructive",
        });
        return;
      }
      setCurrentStep(3);
    }
  };

  // Calculate totals
  const subtotal = cartSummary?.summary.subtotal || 0;
  const shippingFee = cartSummary?.summary.shippingFee || 0;
  const gst = subtotal * 0.18; // 18% GST
  const total = subtotal + shippingFee + gst;

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background font-roboto">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Your cart is empty
            </h1>
            <p className="text-muted-foreground mb-6">
              Add some products to proceed to checkout!
            </p>
            <Button onClick={() => navigate('/')}>
              Continue Shopping
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
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
          Checkout
        </h1>

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
          {/* Checkout Steps */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Address Selection */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">
                    Shipping Address
                  </h2>
                  {currentStep >= 1 && (
                    <CheckCircle className="h-6 w-6 text-success" />
                  )}
                </div>

                {currentStep === 1 ? (
                  <div className="space-y-4">
                    {/* Help Message for Incomplete Addresses */}
                    {addresses.length > 0 && addresses.some(addr => !isAddressComplete(addr)) && (
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <div className="text-amber-600 mt-0.5">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="text-sm text-amber-800">
                            <p className="font-medium">Some addresses are incomplete</p>
                            <p className="mt-1">Addresses missing required fields (like state) cannot be used for checkout. The backend requires state information for order processing. Please edit them to add the missing information.</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {addresses.length > 0 ? (
                      <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                        {addresses.map((address, index) => {
                          const missingFields = getMissingFields(address);
                          const isComplete = isAddressComplete(address);
                          
                          return (
                            <div key={index} className={`flex items-center space-x-3 border rounded-lg p-4 ${
                              missingFields.length > 0 ? 'border-destructive/50 bg-destructive/5' : 'border-border'
                            }`}>
                              <RadioGroupItem 
                                value={index.toString()} 
                                id={`address-${index}`}
                                disabled={!isComplete}
                              />
                              <Label htmlFor={`address-${index}`} className="flex-1 cursor-pointer">
                                <div className="font-medium">
                                  {address.firstName} {address.lastName}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {address.address}, {address.city}
                                  {address.state && `, ${address.state}`} {address.zipCode}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {address.phone} • {address.email}
                                </div>
                                {missingFields.length > 0 && (
                                  <div className="mt-2">
                                    <Badge variant="destructive" className="text-xs">
                                      Missing: {missingFields.join(', ')}
                                    </Badge>
                                  </div>
                                )}
                              </Label>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditAddress(address)}
                                className="ml-2"
                              >
                                Edit
                              </Button>
                            </div>
                          );
                        })}
                      </RadioGroup>
                    ) : (
                      <div className="text-center py-8">
                        <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">No addresses found</p>
                      </div>
                    )}

                    <Button
                      variant="outline"
                      onClick={() => setShowNewAddress(!showNewAddress)}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {editingAddress ? "Edit Address" : "Add New Address"}
                    </Button>

                    {showNewAddress && (
                      <div className="border border-border rounded-lg p-4 space-y-4">
                        <h4 className="font-medium text-foreground">
                          {editingAddress ? "Edit Address" : "Add New Address"}
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName" className="text-foreground">
                              First Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="firstName"
                              value={newAddress.firstName}
                              onChange={(e) => setNewAddress({...newAddress, firstName: e.target.value})}
                              className={!newAddress.firstName ? "border-destructive" : ""}
                              placeholder="Enter first name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName" className="text-foreground">
                              Last Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="lastName"
                              value={newAddress.lastName}
                              onChange={(e) => setNewAddress({...newAddress, lastName: e.target.value})}
                              className={!newAddress.lastName ? "border-destructive" : ""}
                              placeholder="Enter last name"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="email" className="text-foreground">
                              Email <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              value={newAddress.email}
                              onChange={(e) => setNewAddress({...newAddress, email: e.target.value})}
                              className={!newAddress.email ? "border-destructive" : ""}
                              placeholder="Enter email address"
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone" className="text-foreground">
                              Phone <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="phone"
                              value={newAddress.phone}
                              onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                              className={!newAddress.phone ? "border-destructive" : ""}
                              placeholder="Enter 10-digit phone number"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="address" className="text-foreground">
                            Address <span className="text-destructive">*</span>
                          </Label>
                          <Textarea
                            id="address"
                            value={newAddress.address}
                            onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                            className={!newAddress.address ? "border-destructive" : ""}
                            placeholder="Enter complete address"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="city" className="text-foreground">
                              City <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="city"
                              value={newAddress.city}
                              onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                              className={!newAddress.city ? "border-destructive" : ""}
                              placeholder="Enter city"
                            />
                          </div>
                          <div>
                            <Label htmlFor="state" className="text-foreground">
                              State <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="state"
                              value={newAddress.state}
                              onChange={(e) => {
                                setNewAddress({...newAddress, state: e.target.value});
                              }}
                              className={!newAddress.state ? "border-destructive" : ""}
                              placeholder="Enter state"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              State is required for shipping and billing purposes
                            </p>
                          </div>
                          <div>
                            <Label htmlFor="zipCode" className="text-foreground">
                              ZIP Code <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="zipCode"
                              value={newAddress.zipCode}
                              onChange={(e) => setNewAddress({...newAddress, zipCode: e.target.value})}
                              className={!newAddress.zipCode ? "border-destructive" : ""}
                              placeholder="Enter ZIP code"
                            />
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={handleAddAddress}
                            disabled={isLoading}
                            className="flex-1"
                          >
                            {isLoading ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Save className="h-4 w-4 mr-2" />
                            )}
                            {editingAddress ? "Update Address" : "Save Address"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={handleCancelEdit}
                          >
                            <X className="h-4 w-4 mr-2" />
                            {editingAddress ? "Cancel Edit" : "Cancel"}
                          </Button>
                        </div>
                      </div>
                    )}

                                         {/* Address Summary */}
                     {selectedAddress && addresses[parseInt(selectedAddress)] && (
                       <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
                         <h4 className="font-medium text-foreground mb-2">Selected Address:</h4>
                         <div className="text-sm text-muted-foreground space-y-1">
                           <p>{addresses[parseInt(selectedAddress)].firstName} {addresses[parseInt(selectedAddress)].lastName}</p>
                           <p>{addresses[parseInt(selectedAddress)].address}</p>
                           <p>{addresses[parseInt(selectedAddress)].city}, {addresses[parseInt(selectedAddress)].state} {addresses[parseInt(selectedAddress)].zipCode}</p>
                           <p>{addresses[parseInt(selectedAddress)].phone} • {addresses[parseInt(selectedAddress)].email}</p>
                         </div>
                       </div>
                     )}

                     <Button 
                       className="w-full bg-primary hover:bg-primary-hover text-primary-foreground"
                       onClick={handleNextStep}
                       disabled={!selectedAddress}
                     >
                       Continue to Payment
                     </Button>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    {addresses[parseInt(selectedAddress)] && (
                      <div>
                        <div className="font-medium">
                          {addresses[parseInt(selectedAddress)].firstName} {addresses[parseInt(selectedAddress)].lastName}
                        </div>
                        <div>
                          {addresses[parseInt(selectedAddress)].address}, {addresses[parseInt(selectedAddress)].city}, {addresses[parseInt(selectedAddress)].state} {addresses[parseInt(selectedAddress)].zipCode}
                        </div>
                        <div>
                          {addresses[parseInt(selectedAddress)].phone} • {addresses[parseInt(selectedAddress)].email}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Step 2: Payment Method */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">
                    Payment Method
                  </h2>
                  {currentStep >= 2 && (
                    <CheckCircle className="h-6 w-6 text-success" />
                  )}
                </div>

                {currentStep === 2 ? (
                  <div className="space-y-4">
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="border border-border rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="UPI" id="upi" />
                          <Label htmlFor="upi" className="flex items-center font-medium">
                            <Smartphone className="h-4 w-4 mr-2" />
                            UPI
                          </Label>
                        </div>
                        <p className="text-sm text-muted-foreground ml-6 mt-1">
                          Google Pay, PhonePe, Paytm, BHIM
                        </p>
                      </div>

                      <div className="border border-border rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="Card" id="card" />
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
                          <RadioGroupItem value="COD" id="cod" />
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

                                         {/* Payment Method Summary */}
                     <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
                       <h4 className="font-medium text-foreground mb-2">Selected Payment Method:</h4>
                       <div className="text-sm text-muted-foreground">
                         {paymentMethod === 'UPI' ? 'UPI Payment (Google Pay, PhonePe, Paytm, BHIM)' : 
                          paymentMethod === 'Card' ? 'Credit/Debit Card (Visa, MasterCard, American Express, RuPay)' : 
                          'Cash on Delivery (Pay when your order is delivered)'}
                       </div>
                     </div>

                     <Button 
                       className="w-full bg-primary hover:bg-primary-hover text-primary-foreground"
                       onClick={handleNextStep}
                     >
                       Review Order
                     </Button>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    {paymentMethod === 'UPI' ? 'UPI Payment' : 
                     paymentMethod === 'Card' ? 'Credit/Debit Card' : 'Cash on Delivery'}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Step 3: Review Order */}
            {currentStep === 3 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Review Your Order</h2>
                  
                  {/* Order Summary */}
                  <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border">
                    <h4 className="font-medium text-foreground mb-3">Order Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping Address:</span>
                        <span className="text-foreground">
                          {addresses[parseInt(selectedAddress)]?.firstName} {addresses[parseInt(selectedAddress)]?.lastName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Payment Method:</span>
                        <span className="text-foreground">{paymentMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Items:</span>
                        <span className="text-foreground">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    {cartItems.map((item) => (
                      <div key={item._id} className="flex gap-4 border-b border-border pb-4 last:border-b-0">
                        <img
                          src={item.productId.images?.[0] || "/placeholder.svg"}
                          alt={item.productId.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{item.productId.title}</h4>
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

                  {/* Final Validation */}
                  {(!selectedAddress || !paymentMethod || !cartSummary) && (
                    <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <p className="text-sm text-destructive">
                        Please ensure all required information is complete before placing your order.
                      </p>
                    </div>
                  )}

                  <Button 
                    className="w-full bg-success hover:bg-success/90 text-success-foreground font-medium text-lg py-6"
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder || !selectedAddress || !paymentMethod || !cartSummary}
                  >
                    {isPlacingOrder ? (
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="h-5 w-5 mr-2" />
                    )}
                    {isPlacingOrder ? 'Placing Order...' : `Place Order - ₹${total.toLocaleString()}`}
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
                    <span className="text-muted-foreground">Subtotal ({cartItems.length} items)</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className={shippingFee === 0 ? "text-success" : ""}>
                      {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span>₹{gst.toLocaleString()}</span>
                  </div>

                  {cartSummary?.summary.totalSavings > 0 && (
                    <div className="flex justify-between text-success">
                      <span>Total Savings</span>
                      <span>-₹{cartSummary.summary.totalSavings.toLocaleString()}</span>
                    </div>
                  )}
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