import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Eye, 
  Download,
  Star,
  Truck,
  ArrowLeft,
  MapPin,
  Phone,
  Calendar,
  Package,
  CheckCircle,
  Clock,
  Truck as TruckIcon,
  User,
  Loader2,
  CreditCard,
  AlertCircle
} from "lucide-react";
import { apiService, Order } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const OrderDetails = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await apiService.getOrderById(orderId!);
      if (response.success) {
        setOrder(response.data);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to fetch order details",
          variant: "destructive",
        });
        navigate('/orders');
      }
    } catch (error) {
      console.error("Failed to fetch order details:", error);
      toast({
        title: "Error",
        description: "Failed to fetch order details",
        variant: "destructive",
      });
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order || !orderId) return;
    
    if (order.status !== "Pending" && order.status !== "Confirmed") {
      toast({
        title: "Cannot Cancel",
        description: "This order cannot be cancelled at this stage",
        variant: "destructive",
      });
      return;
    }

    setCancelling(true);
    try {
      const response = await apiService.cancelOrder(orderId);
      if (response.success) {
        toast({
          title: "Success",
          description: "Order cancelled successfully",
        });
        // Refresh order details
        await fetchOrderDetails();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to cancel order",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to cancel order:", error);
      toast({
        title: "Error",
        description: "Failed to cancel order",
        variant: "destructive",
      });
    } finally {
      setCancelling(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-success text-success-foreground";
      case "Shipped":
      case "Out for Delivery":
        return "bg-primary text-primary-foreground";
      case "Processing":
      case "Confirmed":
        return "bg-warning text-warning-foreground";
      case "Cancelled":
        return "bg-destructive text-destructive-foreground";
      case "Returned":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle className="h-5 w-5" />;
      case "Shipped":
      case "Out for Delivery":
        return <Truck className="h-5 w-5" />;
      case "Processing":
      case "Confirmed":
        return <Clock className="h-5 w-5" />;
      case "Cancelled":
        return <AlertCircle className="h-5 w-5" />;
      case "Returned":
        return <Package className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstimatedDelivery = (order: Order) => {
    if (order.estimatedDelivery) {
      const date = new Date(order.estimatedDelivery);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return "To be determined";
  };

  const getTrackingUpdates = (order: Order) => {
    const updates = [];
    
    // Order placed
    updates.push({
      date: formatDate(order.createdAt),
      status: "Order Placed",
      description: "Your order has been placed successfully"
    });

    // Order confirmed
    if (order.status !== "Pending") {
      updates.push({
        date: formatDate(order.createdAt),
        status: "Order Confirmed",
        description: "Your order has been confirmed"
      });
    }

    // Processing
    if (["Processing", "Shipped", "Out for Delivery", "Delivered"].includes(order.status)) {
      updates.push({
        date: formatDate(order.createdAt),
        status: "Processing",
        description: "Your order is being processed"
      });
    }

    // Shipped
    if (["Shipped", "Out for Delivery", "Delivered"].includes(order.status)) {
      updates.push({
        date: order.estimatedDelivery ? formatDate(order.estimatedDelivery) : "Soon",
        status: "Shipped",
        description: "Your order has been shipped"
      });
    }

    // Out for Delivery
    if (["Out for Delivery", "Delivered"].includes(order.status)) {
      updates.push({
        date: order.estimatedDelivery ? formatDate(order.estimatedDelivery) : "Today",
        status: "Out for Delivery",
        description: "Your order is out for delivery"
      });
    }

    // Delivered
    if (order.status === "Delivered" && order.actualDelivery) {
      updates.push({
        date: formatDate(order.actualDelivery),
        status: "Delivered",
        description: "Your order has been delivered"
      });
    }

    // Cancelled
    if (order.status === "Cancelled") {
      updates.push({
        date: formatDate(order.updatedAt || order.createdAt),
        status: "Cancelled",
        description: "Your order has been cancelled"
      });
    }

    return updates;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background font-roboto">
        <Navbar />
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-96">
            <div className="flex items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="text-lg">Loading order details...</span>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background font-roboto">
        <Navbar />
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Order Not Found
            </h1>
            <p className="text-muted-foreground mb-6">
              The order you're looking for doesn't exist
            </p>
            <Button onClick={() => navigate('/orders')}>
              Back to Orders
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const trackingUpdates = getTrackingUpdates(order);

  return (
    <div className="min-h-screen bg-background font-roboto">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Order Details
            </h1>
            <p className="text-muted-foreground">
              Order #{order.orderNumber}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">Order Status</h2>
                  <Badge className={`${getStatusColor(order.status)} text-sm px-3 py-1`}>
                    {getStatusIcon(order.status)}
                    <span className="ml-2">{order.status}</span>
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Order Date</p>
                      <p className="font-medium">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                      <p className="font-medium">{getEstimatedDelivery(order)}</p>
                    </div>
                  </div>

                  {order.trackingNumber && (
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Tracking Number</p>
                        <p className="font-medium">{order.trackingNumber}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Order Items</h2>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item._id} className="flex gap-4 border-b border-border pb-4 last:border-b-0">
                      <img
                        src={item.productId.images?.[0] || "/placeholder.svg"}
                        alt={item.productId.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{item.productId.title}</h3>
                        <div className="text-sm text-muted-foreground mt-1">
                          {item.color && <span>Color: {item.color}</span>}
                          {item.size && <span className="ml-2">Size: {item.size}</span>}
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm">Quantity: {item.quantity}</span>
                          <span className="font-medium">₹{item.totalAmount.toLocaleString()}</span>
                        </div>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <div className="text-sm text-muted-foreground mt-1">
                            <span className="line-through">₹{item.originalPrice.toLocaleString()}</span>
                            <span className="ml-2 text-success">Save ₹{(item.originalPrice - item.price).toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tracking Updates */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Order Timeline</h2>
                <div className="space-y-4">
                  {trackingUpdates.map((update, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${
                          index === trackingUpdates.length - 1 ? 'bg-success' : 'bg-muted'
                        }`}></div>
                        {index < trackingUpdates.length - 1 && (
                          <div className="w-0.5 h-8 bg-muted mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-foreground">{update.status}</h4>
                          <span className="text-sm text-muted-foreground">{update.date}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{update.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{order.subtotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className={order.shippingFee === 0 ? "text-success" : ""}>
                      {order.shippingFee === 0 ? "FREE" : `₹${order.shippingFee}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>₹{order.taxAmount.toLocaleString()}</span>
                  </div>

                  {order.discountAmount > 0 && (
                    <div className="flex justify-between text-success">
                      <span>Discount</span>
                      <span>-₹{order.discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{order.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Shipping Address</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{order.shippingAddress.phone}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">{order.shippingAddress.email}</div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Payment Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Payment Method</span>
                  </div>
                  <div className="font-medium">{order.paymentMethod}</div>
                  
                  <Separator />
                  
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      order.paymentStatus === "Paid" ? "bg-success" : 
                      order.paymentStatus === "Failed" ? "bg-destructive" : "bg-warning"
                    }`}></div>
                    <span className="text-sm text-muted-foreground">Payment Status</span>
                  </div>
                  <div className="font-medium">{order.paymentStatus}</div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Actions</h3>
                <div className="space-y-3">
                  {(order.status === "Pending" || order.status === "Confirmed") && (
                    <Button
                      variant="outline"
                      onClick={handleCancelOrder}
                      disabled={cancelling}
                      className="w-full"
                    >
                      {cancelling ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <AlertCircle className="h-4 w-4 mr-2" />
                      )}
                      {cancelling ? 'Cancelling...' : 'Cancel Order'}
                    </Button>
                  )}
                  
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Invoice
                  </Button>
                  
                  {order.status === "Delivered" && (
                    <Button variant="outline" className="w-full">
                      <Star className="h-4 w-4 mr-2" />
                      Rate & Review
                    </Button>
                  )}
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

export default OrderDetails; 