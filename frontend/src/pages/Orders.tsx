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
  X
} from "lucide-react";
import phoneProduct from "@/assets/phone-product.jpg";
import shoesProduct from "@/assets/shoes-product.jpg";
import laptopProduct from "@/assets/laptop-product.jpg";

const orders = [
  {
    id: "NVR001234",
    date: "2023-12-15",
    status: "Delivered",
    deliveryDate: "Jul 11",
    total: 432,
    items: [
      {
        name: "Richer Large 36 L Laptop Backpack Paradise",
        image: laptopProduct,
        quantity: 1,
        price: 432,
        color: "Black"
      }
    ]
  },
  {
    id: "NVR001235",
    date: "2023-12-10",
    status: "Cancelled",
    deliveryDate: "Jul 06",
    total: 413,
    items: [
      {
        name: "ENSURE Clinically Proven Nutritional Drink",
        image: phoneProduct,
        quantity: 1,
        price: 413,
        color: "Chocolate"
      }
    ]
  },
  {
    id: "NVR001236",
    date: "2023-12-05",
    status: "Cancelled",
    deliveryDate: "Jun 13",
    total: 173,
    items: [
      {
        name: "Print maker Back Cover for Realme 12 Pro",
        image: shoesProduct,
        quantity: 1,
        price: 173,
        color: "Multicolor"
      }
    ]
  },
  {
    id: "NVR001237",
    date: "2023-12-01",
    status: "Delivered",
    deliveryDate: "Jun 19",
    total: 186,
    items: [
      {
        name: "75 L Grey Laundry Basket",
        image: phoneProduct,
        quantity: 1,
        price: 186,
        color: "Grey"
      }
    ]
  }
];

