import { useState } from "react";
import { Bell, X, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "success" | "warning" | "info";
  title: string;
  message: string;
  time: string;
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "Order Completed",
    message: "Order #12847 has been successfully delivered",
    time: "2 min ago"
  },
  {
    id: "2", 
    type: "warning",
    title: "Low Stock Alert",
    message: "iPhone 15 Pro is running low on inventory",
    time: "5 min ago"
  },
  {
    id: "3",
    type: "info",
    title: "New Customer",
    message: "Sarah Johnson just created an account",
    time: "10 min ago"
  }
];

export function FloatingNotifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationList, setNotificationList] = useState(notifications);

  const removeNotification = (id: string) => {
    setNotificationList(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case "info": return <Info className="h-4 w-4 text-blue-500" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  return (
    <>
      {/* Notification Trigger */}
      <Button
        variant="glass"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-40 hover-lift relative"
      >
        <Bell className="h-5 w-5" />
        {notificationList.length > 0 && (
          <span className="absolute -top-2 -right-2 h-5 w-5 bg-gradient-coral text-white text-xs font-bold rounded-full flex items-center justify-center">
            {notificationList.length}
          </span>
        )}
      </Button>

      {/* Notifications Panel */}
      {isOpen && (
        <div className="fixed top-16 right-4 z-40 w-80 animate-slide-in-up">
          <div className="glass rounded-2xl border-0 p-4 max-h-96 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Notifications</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {notificationList.map((notification, index) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-3 rounded-xl bg-card/50 border border-border/20 group hover:bg-card/80 transition-smooth animate-scale-in"
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-3">
                    {getIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {notification.time}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeNotification(notification.id)}
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-smooth"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {notificationList.length === 0 && (
              <div className="text-center py-8">
                <Bell className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No new notifications</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}