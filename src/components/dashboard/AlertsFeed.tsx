import { useMemo } from "react";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRealtimeData } from "@/hooks/useFirebaseData";
import { useConfiguredData } from "@/hooks/useConfiguredData";
import { DB_PATHS } from "@/services/firebaseService";
import type { Alert } from "@/services/firebaseService";
import { formatDistanceToNow } from "date-fns";
import { useLanguage } from "@/i18n/LanguageContext";
import { useTranslateAlertMessage } from "@/i18n/dataTranslations";
import { defaultStaticConfig } from "@/config/dashboardConfig";

const defaultAlerts: Record<string, Alert> = defaultStaticConfig.alerts;

export function AlertsFeed() {
  const { t, language } = useLanguage();
  const translateAlertMessage = useTranslateAlertMessage();
  const [liveAlertsData] = useRealtimeData<Record<string, Alert>>(DB_PATHS.ALERTS, defaultAlerts);
  const alertsData = useConfiguredData<Record<string, Alert>>("alerts", liveAlertsData);

  const alerts = useMemo(
    () =>
      Object.values(alertsData || {})
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 5)
        .map((alert) => ({
          ...alert,
          message: translateAlertMessage(alert.message),
          time: alert.timestamp ? formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true }) : alert.time,
        })),
    [alertsData, translateAlertMessage, language],
  );

  const getIcon = (type: Alert["type"]) => {
    switch (type) {
      case "success":
        return CheckCircle;
      case "warning":
        return AlertTriangle;
      case "error":
        return XCircle;
      default:
        return Info;
    }
  };

  const getStyles = (type: Alert["type"]) => {
    switch (type) {
      case "success":
        return "text-eco-green bg-eco-green/10 border-eco-green/20";
      case "warning":
        return "text-solar-amber bg-solar-amber/10 border-solar-amber/20";
      case "error":
        return "text-alert-red bg-alert-red/10 border-alert-red/20";
      default:
        return "text-ai-cyan bg-ai-cyan/10 border-ai-cyan/20";
    }
  };

  return (
    <div className="card-surface p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">{t.dashboard.liveAlerts}</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-eco-green animate-pulse" />
          <span className="text-xs text-muted-foreground">Real-time</span>
        </div>
      </div>

      <div className="space-y-2 max-h-[280px] overflow-y-auto">
        {alerts.map((alert, index) => {
          const Icon = getIcon(alert.type);
          return (
            <div key={alert.id} className={cn("flex items-start gap-3 p-3 rounded-lg border transition-all duration-300", getStyles(alert.type), index === 0 && "animate-slide-in-left")}>
              <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">{alert.message}</p>
                <span className="text-xs opacity-70">{alert.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
