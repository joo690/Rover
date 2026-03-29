import { useMemo } from "react";
import { Cloud, Download, Search, Terminal, RefreshCw, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRealtimeData } from "@/hooks/useFirebaseData";
import { DB_PATHS } from "@/services/firebaseService";
import type { MissionLog, ErrorLog } from "@/services/firebaseService";
import { format } from "date-fns";
import { useTranslateStatus } from "@/i18n/dataTranslations";

const defaultMissionLogs: Record<string, MissionLog> = {};
const defaultErrorLogs: Record<string, ErrorLog> = {};

export default function CloudData() {
  const translateStatus = useTranslateStatus();
  const [syncing, setSyncing] = useState(false);
  const [missionLogsData] = useRealtimeData<Record<string, MissionLog>>(
    `${DB_PATHS.CLOUD_DATA}/missionLogs`,
    defaultMissionLogs
  );
  const [errorLogsData] = useRealtimeData<Record<string, ErrorLog>>(
    `${DB_PATHS.CLOUD_DATA}/errorLogs`,
    defaultErrorLogs
  );

  // Memoize translated status values to ensure they update when language or data changes
  const missionLogs = useMemo(() => {
    return Object.values(missionLogsData || {})
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10)
      .map(log => ({
        ...log,
        status: translateStatus(log.status),
      }));
  }, [missionLogsData, translateStatus]);
  const errorLogs = Object.values(errorLogsData || {}).sort((a, b) => b.timestamp - a.timestamp).slice(0, 20);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cloud Data & Logs</h1>
          <p className="text-muted-foreground">Data access, auditing, and export</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="glass" onClick={handleSync} disabled={syncing}>
            <RefreshCw className={cn("w-4 h-4 mr-2", syncing && "animate-spin")} />
            {syncing ? "Syncing..." : "Sync Now"}
          </Button>
          <Button variant="eco">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* Sync status */}
      <div className="card-surface p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-lg",
            syncing ? "bg-solar-amber/10" : "bg-eco-green/10"
          )}>
            <Cloud className={cn(
              "w-5 h-5",
              syncing ? "text-solar-amber animate-pulse" : "text-eco-green"
            )} />
          </div>
          <div>
            <p className="font-medium text-foreground">
              {syncing ? "Syncing with cloud..." : "Cloud connected"}
            </p>
            <span className="text-sm text-muted-foreground">Last sync: 2 minutes ago</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-muted-foreground" />
            <span className="font-mono text-foreground">1.2 GB</span>
          </div>
        </div>
      </div>

      {/* Mission Log Table */}
      <div className="card-surface p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Mission Logs</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search logs..."
                className="pl-9 pr-4 py-2 text-sm bg-secondary rounded-lg border border-border focus:outline-none focus:border-eco-green/50 text-foreground"
              />
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  Mission ID
                </th>
                <th className="text-left py-3 px-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  Time
                </th>
                <th className="text-left py-3 px-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  Type
                </th>
                <th className="text-left py-3 px-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  Items
                </th>
              </tr>
            </thead>
            <tbody>
              {missionLogs.map((log) => (
                <tr key={log.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="py-3 px-4 font-mono text-sm text-ai-cyan">{log.id}</td>
                  <td className="py-3 px-4 font-mono text-sm text-foreground">
                    {log.timestamp ? format(new Date(log.timestamp), "HH:mm:ss") : log.time}
                  </td>
                  <td className="py-3 px-4 text-sm text-foreground">{log.type}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-eco-green/10 text-eco-green border border-eco-green/20">
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-sm text-foreground">{log.items}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Developer Terminal */}
      <div className="card-surface p-6">
        <div className="flex items-center gap-2 mb-4">
          <Terminal className="w-5 h-5 text-eco-green" />
          <h3 className="font-semibold text-foreground">System Logs</h3>
        </div>

        <div className="bg-surface-overlay rounded-lg p-4 font-mono text-sm max-h-64 overflow-y-auto">
          {errorLogs.map((log, index) => (
            <div key={index} className="flex gap-4 py-1 hover:bg-secondary/20">
              <span className="text-muted-foreground">
                {log.timestamp ? format(new Date(log.timestamp), "HH:mm:ss") : log.time}
              </span>
              <span
                className={cn(
                  "w-14",
                  log.level === "INFO" && "text-ai-cyan",
                  log.level === "DEBUG" && "text-muted-foreground",
                  log.level === "WARN" && "text-solar-amber",
                  log.level === "ERROR" && "text-alert-red"
                )}
              >
                [{log.level}]
              </span>
              <span className="text-foreground">{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
