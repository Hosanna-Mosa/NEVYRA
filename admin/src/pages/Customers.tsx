import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FloatingDock } from "@/components/FloatingDock";

const dummyCustomers = [
  {
    id: "CUST-001",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    joined: "2023-11-12",
    status: "Active",
  },
  {
    id: "CUST-002",
    name: "Bob Smith",
    email: "bob.smith@example.com",
    joined: "2024-01-05",
    status: "VIP",
  },
  {
    id: "CUST-003",
    name: "Charlie Lee",
    email: "charlie.lee@example.com",
    joined: "2024-03-22",
    status: "Active",
  },
  {
    id: "CUST-004",
    name: "Diana Prince",
    email: "diana.prince@example.com",
    joined: "2024-04-18",
    status: "Inactive",
  },
  {
    id: "CUST-005",
    name: "Ethan Hunt",
    email: "ethan.hunt@example.com",
    joined: "2024-06-01",
    status: "Active",
  },
];

const statusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-700";
    case "VIP":
      return "bg-yellow-100 text-yellow-700";
    case "Inactive":
      return "bg-gray-200 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const Customers: React.FC = () => {
  return (
    <>
      <FloatingDock />
      <div className="min-h-screen bg-background py-8 sm:py-12 px-4 sm:px-6 md:px-12 pb-20 sm:pb-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-primary bg-clip-text text-transparent">Customers</h1>
          <Card className="glass border-0 shadow-xl">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Customer ID</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Joined</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {dummyCustomers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-muted/50 transition-smooth">
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-foreground">{customer.id}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-foreground">{customer.name}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-muted-foreground">{customer.email}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-foreground">{customer.joined}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${statusColor(customer.status)}`}>{customer.status}</span>
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

export default Customers; 