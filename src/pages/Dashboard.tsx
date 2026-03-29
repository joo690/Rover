import { SystemGauge } from "@/components/dashboard/SystemGauge";
import { LiveCounter } from "@/components/dashboard/LiveCounter";
import { AlertsFeed } from "@/components/dashboard/AlertsFeed";
import { ModeSelector } from "@/components/dashboard/ModeSelector";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { MiniMap } from "@/components/dashboard/MiniMap";
import { BinLevelsCompact } from "@/components/dashboard/BinLevelsCompact";
import { EnergyMini } from "@/components/dashboard/EnergyMini";
import { Eye, Cpu, Thermometer, Timer, Navigation, Zap } from "lucide-react";
import { useRealtimeData } from "@/hooks/useFirebaseData";
import { useConfiguredData } from "@/hooks/useConfiguredData";
import { DB_PATHS } from "@/services/firebaseService";
import type { DashboardData } from "@/services/firebaseService";
import { useLanguage } from "@/i18n/LanguageContext";
import { defaultStaticConfig } from "@/config/dashboardConfig";

const defaultDashboard: DashboardData = defaultStaticConfig.dashboard;

export default function Dashboard() {
  const { t } = useLanguage();
  const [liveDashboardData] = useRealtimeData<DashboardData>(DB_PATHS.DASHBOARD, defaultDashboard);
  const dashboardData = useConfiguredData<DashboardData>("dashboard", liveDashboardData);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t.dashboard.title}</h1>
          <p className="text-muted-foreground">{t.dashboard.subtitle}</p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-eco-green/10 border border-eco-green/30">
          <div className="w-2 h-2 rounded-full bg-eco-green animate-pulse" />
          <span className="text-sm font-medium text-eco-green">{t.dashboard.allSystemsNominal}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <div className="card-eco p-6 h-full flex flex-col items-center justify-center">
            <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
              {t.dashboard.systemReadiness}
            </h3>
            <SystemGauge value={dashboardData.systemReadiness} label={t.dashboard.operational} size={200} />
            <div className="grid grid-cols-3 gap-4 mt-6 w-full">
              <div className="text-center">
                <p className="font-mono text-lg font-bold text-eco-green">{dashboardData.motors}%</p>
                <span className="text-xs text-muted-foreground">{t.dashboard.motors}</span>
              </div>
              <div className="text-center">
                <p className="font-mono text-lg font-bold text-ai-cyan">{dashboardData.ai}%</p>
                <span className="text-xs text-muted-foreground">{t.dashboard.ai}</span>
              </div>
              <div className="text-center">
                <p className="font-mono text-lg font-bold text-solar-amber">{dashboardData.power}%</p>
                <span className="text-xs text-muted-foreground">{t.dashboard.power}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <LiveCounter initialValue={dashboardData.wasteItemsCollected} label={t.dashboard.wasteItemsCollected} />
          <ModeSelector />
        </div>

        <div className="lg:col-span-4">
          <AlertsFeed />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard title={t.dashboard.detectionRate} value={dashboardData.detectionRate.toFixed(1)} unit="%" icon={Eye} variant="ai" />
        <MetricCard title={t.dashboard.cpuLoad} value={dashboardData.cpuLoad.toString()} unit="%" icon={Cpu} variant="default" />
        <MetricCard title={t.dashboard.temperature} value={dashboardData.temperature.toString()} unit="°C" icon={Thermometer} variant="solar" />
        <MetricCard title={t.dashboard.uptime} value={dashboardData.uptime.toFixed(1)} unit={t.common.hours} icon={Timer} variant="eco" />
        <MetricCard title={t.dashboard.distance} value={dashboardData.distance.toString()} unit="m" icon={Navigation} variant="default" />
        <MetricCard title={t.dashboard.powerOutput} value={`+${dashboardData.powerOutput}`} unit="W" icon={Zap} variant="eco" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MiniMap />
        <BinLevelsCompact />
        <EnergyMini />
      </div>
    </div>
  );
}
