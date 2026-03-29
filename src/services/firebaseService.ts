import { ref, set, push, update, remove, get, DataSnapshot } from "firebase/database";
import { database } from "@/lib/firebase";
import { FIREBASE_DB_PATHS, buildDbPath } from "@/config/firebaseConfig";

// Helper to check if database is available
const checkDatabase = () => {
  if (!database) {
    throw new Error("Firebase database is not initialized. Please check your .env file.");
  }
  return database;
};

// Re-export DB_PATHS for backward compatibility
// Use FIREBASE_DB_PATHS from @/config/firebaseConfig for new code
export const DB_PATHS = FIREBASE_DB_PATHS;

// Dashboard Data
export interface DashboardData {
  systemReadiness: number;
  motors: number;
  ai: number;
  power: number;
  wasteItemsCollected: number;
  detectionRate: number;
  cpuLoad: number;
  temperature: number;
  uptime: number;
  distance: number;
  powerOutput: number;
}

// Bin Data
export interface BinData {
  type: string;
  level: number;
  mass: number;
  color: string;
  bgColor: string;
  icon: string;
  lastEmpty: string;
  timestamp: number;
}

// Energy Data
export interface EnergyData {
  solarInput: number;
  consumption: number;
  netPower: number;
  batteryLevel: number;
  batteryTemp: number;
  isCharging: boolean;
  solarHistory: Array<{ time: string; production: number; consumption: number }>;
  batteryHistory: Array<{ time: string; level: number }>;
  thermalMap: Array<{ label: string; temp: number; status: string }>;
  autonomy: number;
  generatedToday: number;
  consumedToday: number;
}

// Navigation Data
export interface NavigationData {
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  totalDistance: number;
  pathEfficiency: number;
  currentZone: string;
  plannedPath: Array<{ lat: number; lng: number }>;
  actualPath: Array<{ lat: number; lng: number; timestamp: number }>;
  obstacles: Array<{ angle: number; distance: number; type: string }>;
}

// Vision Data
export interface VisionData {
  wasteTypeDistribution: Array<{ name: string; value: number; color: string }>;
  recentDetections: Array<{ id: number; type: string; confidence: number; time: string }>;
  totalDetections: number;
  accuracy: number;
}

// Alert Data
export interface Alert {
  id: string;
  type: "success" | "info" | "warning" | "error";
  message: string;
  time: string;
  timestamp: number;
}

// Analytics Data
export interface AnalyticsData {
  zonalData: Array<{ zone: string; pollution: number }>;
  peakTimeData: Array<{ hour: string; count: number }>;
}

// Impact Data
export interface ImpactData {
  monthlyCo2SavedKg: number;
  treesEquivalent: number;
  recyclableValueUsd: number;
  weeklyCo2Savings: Array<{ day: string; co2: number; items: number }>;
  sortingSuccessRate: number;
  itemsRecycled: number;
  areaCleanedKm2: number;
  efficiencyRate: number;
  targetZoneClearedPct: number;
  targetZoneAreaM2: number;
}

// Cloud Data
export interface MissionLog {
  id: string;
  time: string;
  type: string;
  status: string;
  items: number;
  timestamp: number;
}

export interface ErrorLog {
  time: string;
  level: string;
  message: string;
  timestamp: number;
}

