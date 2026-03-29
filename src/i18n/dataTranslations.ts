/**
 * Helper functions to translate Firebase data values
 * These functions map Firebase data keys/values to translated strings
 */

import { useMemo, useCallback } from "react";
import { useLanguage } from "./LanguageContext";

/**
 * Translate bin type from Firebase key to localized string
 */
export function useTranslateBinType() {
  const { t, language } = useLanguage();
  
  return useCallback((binKey: string): string => {
    const normalizedKey = binKey.toLowerCase();
    return t.data.binTypes[normalizedKey as keyof typeof t.data.binTypes] || binKey;
  }, [t, language]);
}

/**
 * Translate waste type from Firebase value to localized string
 */
export function useTranslateWasteType() {
  const { t, language } = useLanguage();
  
  return useCallback((wasteType: string): string => {
    const normalizedKey = wasteType.toLowerCase();
    return t.data.wasteTypes[normalizedKey as keyof typeof t.data.wasteTypes] || wasteType;
  }, [t, language]);
}

/**
 * Translate detection type from Firebase value to localized string
 */
export function useTranslateDetectionType() {
  const { t, language } = useLanguage();
  
  return useCallback((detectionType: string): string => {
    // Normalize detection type (e.g., "Plastic Bottle" -> "plasticBottle")
    const normalizedKey = detectionType
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9]/g, "");
    
    // Try exact match first
    if (t.data.detectionTypes[normalizedKey]) {
      return t.data.detectionTypes[normalizedKey];
    }
    
    // Try partial matches
    const keys = Object.keys(t.data.detectionTypes);
    const matchedKey = keys.find(key => 
      normalizedKey.includes(key.toLowerCase()) || 
      key.toLowerCase().includes(normalizedKey)
    );
    
    return matchedKey ? t.data.detectionTypes[matchedKey] : detectionType;
  }, [t, language]);
}

/**
 * Translate status value from Firebase to localized string
 */
export function useTranslateStatus() {
  const { t, language } = useLanguage();
  
  return useCallback((status: string): string => {
    const normalizedKey = status.toLowerCase();
    return t.data.status[normalizedKey as keyof typeof t.data.status] || status;
  }, [t, language]);
}

/**
 * Translate thermal map label from Firebase to localized string
 */
export function useTranslateThermalLabel() {
  const { t, language } = useLanguage();
  
  return useCallback((label: string): string => {
    // Normalize label (e.g., "Motor 1" -> "motor1")
    const normalizedKey = label
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9]/g, "");
    
    return t.data.thermalLabels[normalizedKey as keyof typeof t.data.thermalLabels] || label;
  }, [t, language]);
}

/**
 * Translate zone name from Firebase to localized string
 */
export function useTranslateZone() {
  const { t, language } = useLanguage();
  
  return useCallback((zone: string): string => {
    // Handle formats like "Zone A", "A-3", "Zone A-3"
    const zoneMatch = zone.match(/zone\s*([a-z])/i);
    if (zoneMatch) {
      const zoneLetter = zoneMatch[1].toUpperCase();
      const zoneKey = `zone${zoneLetter}` as keyof typeof t.data.zones;
      if (t.data.zones[zoneKey]) {
        // If there's a suffix (like "-3"), append it
        const suffix = zone.replace(/zone\s*[a-z]/i, "").trim();
        return suffix ? `${t.data.zones[zoneKey]} ${suffix}` : t.data.zones[zoneKey];
      }
    }
    
    // Try direct match
    const normalizedKey = zone.toLowerCase().replace(/\s+/g, "");
    return t.data.zones[normalizedKey as keyof typeof t.data.zones] || zone;
  }, [t, language]);
}

/**
 * Translate alert message from Firebase
 * Supports template variables like {type}, {value}, {level}
 */
export function useTranslateAlertMessage() {
  const { t, language } = useLanguage();
  const translateBinType = useTranslateBinType();
  const translateWasteType = useTranslateWasteType();
  
  return useCallback((message: string): string => {
    // Check if message matches known patterns
    if (message.includes("Waste item collected")) {
      const match = message.match(/Waste item collected - (.+)/);
      if (match) {
        const wasteType = match[1];
        return t.data.alertMessages.wasteCollected.replace("{type}", translateWasteType(wasteType));
      }
    }
    
    if (message.includes("Solar charging optimal")) {
      const match = message.match(/(\d+)W input/);
      if (match) {
        return t.data.alertMessages.solarCharging.replace("{value}", match[1]);
      }
    }
    
    if (message.includes("bin at") && message.includes("% capacity")) {
      const match = message.match(/(\w+)\s+bin at (\d+)%/);
      if (match) {
        const binType = match[1];
        const level = match[2];
        return t.data.alertMessages.binCapacity
          .replace("{type}", translateBinType(binType))
          .replace("{level}", level);
      }
    }
    
    if (message.includes("AI detected recyclable item")) {
      return t.data.alertMessages.aiDetected;
    }
    
    if (message.includes("Navigation recalculated")) {
      return t.data.alertMessages.navigationRecalculated;
    }
    
    // If no pattern matches, return original message
    return message;
  }, [t, language, translateBinType, translateWasteType]);
}

/**
 * Hook that provides all translation functions
 */
export function useDataTranslations() {
  return {
    translateBinType: useTranslateBinType(),
    translateWasteType: useTranslateWasteType(),
    translateDetectionType: useTranslateDetectionType(),
    translateStatus: useTranslateStatus(),
    translateThermalLabel: useTranslateThermalLabel(),
    translateZone: useTranslateZone(),
    translateAlertMessage: useTranslateAlertMessage(),
  };
}

