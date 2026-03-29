/**
 * Firebase Admin Page - View and Modify Database
 * This page allows you to view and edit Firebase data directly from the app
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { firebaseService, DB_PATHS } from "@/services/firebaseService";
import { useRealtimeData } from "@/hooks/useFirebaseData";
import { Database, RefreshCw, Save, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { ref, set } from "firebase/database";
import { database } from "@/lib/firebase";

export default function FirebaseAdmin() {
  const [selectedPath, setSelectedPath] = useState<string>(DB_PATHS.DASHBOARD);
  const [data, setData] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [jsonInput, setJsonInput] = useState("");

  const paths = [
    { key: DB_PATHS.DASHBOARD, label: "Dashboard" },
    { key: DB_PATHS.BINS, label: "Bins" },
    { key: DB_PATHS.ENERGY, label: "Energy" },
    { key: DB_PATHS.NAVIGATION, label: "Navigation" },
    { key: DB_PATHS.VISION, label: "Vision" },
    { key: DB_PATHS.ALERTS, label: "Alerts" },
    { key: DB_PATHS.ANALYTICS, label: "Analytics" },
    { key: `${DB_PATHS.CLOUD_DATA}/missionLogs`, label: "Mission Logs" },
    { key: `${DB_PATHS.CLOUD_DATA}/errorLogs`, label: "Error Logs" },
  ];

  const [realtimeData] = useRealtimeData(selectedPath, null);

  useEffect(() => {
    if (realtimeData) {
      setData(realtimeData);
      setJsonInput(JSON.stringify(realtimeData, null, 2));
    } else {
      setData(null);
      setJsonInput("");
    }
  }, [realtimeData]);

  const handleSave = async () => {
    if (!database) {
      alert("Firebase database is not initialized. Please check your .env file.");
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);
      const dataRef = ref(database, selectedPath);
      await set(dataRef, parsed);
      setEditing(false);
      alert("Data saved successfully!");
    } catch (error) {
      alert("Error saving data: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="space-y-6 animate-fade-in p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Database className="w-6 h-6" />
            Firebase Database Admin
          </h1>
          <p className="text-muted-foreground">View and modify your Firebase Realtime Database</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          {editing && (
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          )}
        </div>
      </div>

      {/* Path Selector */}
      <div className="card-surface p-4">
        <h3 className="font-semibold text-foreground mb-3">Select Database Path</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {paths.map((path) => (
            <button
              key={path.key}
              onClick={() => {
                setSelectedPath(path.key);
                setEditing(false);
              }}
              className={cn(
                "px-4 py-2 rounded-lg border transition-colors text-sm",
                selectedPath === path.key
                  ? "bg-eco-green/10 border-eco-green text-eco-green"
                  : "bg-secondary border-border hover:bg-secondary/80"
              )}
            >
              {path.label}
            </button>
          ))}
        </div>
      </div>

      {/* Data Viewer/Editor */}
      <div className="card-surface p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground">Path: {selectedPath}</h3>
            <p className="text-sm text-muted-foreground">
              {data ? "Data loaded" : "No data found"}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setEditing(!editing)}
            disabled={!data}
          >
            {editing ? "Cancel Edit" : "Edit Data"}
          </Button>
        </div>

        {data ? (
          <div className="space-y-4">
            {editing ? (
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  JSON Data (Edit and click Save)
                </label>
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="w-full h-96 p-4 font-mono text-sm bg-surface-overlay border border-border rounded-lg focus:outline-none focus:border-eco-green/50 text-foreground"
                  spellCheck={false}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  ⚠️ Make sure the JSON is valid. Invalid JSON will cause an error.
                </p>
              </div>
            ) : (
              <div className="bg-surface-overlay rounded-lg p-4 overflow-auto">
                <pre className="text-sm font-mono text-foreground whitespace-pre-wrap">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No data found at this path.</p>
            <p className="text-sm mt-2">
              Initialize the database at{" "}
              <a href="/initialize-db" className="text-eco-green hover:underline">
                /initialize-db
              </a>
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card-surface p-4">
        <h3 className="font-semibold text-foreground mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/initialize-db")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Initialize Database
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open("https://console.firebase.google.com/", "_blank")}
          >
            <Database className="w-4 h-4 mr-2" />
            Open Firebase Console
          </Button>
        </div>
      </div>

      {/* Info */}
      <div className="card-surface p-4 bg-ai-cyan/10 border-ai-cyan/20">
        <h4 className="font-semibold text-foreground mb-2">💡 Tips</h4>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>Use Firebase Console for advanced editing and bulk operations</li>
          <li>Changes here update in real-time across all connected clients</li>
          <li>Always validate JSON before saving</li>
          <li>Backup important data before making major changes</li>
        </ul>
      </div>
    </div>
  );
}

