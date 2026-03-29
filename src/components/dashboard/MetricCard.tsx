import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    positive: boolean;
  };
  variant?: "default" | "eco" | "solar" | "ai" | "alert";
}

export function MetricCard({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  variant = "default",
}: MetricCardProps) {
  const variantStyles = {
    default: "border-border",
    eco: "border-eco-green/30 bg-eco-green/5",
    solar: "border-solar-amber/30 bg-solar-amber/5",
    ai: "border-ai-cyan/30 bg-ai-cyan/5",
    alert: "border-alert-red/30 bg-alert-red/5",
  };

  const iconStyles = {
    default: "text-muted-foreground bg-secondary",
    eco: "text-eco-green bg-eco-green/10",
    solar: "text-solar-amber bg-solar-amber/10",
    ai: "text-ai-cyan bg-ai-cyan/10",
    alert: "text-alert-red bg-alert-red/10",
  };

  return (
    <div className={cn("card-surface p-4 border", variantStyles[variant])}>
      <div className="flex items-start justify-between">
        <div className={cn("p-2 rounded-lg", iconStyles[variant])}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span
            className={cn(
              "text-xs font-mono px-2 py-1 rounded-full",
              trend.positive
                ? "text-eco-green bg-eco-green/10"
                : "text-alert-red bg-alert-red/10"
            )}
          >
            {trend.positive ? "+" : ""}{trend.value}%
          </span>
        )}
      </div>
      <div className="mt-3">
        <div className="flex items-baseline gap-1">
          <span className="font-mono text-2xl font-bold text-foreground">{value}</span>
          {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
        </div>
        <p className="text-sm text-muted-foreground mt-1">{title}</p>
      </div>
    </div>
  );
}
