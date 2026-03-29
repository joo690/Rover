import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useRealtimeData } from "@/hooks/useFirebaseData";
import { useConfiguredData } from "@/hooks/useConfiguredData";
import { DB_PATHS } from "@/services/firebaseService";
import type { BinData } from "@/services/firebaseService";
import { useTranslateBinType } from "@/i18n/dataTranslations";
import { useLanguage } from "@/i18n/LanguageContext";
import { defaultStaticConfig } from "@/config/dashboardConfig";

const defaultBins: Record<string, BinData> = defaultStaticConfig.bins;

export function BinLevelsCompact() {
  const { t, language } = useLanguage();
  const translateBinType = useTranslateBinType();
  const [liveBinsData] = useRealtimeData<Record<string, BinData>>(DB_PATHS.BINS, defaultBins);
  const binsData = useConfiguredData<Record<string, BinData>>("bins", liveBinsData);
  const bins = Object.values(binsData || defaultBins);

  const getBinKey = (bin: BinData): string => {
    const entry = Object.entries(binsData || defaultBins).find(([_, current]) => current.type === bin.type);
    return entry ? entry[0] : bin.type.toLowerCase();
  };

  const translatedBins = useMemo(
    () =>
      bins.map((bin) => {
        const binKey = getBinKey(bin);
        return {
          ...bin,
          translatedType: translateBinType(binKey),
        };
      }),
    [bins, binsData, translateBinType, language],
  );

  return (
    <div className="card-surface p-4">
      <h3 className="font-semibold text-foreground mb-4">Bin Capacity</h3>

      <div className="space-y-3">
        {translatedBins.map((bin) => (
          <div key={bin.type} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span>{bin.icon}</span>
                <span className="text-muted-foreground">{bin.translatedType}</span>
              </div>
              <span className={cn("font-mono font-medium", bin.level > 80 ? "text-alert-red" : "text-foreground")}>
                {bin.level}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <div className={cn("h-full rounded-full transition-all duration-500", bin.color, bin.level > 80 && "animate-pulse")} style={{ width: `${bin.level}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-2 rounded-lg bg-solar-amber/10 border border-solar-amber/20">
        <p className="text-xs text-solar-amber">⚠️ {t.storage.organicBinWarningMessage.split("82%")[0]}capacità</p>
      </div>
    </div>
  );
}
