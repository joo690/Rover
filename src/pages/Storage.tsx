import { useMemo } from "react";
import { Trash2, AlertTriangle, Scale, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRealtimeData } from "@/hooks/useFirebaseData";
import { useConfiguredData } from "@/hooks/useConfiguredData";
import { DB_PATHS } from "@/services/firebaseService";
import type { BinData } from "@/services/firebaseService";
import { formatDistanceToNow } from "date-fns";
import { useLanguage } from "@/i18n/LanguageContext";
import { useTranslateBinType } from "@/i18n/dataTranslations";
import { defaultStaticConfig } from "@/config/dashboardConfig";

const defaultBins: Record<string, BinData> = defaultStaticConfig.bins;

export default function Storage() {
  const { t, language } = useLanguage();
  const translateBinType = useTranslateBinType();
  const [liveBinsData] = useRealtimeData<Record<string, BinData>>(DB_PATHS.BINS, defaultBins);
  const binsData = useConfiguredData<Record<string, BinData>>("bins", liveBinsData);
  const bins = Object.values(binsData || defaultBins);
  const totalMass = bins.reduce((acc, bin) => acc + Number(bin.mass || 0), 0);

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
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t.storage.title}</h1>
        <p className="text-muted-foreground">{t.storage.subtitle}</p>
      </div>

      <div className="card-eco p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm uppercase tracking-widest text-muted-foreground">{t.common.totalCollectedMass}</h3>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-mono text-5xl font-bold text-foreground">{totalMass.toFixed(1)}</span>
              <span className="text-2xl text-muted-foreground">kg</span>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-eco-green/10 border border-eco-green/20">
            <Scale className="w-10 h-10 text-eco-green" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {translatedBins.map((bin) => (
          <div key={bin.type} className={cn("card-surface p-6 border", bin.bgColor || "border-border bg-secondary/20")}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2"><span>{bin.icon}</span>{bin.translatedType}</h3>
                <p className="text-sm text-muted-foreground mt-1">{t.common.mass}: {bin.mass} kg</p>
              </div>
              {bin.level > 80 && <AlertTriangle className="w-5 h-5 text-solar-amber" />}
            </div>

            <div className="relative h-56 rounded-2xl border border-border bg-secondary/40 overflow-hidden mb-5">
              <div className="absolute inset-x-0 bottom-0 transition-all duration-700 rounded-b-2xl" style={{ height: `${bin.level}%` }}>
                <div className={cn("w-full h-full", bin.color)} />
              </div>

              <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none">
                <div className="flex justify-end"><span className="text-xs text-muted-foreground/50">100%</span></div>
                <div className="flex justify-end"><span className="text-xs text-muted-foreground/50">50%</span></div>
                <div className="flex justify-end"><span className="text-xs text-muted-foreground/50">0%</span></div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-4xl font-bold drop-shadow-lg text-foreground">{bin.level}%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-2 rounded-lg bg-secondary/50">
                <Scale className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                <p className="font-mono text-lg font-bold text-foreground">{bin.mass} kg</p>
                <span className="text-xs text-muted-foreground">{t.common.mass}</span>
              </div>
              <div className="text-center p-2 rounded-lg bg-secondary/50">
                <RefreshCw className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                <p className="font-mono text-lg font-bold text-foreground">{bin.timestamp ? formatDistanceToNow(new Date(bin.timestamp), { addSuffix: true }) : bin.lastEmpty}</p>
                <span className="text-xs text-muted-foreground">{t.common.lastEmpty}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card-surface p-4 border border-solar-amber/30 bg-solar-amber/5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-solar-amber mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground">{t.storage.organicBinWarning}</h4>
              <p className="text-sm text-muted-foreground mt-1">{t.storage.organicBinWarningMessage}</p>
            </div>
          </div>
        </div>

        <div className="card-surface p-4 border border-eco-green/30 bg-eco-green/5">
          <div className="flex items-start gap-3">
            <Trash2 className="w-5 h-5 text-eco-green mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground">{t.common.collectionSummary}</h4>
              <p className="text-sm text-muted-foreground mt-1">{t.storage.collectionSummaryMessage}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
