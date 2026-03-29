import { useEffect, useMemo, useState } from "react";
import {
  getStaticSection,
  isStaticDataEnabled,
  STATIC_CONFIG_EVENT,
  STATIC_CONFIG_STORAGE_KEY,
  type StaticSectionKey,
} from "@/config/dashboardConfig";

export function useConfiguredData<T>(section: StaticSectionKey, fallbackData: T): T {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setVersion((current) => current + 1);
    const handleStorage = (event: StorageEvent) => {
      if (event.key === STATIC_CONFIG_STORAGE_KEY) {
        handleUpdate();
      }
    };

    window.addEventListener(STATIC_CONFIG_EVENT, handleUpdate as EventListener);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(STATIC_CONFIG_EVENT, handleUpdate as EventListener);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return useMemo(() => {
    if (typeof window === "undefined") {
      return fallbackData;
    }

    if (!isStaticDataEnabled()) {
      return fallbackData;
    }

    return getStaticSection(section) as T;
  }, [fallbackData, section, version]);
}
