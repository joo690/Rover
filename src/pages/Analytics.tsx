import { useMemo } from "react";
import { Brain, TrendingUp, Clock, MapPin } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useRealtimeData } from "@/hooks/useFirebaseData";
import { useConfiguredData } from "@/hooks/useConfiguredData";
import { DB_PATHS } from "@/services/firebaseService";
import type { AnalyticsData } from "@/services/firebaseService";
import { useTranslateZone } from "@/i18n/dataTranslations";
import { cloneChartData, chartKeyFromData } from "@/lib/chartData";
import { defaultStaticConfig, type AnalyticsExtras } from "@/config/dashboardConfig";

const defaultAnalytics: AnalyticsData = defaultStaticConfig.analytics;
const defaultAnalyticsExtras: AnalyticsExtras = defaultStaticConfig.analyticsExtras;

export default function Analytics() {
  const translateZone = useTranslateZone();
  const [liveAnalyticsData] = useRealtimeData<AnalyticsData>(DB_PATHS.ANALYTICS, defaultAnalytics);
  const analyticsData = useConfiguredData<AnalyticsData>("analytics", liveAnalyticsData);
  const analyticsExtras = useConfiguredData<AnalyticsExtras>("analyticsExtras", defaultAnalyticsExtras);

  const zonalData = useMemo(() => analyticsData.zonalData.map((item) => ({ ...item, zone: translateZone(item.zone) })), [analyticsData.zonalData, translateZone]);
  const peakTimeData = analyticsData.peakTimeData;
  const zonalChartData = useMemo(() => cloneChartData(zonalData), [zonalData]);
  const peakChartData = useMemo(() => cloneChartData(peakTimeData), [peakTimeData]);
  const zonalChartKey = useMemo(() => chartKeyFromData(zonalChartData, "analytics-zonal"), [zonalChartData]);
  const peakChartKey = useMemo(() => chartKeyFromData(peakChartData, "analytics-peak"), [peakChartData]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Waste Intelligence</h1>
        <p className="text-muted-foreground">Behavioral analytics and pattern detection</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="Peak Activity" value={analyticsExtras.peakActivityValue} unit={analyticsExtras.peakActivityUnit} icon={Clock} variant="solar" />
        <MetricCard title="Hotspot Zone" value={analyticsExtras.hotspotZone} unit="" icon={MapPin} variant="alert" />
        <MetricCard title="Pattern Match" value={analyticsExtras.patternMatch.toString()} unit="%" icon={Brain} variant="ai" />
        <MetricCard title="Trend Score" value={`+${analyticsExtras.trendScore}`} unit="%" icon={TrendingUp} variant="eco" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-surface p-6">
          <h3 className="font-semibold text-foreground mb-4">Zonal Pollution Radar</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart key={zonalChartKey} data={zonalChartData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="zone" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <PolarRadiusAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <Radar name="Pollution Level" dataKey="pollution" stroke="hsl(var(--alert-red))" fill="hsl(var(--alert-red))" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-surface p-6">
          <h3 className="font-semibold text-foreground mb-4">Peak-Time Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart key={peakChartKey} data={peakChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                <Bar dataKey="count" fill="hsl(186 94% 42%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card-eco p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-ai-cyan/10 border border-ai-cyan/20">
            <Brain className="w-8 h-8 text-ai-cyan" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-2">AI-Generated Insights</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              {analyticsExtras.insights.map((insight, index) => (
                <p key={`${insight}-${index}`} className="flex items-start gap-2">
                  <span className={index % 3 === 0 ? "text-eco-green" : index % 3 === 1 ? "text-solar-amber" : "text-ai-cyan"}>▸</span>
                  {insight}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
