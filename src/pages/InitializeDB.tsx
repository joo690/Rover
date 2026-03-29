/**
 * One-time page to initialize Firebase database
 * Visit /initialize-db in your browser to run this
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { initializeDatabase } from "@/scripts/initializeFirebase";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export default function InitializeDB() {
  const { t } = useLanguage();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleInitialize = async () => {
    setStatus("loading");
    setMessage("Initializing database...");
    
    try {
      await initializeDatabase();
      setStatus("success");
      setMessage("Database initialized successfully! You can now use the app. Refresh the page to see the data.");
    } catch (error) {
      setStatus("error");
      const errorMessage = error instanceof Error ? error.message : "Failed to initialize database";
      setMessage(errorMessage);
      console.error("Initialization error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full card-surface p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">{t.initialize.title}</h1>
          <p className="text-muted-foreground">
            {t.initialize.subtitle}
          </p>
        </div>

        {status === "idle" && (
          <Button onClick={handleInitialize} className="w-full" size="lg">
            {t.initialize.button}
          </Button>
        )}

        {status === "loading" && (
          <div className="flex items-center justify-center gap-3 text-ai-cyan">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>{message}</span>
          </div>
        )}

        {status === "success" && (
          <div className="flex items-center gap-3 text-eco-green">
            <CheckCircle className="w-5 h-5" />
            <span>{message}</span>
          </div>
        )}

        {status === "error" && (
          <div className="flex items-center gap-3 text-alert-red">
            <XCircle className="w-5 h-5" />
            <span>{message}</span>
          </div>
        )}

        <div className="text-sm text-muted-foreground space-y-2">
          <p className="font-semibold">{t.initialize.whatThisDoes}</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>{t.initialize.createsDashboard}</li>
            <li>{t.initialize.setsUpBins}</li>
            <li>{t.initialize.initializesEnergy}</li>
            <li>{t.initialize.setsUpNavigation}</li>
            <li>{t.initialize.createsVision}</li>
            <li>{t.initialize.addsAnalytics}</li>
            <li>{t.initialize.setsUpAlerts}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

