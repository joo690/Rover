import { Shield, AlertOctagon, Wifi, Activity, Gauge, ThermometerSun } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRealtimeData } from "@/hooks/useFirebaseData";
import { useConfiguredData } from "@/hooks/useConfiguredData";
import { defaultStaticConfig, type SafetyConfig } from "@/config/dashboardConfig";

type SystemMetrics = {
  status?: string;
  networkActive?: boolean;
  uptimeHours?: number;
  cpuLoad?: number;
  wifiSignalDbm?: number;
  cloudLatencyMs?: number;
  packetLossPercent?: number;
  memory?: { percent?: number };
  storage?: { percent?: number };
};

const defaultSystemMetrics: SystemMetrics = {
  status: "offline",
  networkActive: false,
  uptimeHours: 0,
  cpuLoad: 0,
  wifiSignalDbm: 0,
  cloudLatencyMs: 0,
  packetLossPercent: 0,
  memory: { percent: 0 },
  storage: { percent: 0 },
};

export default function Safety() {
  const [systemMetrics] = useRealtimeData<SystemMetrics>("metrics/system", defaultSystemMetrics);

  const fallbackSafety: SafetyConfig = {
    ...defaultStaticConfig.safety,
    status: systemMetrics.status ?? defaultStaticConfig.safety.status,
    networkActive: systemMetrics.networkActive ?? defaultStaticConfig.safety.networkActive,
    uptimeHours: systemMetrics.uptimeHours ?? defaultStaticConfig.safety.uptimeHours,
    wifiSignalDbm: systemMetrics.wifiSignalDbm ?? defaultStaticConfig.safety.wifiSignalDbm,
    cloudLatencyMs: systemMetrics.cloudLatencyMs ?? defaultStaticConfig.safety.cloudLatencyMs,
    packetLossPercent: systemMetrics.packetLossPercent ?? defaultStaticConfig.safety.packetLossPercent,
    cpuLoad: systemMetrics.cpuLoad ?? defaultStaticConfig.safety.cpuLoad,
    memoryPercent: systemMetrics.memory?.percent ?? defaultStaticConfig.safety.memoryPercent,
    storagePercent: systemMetrics.storage?.percent ?? defaultStaticConfig.safety.storagePercent,
  };

  const safetyData = useConfiguredData<SafetyConfig>("safety", fallbackSafety);

  const getStatusBadge = (value: number, warningAt: number, dangerAt: number) => {
    if (value >= dangerAt) return { text: "HIGH", cls: "text-alert-red bg-alert-red/10 border-alert-red/20" };
    if (value >= warningAt) return { text: "WARN", cls: "text-solar-amber bg-solar-amber/10 border-solar-amber/20" };
    return { text: "OK", cls: "text-eco-green bg-eco-green/10 border-eco-green/20" };
  };

  const cpuBadge = getStatusBadge(safetyData.cpuLoad, 70, 90);
  const memBadge = getStatusBadge(safetyData.memoryPercent, 75, 90);
  const storageBadge = getStatusBadge(safetyData.storagePercent, 80, 95);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Safety & Diagnostics</h1>
        <p className="text-muted-foreground">System protection and reliability monitoring</p>
      </div>

      <div className="card-surface p-6 border border-alert-red/30 bg-alert-red/5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground">Emergency Control</h3>
            <p className="text-sm text-muted-foreground mt-1">Immediately halt all motor and arm operations</p>
          </div>
          <Button variant="danger" size="xl" className="relative overflow-hidden">
            <AlertOctagon className="w-6 h-6 mr-2" />
            EMERGENCY STOP
            <div className="absolute inset-0 bg-alert-red/20 animate-pulse pointer-events-none" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard title="Wi-Fi Signal" value={String(safetyData.wifiSignalDbm)} unit="dBm" icon={Wifi} variant="eco" />
        <MetricCard title="Cloud Latency" value={String(safetyData.cloudLatencyMs)} unit="ms" icon={Activity} variant="ai" />
        <MetricCard title="Packet Loss" value={String(safetyData.packetLossPercent)} unit="%" icon={Shield} variant="default" />
      </div>

      <div className="card-surface p-6">
        <h3 className="font-semibold text-foreground mb-4">Motor Load & Temperature</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {safetyData.motorStatus.map((motor) => {
            const loadPercent = (motor.current / motor.max) * 100;
            const isOverload = loadPercent > 80;
            return (
              <div key={motor.id} className={cn("p-4 rounded-xl border", isOverload ? "border-alert-red/30 bg-alert-red/5" : "border-border bg-secondary/30")}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-foreground">{motor.name}</span>
                  <Gauge className={cn("w-4 h-4", isOverload ? "text-alert-red" : "text-eco-green")} />
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Current</span>
                    <span className="font-mono text-foreground">{motor.current}A</span>
                  </div>
                  <div className="h-3 rounded-full bg-secondary overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all duration-500", isOverload ? "bg-alert-red" : "bg-eco-green")} style={{ width: `${loadPercent}%` }} />
                  </div>
                  <div className="flex justify-between text-xs mt-1 text-muted-foreground"><span>0A</span><span>{motor.max}A</span></div>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-2">
                    <ThermometerSun className={cn("w-4 h-4", motor.temp > 45 ? "text-solar-amber" : "text-muted-foreground")} />
                    <span className="text-xs text-muted-foreground">Temp</span>
                  </div>
                  <span className="font-mono text-sm font-medium text-foreground">{motor.temp}°C</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card-surface p-6">
        <h3 className="font-semibold text-foreground mb-4">IMU Stability Indicators</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {safetyData.imuIndicators.map((axis) => {
            const normalized = ((axis.value + axis.maxDeviation) / (2 * axis.maxDeviation)) * 100;
            return (
              <div key={axis.axis} className="text-center">
                <h4 className="text-sm text-muted-foreground mb-2">{axis.axis}</h4>
                <div className="relative h-4 rounded-full bg-secondary overflow-hidden">
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-eco-green" />
                  <div className="absolute top-0 bottom-0 w-3 rounded-full bg-ai-cyan" style={{ left: `calc(${normalized}% - 6px)`, boxShadow: "0 0 10px hsl(var(--ai-cyan) / 0.5)" }} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>-{axis.maxDeviation}°</span><span className="font-mono text-foreground">{axis.value}°</span><span>+{axis.maxDeviation}°</span></div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "CPU", status: cpuBadge.text, statusCls: cpuBadge.cls, value: `${safetyData.cpuLoad}%` },
          { label: "Memory", status: memBadge.text, statusCls: memBadge.cls, value: `${safetyData.memoryPercent}%` },
          { label: "Storage", status: storageBadge.text, statusCls: storageBadge.cls, value: `${safetyData.storagePercent}%` },
          { label: "Uptime", status: safetyData.networkActive ? "ONLINE" : "OFFLINE", statusCls: safetyData.networkActive ? "text-eco-green bg-eco-green/10 border-eco-green/20" : "text-alert-red bg-alert-red/10 border-alert-red/20", value: `${safetyData.uptimeHours.toFixed(1)} h` },
        ].map((item) => (
          <div key={item.label} className="card-surface p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{item.label}</span>
              <span className={cn("text-xs px-2 py-1 rounded-full border", item.statusCls)}>{item.status}</span>
            </div>
            <p className="font-mono text-2xl font-bold text-foreground">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
