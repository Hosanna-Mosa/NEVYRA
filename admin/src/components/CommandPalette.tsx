import { useState, useEffect } from "react";
import { Search, Command, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  action: () => void;
}

const quickActions: QuickAction[] = [
  {
    id: "new-product",
    title: "Add New Product",
    description: "Create a new product listing",
    icon: "📦",
    category: "Products",
    action: () => console.log("Add product")
  },
  {
    id: "view-orders",
    title: "View Orders",
    description: "Check recent orders and shipments",
    icon: "🛍️",
    category: "Orders",
    action: () => console.log("View orders")
  },
  {
    id: "customer-support",
    title: "Customer Support",
    description: "Handle customer inquiries",
    icon: "💬",
    category: "Support",
    action: () => console.log("Customer support")
  },
  {
    id: "analytics",
    title: "View Analytics",
    description: "Check performance metrics",
    icon: "📊",
    category: "Analytics",
    action: () => console.log("Analytics")
  }
];

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isOpen]);

  const filteredActions = quickActions.filter(action =>
    action.title.toLowerCase().includes(search.toLowerCase()) ||
    action.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Command Trigger */}
      <Button
        onClick={() => setIsOpen(true)}
        variant="glass"
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 min-w-96 justify-between hover-lift"
      >
        <div className="flex items-center gap-3">
          <Search className="h-4 w-4" />
          <span className="text-muted-foreground">Search anything...</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Command className="h-3 w-3" />
          <span>K</span>
        </div>
      </Button>

      {/* Command Palette Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl">
            <div className="glass rounded-2xl border-0 p-4 animate-scale-in">
              {/* Search Input */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Type to search actions, products, customers..."
                  className="pl-10 pr-4 py-3 text-lg glass border-0 focus:ring-2 focus:ring-primary/20"
                  autoFocus
                />
              </div>

              {/* Quick Actions */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredActions.map((action, index) => (
                  <button
                    key={action.id}
                    onClick={() => {
                      action.action();
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-xl transition-smooth hover:bg-primary/10 text-left group",
                      "animate-slide-in-up"
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="text-2xl">{action.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium text-foreground group-hover:text-primary">
                        {action.title}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {action.description}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground px-2 py-1 rounded-md bg-muted/50">
                      {action.category}
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-smooth" />
                  </button>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-border/20 text-center">
                <p className="text-xs text-muted-foreground">
                  Press <kbd className="px-2 py-1 bg-muted rounded text-foreground">ESC</kbd> to close
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}