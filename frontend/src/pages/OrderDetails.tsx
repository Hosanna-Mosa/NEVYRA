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
  User
} from "lucide-react";
import phoneProduct from "@/assets/phone-product.jpg";
import shoesProduct from "@/assets/shoes-product.jpg";
import laptopProduct from "@/assets/laptop-product.jpg";

// Mock order data
const orderData = {
  id: "OD334854323355442100",
  date: "Jul 05",
  status: "Delivered",
  total: 432,
  subtotal: 493,
  shipping: 0,
  tax: 13,
  discount: 74,
  listPrice: 2999,
  sellingPrice: 750,
  extraDiscount: 257,
  specialPrice: 493,
  paymentHandlingFee: 9,
  platformFee: 4,
  items: [
    {
      name: "Richer Large 36 L Laptop Backpack Paradise (Green) 36 L Laptop Backpack",
      image: laptopProduct,
      quantity: 1,
      price: 432,
      color: "Black",
      seller: "RicherInternational"
    }
  ],
  shippingAddress: {
    name: "Bablu",
    address: "1-213/1 Atreyapuram Subdistrict, Cbc church",
    phone: "9502926069, 9704726252"
  },
  tracking: {
    number: "9502926069",
    status: "Delivered",
    updates: [
      {
        date: "Jul 05",
        status: "Order Confirmed",
        description: "Your order has been confirmed"
      },
      {
        date: "Jul 11",
        status: "Delivered",
        description: "Your order has been delivered"
      }
    ]
  }
};

const OrderDetails = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState(orderData);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-500 text-white";
      case "shipped":
        return "bg-blue-500 text-white";
      case "processing":
        return "bg-yellow-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background font-roboto">
      <Navbar />
      
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200 px-3 py-2">
        <div className="text-xs text-gray-600">
          Home > My Account > My Orders > {order.id}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row bg-gray-50">
        {/* Left Section */}
        <div className="flex-1 p-4">
          {/* Order Tracking Info */}
          <div className="bg-white rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-2">Order can be tracked by {order.tracking.number}.</p>
            <p className="text-sm text-gray-600 mb-4">Tracking link is shared via SMS.</p>
            <div className="flex items-center justify-between text-sm text-blue-600">
              <span>Manage who can access</span>
              <span>→</span>
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-lg p-4 mb-4">
            <div className="flex gap-4">
              <img
                src={order.items[0].image}
                alt={order.items[0].name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-medium text-sm text-gray-900 line-clamp-2">
                  {order.items[0].name}
                </h3>
                <p className="text-xs text-gray-600 mt-1">Color: {order.items[0].color}</p>
                <p className="text-xs text-gray-600">Seller: {order.items[0].seller}</p>
                <p className="text-sm font-medium text-gray-900 mt-1">₹{order.total}</p>
                <p className="text-xs text-gray-600">1 offer</p>
              </div>
            </div>
          </div>

          {/* Order Status Timeline */}
          <div className="bg-white rounded-lg p-4 mb-4">
            <div className="space-y-3">
              {order.tracking.updates.map((update, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-3 w-3 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{update.status}, {update.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <a href="#" className="text-sm text-blue-600">See All Updates ></a>
            </div>
            <p className="text-xs text-gray-600 mt-2">Return policy ended on Jul 21</p>
          </div>

          {/* Product Rating */}
          <div className="bg-white rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 text-gray-300" />
                ))}
              </div>
              <span className="text-sm text-gray-600">Rate this product</span>
            </div>
          </div>

          {/* Support */}
          <div className="bg-white rounded-lg p-4">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Chat with us
            </Button>
          </div>
        </div>

        {/* Right Section */}
        <div className="lg:w-80 p-4">
          {/* Download Invoice */}
          <div className="bg-white rounded-lg p-4 mb-4">
            <Button variant="outline" className="w-full">
              Download Invoice →
            </Button>
          </div>

          {/* Delivery Details */}
          <div className="bg-white rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-sm mb-3">Delivery Details</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-900">{order.shippingAddress.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-900">{order.shippingAddress.name}</p>
                  <p className="text-xs text-gray-600">{order.shippingAddress.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Price Details */}
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-semibold text-sm mb-3">Price Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">List price</span>
                <span>₹{order.listPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Selling price</span>
                <span>₹{order.sellingPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Extra Discount</span>
                <span className="text-green-600">-₹{order.extraDiscount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Special Price</span>
                <span>₹{order.specialPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Handling Fee</span>
                <span>₹{order.paymentHandlingFee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Platform fee</span>
                <span>₹{order.platformFee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Get extra 15% off upto ₹75 on 50 item(s)</span>
                <span className="text-green-600">-₹{order.discount}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total Amount</span>
                <span>₹{order.total}</span>
              </div>
              <p className="text-xs text-gray-600">1 coupon:</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderDetails; 