import { useMemo } from "react";
import { MapPin, Navigation as NavIcon, Gauge, Target, Route } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { useRealtimeData } from "@/hooks/useFirebaseData";
import { useConfiguredData } from "@/hooks/useConfiguredData";
import { DB_PATHS } from "@/services/firebaseService";
import type { NavigationData } from "@/services/firebaseService";
import { useLanguage } from "@/i18n/LanguageContext";
import { useTranslateZone } from "@/i18n/dataTranslations";
import { defaultStaticConfig } from "@/config/dashboardConfig";

const defaultNavigation: NavigationData = defaultStaticConfig.navigation;

function obstacleColor(type: string) {
  const normalized = type.toLowerCase();
  if (normalized.includes("waste")) return "hsl(var(--solar-amber))";
  if (normalized.includes("moving")) return "hsl(var(--alert-red))";
  if (normalized.includes("clear")) return "hsl(var(--eco-green))";
  return "hsl(var(--ai-cyan))";
}

export default function Navigation() {
  const { t, language } = useLanguage();
  const translateZone = useTranslateZone();
  const [liveNavData] = useRealtimeData<NavigationData>(DB_PATHS.NAVIGATION, defaultNavigation);
  const navData = useConfiguredData<NavigationData>("navigation", liveNavData);

  const translatedZone = useMemo(() => translateZone(navData.currentZone), [navData.currentZone, translateZone, language]);

  const radarPoints = useMemo(
    () =>
      (navData.obstacles || []).map((obstacle, index) => {
        const angleRad = ((obstacle.angle ?? 0) - 90) * (Math.PI / 180);
        const distanceRatio = Math.max(0, Math.min(1, (obstacle.distance ?? 0) / 100));
        const radius = 18 + distanceRatio * 62;

        return {
          ...obstacle,
          index,
          x: 100 + Math.cos(angleRad) * radius,
          y: 100 + Math.sin(angleRad) * radius,
          color: obstacleColor(obstacle.type),
        };
      }),
    [navData.obstacles],
  );

  const headingX = 50 + 15 * Math.cos((navData.heading - 90) * Math.PI / 180);
  const headingY = 50 + 15 * Math.sin((navData.heading - 90) * Math.PI / 180);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t.navigation.title}</h1>
        <p className="text-muted-foreground">{t.navigation.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="card-surface p-4 h-[500px] relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-20" />

            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
              <rect x="50" y="50" width="80" height="60" fill="hsl(var(--eco-green) / 0.1)" stroke="hsl(var(--eco-green) / 0.3)" strokeWidth="1" rx="4" />
              <text x="90" y="85" fill="hsl(var(--muted-foreground))" fontSize="10" textAnchor="middle">{t.data.zones.zoneA}</text>

              <rect x="160" y="80" width="80" height="60" fill="hsl(var(--ai-cyan) / 0.1)" stroke="hsl(var(--ai-cyan) / 0.3)" strokeWidth="1" rx="4" />
              <text x="200" y="115" fill="hsl(var(--muted-foreground))" fontSize="10" textAnchor="middle">{t.data.zones.zoneB}</text>

              <rect x="270" y="120" width="80" height="60" fill="hsl(var(--solar-amber) / 0.1)" stroke="hsl(var(--solar-amber) / 0.3)" strokeWidth="1" rx="4" />
              <text x="310" y="155" fill="hsl(var(--muted-foreground))" fontSize="10" textAnchor="middle">{t.data.zones.zoneC}</text>

              <path d="M 90,110 Q 130,140 200,140 T 310,180 T 350,220" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="2" strokeDasharray="8 4" opacity="0.5" />
              <path d="M 90,110 Q 125,145 195,145 T 280,175" fill="none" stroke="hsl(var(--eco-green))" strokeWidth="3" />

              <circle cx="100" cy="80" r="8" fill="hsl(var(--alert-red) / 0.3)" />
              <circle cx="180" cy="100" r="12" fill="hsl(var(--alert-red) / 0.4)" />
              <circle cx="290" cy="140" r="6" fill="hsl(var(--solar-amber) / 0.3)" />
              <circle cx="220" cy="160" r="10" fill="hsl(var(--alert-red) / 0.3)" />

              <circle cx="280" cy="175" r="15" fill="hsl(var(--eco-green) / 0.2)" className="animate-pulse" />
              <circle cx="280" cy="175" r="8" fill="hsl(var(--eco-green))" />
              <circle cx="280" cy="175" r="3" fill="hsl(var(--background))" />
            </svg>

            <div className="absolute top-4 left-4 px-3 py-2 rounded-lg bg-surface-overlay/90 backdrop-blur-sm border border-border">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-eco-green" />
                <span className="font-mono text-foreground">{navData.latitude}°N, {navData.longitude}°E</span>
              </div>
            </div>

            <div className="absolute bottom-4 left-4 px-3 py-2 rounded-lg bg-surface-overlay/90 backdrop-blur-sm border border-border">
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-eco-green" />
                  <span className="text-muted-foreground">{t.navigation.actualPath}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-muted-foreground" style={{ borderStyle: "dashed" }} />
                  <span className="text-muted-foreground">{t.navigation.plannedPath}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-alert-red/50" />
                  <span className="text-muted-foreground">{t.navigation.wasteDensity}</span>
                </div>
              </div>
            </div>

            <div className="absolute top-4 right-4 px-4 py-3 rounded-lg bg-surface-overlay/90 backdrop-blur-sm border border-border">
              <div className="text-center">
                <p className="font-mono text-3xl font-bold text-foreground">{navData.speed.toFixed(1)}</p>
                <span className="text-xs text-muted-foreground">m/s</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card-surface p-4">
            <h3 className="font-semibold text-foreground mb-3">Bussola Digitale</h3>
            <div className="relative w-32 h-32 mx-auto">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--border))" strokeWidth="2" />
                <circle cx="50" cy="50" r="35" fill="none" stroke="hsl(var(--border))" strokeWidth="1" opacity="0.5" />
                <text x="50" y="15" fill="hsl(var(--foreground))" fontSize="8" textAnchor="middle" fontWeight="bold">N</text>
                <text x="90" y="53" fill="hsl(var(--muted-foreground))" fontSize="8" textAnchor="middle">E</text>
                <text x="50" y="93" fill="hsl(var(--muted-foreground))" fontSize="8" textAnchor="middle">S</text>
                <text x="10" y="53" fill="hsl(var(--muted-foreground))" fontSize="8" textAnchor="middle">W</text>
                <line x1="50" y1="50" x2={headingX} y2={headingY} stroke="hsl(var(--eco-green))" strokeWidth="3" strokeLinecap="round" />
                <circle cx="50" cy="50" r="4" fill="hsl(var(--eco-green))" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-sm text-eco-green mt-8">{navData.heading}°</span>
              </div>
            </div>
          </div>

          <MetricCard title={t.navigation.currentSpeed} value={navData.speed.toFixed(1)} unit="m/s" icon={Gauge} variant="eco" />
          <MetricCard title={t.navigation.totalDistance} value={navData.totalDistance.toString()} unit="m" icon={Route} variant="default" />
          <MetricCard title={t.navigation.pathEfficiency} value={navData.pathEfficiency.toString()} unit="%" icon={Target} variant="ai" />
        </div>
      </div>

      <div className="card-surface p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h3 className="font-semibold text-foreground mb-1">{t.navigation.obstacleRadar}</h3>
            <p className="text-sm text-muted-foreground">Dynamic radar now renders directly from the editable obstacle list in Configuration.</p>
          </div>
          <div className="px-3 py-2 rounded-lg bg-secondary/40 border border-border text-sm">
            <span className="text-muted-foreground">Current zone: </span>
            <span className="font-medium text-foreground">{translatedZone}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px,1fr] gap-8 mt-6 items-center">
          <div className="flex items-center justify-center">
            <div className="relative w-72 h-72">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <defs>
                  <linearGradient id="radarSweep" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--eco-green) / 0.28)" />
                    <stop offset="100%" stopColor="hsl(var(--eco-green) / 0)" />
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r="80" fill="none" stroke="hsl(var(--border))" strokeWidth="1" />
                <circle cx="100" cy="100" r="60" fill="none" stroke="hsl(var(--border))" strokeWidth="1" />
                <circle cx="100" cy="100" r="40" fill="none" stroke="hsl(var(--border))" strokeWidth="1" />
                <circle cx="100" cy="100" r="20" fill="none" stroke="hsl(var(--border))" strokeWidth="1" />
                <line x1="100" y1="20" x2="100" y2="180" stroke="hsl(var(--border))" strokeWidth="1" />
                <line x1="20" y1="100" x2="180" y2="100" stroke="hsl(var(--border))" strokeWidth="1" />
                <path d="M 100,100 L 100,20 A 80,80 0 0,1 160,60 Z" fill="url(#radarSweep)" className="animate-spin-slow origin-center" />

                {radarPoints.map((point) => (
                  <g key={`${point.type}-${point.index}`}>
                    <circle cx={point.x} cy={point.y} r="7" fill={point.color} opacity="0.25" />
                    <circle cx={point.x} cy={point.y} r="3.5" fill={point.color} />
                    <text x={point.x + 6} y={point.y - 6} fill="hsl(var(--foreground))" fontSize="8">
                      {Math.round(point.distance)}
                    </text>
                  </g>
                ))}

                <circle cx="100" cy="100" r="5" fill="hsl(var(--eco-green))" />
              </svg>
            </div>
          </div>

          <div className="space-y-3">
            {radarPoints.length === 0 ? (
              <div className="p-4 rounded-xl border border-border bg-secondary/20 text-sm text-muted-foreground">
                No radar points configured. Add obstacles from the Configuration page.
              </div>
            ) : (
              radarPoints.map((point) => (
                <div key={`${point.type}-${point.index}-row`} className="flex items-center justify-between gap-3 p-4 rounded-xl border border-border bg-secondary/20">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: point.color }} />
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">{point.type}</p>
                      <p className="text-xs text-muted-foreground">Angle {Math.round(point.angle)}°</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-foreground">{Math.round(point.distance)}</p>
                    <p className="text-xs text-muted-foreground">range</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
