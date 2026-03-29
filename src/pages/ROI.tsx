import { TrendingUp, Zap, Sun, DollarSign, Leaf, Clock } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";

export default function ROI() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Technical ROI & Sustainability</h1>
        <p className="text-muted-foreground">Zero-cost operation proof and efficiency metrics</p>
      </div>

      {/* Hero metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-eco p-6 text-center">
          <Zap className="w-10 h-10 text-eco-green mx-auto mb-3" />
          <p className="font-mono text-4xl font-bold text-foreground">0.12</p>
          <p className="text-lg text-eco-green">kWh per kg</p>
          <span className="text-sm text-muted-foreground">Energy per collected waste</span>
        </div>

        <div className="card-surface p-6 text-center border border-solar-amber/20">
          <Sun className="w-10 h-10 text-solar-amber mx-auto mb-3" />
          <p className="font-mono text-4xl font-bold text-foreground">∞</p>
          <p className="text-lg text-solar-amber">Solar Autonomy</p>
          <span className="text-sm text-muted-foreground">Self-sustaining operation</span>
        </div>

        <div className="card-surface p-6 text-center border border-eco-green/20">
          <Leaf className="w-10 h-10 text-eco-green mx-auto mb-3" />
          <p className="font-mono text-4xl font-bold text-foreground">124.5</p>
          <p className="text-lg text-eco-green">kg CO₂ Offset</p>
          <span className="text-sm text-muted-foreground">Monthly carbon savings</span>
        </div>
      </div>

      {/* Detailed metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Energy Efficiency"
          value="98"
          unit="%"
          icon={Zap}
          variant="eco"
        />
        <MetricCard
          title="Solar Surplus"
          value="+155"
          unit="W"
          icon={Sun}
          variant="solar"
        />
        <MetricCard
          title="Op. Cost"
          value="$0"
          unit="/day"
          icon={DollarSign}
          variant="eco"
        />
        <MetricCard
          title="Autonomy"
          value="8.5"
          unit="hrs"
          icon={Clock}
          variant="default"
        />
      </div>

      {/* Savings Calculator */}
      <div className="card-surface p-6">
        <h3 className="font-semibold text-foreground mb-4">Operational Savings Calculator</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Daily Energy Cost", value: "$0.00", saved: "$4.20" },
            { label: "Weekly Maintenance", value: "$0.00", saved: "$50.00" },
            { label: "Monthly Labor", value: "$0.00", saved: "$1,200" },
            { label: "Annual Savings", value: "-", saved: "$15,840" },
          ].map((item) => (
            <div key={item.label} className="p-4 rounded-lg bg-secondary/50 border border-border">
              <span className="text-xs text-muted-foreground">{item.label}</span>
              <p className="font-mono text-2xl font-bold text-foreground mt-1">{item.value}</p>
              <p className="text-sm text-eco-green mt-2">Saved: {item.saved}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Zero-cost proof */}
      <div className="card-eco p-6">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6 text-eco-green" />
          <h3 className="font-semibold text-foreground">Zero-Cost Operation Proof</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-eco-green/5 border border-eco-green/20">
            <h4 className="font-medium text-foreground mb-2">Energy Balance</h4>
            <p className="text-sm text-muted-foreground">
              Solar input exceeds consumption by 84%, ensuring 24/7 operation capability.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-eco-green/5 border border-eco-green/20">
            <h4 className="font-medium text-foreground mb-2">Maintenance-Free</h4>
            <p className="text-sm text-muted-foreground">
              Designed for 2,000+ hours of operation between service intervals.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-eco-green/5 border border-eco-green/20">
            <h4 className="font-medium text-foreground mb-2">ROI Timeline</h4>
            <p className="text-sm text-muted-foreground">
              Full cost recovery projected within 8 months of deployment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
