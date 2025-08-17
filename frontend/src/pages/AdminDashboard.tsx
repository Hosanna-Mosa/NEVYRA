import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  IndianRupee
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import phoneProduct from "@/assets/phone-product.jpg";

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

const recentOrders = [
  {
    id: "NVR001234",
    customer: "Rajesh Kumar",
    product: "Latest Smartphone Pro Max",
    amount: 29999,
    status: "Delivered",
    date: "2023-12-15"
  },
  {
    id: "NVR001235",
    customer: "Priya Sharma",
    product: "Premium Running Shoes",
    amount: 2999,
    status: "Shipped",
    date: "2023-12-14"
  },
  {
    id: "NVR001236",
    customer: "Amit Patel",
    product: "Gaming Laptop Ultra",
    amount: 69999,
    status: "Processing",
    date: "2023-12-13"
  },
  {
    id: "NVR001237",
    customer: "Sneha Gupta",
    product: "Designer Dress",
    amount: 1499,
    status: "Pending",
    date: "2023-12-12"
  }
];

const products = [
  {
    id: 1,
    name: "Latest Smartphone Pro Max",
    image: phoneProduct,
    price: 29999,
    stock: 25,
    category: "Electronics",
    status: "Active"
  },
  {
    id: 2,
    name: "Premium Running Shoes",
    image: phoneProduct,
    price: 2999,
    stock: 50,
    category: "Fashion",
    status: "Active"
  },
  {
    id: 3,
    name: "Gaming Laptop Ultra",
    image: phoneProduct,
    price: 69999,
    stock: 8,
    category: "Electronics",
    status: "Active"
  },
  {
    id: 4,
    name: "Designer Dress Collection",
    image: phoneProduct,
    price: 1499,
    stock: 0,
    category: "Fashion",
    status: "Out of Stock"
  }
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      case "active":
        return "bg-green-100 text-green-800";
      case "out of stock":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-muted/50 font-roboto">
      {/* Header */}
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Nevyra Admin</h1>
              <p className="text-muted-foreground">Manage your e-commerce platform</p>
            </div>
            <div className="flex items-center gap-4">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary-foreground">A</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Customers
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                          <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                          <p className={`text-sm ${stat.color}`}>
                            <TrendingUp className="h-3 w-3 inline mr-1" />
                            {stat.change}
                          </p>
                        </div>
                        <div className={`${stat.color} opacity-20`}>
                          <IconComponent className="h-8 w-8" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-medium text-foreground">#{order.id}</p>
                            <p className="text-sm text-muted-foreground">{order.customer}</p>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-foreground">{order.product}</p>
                            <p className="text-sm text-muted-foreground">{order.date}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-medium">₹{order.amount.toLocaleString()}</p>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Products</h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search products..." className="pl-10 w-64" />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium">₹{product.price.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Price</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium">{product.stock}</p>
                        <p className="text-sm text-muted-foreground">Stock</p>
                      </div>
                      <Badge className={getStatusColor(product.status)}>
                        {product.status}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Orders</h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search orders..." className="pl-10 w-64" />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium text-foreground">#{order.id}</p>
                          <p className="text-sm text-muted-foreground">{order.date}</p>
                        </div>
                        <div>
                          <p className="text-sm text-foreground">{order.customer}</p>
                          <p className="text-sm text-muted-foreground">{order.product}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-medium">₹{order.amount.toLocaleString()}</p>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Update Status
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Customers</h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search customers..." className="pl-10 w-64" />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Customer Management</h3>
                  <p className="text-muted-foreground">
                    Customer management features will be available here. You can view customer details, 
                    order history, and manage customer relationships.
                  </p>
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