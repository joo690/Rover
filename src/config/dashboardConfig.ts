import type {
  Alert,
  AnalyticsData,
  BinData,
  DashboardData,
  EnergyData,
  ImpactData,
  NavigationData,
  VisionData,
} from "@/services/firebaseService";

export type StaticSectionKey =
  | "dashboard"
  | "navigation"
  | "energy"
  | "vision"
  | "analytics"
  | "analyticsExtras"
  | "impact"
  | "bins"
  | "safety"
  | "alerts";

export interface AnalyticsExtras {
  peakActivityValue: string;
  peakActivityUnit: string;
  hotspotZone: string;
  patternMatch: number;
  trendScore: number;
  insights: string[];
}

export interface SafetyMotorStatus {
  id: number;
  name: string;
  current: number;
  max: number;
  temp: number;
}

export interface SafetyImuIndicator {
  axis: string;
  value: number;
  maxDeviation: number;
}

export interface SafetyConfig {
  status: string;
  networkActive: boolean;
  uptimeHours: number;
  wifiSignalDbm: number;
  cloudLatencyMs: number;
  packetLossPercent: number;
  cpuLoad: number;
  memoryPercent: number;
  storagePercent: number;
  motorStatus: SafetyMotorStatus[];
  imuIndicators: SafetyImuIndicator[];
}

export interface StaticDashboardConfig {
  useStaticData: boolean;
  dashboard: DashboardData;
  navigation: NavigationData;
  energy: EnergyData;
  vision: VisionData;
  analytics: AnalyticsData;
  analyticsExtras: AnalyticsExtras;
  impact: ImpactData;
  bins: Record<string, BinData>;
  safety: SafetyConfig;
  alerts: Record<string, Alert>;
}

export const STATIC_CONFIG_STORAGE_KEY = "ecorover-static-config-v1";
export const STATIC_CONFIG_EVENT = "ecorover-static-config-updated";

const now = Date.now();

