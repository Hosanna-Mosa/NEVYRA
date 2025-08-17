import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  Package, 
  Users, 
  TrendingUp, 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  ShoppingCart,
  IndianRupee,
  Loader2,
  Calendar,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiService, Order } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const stats = [
  {
    title: "Total Revenue",
    value: "₹12,45,890",
    change: "+12.5%",
    icon: IndianRupee,
    color: "text-green-600"
  },
  {
    title: "Total Orders",
    value: "1,234",
    change: "+8.2%",
    icon: ShoppingCart,
    color: "text-blue-600"
  },
  {
    title: "Total Products",
    value: "856",
    change: "+3.1%",
    icon: Package,
    color: "text-purple-600"
  },
  {
    title: "Total Customers",
    value: "2,456",
    change: "+15.3%",
    icon: Users,
    color: "text-orange-600"
  }
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("all");
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllOrders();
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
        ) ||
        `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Payment status filter
    if (paymentStatusFilter !== "all") {
      filtered = filtered.filter(order => order.paymentStatus === paymentStatusFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchQuery, statusFilter, paymentStatusFilter]);

  const handleStatusUpdate = async (orderId: string, newStatus: string, trackingNumber?: string, notes?: string) => {
    setUpdatingOrder(orderId);
    try {
      const response = await apiService.updateOrderStatus(orderId, {
        status: newStatus,
        trackingNumber,
        notes
      });
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Order status updated successfully",
        });
        // Refresh orders
        await fetchOrders();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update order status",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    } finally {
      setUpdatingOrder(null);
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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-success text-success-foreground";
      case "Failed":
        return "bg-destructive text-destructive-foreground";
      case "Refunded":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-warning text-warning-foreground";
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

  const getOrderStats = () => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === "Pending").length;
    const processingOrders = orders.filter(o => o.status === "Processing").length;
    const shippedOrders = orders.filter(o => o.status === "Shipped").length;
    const deliveredOrders = orders.filter(o => o.status === "Delivered").length;
    const cancelledOrders = orders.filter(o => o.status === "Cancelled").length;
    
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const pendingRevenue = orders
      .filter(o => o.status === "Pending" || o.status === "Confirmed" || o.status === "Processing")
      .reduce((sum, order) => sum + order.totalAmount, 0);
    
    return {
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue,
      pendingRevenue
    };
  };

  const orderStats = getOrderStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-background font-roboto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-96">
            <div className="flex items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="text-lg">Loading dashboard...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-roboto">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-foreground mb-8">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-foreground">₹{orderStats.totalRevenue.toLocaleString()}</p>
                </div>
                <IndianRupee className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold text-foreground">{orderStats.totalOrders}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Orders</p>
                  <p className="text-2xl font-bold text-foreground">{orderStats.pendingOrders}</p>
                </div>
                <Package className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Delivered Orders</p>
                  <p className="text-2xl font-bold text-foreground">{orderStats.deliveredOrders}</p>
                </div>
                <Truck className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="search">Search</Label>
                    <Input
                      id="search"
                      placeholder="Search orders..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="status">Order Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Confirmed">Confirmed</SelectItem>
                        <SelectItem value="Processing">Processing</SelectItem>
                        <SelectItem value="Shipped">Shipped</SelectItem>
                        <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                        <SelectItem value="Returned">Returned</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="paymentStatus">Payment Status</Label>
                    <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Payment Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Payment Statuses</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Failed">Failed</SelectItem>
                        <SelectItem value="Refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("");
                        setStatusFilter("all");
                        setPaymentStatusFilter("all");
                      }}
                      className="w-full"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Orders Table */}
            <Card>
              <CardHeader>
                <CardTitle>Orders ({filteredOrders.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No orders found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredOrders.map((order) => (
                      <Card key={order._id} className="p-4">
                        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                          {/* Order Info */}
                          <div className="lg:col-span-2">
                            <div className="flex items-center gap-3">
                              <Package className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="font-medium text-foreground">{order.orderNumber}</p>
                                <p className="text-sm text-muted-foreground">
                                  {formatDate(order.createdAt)}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Customer */}
                          <div>
                            <p className="font-medium text-foreground">
                              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {order.shippingAddress.city}, {order.shippingAddress.state}
                            </p>
                          </div>

                          {/* Items */}
                          <div>
                            <p className="font-medium text-foreground">
                              {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {order.items[0]?.productId.title}
                              {order.items.length > 1 && ` +${order.items.length - 1} more`}
                            </p>
                          </div>

                          {/* Amount */}
                          <div>
                            <p className="font-medium text-foreground">
                              ₹{order.totalAmount.toLocaleString()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {order.paymentMethod}
                            </p>
                          </div>

                          {/* Status & Actions */}
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                            <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                              {order.paymentStatus}
                            </Badge>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => navigate(`/order/${order._id}`)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                
                                {order.status === "Pending" && (
                                  <DropdownMenuItem onClick={() => handleStatusUpdate(order._id, "Confirmed")}>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Confirm Order
                                  </DropdownMenuItem>
                                )}
                                
                                {order.status === "Confirmed" && (
                                  <DropdownMenuItem onClick={() => handleStatusUpdate(order._id, "Processing")}>
                                    <Package className="h-4 w-4 mr-2" />
                                    Start Processing
                                  </DropdownMenuItem>
                                )}
                                
                                {order.status === "Processing" && (
                                  <DropdownMenuItem onClick={() => handleStatusUpdate(order._id, "Shipped")}>
                                    <Truck className="h-4 w-4 mr-2" />
                                    Mark Shipped
                                  </DropdownMenuItem>
                                )}
                                
                                {order.status === "Shipped" && (
                                  <DropdownMenuItem onClick={() => handleStatusUpdate(order._id, "Out for Delivery")}>
                                    <Truck className="h-4 w-4 mr-2" />
                                    Out for Delivery
                                  </DropdownMenuItem>
                                )}
                                
                                {order.status === "Out for Delivery" && (
                                  <DropdownMenuItem onClick={() => handleStatusUpdate(order._id, "Delivered")}>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Mark Delivered
                                  </DropdownMenuItem>
                                )}
                                
                                {(order.status === "Pending" || order.status === "Confirmed") && (
                                  <DropdownMenuItem onClick={() => handleStatusUpdate(order._id, "Cancelled")}>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Cancel Order
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-foreground mb-2">
                      {orderStats.pendingOrders}
                    </div>
                    <div className="text-sm text-muted-foreground">Pending Orders</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-foreground mb-2">
                      {orderStats.processingOrders}
                    </div>
                    <div className="text-sm text-muted-foreground">Processing Orders</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-foreground mb-2">
                      {orderStats.shippedOrders}
                    </div>
                    <div className="text-sm text-muted-foreground">Shipped Orders</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-foreground mb-2">
                      {orderStats.deliveredOrders}
                    </div>
                    <div className="text-sm text-muted-foreground">Delivered Orders</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-foreground mb-2">
                      {orderStats.cancelledOrders}
                    </div>
                    <div className="text-sm text-muted-foreground">Cancelled Orders</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-foreground mb-2">
                      ₹{orderStats.pendingRevenue.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Pending Revenue</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;