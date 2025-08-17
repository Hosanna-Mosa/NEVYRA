import { 
  Package, 
  ShoppingBag, 
  Users, 
  BarChart3, 
  Warehouse, 
  Heart,
  Star,
  TrendingUp,
  Zap,
  Sparkles
} from "lucide-react";
import { CommandPalette } from "@/components/CommandPalette";
import { FloatingDock } from "@/components/FloatingDock";
import { TileNavigation } from "@/components/TileNavigation";
import { FloatingNotifications } from "@/components/FloatingNotifications";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const navigationTiles = [
    {
      title: "Analytics",
      description: "Business intelligence & insights",
      icon: BarChart3,
      gradient: "bg-gradient-to-br from-blue-500/20 to-cyan-500/20",
      size: "wide" as const,
      stats: [
        { label: "Revenue", value: "₹847K", trend: "+12.5%" },
        { label: "Conversion", value: "3.24%" },
        { label: "Page Views", value: "284K" },
        { label: "Bounce Rate", value: "2.4%" }
      ],
      delay: 0,
      onClick: () => navigate("/analytics"),
    },
    {
      title: "Orders",
      description: "Track and manage all orders",
      icon: ShoppingBag,
      gradient: "bg-gradient-to-br from-emerald-500/20 to-teal-500/20",
      size: "medium" as const,
      stats: [
        { label: "Today's Orders", value: "89", trend: "+12%" },
        { label: "Processing", value: "34" },
        { label: "Shipped", value: "156" }
      ],
      delay: 100,
      onClick: () => navigate("/orders"),
    },
    {
      title: "Products",
      description: "Manage your entire product catalog",
      icon: Package,
      gradient: "bg-gradient-to-br from-purple-500/20 to-pink-500/20",
      size: "large" as const,
      stats: [
        { label: "Total Products", value: "12,847", trend: "+156" },
        { label: "Categories", value: "24" },
        { label: "Low Stock", value: "23", trend: "-12" },
        { label: "Best Seller", value: "iPhone 15" }
      ],
      delay: 200,
      onClick: () => navigate("/products"),
    },
    {
      title: "Customers",
      description: "Customer relationship management",
      icon: Users,
      gradient: "bg-gradient-to-br from-orange-500/20 to-red-500/20",
      size: "medium" as const,
      stats: [
        { label: "Total Customers", value: "45,231", trend: "+8.2%" },
        { label: "New Today", value: "12" },
        { label: "VIP Members", value: "1,847" }
      ],
      delay: 300,
      onClick: () => navigate("/customers"),
    },
    // {
    //   title: "Inventory",
    //   description: "Stock management & logistics",
    //   icon: Warehouse,
    //   gradient: "bg-gradient-to-br from-violet-500/20 to-purple-500/20",
    //   size: "small" as const,
    //   stats: [
    //     { label: "Items in Stock", value: "98.2%" },
    //     { label: "Warehouses", value: "8" }
    //   ],
    //   delay: 400
    // },
    // {
    //   title: "Reviews",
    //   description: "Customer feedback management",
    //   icon: Star,
    //   gradient: "bg-gradient-to-br from-yellow-500/20 to-orange-500/20",
    //   size: "small" as const,
    //   stats: [
    //     { label: "Average Rating", value: "4.8★" },
    //     { label: "New Reviews", value: "67" }
    //   ],
    //   delay: 500
    // },
    // {
    //   title: "Wishlist",
    //   description: "Customer preferences & trends",
    //   icon: Heart,
    //   gradient: "bg-gradient-to-br from-pink-500/20 to-rose-500/20",
    //   size: "small" as const,
    //   stats: [
    //     { label: "Items Added", value: "1,249" },
    //     { label: "Conversion", value: "23%" }
    //   ],
    //   delay: 600
    // },
    // {
    //   title: "Performance",
    //   description: "Real-time system metrics",
    //   icon: TrendingUp,
    //   gradient: "bg-gradient-to-br from-green-500/20 to-emerald-500/20",
    //   size: "small" as const,
    //   stats: [
    //     { label: "Uptime", value: "99.9%" },
    //     { label: "Response", value: "1.2ms" }
    //   ],
    //   delay: 700
    // }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-coral-500/5" />
      <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-coral/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "3s" }} />

      {/* Command Palette */}
      <CommandPalette />

      {/* Floating Notifications */}
      <FloatingNotifications />

      {/* Main Content Area */}
      <main className="pt-20 pb-20 sm:pb-32 px-4 sm:px-6">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto mb-8 sm:mb-12">
          <div className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-8 text-center animate-slide-in-up">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
              <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-primary animate-pulse" />
              <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                EcoAdmin Dashboard
              </h1>
              <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-accent animate-bounce" />
            </div>
            <p className="text-base sm:text-xl text-muted-foreground mb-4 sm:mb-6">
              Revolutionary command-driven ecommerce management
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>All systems operational</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span>Real-time sync active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                <span>AI insights enabled</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tiles Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            {navigationTiles.map((tile, index) => (
              <TileNavigation
                key={tile.title}
                {...tile}
                onClick={tile.onClick}
              />
            ))}
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="max-w-7xl mx-auto mt-8 sm:mt-12">
          <div className="glass rounded-2xl p-4 sm:p-6 animate-slide-in-up" style={{ animationDelay: "800ms" }}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 text-center">
              <div className="space-y-1">
                <p className="text-2xl font-bold text-primary">₹2.8M</p>
                <p className="text-xs text-muted-foreground">Monthly Revenue</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-emerald-500">98.7%</p>
                <p className="text-xs text-muted-foreground">Uptime</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-orange-500">1,249</p>
                <p className="text-xs text-muted-foreground">Active Orders</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-blue-500">45K</p>
                <p className="text-xs text-muted-foreground">Customers</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-purple-500">4.8★</p>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-pink-500">89%</p>
                <p className="text-xs text-muted-foreground">Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Dock */}
      <FloatingDock />
    </div>
  );
};

export default Index;
