import { useMemo } from "react";
import { MapPin, Navigation } from "lucide-react";
import { useRealtimeData } from "@/hooks/useFirebaseData";
import { useConfiguredData } from "@/hooks/useConfiguredData";
import { DB_PATHS } from "@/services/firebaseService";
import type { NavigationData } from "@/services/firebaseService";
import { useTranslateZone } from "@/i18n/dataTranslations";
import { defaultStaticConfig } from "@/config/dashboardConfig";

const defaultNavigation: NavigationData = defaultStaticConfig.navigation;

export function MiniMap() {
  const translateZone = useTranslateZone();
  const [liveNavData] = useRealtimeData<NavigationData>(DB_PATHS.NAVIGATION, defaultNavigation);
  const navData = useConfiguredData<NavigationData>("navigation", liveNavData);

  const translatedZone = useMemo(() => translateZone(navData.currentZone), [navData.currentZone, translateZone]);

  return (
    <div className="card-surface p-4 h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-foreground">Live Position</h3>
        <div className="flex items-center gap-1 text-eco-green text-xs">
          <Navigation className="w-3 h-3" />
          <span className="font-mono">{navData.heading}°</span>
        </div>
      </div>

      <div className="relative aspect-video rounded-lg overflow-hidden bg-surface-elevated border border-border">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />

        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <path d="M 10,50 Q 25,30 40,45 T 70,40 T 90,60" fill="none" stroke="hsl(var(--eco-green) / 0.3)" strokeWidth="2" strokeDasharray="4 2" />
          <circle cx="90" cy="60" r="8" fill="hsl(var(--eco-green) / 0.2)" />
          <circle cx="90" cy="60" r="4" fill="hsl(var(--eco-green))" className="animate-pulse-soft" />
        </svg>

        <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-overlay/80 backdrop-blur-sm border border-eco-green/20">
          <MapPin className="w-3 h-3 text-eco-green" />
          <span className="text-xs font-mono text-foreground">{translatedZone}</span>
        </div>

        <div className="absolute top-4 left-4 px-2 py-1 rounded bg-surface-overlay/80 backdrop-blur-sm">
          <span className="text-xs font-mono text-muted-foreground">
            {navData.latitude}°N, {navData.longitude}°E
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3">
        <div className="p-2 rounded-lg bg-secondary/50 text-center">
          <span className="text-xs text-muted-foreground">Speed</span>
          <p className="font-mono text-sm font-semibold text-foreground">{navData.speed.toFixed(1)} m/s</p>
        </div>
        <div className="p-2 rounded-lg bg-secondary/50 text-center">
          <span className="text-xs text-muted-foreground">Distance</span>
          <p className="font-mono text-sm font-semibold text-foreground">{navData.totalDistance} m</p>
        </div>
      </div>
    </div>
  );
}