export const defaultStaticConfig: StaticDashboardConfig = {
  useStaticData: true,
  dashboard: {
    systemReadiness: 94,
    motors: 98,
    ai: 96,
    power: 87,
    wasteItemsCollected: 1247,
    detectionRate: 98.7,
    cpuLoad: 42,
    temperature: 32,
    uptime: 4.2,
    distance: 847,
    powerOutput: 155,
  },
  navigation: {
    latitude: 31.2156,
    longitude: 29.9553,
    speed: 1.2,
    heading: 45,
    totalDistance: 847,
    pathEfficiency: 94,
    currentZone: "A-3",
    plannedPath: [],
    actualPath: [],
    obstacles: [
      { angle: 20, distance: 28, type: "Static Object" },
      { angle: 70, distance: 52, type: "Detected Waste" },
      { angle: 145, distance: 38, type: "Moving Object" },
      { angle: 295, distance: 64, type: "Clear Zone" },
    ],
  },
  energy: {
    solarInput: 340,
    consumption: 185,
    netPower: 155,
    batteryLevel: 87,
    batteryTemp: 32,
    isCharging: true,
    solarHistory: [
      { time: "06:00", production: 50, consumption: 120 },
      { time: "08:00", production: 180, consumption: 150 },
      { time: "10:00", production: 320, consumption: 170 },
      { time: "12:00", production: 380, consumption: 185 },
      { time: "14:00", production: 340, consumption: 175 },
      { time: "16:00", production: 250, consumption: 160 },
      { time: "18:00", production: 100, consumption: 140 },
      { time: "20:00", production: 0, consumption: 80 },
    ],
    batteryHistory: [
      { time: "00:00", level: 45 },
      { time: "04:00", level: 35 },
      { time: "08:00", level: 52 },
      { time: "12:00", level: 78 },
      { time: "16:00", level: 92 },
      { time: "20:00", level: 87 },
    ],
    thermalMap: [
      { label: "Motor 1", temp: 45, status: "normal" },
      { label: "Motor 2", temp: 42, status: "normal" },
      { label: "Motor 3", temp: 48, status: "warm" },
      { label: "Motor 4", temp: 44, status: "normal" },
      { label: "Battery Pack", temp: 32, status: "optimal" },
      { label: "Arm Servo", temp: 38, status: "normal" },
      { label: "RPi CPU", temp: 52, status: "warm" },
      { label: "ESP32", temp: 35, status: "normal" },
    ],
    autonomy: 8.5,
    generatedToday: 2.4,
    consumedToday: 1.8,
  },
  vision: {
    wasteTypeDistribution: [
      { name: "Plastic", value: 45, color: "hsl(186 94% 42%)" },
      { name: "Organic", value: 30, color: "hsl(142 71% 45%)" },
      { name: "Paper", value: 20, color: "hsl(38 92% 50%)" },
      { name: "Other", value: 5, color: "hsl(var(--muted-foreground))" },
    ],
    recentDetections: [
      { id: 1, type: "Plastic Bottle", confidence: 98, time: "12s ago" },
      { id: 2, type: "Paper Cup", confidence: 94, time: "45s ago" },
      { id: 3, type: "Banana Peel", confidence: 97, time: "1m ago" },
      { id: 4, type: "Cardboard", confidence: 91, time: "2m ago" },
      { id: 5, type: "Aluminum Can", confidence: 99, time: "3m ago" },
    ],
    totalDetections: 1247,
    accuracy: 98.7,
  },
  analytics: {
    zonalData: [
      { zone: "Zone A", pollution: 85 },
      { zone: "Zone B", pollution: 62 },
      { zone: "Zone C", pollution: 78 },
      { zone: "Zone D", pollution: 45 },
      { zone: "Zone E", pollution: 90 },
      { zone: "Zone F", pollution: 55 },
    ],
    peakTimeData: [
      { hour: "6am", count: 12 },
      { hour: "8am", count: 45 },
      { hour: "10am", count: 78 },
      { hour: "12pm", count: 95 },
      { hour: "2pm", count: 82 },
      { hour: "4pm", count: 68 },
      { hour: "6pm", count: 55 },
      { hour: "8pm", count: 25 },
    ],
  },
  analyticsExtras: {
    peakActivityValue: "12:00",
    peakActivityUnit: "PM",
    hotspotZone: "E",
    patternMatch: 94,
    trendScore: 12,
    insights: [
      "Zone E shows 40% higher waste density than average. Recommend increasing patrol frequency.",
      "Peak littering occurs between 11:00-13:00, correlating with lunch breaks.",
      "Plastic waste increased 15% this week. Consider targeted awareness campaigns.",
      "Weekend collection efficiency 23% higher due to reduced foot traffic.",
    ],
  },
  impact: {
    monthlyCo2SavedKg: 124.5,
    treesEquivalent: 6.2,
    recyclableValueUsd: 847,
    weeklyCo2Savings: [
      { day: "Mon", co2: 12, items: 180 },
      { day: "Tue", co2: 15, items: 220 },
      { day: "Wed", co2: 11, items: 165 },
      { day: "Thu", co2: 18, items: 270 },
      { day: "Fri", co2: 14, items: 210 },
      { day: "Sat", co2: 22, items: 330 },
      { day: "Sun", co2: 8, items: 120 },
    ],
    sortingSuccessRate: 98.2,
    itemsRecycled: 3847,
    areaCleanedKm2: 12.4,
    efficiencyRate: 94,
    targetZoneClearedPct: 78,
    targetZoneAreaM2: 16000,
  },
  bins: {
    plastic: {
      type: "Plastic",
      level: 67,
      mass: 2.4,
      color: "bg-ai-cyan",
      bgColor: "border-ai-cyan/30 bg-ai-cyan/5",
      icon: "♻️",
      lastEmpty: "4h ago",
      timestamp: now - 4 * 60 * 60 * 1000,
    },
    organic: {
      type: "Organic",
      level: 82,
      mass: 3.1,
      color: "bg-eco-green",
      bgColor: "border-eco-green/30 bg-eco-green/5",
      icon: "🌱",
      lastEmpty: "2h ago",
      timestamp: now - 2 * 60 * 60 * 1000,
    },
    paper: {
      type: "Paper/Glass",
      level: 45,
      mass: 1.8,
      color: "bg-solar-amber",
      bgColor: "border-solar-amber/30 bg-solar-amber/5",
      icon: "📄",
      lastEmpty: "6h ago",
      timestamp: now - 6 * 60 * 60 * 1000,
    },
  },
  safety: {
    status: "online",
    networkActive: true,
    uptimeHours: 4.2,
    wifiSignalDbm: -58,
    cloudLatencyMs: 42,
    packetLossPercent: 0,
    cpuLoad: 42,
    memoryPercent: 61,
    storagePercent: 48,
    motorStatus: [
      { id: 1, name: "Front Left", current: 2.4, max: 5.0, temp: 45 },
      { id: 2, name: "Front Right", current: 2.2, max: 5.0, temp: 42 },
      { id: 3, name: "Rear Left", current: 2.8, max: 5.0, temp: 48 },
      { id: 4, name: "Rear Right", current: 2.1, max: 5.0, temp: 44 },
    ],
    imuIndicators: [
      { axis: "Roll", value: 2.3, maxDeviation: 15 },
      { axis: "Pitch", value: -1.8, maxDeviation: 15 },
      { axis: "Yaw", value: 0.5, maxDeviation: 15 },
    ],
  },
  alerts: {
    alert_1: {
      id: "alert_1",
      type: "success",
      message: "Waste collected",
      time: "2m ago",
      timestamp: now - 2 * 60 * 1000,
    },
    alert_2: {
      id: "alert_2",
      type: "info",
      message: "Solar charging active",
      time: "5m ago",
      timestamp: now - 5 * 60 * 1000,
    },
    alert_3: {
      id: "alert_3",
      type: "warning",
      message: "Bin capacity high",
      time: "9m ago",
      timestamp: now - 9 * 60 * 1000,
    },
  },
};

function cloneValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function mergeConfig(partial: Partial<StaticDashboardConfig> | null | undefined): StaticDashboardConfig {
  const base = cloneValue(defaultStaticConfig);
  if (!partial || typeof partial !== "object") {
    return base;
  }

  return {
    ...base,
    ...partial,
    dashboard: { ...base.dashboard, ...(partial.dashboard ?? {}) },
    navigation: { ...base.navigation, ...(partial.navigation ?? {}) },
    energy: { ...base.energy, ...(partial.energy ?? {}) },
    vision: { ...base.vision, ...(partial.vision ?? {}) },
    analytics: { ...base.analytics, ...(partial.analytics ?? {}) },
    analyticsExtras: { ...base.analyticsExtras, ...(partial.analyticsExtras ?? {}) },
    impact: { ...base.impact, ...(partial.impact ?? {}) },
    bins: partial.bins ? cloneValue(partial.bins) : base.bins,
    safety: {
      ...base.safety,
      ...(partial.safety ?? {}),
      motorStatus: partial.safety?.motorStatus ? cloneValue(partial.safety.motorStatus) : base.safety.motorStatus,
      imuIndicators: partial.safety?.imuIndicators ? cloneValue(partial.safety.imuIndicators) : base.safety.imuIndicators,
    },
    alerts: partial.alerts ? cloneValue(partial.alerts) : base.alerts,
  };
}

export function getStaticConfig(): StaticDashboardConfig {
  if (typeof window === "undefined") {
    return cloneValue(defaultStaticConfig);
  }

  try {
    const raw = window.localStorage.getItem(STATIC_CONFIG_STORAGE_KEY);
    if (!raw) {
      return cloneValue(defaultStaticConfig);
    }

    return mergeConfig(JSON.parse(raw) as Partial<StaticDashboardConfig>);
  } catch (error) {
    console.error("Failed to read static dashboard config:", error);
    return cloneValue(defaultStaticConfig);
  }
}

export function saveStaticConfig(config: StaticDashboardConfig) {
  if (typeof window === "undefined") {
    return;
  }

  const normalized = mergeConfig(config);
  window.localStorage.setItem(STATIC_CONFIG_STORAGE_KEY, JSON.stringify(normalized));
  window.dispatchEvent(new CustomEvent(STATIC_CONFIG_EVENT));
}

export function resetStaticConfig() {
  saveStaticConfig(cloneValue(defaultStaticConfig));
}

export function isStaticDataEnabled(): boolean {
  return getStaticConfig().useStaticData;
}

export function getStaticSection<K extends StaticSectionKey>(section: K): StaticDashboardConfig[K] {
  return getStaticConfig()[section];
}
