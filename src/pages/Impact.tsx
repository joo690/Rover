import { Leaf, TreeDeciduous, Recycle, TrendingUp, Cloud, DollarSign } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useMemo } from "react";
import { useRealtimeData } from "@/hooks/useFirebaseData";
import { useConfiguredData } from "@/hooks/useConfiguredData";
import { DB_PATHS } from "@/services/firebaseService";
import type { ImpactData } from "@/services/firebaseService";
import { cloneChartData, chartKeyFromData } from "@/lib/chartData";
import { defaultStaticConfig } from "@/config/dashboardConfig";

const defaultImpact: ImpactData = defaultStaticConfig.impact;

export default function Impact() {
  const [liveImpactData] = useRealtimeData<ImpactData>(DB_PATHS.IMPACT, defaultImpact);
  const impactData = useConfiguredData<ImpactData>("impact", liveImpactData);

  const weeklyData = useMemo(() => cloneChartData(impactData.weeklyCo2Savings), [impactData.weeklyCo2Savings]);
  const weeklyChartKey = useMemo(() => chartKeyFromData(weeklyData, "impact-weekly"), [weeklyData]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Environmental Impact</h1>
        <p className="text-muted-foreground">Measuring ecological value and sustainability</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-eco p-6 text-center">
          <div className="inline-flex p-4 rounded-full bg-eco-green/10 border border-eco-green/20 mb-4"><Cloud className="w-10 h-10 text-eco-green" /></div>
          <div className="space-y-1">
            <p className="font-mono text-4xl font-bold text-foreground">{impactData.monthlyCo2SavedKg}</p>
            <p className="text-lg text-eco-green">kg CO₂ Saved</p>
            <span className="text-sm text-muted-foreground">This month</span>
          </div>
        </div>

        <div className="card-surface p-6 text-center border border-eco-green/20">
          <div className="inline-flex p-4 rounded-full bg-eco-green/10 border border-eco-green/20 mb-4"><TreeDeciduous className="w-10 h-10 text-eco-green" /></div>
          <div className="space-y-1">
            <p className="font-mono text-4xl font-bold text-foreground">{impactData.treesEquivalent}</p>
            <p className="text-lg text-eco-green">Trees Equivalent</p>
            <span className="text-sm text-muted-foreground">Carbon offset</span>
          </div>
        </div>

        <div className="card-surface p-6 text-center border border-solar-amber/20">
          <div className="inline-flex p-4 rounded-full bg-solar-amber/10 border border-solar-amber/20 mb-4"><DollarSign className="w-10 h-10 text-solar-amber" /></div>
          <div className="space-y-1">
            <p className="font-mono text-4xl font-bold text-foreground">${impactData.recyclableValueUsd}</p>
            <p className="text-lg text-solar-amber">Recyclable Value</p>
            <span className="text-sm text-muted-foreground">Market estimate</span>
          </div>
        </div>
      </div>

      <div className="card-surface p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Weekly CO₂ Savings</h3>
          <div className="flex items-center gap-2 text-xs"><div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-eco-green" /><span className="text-muted-foreground">kg CO₂</span></div></div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart key={weeklyChartKey} data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
              <Bar dataKey="co2" fill="hsl(142 71% 45%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="Sorting Success" value={impactData.sortingSuccessRate.toString()} unit="%" icon={Recycle} variant="eco" />
        <MetricCard title="Items Recycled" value={impactData.itemsRecycled.toLocaleString()} unit="" icon={Leaf} variant="eco" />
        <MetricCard title="Area Cleaned" value={impactData.areaCleanedKm2.toString()} unit="km²" icon={TrendingUp} variant="default" />
        <MetricCard title="Efficiency Rate" value={impactData.efficiencyRate.toString()} unit="%" icon={TrendingUp} variant="ai" />
      </div>

      <div className="card-surface p-6">
        <h3 className="font-semibold text-foreground mb-4">Clean Area Restoration</h3>
        <div className="relative h-8 rounded-full bg-secondary overflow-hidden">
          <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-eco-green to-eco-green-glow rounded-full transition-all duration-1000" style={{ width: `${impactData.targetZoneClearedPct}%` }} />
          <div className="absolute inset-0 flex items-center justify-center"><span className="font-mono text-sm font-bold text-foreground">{impactData.targetZoneClearedPct}% of Target Zone Cleared</span></div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>0 m²</span>
          <span>Target: {impactData.targetZoneAreaM2.toLocaleString()} m²</span>
        </div>
      </div>
    </div>
  );
}
