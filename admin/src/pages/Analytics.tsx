import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { FloatingDock } from "@/components/FloatingDock";

const revenueData = [
  { month: "Jan", revenue: 12000 },
  { month: "Feb", revenue: 15000 },
  { month: "Mar", revenue: 18000 },
  { month: "Apr", revenue: 14000 },
  { month: "May", revenue: 21000 },
  { month: "Jun", revenue: 25000 },
];

const ordersData = [
  { day: "Mon", orders: 120 },
  { day: "Tue", orders: 98 },
  { day: "Wed", orders: 150 },
  { day: "Thu", orders: 170 },
  { day: "Fri", orders: 200 },
  { day: "Sat", orders: 220 },
  { day: "Sun", orders: 180 },
];

const pieData = [
  { label: "Electronics", value: 40, color: "#7c3aed" },
  { label: "Fashion", value: 25, color: "#f472b6" },
  { label: "Home", value: 20, color: "#34d399" },
  { label: "Other", value: 15, color: "#fbbf24" },
];

const summaryStats = [
  { label: "Total Revenue", value: "₹120,000", color: "text-purple-600" },
  { label: "Orders", value: "4,200", color: "text-pink-500" },
  { label: "Conversion Rate", value: "3.2%", color: "text-green-500" },
  { label: "Bounce Rate", value: "2.1%", color: "text-yellow-500" },
];

const Analytics: React.FC = () => {
  return (
    <>
      <FloatingDock />
      <div className="min-h-screen bg-background py-8 sm:py-12 px-4 sm:px-6 md:px-12 pb-20 sm:pb-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-primary bg-clip-text text-transparent">Analytics</h1>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {summaryStats.map((stat) => (
              <Card key={stat.label} className="glass border-0 shadow-md">
                <CardContent className="py-4 sm:py-6 text-center">
                  <div className={`text-lg sm:text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-6 sm:mb-8">
            <Card className="glass border-0 shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-purple-700">Monthly Revenue</h2>
                <ChartContainer config={{ revenue: { color: "#7c3aed", label: "Revenue" } }}>
                  <BarChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#7c3aed" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card className="glass border-0 shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-pink-500">Orders This Week</h2>
                <ChartContainer config={{ orders: { color: "#f472b6", label: "Orders" } }}>
                  <LineChart data={ordersData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="orders" stroke="#f472b6" strokeWidth={3} dot={{ r: 6 }} />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
            <Card className="glass border-0 shadow-lg">
              <CardContent className="p-4 sm:p-6 flex flex-col items-center">
                <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-green-500">Category Distribution</h2>
                <ChartContainer config={{ Electronics: { color: "#7c3aed", label: "Electronics" }, Fashion: { color: "#f472b6", label: "Fashion" }, Home: { color: "#34d399", label: "Home" }, Other: { color: "#fbbf24", label: "Other" } }}>
                  <PieChart width={320} height={220}>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="label"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Analytics; 