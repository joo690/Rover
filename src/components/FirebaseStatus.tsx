/**
 * Component to show Firebase connection status and test real-time updates
 */

import { useState, useEffect } from "react";
import { ref, onValue, Unsubscribe } from "firebase/database";
import { database } from "@/lib/firebase";
import { CheckCircle, XCircle, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FirebaseStatus() {
  const [connected, setConnected] = useState<boolean | null>(null);
  const [testValue, setTestValue] = useState<any>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    if (!database) {
      setConnected(false);
      return;
    }

    setConnected(true);

    // Test real-time connection by listening to a test path
    const testRef = ref(database, "testConnection");
    
    const unsubscribe: Unsubscribe = onValue(
      testRef,
      (snapshot) => {
        const value = snapshot.val();
        setTestValue(value);
        setLastUpdate(new Date());
        console.log("🔄 Real-time update received:", value);
      },
      (error) => {
        console.error("❌ Real-time listener error:", error);
        setConnected(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const handleTestWrite = async () => {
    if (!database) return;
    
    try {
      const { set } = await import("firebase/database");
      const testRef = ref(database, "testConnection");
      await set(testRef, {
        timestamp: Date.now(),
        message: "Real-time test",
        value: Math.random(),
      });
      console.log("✅ Test write successful");
    } catch (error) {
      console.error("❌ Test write failed:", error);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-card border rounded-lg shadow-lg z-50 max-w-sm">
      <div className="flex items-center gap-2 mb-2">
        {connected === null ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Checking connection...</span>
          </>
        ) : connected ? (
          <>
            <CheckCircle className="w-4 h-4 text-eco-green" />
            <span className="text-sm font-medium text-eco-green">Firebase Connected</span>
          </>
        ) : (
          <>
            <XCircle className="w-4 h-4 text-alert-red" />
            <span className="text-sm font-medium text-alert-red">Firebase Disconnected</span>
          </>
        )}
      </div>

      {connected && (
        <div className="space-y-2 text-xs">
          <div>
            <span className="text-muted-foreground">Real-time updates: </span>
            <span className="text-eco-green">Active</span>
          </div>
          {lastUpdate && (
            <div>
              <span className="text-muted-foreground">Last update: </span>
              <span className="text-foreground">{lastUpdate.toLocaleTimeString()}</span>
            </div>
          )}
          {testValue && (
            <div className="p-2 bg-secondary rounded text-xs">
              <pre>{JSON.stringify(testValue, null, 2)}</pre>
            </div>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={handleTestWrite}
            className="w-full"
          >
            <RefreshCw className="w-3 h-3 mr-2" />
            Test Real-time
          </Button>
        </div>
      )}

      {!connected && (
        <div className="text-xs text-muted-foreground">
          Check browser console for details
        </div>
      )}
    </div>
  );
}

