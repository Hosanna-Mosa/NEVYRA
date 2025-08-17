import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  LogOut 
} from "lucide-react";
import { adminAuthUtils } from "@/lib/api";

const dockItems = [
  { id: "dashboard", icon: Home, label: "Dashboard", color: "from-purple-500 to-pink-500" },
  { id: "analytics", icon: BarChart3, label: "Analytics", color: "from-violet-500 to-purple-500" },
  { id: "orders", icon: ShoppingCart, label: "Orders", color: "from-green-500 to-emerald-500" },
  { id: "products", icon: Package, label: "Products", color: "from-blue-500 to-cyan-500" },
  { id: "customers", icon: Users, label: "Customers", color: "from-orange-500 to-red-500" },
  // { id: "inventory", icon: Warehouse, label: "Inventory", color: "from-cyan-500 to-blue-500" },
  // { id: "marketing", icon: Megaphone, label: "Marketing", color: "from-pink-500 to-rose-500" },
  // { id: "settings", icon: Settings, label: "Settings", color: "from-gray-500 to-slate-500" },
];

export function FloatingDock() {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Map dock item id to route
  const routeMap: Record<string, string> = {
    dashboard: "/",
    products: "/products",
    orders: "/orders",
    customers: "/customers",
    analytics: "/analytics",
  };

  // Update active item based on current route
  useEffect(() => {
    const currentPath = location.pathname;
    const activeId = Object.entries(routeMap).find(([id, route]) => route === currentPath)?.[0] || "dashboard";
    setActiveItem(activeId);
  }, [location.pathname]);

  const handleLogout = () => {
    adminAuthUtils.clearAuth();
    navigate("/login");
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 sm:left-6 sm:top-1/2 sm:-translate-y-1/2 sm:bottom-auto z-40">
      <div className="glass rounded-xl sm:rounded-2xl p-2 sm:p-4 backdrop-blur-xl border-0">
        <div className="flex flex-row sm:flex-col items-center gap-2 sm:gap-2">
          {/* Dock Items */}
          {dockItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            const isHovered = hoveredItem === item.id;
            return (
              <div key={item.id} className="relative">
                                                  <Button
                   variant="ghost"
                   size="icon"
                   onClick={() => {
                     setActiveItem(item.id);
                     if (routeMap[item.id]) navigate(routeMap[item.id]);
                   }}
                   onMouseEnter={() => setHoveredItem(item.id)}
                   onMouseLeave={() => setHoveredItem(null)}
                   className={cn(
                     "relative rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-110",
                     "h-10 w-10 sm:h-10 sm:w-10",
                     isActive 
                       ? `bg-gradient-to-r ${item.color} text-white shadow-lg scale-110` 
                       : "hover:bg-muted"
                   )}
                 >
                   <Icon className="h-5 w-5 sm:h-5 sm:w-5" />
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                  )}
                </Button>

                {/* Tooltip */}
                {isHovered && (
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded-md whitespace-nowrap animate-scale-in">
                    {item.label}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-2 border-transparent border-t-black/80" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Separator */}
          <div className="w-px h-8 bg-border/50 mx-1" />

          {/* Logout Button */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              onMouseEnter={() => setHoveredItem("logout")}
              onMouseLeave={() => setHoveredItem(null)}
              className="relative rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-110 h-10 w-10 sm:h-10 sm:w-10 hover:bg-red-100 hover:text-red-600"
            >
              <LogOut className="h-5 w-5 sm:h-5 sm:w-5" />
            </Button>

            {/* Tooltip */}
            {hoveredItem === "logout" && (
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded-md whitespace-nowrap animate-scale-in">
                Logout
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-2 border-transparent border-t-black/80" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}