// Service functions
export const firebaseService = {
  // Dashboard
  async getDashboardData(): Promise<DashboardData | null> {
    const db = checkDatabase();
    const snapshot = await get(ref(db, FIREBASE_DB_PATHS.DASHBOARD));
    return snapshot.val();
  },

  async updateDashboardData(data: Partial<DashboardData>): Promise<void> {
    const db = checkDatabase();
    await update(ref(db, FIREBASE_DB_PATHS.DASHBOARD), data);
  },

  // Bins
  async getBins(): Promise<Record<string, BinData> | null> {
    const snapshot = await get(ref(database, FIREBASE_DB_PATHS.BINS));
    return snapshot.val();
  },

  async updateBin(binId: string, data: Partial<BinData>): Promise<void> {
    await update(ref(database, buildDbPath(FIREBASE_DB_PATHS.BINS, binId)), {
      ...data,
      timestamp: Date.now(),
    });
  },

  // Energy
  async getEnergyData(): Promise<EnergyData | null> {
    const snapshot = await get(ref(database, FIREBASE_DB_PATHS.ENERGY));
    return snapshot.val();
  },

  async updateEnergyData(data: Partial<EnergyData>): Promise<void> {
    await update(ref(database, FIREBASE_DB_PATHS.ENERGY), {
      ...data,
      timestamp: Date.now(),
    });
  },

  // Navigation
  async getNavigationData(): Promise<NavigationData | null> {
    const snapshot = await get(ref(database, FIREBASE_DB_PATHS.NAVIGATION));
    return snapshot.val();
  },

  async updateNavigationData(data: Partial<NavigationData>): Promise<void> {
    await update(ref(database, FIREBASE_DB_PATHS.NAVIGATION), {
      ...data,
      timestamp: Date.now(),
    });
  },

  async addPathPoint(lat: number, lng: number): Promise<void> {
    const pathRef = ref(database, FIREBASE_DB_PATHS.NAVIGATION_ACTUAL_PATH);
    await push(pathRef, { lat, lng, timestamp: Date.now() });
  },

  // Vision
  async getVisionData(): Promise<VisionData | null> {
    const snapshot = await get(ref(database, FIREBASE_DB_PATHS.VISION));
    return snapshot.val();
  },

  async addDetection(detection: { type: string; confidence: number }): Promise<void> {
    const detectionsRef = ref(database, FIREBASE_DB_PATHS.VISION_RECENT_DETECTIONS);
    await push(detectionsRef, {
      ...detection,
      id: Date.now(),
      time: new Date().toISOString(),
    });
  },

  // Alerts
  async getAlerts(): Promise<Record<string, Alert> | null> {
    const snapshot = await get(ref(database, FIREBASE_DB_PATHS.ALERTS));
    return snapshot.val();
  },

  async addAlert(alert: Omit<Alert, "id" | "timestamp">): Promise<void> {
    const alertsRef = ref(database, FIREBASE_DB_PATHS.ALERTS);
    await push(alertsRef, {
      ...alert,
      timestamp: Date.now(),
    });
  },

  // Analytics
  async getAnalyticsData(): Promise<AnalyticsData | null> {
    const snapshot = await get(ref(database, FIREBASE_DB_PATHS.ANALYTICS));
    return snapshot.val();
  },

  // Impact
  async getImpactData(): Promise<ImpactData | null> {
    const snapshot = await get(ref(database, FIREBASE_DB_PATHS.IMPACT));
    return snapshot.val();
  },

  // Cloud Data
  async getMissionLogs(): Promise<Record<string, MissionLog> | null> {
    const snapshot = await get(ref(database, FIREBASE_DB_PATHS.MISSION_LOGS));
    return snapshot.val();
  },

  async getErrorLogs(): Promise<Record<string, ErrorLog> | null> {
    const snapshot = await get(ref(database, FIREBASE_DB_PATHS.ERROR_LOGS));
    return snapshot.val();
  },

  async addMissionLog(log: Omit<MissionLog, "id" | "timestamp">): Promise<void> {
    const logsRef = ref(database, FIREBASE_DB_PATHS.MISSION_LOGS);
    await push(logsRef, {
      ...log,
      timestamp: Date.now(),
    });
  },

  async addErrorLog(log: Omit<ErrorLog, "timestamp">): Promise<void> {
    const logsRef = ref(database, FIREBASE_DB_PATHS.ERROR_LOGS);
    await push(logsRef, {
      ...log,
      timestamp: Date.now(),
    });
  },
};

