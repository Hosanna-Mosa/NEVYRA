import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface NavigationTileProps {
  title: string;
  description: string;
  icon: LucideIcon;
  stats: { label: string; value: string; trend?: string }[];
  gradient: string;
  size?: "small" | "medium" | "large" | "wide";
  onClick?: () => void;
  delay?: number;
}

export function NavigationTile({
  title,
  description,
  icon: Icon,
  stats,
  gradient,
  size = "medium",
  onClick,
  delay = 0
}: NavigationTileProps) {
  return (
    <Card 
      className="glass border-0 overflow-hidden cursor-pointer group transition-smooth hover-lift animate-scale-in w-full"
      onClick={onClick}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={cn("absolute inset-0 opacity-10 group-hover:opacity-20 transition-smooth", gradient)} />
      
      <CardContent className="relative p-4 sm:p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-1 flex-1">
            <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-smooth">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>
          </div>
          <div className={cn(
            "p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-smooth group-hover:scale-110 ml-2",
            "bg-white/10 backdrop-blur-sm flex-shrink-0"
          )}>
            <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 flex-1">
          {stats.map((stat, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-baseline gap-1 sm:gap-2">
                <p className="text-lg sm:text-2xl font-bold text-foreground">{stat.value}</p>
                {stat.trend && (
                  <span className={cn(
                    "text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium",
                    stat.trend.startsWith('+') 
                      ? "bg-green-100 text-green-700" 
                      : "bg-red-100 text-red-700"
                  )}>
                    {stat.trend}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Hover indicator */}
        <div className="mt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-smooth">
          <span className="text-sm font-medium text-primary">Manage {title}</span>
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-primary text-sm">→</span>
          </div>
        </div>
      </CardContent>

      {/* Floating decorations */}
      <div className="absolute top-6 right-6 w-2 h-2 rounded-full bg-primary/40 float" />
      <div className="absolute bottom-6 left-6 w-1 h-1 rounded-full bg-accent/60 float-delayed" />
    </Card>
  );
}

export { NavigationTile as TileNavigation };