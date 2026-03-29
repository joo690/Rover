import { useMemo } from "react";
import { Eye, Camera, Target, CheckCircle } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useRealtimeData } from "@/hooks/useFirebaseData";
import { useConfiguredData } from "@/hooks/useConfiguredData";
import { DB_PATHS } from "@/services/firebaseService";
import type { VisionData } from "@/services/firebaseService";
import { useLanguage } from "@/i18n/LanguageContext";
import { useTranslateWasteType, useTranslateDetectionType } from "@/i18n/dataTranslations";
import { cloneChartData, chartKeyFromData } from "@/lib/chartData";
import { defaultStaticConfig } from "@/config/dashboardConfig";

const defaultVision: VisionData = defaultStaticConfig.vision;

export default function Vision() {
  const { language } = useLanguage();
  const translateWasteType = useTranslateWasteType();
  const translateDetectionType = useTranslateDetectionType();
  const [liveVisionData] = useRealtimeData<VisionData>(DB_PATHS.VISION, defaultVision);
  const visionData = useConfiguredData<VisionData>("vision", liveVisionData);

  const wasteTypeData = useMemo(
    () => visionData.wasteTypeDistribution.map((item) => ({ ...item, name: translateWasteType(item.name) })),
    [visionData.wasteTypeDistribution, translateWasteType, language],
  );

  const wasteTypeChartData = useMemo(() => cloneChartData(wasteTypeData), [wasteTypeData]);
  const wasteTypeChartKey = useMemo(() => chartKeyFromData(wasteTypeChartData, "vision-waste"), [wasteTypeChartData]);

  const recentDetections = useMemo(
    () => visionData.recentDetections.slice(0, 5).map((detection) => ({ ...detection, type: translateDetectionType(detection.type) })),
    [visionData.recentDetections, translateDetectionType, language],
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Vision & AI Recognition</h1>
        <p className="text-muted-foreground">Live detection and classification analytics</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="Detection Rate" value={visionData.accuracy.toFixed(1)} unit="%" icon={Eye} variant="ai" />
        <MetricCard title="Objects Today" value={visionData.totalDetections.toLocaleString()} unit="" icon={Target} variant="eco" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card-surface p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-ai-cyan" />
                <h3 className="font-semibold text-foreground">Live Vision Feed</h3>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-alert-red animate-pulse" />
                <span className="text-xs text-muted-foreground">LIVE</span>
              </div>
            </div>

            <div className="relative aspect-video rounded-lg overflow-hidden bg-surface-elevated border border-border flex items-center justify-center">
              <div className="absolute top-2 left-2 z-10">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-alert-red text-primary-foreground text-xs font-semibold shadow">
                  <span className="w-2 h-2 rounded-full bg-alert-red animate-pulse mr-1" />
                  LIVE
                </span>
              </div>
              <img src="http://127.0.0.1:8081/annotated" alt="Live Vision Feed" className="w-full h-auto rounded-lg" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card-surface p-4">
            <h3 className="font-semibold text-foreground mb-4">AI Confidence</h3>
            <div className="flex items-center justify-center">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" opacity="0.3" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--ai-cyan))" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={`${251.2 - (251.2 * visionData.accuracy) / 100}`} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 10px hsl(var(--ai-cyan) / 0.5))" }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-mono text-2xl font-bold text-foreground">{visionData.accuracy.toFixed(0)}%</span>
                  <span className="text-xs text-muted-foreground">Avg</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card-surface p-4">
            <h3 className="font-semibold text-foreground mb-4">Waste Distribution</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart key={wasteTypeChartKey}>
                  <Pie data={wasteTypeChartData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={4} dataKey="value">
                    {wasteTypeChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {wasteTypeData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="font-mono text-foreground ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card-surface p-6">
        <h3 className="font-semibold text-foreground mb-4">Last 5 Detected Objects</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {recentDetections.map((detection) => (
            <div key={detection.id} className="p-4 rounded-lg bg-secondary/50 border border-border hover:border-ai-cyan/30 transition-colors">
              <div className="aspect-square rounded-lg bg-surface-elevated mb-3 flex items-center justify-center border border-border">
                <Target className="w-8 h-8 text-ai-cyan/50" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{detection.type}</span>
                  <CheckCircle className="w-4 h-4 text-eco-green" />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{detection.time}</span>
                  <span className="font-mono text-ai-cyan">{detection.confidence}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
