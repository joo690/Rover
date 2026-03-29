import { useEffect, useState } from "react";
import { Trash2, TrendingUp } from "lucide-react";

interface LiveCounterProps {
  initialValue?: number;
  label: string;
  icon?: "trash" | "trend";
}

export function LiveCounter({ initialValue = 0, label, icon = "trash" }: LiveCounterProps) {
  const [count, setCount] = useState(initialValue);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Sync with the latest value from props (Firebase-driven)
    setIsAnimating(true);
    setCount(initialValue);
    const timeout = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timeout);
  }, [initialValue]);

  const IconComponent = icon === "trash" ? Trash2 : TrendingUp;

  return (
    <div className="card-surface p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-eco opacity-5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl bg-eco-green/10 border border-eco-green/20">
          <IconComponent className="w-6 h-6 text-eco-green" />
        </div>
      </div>

      <div className="space-y-2">
        <div
          className={`font-mono text-5xl font-bold text-foreground transition-all duration-300 ${
            isAnimating ? "scale-105 text-eco-green" : ""
          }`}
        >
          {count.toLocaleString()}
        </div>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>

      {isAnimating && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-eco animate-pulse" />
      )}
    </div>
  );
}
