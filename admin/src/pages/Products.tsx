import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FloatingDock } from "@/components/FloatingDock";

const dummyProducts = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    category: "Smartphones",
    price: "₹1,199",
    stock: 42,
    status: "Active",
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra",
    category: "Smartphones",
    price: "₹1,099",
    stock: 18,
    status: "Active",
  },
  {
    id: 3,
    name: "Sony WH-1000XM5",
    category: "Headphones",
    price: "₹399",
    stock: 120,
    status: "Active",
  },
  {
    id: 4,
    name: "Apple MacBook Pro 16\"",
    category: "Laptops",
    price: "₹2,499",
    stock: 7,
    status: "Low Stock",
  },
  {
    id: 5,
    name: "Logitech MX Master 3S",
    category: "Accessories",
    price: "₹99",
    stock: 0,
    status: "Out of Stock",
  },
];

const statusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-700";
    case "Low Stock":
      return "bg-yellow-100 text-yellow-700";
    case "Out of Stock":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const Products: React.FC = () => {
  return (
    <>
      <FloatingDock />
      <div className="min-h-screen bg-background py-8 sm:py-12 px-4 sm:px-6 md:px-12 pb-20 sm:pb-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-primary bg-clip-text text-transparent">Products</h1>
          <Card className="glass border-0 shadow-xl">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Stock</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {dummyProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-muted/50 transition-smooth">
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-foreground">{product.id}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-foreground">{product.name}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-muted-foreground">{product.category}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-foreground">{product.price}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-foreground">{product.stock}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${statusColor(product.status)}`}>{product.status}</span>
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

export default Products; 