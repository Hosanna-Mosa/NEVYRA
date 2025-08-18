import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Package, Truck, CheckCircle, XCircle, Edit, Eye, Loader2 } from "lucide-react";
import { adminAPI } from "@/lib/api";

interface OrderItem {
  _id: string;
  productId: {
    _id: string;
    title: string;
    images: string[];
    price: number;
  };
  quantity: number;
  price: number;
  subtotal: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  items: OrderItem[];
  totalAmount: number;
  subtotal: number;
  shippingFee: number;
  taxAmount: number;
  discountAmount: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    email: string;
  };
  createdAt: string;
  estimatedDelivery: string;
  trackingNumber?: string;
  notes?: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setIsLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await adminAPI.getOrders();
      if (response.success) {
        setOrders(response.data || []);
      } else {
        console.error('Failed to fetch orders:', response.message);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string, trackingNumber?: string, notes?: string) => {
    try {
      setUpdatingOrder(orderId);
      const response = await adminAPI.updateOrderStatus(orderId, { status, trackingNumber, notes });
      
      if (response.success) {
        // Update the order in local state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === orderId 
              ? { ...order, status, trackingNumber, notes }
              : order
          )
        );
      } else {
        console.error('Failed to update order status:', response.message);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setUpdatingOrder(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Confirmed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Processing":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Shipped":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case "Out for Delivery":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "Cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      case "Returned":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700 border-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Failed":
        return "bg-red-100 text-red-700 border-red-200";
      case "Refunded":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const closeOrderDetails = () => {
    setIsDetailsOpen(false);
    setSelectedOrder(null);
  };

  // Filter orders based on search and filters
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${order.userId.firstName} ${order.userId.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || !statusFilter || order.status === statusFilter;
    const matchesPaymentStatus = paymentStatusFilter === "all" || !paymentStatusFilter || order.paymentStatus === paymentStatusFilter;
    
    return matchesSearch && matchesStatus && matchesPaymentStatus;
  });

  if (loading) {
    return (
      <>
        <div className="min-h-screen bg-background py-8 sm:py-12 px-4 sm:px-6 md:px-12 pb-20 sm:pb-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background py-8 sm:py-12 px-4 sm:px-6 md:px-12 pb-20 sm:pb-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-primary bg-clip-text text-transparent">Orders</h1>
          
          {/* Filters and Search */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by order number, customer name, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
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
              <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by payment" />
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
          </div>

          <Card className="glass border-0 shadow-xl">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Order Details</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Customer</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Items</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Total</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {filteredOrders.map((order) => (
                      <tr
                        key={order._id}
                        className="hover:bg-muted/50 transition-smooth cursor-pointer"
                        onClick={() => openOrderDetails(order)}
                      >
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <div className="space-y-1">
                            <div className="font-medium text-foreground">{order.orderNumber}</div>
                            <div className="text-xs text-muted-foreground">
                              {formatDate(order.createdAt)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {order.paymentMethod}
                            </div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <div className="space-y-1">
                            <div className="font-medium text-foreground">
                              {order.userId.firstName} {order.userId.lastName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {order.userId.email}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {order.shippingAddress.phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <div className="space-y-1">
                            <div className="text-sm text-foreground">
                              {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {order.items[0]?.productId.title}
                              {order.items.length > 1 && ` +${order.items.length - 1} more`}
                            </div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <div className="space-y-1">
                            <div className="font-medium text-foreground">
                              {formatCurrency(order.totalAmount)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Subtotal: {formatCurrency(order.subtotal)}
                            </div>
                            {order.shippingFee > 0 && (
                              <div className="text-xs text-muted-foreground">
                                Shipping: {formatCurrency(order.shippingFee)}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <div className="space-y-2">
                            <Badge className={`${getStatusColor(order.status)} border`}>
                              {order.status}
                            </Badge>
                            <Badge className={`${getPaymentStatusColor(order.paymentStatus)} border`}>
                              {order.paymentStatus}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" onClick={() => openOrderDetails(order)}>
                                <Eye className="h-4 w-4 mr-1" /> View
                              </Button>
                            </div>
                            <Select
                              value={order.status}
                              onValueChange={(value) => updateOrderStatus(order._id, value)}
                              disabled={updatingOrder === order._id}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
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
                            {updatingOrder === order._id && (
                              <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredOrders.length === 0 && (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No orders found</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Details Dialog */}
          <Dialog open={isDetailsOpen} onOpenChange={(open) => (open ? setIsDetailsOpen(true) : closeOrderDetails())}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Order Details</DialogTitle>
              </DialogHeader>
              {selectedOrder && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Order</div>
                      <div className="font-medium">{selectedOrder.orderNumber}</div>
                      <div className="text-sm text-muted-foreground">{formatDate(selectedOrder.createdAt)}</div>
                      <div className="flex gap-2 mt-1">
                        <Badge className={`${getStatusColor(selectedOrder.status)} border`}>{selectedOrder.status}</Badge>
                        <Badge className={`${getPaymentStatusColor(selectedOrder.paymentStatus)} border`}>{selectedOrder.paymentStatus}</Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Customer</div>
                      <div className="font-medium">{selectedOrder.userId.firstName} {selectedOrder.userId.lastName}</div>
                      <div className="text-sm text-muted-foreground break-all">{selectedOrder.userId.email}</div>
                      <div className="text-sm text-muted-foreground">{selectedOrder.shippingAddress.phone}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Payment</div>
                      <div className="font-medium">{selectedOrder.paymentMethod}</div>
                      {selectedOrder.trackingNumber && (
                        <div className="text-sm text-muted-foreground">Tracking: {selectedOrder.trackingNumber}</div>
                      )}
                      {selectedOrder.estimatedDelivery && (
                        <div className="text-sm text-muted-foreground">ETA: {formatDate(selectedOrder.estimatedDelivery)}</div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Shipping Address</div>
                    <div className="text-sm">
                      {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="font-medium">Items</div>
                    <div className="divide-y divide-border rounded-md border">
                      {selectedOrder.items.map((item) => (
                        <div key={item._id} className="flex items-center gap-4 p-3">
                          {item.productId?.images?.[0] ? (
                            <img src={item.productId.images[0]} alt={item.productId.title} className="w-12 h-12 rounded object-cover" />
                          ) : (
                            <div className="w-12 h-12 rounded bg-muted" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="truncate font-medium">{item.productId.title}</div>
                            <div className="text-sm text-muted-foreground">Qty: {item.quantity}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">{formatCurrency(item.price)}</div>
                            <div className="font-medium">{formatCurrency(item.subtotal)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <div className="text-sm text-muted-foreground">Subtotal: {formatCurrency(selectedOrder.subtotal)}</div>
                    {selectedOrder.shippingFee > 0 && (
                      <div className="text-sm text-muted-foreground">Shipping: {formatCurrency(selectedOrder.shippingFee)}</div>
                    )}
                    {selectedOrder.taxAmount > 0 && (
                      <div className="text-sm text-muted-foreground">Tax: {formatCurrency(selectedOrder.taxAmount)}</div>
                    )}
                    {selectedOrder.discountAmount > 0 && (
                      <div className="text-sm text-muted-foreground">Discount: -{formatCurrency(selectedOrder.discountAmount)}</div>
                    )}
                    <div className="font-semibold">Total: {formatCurrency(selectedOrder.totalAmount)}</div>
                  </div>

                  {selectedOrder.notes && (
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Notes</div>
                      <div className="text-sm whitespace-pre-wrap">{selectedOrder.notes}</div>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default Orders; 