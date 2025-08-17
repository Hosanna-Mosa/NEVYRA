import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FloatingDock } from "@/components/FloatingDock";

const dummyOrders = [
  {
    id: "ORD-1001",
    customer: "Alice Johnson",
    date: "2024-07-21",
    total: "₹1,299",
    status: "Processing",
  },
  {
    id: "ORD-1002",
    customer: "Bob Smith",
    date: "2024-07-20",
    total: "₹399",
    status: "Shipped",
  },
  {
    id: "ORD-1003",
    customer: "Charlie Lee",
    date: "2024-07-19",
    total: "₹2,499",
    status: "Delivered",
  },
  {
    id: "ORD-1004",
    customer: "Diana Prince",
    date: "2024-07-18",
    total: "₹99",
    status: "Cancelled",
  },
  {
    id: "ORD-1005",
    customer: "Ethan Hunt",
    date: "2024-07-17",
    total: "₹1,099",
    status: "Processing",
  },
];

const statusColor = (status: string) => {
  switch (status) {
    case "Processing":
      return "bg-yellow-100 text-yellow-700";
    case "Shipped":
      return "bg-blue-100 text-blue-700";
    case "Delivered":
      return "bg-green-100 text-green-700";
    case "Cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const Orders: React.FC = () => {
  return (
    <>
      <FloatingDock />
      <div className="min-h-screen bg-background py-8 sm:py-12 px-4 sm:px-6 md:px-12 pb-20 sm:pb-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-primary bg-clip-text text-transparent">Orders</h1>
          <Card className="glass border-0 shadow-xl">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Order ID</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Customer</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Total</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {dummyOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-muted/50 transition-smooth">
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-foreground">{order.id}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-foreground">{order.customer}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-muted-foreground">{order.date}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-foreground">{order.total}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${statusColor(order.status)}`}>{order.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Orders; 