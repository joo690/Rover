import {
  Battery,
  Wifi,
  Signal,
  Clock,
  MapPin,
  Thermometer,
} from "lucide-react";
import { useEffect, useState } from "react";
import { LanguageToggler } from "@/components/LanguageToggler";
import { useRoverOnlineStatus } from "@/hooks/useRoverOnlineStatus";
import { useRealtimeData } from "@/hooks/useFirebaseData";
import { DB_PATHS } from "@/services/firebaseService";
import type {
  DashboardData,
  EnergyData,
  NavigationData,
} from "@/services/firebaseService";
import { useTranslateZone } from "@/i18n/dataTranslations";

export function StatusBar() {
  const [time, setTime] = useState(new Date());
  const roverStatus = useRoverOnlineStatus();
  const translateZone = useTranslateZone();

  // Pull the same values used across the app so the header matches every page.
  const [dashboardData] = useRealtimeData<DashboardData>(DB_PATHS.DASHBOARD, {
    systemReadiness: 0,
    motors: 0,
    ai: 0,
    power: 0,
    wasteItemsCollected: 0,
    detectionRate: 0,
    cpuLoad: 0,
    temperature: 0,
    uptime: 0,
    distance: 0,
    powerOutput: 0,
  });

  const [energyData] = useRealtimeData<EnergyData>(DB_PATHS.ENERGY, {
    solarInput: 0,
    consumption: 0,
    netPower: 0,
    batteryLevel: 0,
    batteryTemp: 0,
    isCharging: false,
    solarHistory: [],
    batteryHistory: [],
    thermalMap: [],
    autonomy: 0,
    generatedToday: 0,
    consumedToday: 0,
  });

  const [navData] = useRealtimeData<NavigationData>(DB_PATHS.NAVIGATION, {
    latitude: 0,
    longitude: 0,
    speed: 0,
    heading: 0,
    totalDistance: 0,
    pathEfficiency: 0,
    currentZone: "",
    plannedPath: [],
    actualPath: [],
    obstacles: [],
  });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-14 bg-surface-elevated border-b border-border px-6 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div
            className={
              roverStatus === "online"
                ? "status-online animate-pulse-soft"
                : "w-2 h-2 rounded-full bg-alert-red"
            }
          />
          <span
            className={
              roverStatus === "online"
                ? "text-sm text-muted-foreground"
                : "text-sm text-alert-red"
            }
          >
            {roverStatus === "online" ? "System Online" : "System Offline"}
          </span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-ai-cyan" />
          <span className="text-sm font-mono text-foreground">
            {translateZone(navData.currentZone || "A-3")}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-solar-amber" />
          <span className="text-sm font-mono">
            {dashboardData.temperature}°C
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Battery className="w-4 h-4 text-eco-green" />
          <span className="text-sm font-mono text-eco-green">
            {energyData.batteryLevel}%
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Wifi
            className={
              roverStatus === "online"
                ? "w-4 h-4 text-eco-green"
                : "w-4 h-4 text-alert-red"
            }
          />
          <span
            className={
              roverStatus === "online"
                ? "text-sm font-mono text-eco-green"
                : "text-sm font-mono text-alert-red"
            }
          >
            {roverStatus === "online" ? "Online" : "Offline"}
          </span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-mono text-foreground">
            {time.toLocaleTimeString("en-US", { hour12: false })}
          </span>
        </div>
        <div className="h-4 w-px bg-border" />
        <LanguageToggler />
      </div>
    </header>
  );
}
