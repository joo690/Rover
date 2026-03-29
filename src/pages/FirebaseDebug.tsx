/**
 * Debug page to test Firebase real-time connection
 */

import { useState, useEffect } from "react";
import { ref, onValue, set, DataSnapshot, Unsubscribe } from "firebase/database";
import { database } from "@/lib/firebase";
import { FIREBASE_DB_PATHS } from "@/config/firebaseConfig";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle, RefreshCw, Database } from "lucide-react";

export default function FirebaseDebug() {
  const [connected, setConnected] = useState<boolean | null>(null);
  const [testValue, setTestValue] = useState<any>(null);
  const [updates, setUpdates] = useState<string[]>([]);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    if (!database) {
      setConnected(false);
      addUpdate("❌ Database not initialized");
      return;
    }

    setConnected(true);
    addUpdate("✅ Database initialized");

    // Test listener on a simple path
    const testRef = ref(database, "testConnection");
    const dashboardRef = ref(database, FIREBASE_DB_PATHS.DASHBOARD);

    const testUnsubscribe: Unsubscribe = onValue(
      testRef,
      (snapshot) => {
        const value = snapshot.val();
        setTestValue(value);
        addUpdate(`🔄 Test connection updated: ${JSON.stringify(value)}`);
      },
      (error) => {
        addUpdate(`❌ Test listener error: ${error.message}`);
      }
    );

    const dashboardUnsubscribe: Unsubscribe = onValue(
      dashboardRef,
      (snapshot) => {
        const value = snapshot.val();
        setDashboardData(value);
        addUpdate(`🔄 Dashboard updated: systemReadiness = ${value?.systemReadiness || 'N/A'}`);
      },
      (error) => {
        addUpdate(`❌ Dashboard listener error: ${error.message}`);
      }
    );

    return () => {
      testUnsubscribe();
      dashboardUnsubscribe();
    };
  }, []);

  const addUpdate = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setUpdates((prev) => [`[${timestamp}] ${message}`, ...prev.slice(0, 19)]);
  };

  const handleTestWrite = async () => {
    if (!database) {
      addUpdate("❌ Cannot write - database not initialized");
      return;
    }

    try {
      const testRef = ref(database, "testConnection");
      const testData = {
        timestamp: Date.now(),
        message: "Real-time test",
        value: Math.random(),
      };
      await set(testRef, testData);
      addUpdate(`✅ Test write successful: ${JSON.stringify(testData)}`);
    } catch (error) {
      addUpdate(`❌ Test write failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const handleUpdateDashboard = async () => {
    if (!database) {
      addUpdate("❌ Cannot write - database not initialized");
      return;
    }

    try {
      const dashboardRef = ref(database, `${FIREBASE_DB_PATHS.DASHBOARD}/systemReadiness`);
      const newValue = Math.floor(Math.random() * 100);
      await set(dashboardRef, newValue);
      addUpdate(`✅ Updated dashboard/systemReadiness to ${newValue}`);
    } catch (error) {
      addUpdate(`❌ Update failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Database className="w-6 h-6" />
          Firebase Real-time Debug
        </h1>
        <p className="text-muted-foreground">Test and verify Firebase real-time connection</p>
      </div>

      {/* Connection Status */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          {connected === null ? (
            <>
              <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
              <span className="font-medium">Checking connection...</span>
            </>
          ) : connected ? (
            <>
              <CheckCircle className="w-5 h-5 text-eco-green" />
              <span className="font-medium text-eco-green">Firebase Connected</span>
            </>
          ) : (
            <>
              <XCircle className="w-5 h-5 text-alert-red" />
              <span className="font-medium text-alert-red">Firebase Disconnected</span>
            </>
          )}
        </div>

        {database && (
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Database URL: {import.meta.env.VITE_FIREBASE_DATABASE_URL || "Not set"}</p>
            <p>Project ID: {import.meta.env.VITE_FIREBASE_PROJECT_ID || "Not set"}</p>
          </div>
        )}
      </Card>

      {/* Test Controls */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">Test Actions</h3>
        <div className="flex gap-2">
          <Button onClick={handleTestWrite} disabled={!connected}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Write Test Data
          </Button>
          <Button onClick={handleUpdateDashboard} disabled={!connected} variant="outline">
            Update Dashboard Value
          </Button>
        </div>
      </Card>

      {/* Current Values */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-2">Test Connection Value</h3>
          <div className="bg-secondary rounded p-3 font-mono text-sm">
            {testValue ? (
              <pre>{JSON.stringify(testValue, null, 2)}</pre>
            ) : (
              <span className="text-muted-foreground">No data yet</span>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-2">Dashboard Data</h3>
          <div className="bg-secondary rounded p-3 font-mono text-sm">
            {dashboardData ? (
              <div>
                <p>systemReadiness: {dashboardData.systemReadiness}</p>
                <p>wasteItemsCollected: {dashboardData.wasteItemsCollected}</p>
                <p>motors: {dashboardData.motors}</p>
              </div>
            ) : (
              <span className="text-muted-foreground">No data yet</span>
            )}
          </div>
        </Card>
      </div>

      {/* Update Log */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">Real-time Update Log</h3>
        <div className="bg-surface-overlay rounded p-4 h-64 overflow-y-auto font-mono text-xs space-y-1">
          {updates.length === 0 ? (
            <span className="text-muted-foreground">Waiting for updates...</span>
          ) : (
            updates.map((update, index) => (
              <div key={index} className="text-foreground">
                {update}
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Instructions */}
      <Card className="p-6 bg-ai-cyan/10 border-ai-cyan/20">
        <h4 className="font-semibold text-foreground mb-2">How to Test:</h4>
        <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
          <li>Click "Write Test Data" - should see update in log immediately</li>
          <li>Click "Update Dashboard Value" - should see dashboard update in log</li>
          <li>Go to Firebase Console and change a value manually</li>
          <li>Watch the log - you should see updates appear automatically</li>
          <li>Check browser console (F12) for detailed logs</li>
        </ol>
      </Card>
    </div>
  );
}

