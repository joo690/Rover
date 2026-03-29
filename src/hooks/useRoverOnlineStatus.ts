import { useEffect, useMemo, useRef, useState } from "react";
import { useRealtimeData } from "@/hooks/useFirebaseData";
import { DB_PATHS, type DashboardData } from "@/services/firebaseService";

type RoverStatus = "online" | "offline";

const defaultDashboard: DashboardData = {
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
};

export function useRoverOnlineStatus(timeoutMs: number = 30000): RoverStatus {
  const [dashboard] = useRealtimeData<DashboardData>(DB_PATHS.DASHBOARD, defaultDashboard);
  const [status, setStatus] = useState<RoverStatus>("offline");
  const lastChangeRef = useRef<number>(Date.now());
  const lastSnapshotRef = useRef<string>("");

  const snapshotKey = useMemo(() => {
    try {
      return JSON.stringify({
        systemReadiness: dashboard.systemReadiness,
        motors: dashboard.motors,
        ai: dashboard.ai,
        power: dashboard.power,
        wasteItemsCollected: dashboard.wasteItemsCollected,
        cpuLoad: dashboard.cpuLoad,
        temperature: dashboard.temperature,
        uptime: dashboard.uptime,
        distance: dashboard.distance,
        powerOutput: dashboard.powerOutput,
      });
    } catch {
      return "";
    }
  }, [dashboard]);

  useEffect(() => {
    if (snapshotKey && snapshotKey !== lastSnapshotRef.current) {
      lastSnapshotRef.current = snapshotKey;
      lastChangeRef.current = Date.now();
      setStatus("online");
    }
  }, [snapshotKey]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = now - lastChangeRef.current;
      if (diff > timeoutMs) {
        setStatus("offline");
      }
    }, Math.min(timeoutMs / 2, 10000));

    return () => clearInterval(interval);
  }, [timeoutMs]);

  return status;
}

