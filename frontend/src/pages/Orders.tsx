import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Eye, 
  Download,
  Star,
  Truck,
  ArrowLeft,
  Search,
  Filter,
  X,
  Loader2,
  Package,
  Calendar,
  MapPin,
  CreditCard
} from "lucide-react";
import { apiService, Order } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Orders = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [timeFilters, setTimeFilters] = useState<string[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUserOrders();
      if (response.success) {
        setOrders(response.data);
        setFilteredOrders(response.data);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to fetch orders",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter orders based on search query and filters
  useEffect(() => {
    let filtered = orders;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some(item => 
          item.productId.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Status filter
    if (statusFilters.length > 0) {
      filtered = filtered.filter(order => statusFilters.includes(order.status));
    }

    // Time filter
    if (timeFilters.length > 0) {
      const now = new Date();
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt);
        const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (timeFilters.includes("last7days") && daysDiff <= 7) return true;
        if (timeFilters.includes("last30days") && daysDiff <= 30) return true;
        if (timeFilters.includes("last3months") && daysDiff <= 90) return true;
        if (timeFilters.includes("last6months") && daysDiff <= 180) return true;
        return false;
      });
    }

    setFilteredOrders(filtered);
  }, [orders, searchQuery, statusFilters, timeFilters]);

  const handleStatusFilter = (status: string, checked: boolean) => {
    if (checked) {
      setStatusFilters([...statusFilters, status]);
    } else {
      setStatusFilters(statusFilters.filter(s => s !== status));
    }
  };

  const handleTimeFilter = (time: string, checked: boolean) => {
    if (checked) {
      setTimeFilters([...timeFilters, time]);
    } else {
      setTimeFilters(timeFilters.filter(t => t !== time));
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilters([]);
    setTimeFilters([]);
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getEstimatedDelivery = (order: Order) => {
    if (order.estimatedDelivery) {
      const date = new Date(order.estimatedDelivery);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
    return "TBD";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background font-roboto">
        <Navbar />
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-96">
            <div className="flex items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="text-lg">Loading orders...</span>
            </div>
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
              My Orders
            </h1>
            <p className="text-muted-foreground">
              Track and manage your orders
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders by order number or product name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filter Button */}
          <div className="lg:col-span-2">
            <Button
              variant="outline"
              onClick={() => document.getElementById('filters')?.classList.toggle('hidden')}
              className="w-full lg:w-auto"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {(statusFilters.length > 0 || timeFilters.length > 0) && (
                <Badge variant="secondary" className="ml-2">
                  {statusFilters.length + timeFilters.length}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        <div id="filters" className="hidden lg:block mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Status Filters */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Order Status</h3>
                  <div className="space-y-2">
                    {["Pending", "Confirmed", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled", "Returned"].map((status) => (
                      <div key={status} className="flex items-center space-x-2">
                        <Checkbox
                          id={status}
                          checked={statusFilters.includes(status)}
                          onCheckedChange={(checked) => handleStatusFilter(status, checked as boolean)}
                        />
                        <label htmlFor={status} className="text-sm text-foreground cursor-pointer">
                          {status}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Time Filters */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Time Period</h3>
                  <div className="space-y-2">
                    {[
                      { key: "last7days", label: "Last 7 days" },
                      { key: "last30days", label: "Last 30 days" },
                      { key: "last3months", label: "Last 3 months" },
                      { key: "last6months", label: "Last 6 months" }
                    ].map((time) => (
                      <div key={time.key} className="flex items-center space-x-2">
                        <Checkbox
                          id={time.key}
                          checked={timeFilters.includes(time.key)}
                          onCheckedChange={(checked) => handleTimeFilter(time.key, checked as boolean)}
                        />
                        <label htmlFor={time.key} className="text-sm text-foreground cursor-pointer">
                          {time.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="lg:col-span-2 flex items-end">
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="w-full"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear All Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {orders.length === 0 ? "No orders yet" : "No orders match your filters"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {orders.length === 0 
                  ? "Start shopping to see your orders here"
                  : "Try adjusting your search or filters"
                }
              </p>
              {orders.length === 0 && (
                <Button onClick={() => navigate('/')}>
                  Start Shopping
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  {/* Order Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-muted-foreground" />
                        <span className="font-mono font-medium text-foreground">
                          {order.orderNumber}
                        </span>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Ordered: {formatDate(order.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Truck className="h-4 w-4" />
                        <span>Est. Delivery: {getEstimatedDelivery(order)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3 mb-4">
                    {order.items.map((item) => (
                      <div key={item._id} className="flex gap-4 border-b border-border pb-3 last:border-b-0">
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
                            <span className="font-medium">₹{item.totalAmount.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{order.shippingAddress.city}, {order.shippingAddress.state}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CreditCard className="h-4 w-4" />
                        <span>{order.paymentMethod}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Total Amount</div>
                        <div className="text-lg font-bold text-foreground">
                          ₹{order.totalAmount.toLocaleString()}
                        </div>
                      </div>
                      <Button
                        onClick={() => navigate(`/order/${order._id}`)}
                        className="bg-primary hover:bg-primary-hover text-primary-foreground"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Orders; 
