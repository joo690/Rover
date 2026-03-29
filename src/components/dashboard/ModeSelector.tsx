import { useState } from "react";
import { Bot, Gamepad2, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageContext";

type Mode = "autonomous" | "manual" | "eco-save";

export function ModeSelector() {
  const { t } = useLanguage();
  const [activeMode, setActiveMode] = useState<Mode>("autonomous");

  const modes = [
    {
      id: "autonomous" as Mode,
      label: t.mode.autonomous,
      icon: Bot,
      description: t.mode.autonomousDesc,
    },
    {
      id: "manual" as Mode,
      label: t.mode.manual,
      icon: Gamepad2,
      description: t.mode.manualDesc,
    },
    {
      id: "eco-save" as Mode,
      label: t.mode.ecoSave,
      icon: Leaf,
      description: t.mode.ecoSaveDesc,
    },
  ];

  return (
    <div className="card-surface p-6">
      <h3 className="font-semibold text-foreground mb-4">{t.mode.operationMode}</h3>
      
      <div className="grid grid-cols-3 gap-3">
        {modes.map((mode) => (
          <Button
            key={mode.id}
            variant="mode"
            data-active={activeMode === mode.id}
            onClick={() => setActiveMode(mode.id)}
            className={cn(
              "flex flex-col items-center gap-2 h-auto py-4 px-3",
              activeMode === mode.id && "glow-eco"
            )}
          >
            <mode.icon
              className={cn(
                "w-6 h-6 transition-colors",
                activeMode === mode.id ? "text-eco-green" : "text-muted-foreground"
              )}
            />
            <span className="text-sm font-medium">{mode.label}</span>
            <span className="text-xs text-muted-foreground text-center leading-tight">
              {mode.description}
            </span>
          </Button>
        ))}
      </div>

      <div className="mt-4 p-3 rounded-lg bg-eco-green/5 border border-eco-green/20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-eco-green animate-pulse" />
          <span className="text-sm text-eco-green font-medium">
            {modes.find((m) => m.id === activeMode)?.label} {t.mode.modeActive}
          </span>
        </div>
      </div>
    </div>
  );
}
