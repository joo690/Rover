/**
 * Centralized Firebase Database Paths Configuration
 * 
 * This file contains all Firebase Realtime Database paths used throughout the application.
 * If a path needs to change, update it here and it will be reflected everywhere.
 * 
 * IMPORTANT: When adding new paths, ensure they match the database structure
 * and update all components that use them.
 */

export const FIREBASE_DB_PATHS = {
  // Main data paths
  DASHBOARD: "dashboard",
  BINS: "bins",
  ENERGY: "energy",
  NAVIGATION: "navigation",
  VISION: "vision",
  ALERTS: "alerts",
  ANALYTICS: "analytics",
  CLOUD_DATA: "cloudData",
  AI_PERFORMANCE: "aiPerformance",
  IMPACT: "impact",
  SAFETY: "safety",
  METRICS: "metrics",
  
  // Sub-paths (composed from main paths)
  get MISSION_LOGS() {
    return `${this.CLOUD_DATA}/missionLogs`;
  },
  
  get ERROR_LOGS() {
    return `${this.CLOUD_DATA}/errorLogs`;
  },
  
  // Bin-specific paths
  get BIN_PLASTIC() {
    return `${this.BINS}/plastic`;
  },
  
  get BIN_ORGANIC() {
    return `${this.BINS}/organic`;
  },
  
  get BIN_PAPER() {
    return `${this.BINS}/paper`;
  },
  
  // Navigation sub-paths
  get NAVIGATION_ACTUAL_PATH() {
    return `${this.NAVIGATION}/actualPath`;
  },
  
  get NAVIGATION_PLANNED_PATH() {
    return `${this.NAVIGATION}/plannedPath`;
  },
  
  // Vision sub-paths
  get VISION_RECENT_DETECTIONS() {
    return `${this.VISION}/recentDetections`;
  },
  
  get VISION_WASTE_DISTRIBUTION() {
    return `${this.VISION}/wasteTypeDistribution`;
  },
} as const;

/**
 * Type for database path keys
 */
export type FirebaseDbPath = typeof FIREBASE_DB_PATHS[keyof typeof FIREBASE_DB_PATHS];

/**
 * Helper function to build nested paths
 * @param basePath - Base path from FIREBASE_DB_PATHS
 * @param subPath - Sub-path to append
 * @returns Full path string
 */
export function buildDbPath(basePath: string, subPath: string): string {
  return `${basePath}/${subPath}`;
}

/**
 * Validate that a path exists in our configuration
 * @param path - Path to validate
 * @returns True if path is valid
 */
export function isValidDbPath(path: string): boolean {
  const allPaths = Object.values(FIREBASE_DB_PATHS);
  return allPaths.some(p => p === path || path.startsWith(p + "/"));
}

