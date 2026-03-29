import { useMemo, useState, useEffect } from "react";
import { Sun, Battery, Zap, Thermometer, TrendingUp, Clock } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { useRealtimeData } from "@/hooks/useFirebaseData";
import { useConfiguredData } from "@/hooks/useConfiguredData";
import { DB_PATHS } from "@/services/firebaseService";
import type { EnergyData } from "@/services/firebaseService";
import { useLanguage } from "@/i18n/LanguageContext";
import { useTranslateThermalLabel, useTranslateStatus } from "@/i18n/dataTranslations";
import { defaultStaticConfig } from "@/config/dashboardConfig";

const defaultEnergy: EnergyData = defaultStaticConfig.energy;

export default function Energy() {
  const { t, language } = useLanguage();
  const translateThermalLabel = useTranslateThermalLabel();
  const translateStatus = useTranslateStatus();
  const [liveEnergyData] = useRealtimeData<EnergyData>(DB_PATHS.ENERGY, defaultEnergy);
  const energyData = useConfiguredData<EnergyData>("energy", liveEnergyData);

  const batteryLevel = energyData.batteryLevel;
  const isCharging = energyData.isCharging;
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  useEffect(() => {
    setUpdateTrigger((prev) => prev + 1);
  }, [energyData.solarInput, energyData.consumption, energyData.batteryLevel]);

  const solarHistoryData = useMemo(() => {
    const history = energyData.solarHistory ? [...energyData.solarHistory] : [];
    const currentTime = `${getCurrentTime()}-${updateTrigger}`;
    return [
      ...history.map((item) => ({ ...item })),
      {
        time: currentTime,
        production: energyData.solarInput || 0,
        consumption: energyData.consumption || 0,
      },
    ];
  }, [energyData.solarHistory, energyData.solarInput, energyData.consumption, updateTrigger]);

  const batteryHistoryData = useMemo(() => {
    const history = energyData.batteryHistory ? [...energyData.batteryHistory] : [];
    const currentTime = `${getCurrentTime()}-${updateTrigger}`;
    const currentDataPoint = { time: currentTime, level: energyData.batteryLevel || 0 };

    if (history.length > 0) {
      history[history.length - 1] = { ...currentDataPoint };
    } else {
      history.push({ ...currentDataPoint });
    }

    return history.map((item) => ({ ...item }));
  }, [energyData.batteryHistory, energyData.batteryLevel, updateTrigger]);

  const solarChartKey = useMemo(() => `solar-${energyData.solarInput}-${energyData.consumption}-${updateTrigger}`, [energyData.solarInput, energyData.consumption, updateTrigger]);
  const batteryChartKey = useMemo(() => `battery-${energyData.batteryLevel}-${updateTrigger}`, [energyData.batteryLevel, updateTrigger]);

  const translatedThermalMap = useMemo(
    () => energyData.thermalMap.map((item) => ({ ...item, label: translateThermalLabel(item.label), status: translateStatus(item.status) })),
    [energyData.thermalMap, translateThermalLabel, translateStatus, language],
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t.energy.title}</h1>
        <p className="text-muted-foreground">{t.energy.subtitle}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title={t.energy.solarInput} value={energyData.solarInput.toString()} unit="W" icon={Sun} variant="solar" />
        <MetricCard title={t.energy.consumption} value={energyData.consumption.toString()} unit="W" icon={Zap} variant="ai" />
        <MetricCard title={t.energy.netPower} value={`+${energyData.netPower}`} unit="W" icon={TrendingUp} variant="eco" />
        <MetricCard title={t.energy.batteryTemp} value={energyData.batteryTemp.toString()} unit="°C" icon={Thermometer} variant="default" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-surface p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">{t.energy.solarProduction}</h3>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-solar-amber" /><span className="text-muted-foreground">{t.energy.solarInput}</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-ai-cyan" /><span className="text-muted-foreground">{t.energy.consumption}</span></div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart key={solarChartKey} data={solarHistoryData}>
                <defs>
                  <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(38 92% 50%)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(38 92% 50%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="consumeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(186 94% 42%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(186 94% 42%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                <Area type="monotone" dataKey="production" stroke="hsl(38 92% 50%)" fill="url(#solarGradient)" strokeWidth={2} />
                <Area type="monotone" dataKey="consumption" stroke="hsl(186 94% 42%)" fill="url(#consumeGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-surface p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">{t.energy.batteryStatus}</h3>
            <div className="flex items-center gap-2 text-xs">
              <div className={`w-2 h-2 rounded-full ${isCharging ? "bg-eco-green animate-pulse" : "bg-muted-foreground"}`} />
              <span className="text-muted-foreground">{isCharging ? t.common.charging : t.common.connected}</span>
            </div>
          </div>
          <div className="grid grid-cols-[140px,1fr] gap-6 items-center">
            <div className="relative w-32 h-48 mx-auto">
              <div className="absolute inset-0 rounded-2xl border-4 border-border bg-secondary/40" />
              <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-10 h-3 rounded-t-lg bg-border" />
              <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-secondary overflow-hidden" style={{ top: `${Math.max(0, 100 - batteryLevel)}%` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-eco-green to-eco-green-glow" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <Battery className="w-10 h-10 text-foreground mb-2" />
                <span className="font-mono text-3xl font-bold text-foreground">{batteryLevel}%</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart key={batteryChartKey} data={batteryHistoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                    <Line type="monotone" dataKey="level" stroke="hsl(var(--eco-green))" strokeWidth={3} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card-surface p-6 lg:col-span-2">
          <h3 className="font-semibold text-foreground mb-4">{t.energy.thermalHeatmap}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {translatedThermalMap.map((item) => (
              <div key={`${item.label}-${item.temp}`} className="p-4 rounded-xl border border-border bg-secondary/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground">{item.label}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-secondary border border-border text-muted-foreground">{item.status}</span>
                </div>
                <div className="flex items-end justify-between gap-4">
                  <span className="font-mono text-3xl font-bold text-foreground">{item.temp}°C</span>
                  <div className="flex-1 h-3 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-eco-green via-solar-amber to-alert-red" style={{ width: `${Math.min(100, Math.max(0, item.temp))}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <MetricCard title={t.energy.hoursOfAutonomy} value={energyData.autonomy.toFixed(1)} unit={t.common.hours} icon={Clock} variant="eco" />
          <MetricCard title={t.energy.kWhGeneratedToday} value={energyData.generatedToday.toFixed(1)} unit="kWh" icon={Sun} variant="solar" />
          <MetricCard title={t.energy.kWhConsumedToday} value={energyData.consumedToday.toFixed(1)} unit="kWh" icon={Zap} variant="ai" />
        </div>
      </div>
    </div>
  );
}