const Orders = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [timeFilters, setTimeFilters] = useState<string[]>([]);
  const [filteredOrders, setFilteredOrders] = useState(orders);

  // Filter orders based on search query and filters
  useEffect(() => {
    let filtered = orders;

    // Search functionality
    if (searchQuery.trim()) {
      filtered = filtered.filter(order => 
        order.items[0].name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items[0].color.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filtering
    if (statusFilters.length > 0) {
      filtered = filtered.filter(order => 
        statusFilters.includes(order.status.toLowerCase())
      );
    }

    // Time filtering
    if (timeFilters.length > 0) {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.date);
        const currentDate = new Date();
        
        return timeFilters.some(filter => {
          switch (filter) {
            case "last-30-days":
              const thirtyDaysAgo = new Date();
              thirtyDaysAgo.setDate(currentDate.getDate() - 30);
              return orderDate >= thirtyDaysAgo;
            case "2024":
              return orderDate.getFullYear() === 2024;
            case "2023":
              return orderDate.getFullYear() === 2023;
            case "2022":
              return orderDate.getFullYear() === 2022;
            case "2021":
              return orderDate.getFullYear() === 2021;
            case "older":
              return orderDate.getFullYear() < 2021;
            default:
              return true;
          }
        });
      });
    }

    setFilteredOrders(filtered);
  }, [searchQuery, statusFilters, timeFilters]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      case "shipped":
        return "bg-blue-500";
      case "processing":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      case "shipped":
        return "On the way";
      case "processing":
        return "Processing";
      default:
        return status;
    }
  };

  const handleOrderClick = (orderId: string) => {
    navigate(`/order/${orderId}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleStatusFilterChange = (status: string, checked: boolean) => {
    if (checked) {
      setStatusFilters(prev => [...prev, status]);
    } else {
      setStatusFilters(prev => prev.filter(s => s !== status));
    }
  };

  const handleTimeFilterChange = (timeFilter: string, checked: boolean) => {
    if (checked) {
      setTimeFilters(prev => [...prev, timeFilter]);
    } else {
      setTimeFilters(prev => prev.filter(t => t !== timeFilter));
    }
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setStatusFilters([]);
    setTimeFilters([]);
  };

  return (
    <div className="min-h-screen bg-background font-roboto">
      <Navbar />
      
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200 px-3 py-2">
        <div className="text-xs text-gray-600">
          Home &gt; My Account &gt; My Orders
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row">
        {/* Filters Sidebar - Hidden on mobile, shown on desktop */}
        <div className="hidden lg:block lg:w-64 bg-white border-r border-gray-200 p-4">
          <h3 className="font-semibold text-sm mb-4">Filters</h3>
          
                     {/* Order Status */}
           <div className="mb-6">
             <h4 className="font-medium text-sm mb-3">ORDER STATUS</h4>
             <div className="space-y-2">
               <div className="flex items-center space-x-2">
                 <Checkbox 
                   id="on-the-way" 
                   checked={statusFilters.includes("shipped")}
                   onCheckedChange={(checked) => handleStatusFilterChange("shipped", checked as boolean)}
                 />
                 <label htmlFor="on-the-way" className="text-sm">On the way</label>
               </div>
               <div className="flex items-center space-x-2">
                 <Checkbox 
                   id="delivered" 
                   checked={statusFilters.includes("delivered")}
                   onCheckedChange={(checked) => handleStatusFilterChange("delivered", checked as boolean)}
                 />
                 <label htmlFor="delivered" className="text-sm">Delivered</label>
               </div>
               <div className="flex items-center space-x-2">
                 <Checkbox 
                   id="cancelled" 
                   checked={statusFilters.includes("cancelled")}
                   onCheckedChange={(checked) => handleStatusFilterChange("cancelled", checked as boolean)}
                 />
                 <label htmlFor="cancelled" className="text-sm">Cancelled</label>
               </div>
               <div className="flex items-center space-x-2">
                 <Checkbox 
                   id="returned" 
                   checked={statusFilters.includes("returned")}
                   onCheckedChange={(checked) => handleStatusFilterChange("returned", checked as boolean)}
                 />
                 <label htmlFor="returned" className="text-sm">Returned</label>
               </div>
             </div>
           </div>

           {/* Order Time */}
           <div>
             <h4 className="font-medium text-sm mb-3">ORDER TIME</h4>
             <div className="space-y-2">
               <div className="flex items-center space-x-2">
                 <Checkbox 
                   id="last-30-days" 
                   checked={timeFilters.includes("last-30-days")}
                   onCheckedChange={(checked) => handleTimeFilterChange("last-30-days", checked as boolean)}
                 />
                 <label htmlFor="last-30-days" className="text-sm">Last 30 days</label>
               </div>
               <div className="flex items-center space-x-2">
                 <Checkbox 
                   id="2024" 
                   checked={timeFilters.includes("2024")}
                   onCheckedChange={(checked) => handleTimeFilterChange("2024", checked as boolean)}
                 />
                 <label htmlFor="2024" className="text-sm">2024</label>
               </div>
               <div className="flex items-center space-x-2">
                 <Checkbox 
                   id="2023" 
                   checked={timeFilters.includes("2023")}
                   onCheckedChange={(checked) => handleTimeFilterChange("2023", checked as boolean)}
                 />
                 <label htmlFor="2023" className="text-sm">2023</label>
               </div>
               <div className="flex items-center space-x-2">
                 <Checkbox 
                   id="2022" 
                   checked={timeFilters.includes("2022")}
                   onCheckedChange={(checked) => handleTimeFilterChange("2022", checked as boolean)}
                 />
                 <label htmlFor="2022" className="text-sm">2022</label>
               </div>
               <div className="flex items-center space-x-2">
                 <Checkbox 
                   id="2021" 
                   checked={timeFilters.includes("2021")}
                   onCheckedChange={(checked) => handleTimeFilterChange("2021", checked as boolean)}
                 />
                 <label htmlFor="2021" className="text-sm">2021</label>
               </div>
               <div className="flex items-center space-x-2">
                 <Checkbox 
                   id="older" 
                   checked={timeFilters.includes("older")}
                   onCheckedChange={(checked) => handleTimeFilterChange("older", checked as boolean)}
                 />
                 <label htmlFor="older" className="text-sm">Older</label>
               </div>
             </div>
           </div>

           {/* Clear Filters Button */}
           {(statusFilters.length > 0 || timeFilters.length > 0) && (
             <div className="mt-4">
               <Button 
                 variant="outline" 
                 size="sm" 
                 onClick={clearAllFilters}
                 className="w-full text-xs"
               >
                 <X className="h-3 w-3 mr-1" />
                 Clear All Filters
               </Button>
             </div>
           )}
        </div>

        {/* Orders List */}
        <div className="flex-1 bg-gray-50">
                     {/* Search Bar */}
           <div className="bg-white border-b border-gray-200 p-4">
             <div className="flex gap-2">
               <Input 
                 placeholder="Search your orders here" 
                 className="flex-1"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
               {searchQuery && (
                 <Button 
                   variant="ghost" 
                   size="sm"
                   onClick={() => setSearchQuery("")}
                   className="text-gray-500 hover:text-gray-700"
                 >
                   <X className="h-4 w-4" />
                 </Button>
               )}
             </div>
             {/* Active Filters Display */}
             {(statusFilters.length > 0 || timeFilters.length > 0) && (
               <div className="flex flex-wrap gap-2 mt-2">
                 {statusFilters.map(filter => (
                   <Badge key={filter} variant="secondary" className="text-xs">
                     {filter.charAt(0).toUpperCase() + filter.slice(1)}
                   </Badge>
                 ))}
                 {timeFilters.map(filter => (
                   <Badge key={filter} variant="secondary" className="text-xs">
                     {filter === "last-30-days" ? "Last 30 days" : filter}
                   </Badge>
                 ))}
               </div>
             )}
           </div>

                                   {/* Orders */}
             <div className="p-4 space-y-4">
               {filteredOrders.length === 0 ? (
                 <div className="text-center py-8">
                   <p className="text-gray-500 text-sm">
                     {searchQuery || statusFilters.length > 0 || timeFilters.length > 0 
                       ? "No orders found matching your criteria." 
                       : "No orders found."}
                   </p>
                   {(searchQuery || statusFilters.length > 0 || timeFilters.length > 0) && (
                     <Button 
                       variant="outline" 
                       size="sm" 
                       onClick={clearAllFilters}
                       className="mt-2"
                     >
                       Clear Filters
                     </Button>
                   )}
                 </div>
               ) : (
                 <>
                   <div className="text-sm text-gray-600 mb-2">
                     Showing {filteredOrders.length} of {orders.length} orders
                   </div>
                   {filteredOrders.map((order) => (
                <Card 
                  key={order.id} 
                  className="bg-white border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleOrderClick(order.id)}
                >
                  <CardContent className="p-4">
                    {/* Order Item */}
                    <div className="flex gap-4">
                      <img
                        src={order.items[0].image}
                        alt={order.items[0].name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-sm text-gray-900 line-clamp-2">
                          {order.items[0].name}
                        </h3>
                        <p className="text-xs text-gray-600 mt-1">Color: {order.items[0].color}</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">₹{order.total}</p>
                        
                        {/* Status */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(order.status)}`}></div>
                          <span className="text-xs text-gray-600">
                            {getStatusText(order.status)} on {order.deliveryDate}
                          </span>
                        </div>
                        
                        {/* Additional Info */}
                        {order.status === "Delivered" && (
                          <p className="text-xs text-gray-600 mt-1">Your item has been delivered</p>
                        )}
                        {order.status === "Cancelled" && order.id === "NVR001236" && (
                          <p className="text-xs text-gray-600 mt-1">
                            You requested a cancellation because you changed your mind about this product.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {order.status === "Delivered" && (
                      <div className="mt-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle rate & review
                          }}
                        >
                          <Star className="h-3 w-3 mr-1" />
                          Rate & Review Product
                        </Button>
                      </div>
                                         )}
                   </CardContent>
                 </Card>
               ))}
                 </>
               )}
             </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Orders; 
