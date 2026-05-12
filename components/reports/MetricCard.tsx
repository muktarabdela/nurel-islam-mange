import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  trend?: {
    value: string;
    direction: "up" | "down";
  };
}

export default function MetricCard({ title, value, subtitle, trend }: MetricCardProps) {
  return (
    <Card className="flex-1 flex flex-col justify-center">
      <CardContent className="p-6">
        <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
        <div className="flex items-baseline gap-2">
          <h2 className="text-4xl font-bold">{value}</h2>
          {trend && (
            <span 
              className={`text-sm flex items-center px-2 py-0.5 rounded-full ${
                trend.direction === "up" 
                  ? "text-green-600 bg-green-50" 
                  : "text-red-600 bg-red-50"
              }`}
            >
              {trend.direction === "up" ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {trend.value}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {subtitle}
        </p>
      </CardContent>
    </Card>
  );
}
