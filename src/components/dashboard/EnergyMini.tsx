import { Sun, Zap, Battery } from "lucide-react";
import { useRealtimeData } from "@/hooks/useFirebaseData";
import { useConfiguredData } from "@/hooks/useConfiguredData";
import { DB_PATHS } from "@/services/firebaseService";
import type { EnergyData } from "@/services/firebaseService";
import { useLanguage } from "@/i18n/LanguageContext";
import { defaultStaticConfig } from "@/config/dashboardConfig";

const defaultEnergy: EnergyData = defaultStaticConfig.energy;

export function EnergyMini() {
  const { t } = useLanguage();
  const [liveEnergyData] = useRealtimeData<EnergyData>(DB_PATHS.ENERGY, defaultEnergy);
  const energyData = useConfiguredData<EnergyData>("energy", liveEnergyData);

  return (
    <div className="card-surface p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">{t.energy.batteryStatus}</h3>
        <Sun className="w-5 h-5 text-solar-amber animate-pulse-soft" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-3 rounded-lg bg-solar-amber/10 border border-solar-amber/20">
          <Sun className="w-5 h-5 text-solar-amber mx-auto mb-2" />
          <p className="font-mono text-lg font-bold text-foreground">{energyData.solarInput}W</p>
          <span className="text-xs text-muted-foreground">Solar In</span>
        </div>

        <div className="text-center p-3 rounded-lg bg-ai-cyan/10 border border-ai-cyan/20">
          <Zap className="w-5 h-5 text-ai-cyan mx-auto mb-2" />
          <p className="font-mono text-lg font-bold text-foreground">{energyData.consumption}W</p>
          <span className="text-xs text-muted-foreground">Consume</span>
        </div>

        <div className="text-center p-3 rounded-lg bg-eco-green/10 border border-eco-green/20">
          <Battery className="w-5 h-5 text-eco-green mx-auto mb-2" />
          <p className="font-mono text-lg font-bold text-foreground">{energyData.batteryLevel}%</p>
          <span className="text-xs text-muted-foreground">Battery</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{t.energy.netPower}</span>
        <span className="font-mono text-eco-green">+{energyData.netPower}W ⚡</span>
      </div>
    </div>
  );
}
