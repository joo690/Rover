/**
 * Script to initialize Firebase Realtime Database with default data
 * Run this once to set up the initial database structure
 * 
 * Usage: Import and call initializeDatabase() from your app or run as a script
 */

import { ref, set } from "firebase/database";
import { database } from "@/lib/firebase";
import { FIREBASE_DB_PATHS } from "@/config/firebaseConfig";

export async function initializeDatabase() {
  if (!database) {
    throw new Error(
      "Firebase database is not initialized. Please check:\n" +
      "1. Your .env file has all Firebase configuration variables\n" +
      "2. You've restarted the dev server after creating .env\n" +
      "3. Your Firebase Realtime Database is enabled in Firebase Console"
    );
  }

  try {
    console.log("Initializing Firebase database...");

    // Dashboard data
    await set(ref(database, FIREBASE_DB_PATHS.DASHBOARD), {
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
    });

    // Bins data
    await set(ref(database, FIREBASE_DB_PATHS.BINS), {
      plastic: {
        type: "Plastic",
        level: 67,
        mass: 2.4,
        color: "bg-ai-cyan",
        bgColor: "border-ai-cyan/30 bg-ai-cyan/5",
        icon: "♻️",
        lastEmpty: "4h ago",
        timestamp: Date.now() - 4 * 60 * 60 * 1000,
      },
      organic: {
        type: "Organic",
        level: 82,
        mass: 3.1,
        color: "bg-eco-green",
        bgColor: "border-eco-green/30 bg-eco-green/5",
        icon: "🌱",
        lastEmpty: "2h ago",
        timestamp: Date.now() - 2 * 60 * 60 * 1000,
      },
      paper: {
        type: "Paper/Glass",
        level: 45,
        mass: 1.8,
        color: "bg-solar-amber",
        bgColor: "border-solar-amber/30 bg-solar-amber/5",
        icon: "📄",
        lastEmpty: "6h ago",
        timestamp: Date.now() - 6 * 60 * 60 * 1000,
      },
    });

    // Energy data
    await set(ref(database, FIREBASE_DB_PATHS.ENERGY), {
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
    });

    // Navigation data
    await set(ref(database, FIREBASE_DB_PATHS.NAVIGATION), {
      latitude: 31.2156,
      longitude: 29.9553,
      speed: 1.2,
      heading: 45,
      totalDistance: 847,
      pathEfficiency: 94,
      currentZone: "A-3",
      plannedPath: [],
      actualPath: [],
      obstacles: [],
    });

    // Vision data
    await set(ref(database, FIREBASE_DB_PATHS.VISION), {
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
    });

    // Analytics data
    await set(ref(database, FIREBASE_DB_PATHS.ANALYTICS), {
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
    });

    // Impact data
    await set(ref(database, FIREBASE_DB_PATHS.IMPACT), {
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
    });

    // Initial alerts
    await set(ref(database, FIREBASE_DB_PATHS.ALERTS), {
      alert1: {
        id: "alert1",
        type: "success",
        message: "Waste item collected - Plastic bottle",
        time: "12s ago",
        timestamp: Date.now() - 12000,
      },
      alert2: {
        id: "alert2",
        type: "info",
        message: "Solar charging optimal - 340W input",
        time: "45s ago",
        timestamp: Date.now() - 45000,
      },
      alert3: {
        id: "alert3",
        type: "warning",
        message: "Organic bin at 78% capacity",
        time: "2m ago",
        timestamp: Date.now() - 120000,
      },
      alert4: {
        id: "alert4",
        type: "success",
        message: "AI detected recyclable item",
        time: "3m ago",
        timestamp: Date.now() - 180000,
      },
      alert5: {
        id: "alert5",
        type: "info",
        message: "Navigation recalculated - new path",
        time: "5m ago",
        timestamp: Date.now() - 300000,
      },
    });

    // Cloud data - Mission logs
    await set(ref(database, FIREBASE_DB_PATHS.MISSION_LOGS), {
      log1: {
        id: "M-2024-001",
        time: "14:32:15",
        type: "Collection",
        status: "Complete",
        items: 12,
        timestamp: Date.now() - 1000 * 60 * 5,
      },
      log2: {
        id: "M-2024-002",
        time: "14:28:42",
        type: "Navigation",
        status: "Complete",
        items: 0,
        timestamp: Date.now() - 1000 * 60 * 8,
      },
      log3: {
        id: "M-2024-003",
        time: "14:25:18",
        type: "Collection",
        status: "Complete",
        items: 8,
        timestamp: Date.now() - 1000 * 60 * 12,
      },
    });

    // Cloud data - Error logs
    await set(ref(database, FIREBASE_DB_PATHS.ERROR_LOGS), {
      log1: {
        time: "14:30:22",
        level: "INFO",
        message: "[VISION] Object detected: plastic_bottle (conf: 0.98)",
        timestamp: Date.now() - 1000 * 60 * 2,
      },
      log2: {
        time: "14:30:21",
        level: "DEBUG",
        message: "[NAV] Waypoint reached: lat=31.2156, lng=29.9553",
        timestamp: Date.now() - 1000 * 60 * 2,
      },
      log3: {
        time: "14:30:20",
        level: "INFO",
        message: "[ARM] Pickup sequence initiated",
        timestamp: Date.now() - 1000 * 60 * 2,
      },
    });

    console.log("✅ Database initialized successfully!");
    return true;
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    throw error;
  }
}

