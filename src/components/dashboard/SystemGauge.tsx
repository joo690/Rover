import { useEffect, useState } from "react";

interface SystemGaugeProps {
  value: number;
  label: string;
  size?: number;
}

export function SystemGauge({ value, label, size = 180 }: SystemGaugeProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(value), 100);
    return () => clearTimeout(timer);
  }, [value]);

  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedValue / 100) * circumference;

  const getColor = () => {
    if (animatedValue >= 80) return "hsl(var(--eco-green))";
    if (animatedValue >= 50) return "hsl(var(--solar-amber))";
    return "hsl(var(--alert-red))";
  };

  const getGlowColor = () => {
    if (animatedValue >= 80) return "hsl(var(--eco-green) / 0.4)";
    if (animatedValue >= 50) return "hsl(var(--solar-amber) / 0.4)";
    return "hsl(var(--alert-red) / 0.4)";
  };

  return (
    <div className="relative flex flex-col items-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        style={{ filter: `drop-shadow(0 0 20px ${getGlowColor()})` }}
      >
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          opacity={0.3}
        />
        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="gauge-ring"
          strokeLinecap="round"
        />
        {/* Inner glow ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius - 20}
          fill="none"
          stroke={getColor()}
          strokeWidth={2}
          opacity={0.3}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-4xl font-bold text-foreground">
          {Math.round(animatedValue)}%
        </span>
        <span className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
          {label}
        </span>
      </div>
    </div>
  );
}
