import { useMemo, useState, type ReactNode } from "react";
import { Settings2, Save, RotateCcw, Plus, Trash2, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  defaultStaticConfig,
  getStaticConfig,
  resetStaticConfig,
  saveStaticConfig,
  type AnalyticsExtras,
  type SafetyConfig,
  type StaticDashboardConfig,
} from "@/config/dashboardConfig";
import type { Alert, BinData } from "@/services/firebaseService";

function parseNumber(value: string, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

export default function Configuration() {
  const [config, setConfig] = useState<StaticDashboardConfig>(() => getStaticConfig());

  const alertEntries = useMemo(() => Object.entries(config.alerts), [config.alerts]);
  const binEntries = useMemo(() => Object.entries(config.bins), [config.bins]);

  const reloadSaved = () => {
    setConfig(getStaticConfig());
    toast.success("Configuration reloaded from saved browser data.");
  };

  const handleSave = () => {
    saveStaticConfig(config);
    toast.success("Dashboard configuration saved.");
  };

  const handleReset = () => {
    resetStaticConfig();
    setConfig(getStaticConfig());
    toast.success("Configuration reset to defaults.");
  };

  const updateAnalyticsExtras = <K extends keyof AnalyticsExtras>(key: K, value: AnalyticsExtras[K]) => {
    setConfig((prev) => ({
      ...prev,
      analyticsExtras: {
        ...prev.analyticsExtras,
        [key]: value,
      },
    }));
  };

  const updateSafety = <K extends keyof SafetyConfig>(key: K, value: SafetyConfig[K]) => {
    setConfig((prev) => ({
      ...prev,
      safety: {
        ...prev.safety,
        [key]: value,
      },
    }));
  };

  const updateBin = (binKey: string, field: keyof BinData, value: string | number) => {
    setConfig((prev) => ({
      ...prev,
      bins: {
        ...prev.bins,
        [binKey]: {
          ...prev.bins[binKey],
          [field]: value,
        },
      },
    }));
  };

  const updateAlert = (alertId: string, field: keyof Alert, value: string | number) => {
    setConfig((prev) => ({
      ...prev,
      alerts: {
        ...prev.alerts,
        [alertId]: {
          ...prev.alerts[alertId],
          [field]: value,
        },
      },
    }));
  };

  const removeAlert = (alertId: string) => {
    setConfig((prev) => {
      const next = { ...prev.alerts };
      delete next[alertId];
      return { ...prev, alerts: next };
    });
  };

  const addAlert = () => {
    const id = `alert_${Date.now()}`;
    setConfig((prev) => ({
      ...prev,
      alerts: {
        ...prev.alerts,
        [id]: {
          id,
          type: "info",
          message: "New alert",
          time: "now",
          timestamp: Date.now(),
        },
      },
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-ai-cyan/10 border border-ai-cyan/20">
              <Settings2 className="w-6 h-6 text-ai-cyan" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard Configuration</h1>
              <p className="text-muted-foreground">
                Edit all major dashboard numbers and chart datasets from one GUI page.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={reloadSaved}>
            <SlidersHorizontal className="w-4 h-4" />
            Reload saved
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4" />
            Reset defaults
          </Button>
          <Button variant="eco" onClick={handleSave}>
            <Save className="w-4 h-4" />
            Save changes
          </Button>
        </div>
      </div>

      <div className="card-surface p-5 border border-ai-cyan/20">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-semibold text-foreground">Static data mode</h2>
            <p className="text-sm text-muted-foreground">
              When enabled, all configured values below override Firebase/live values in this browser.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Live Firebase</span>
            <Switch
              checked={config.useStaticData}
              onCheckedChange={(checked) =>
                setConfig((prev) => ({
                  ...prev,
                  useStaticData: checked,
                }))
              }
            />
            <span className="text-sm font-medium text-foreground">Static GUI</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 xl:grid-cols-10 h-auto gap-2 bg-transparent p-0">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
          <TabsTrigger value="energy">Energy</TabsTrigger>
          <TabsTrigger value="vision">Vision</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="impact">Impact</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
          <TabsTrigger value="safety">Safety</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="card-surface p-6 space-y-6">
          <SectionTitle
            title="Dashboard metrics"
            subtitle="These values feed the main overview gauge, cards, mini map, bin widget, and energy widget."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <Field label="System Readiness %">
              <Input value={config.dashboard.systemReadiness} onChange={(e) => setConfig((prev) => ({ ...prev, dashboard: { ...prev.dashboard, systemReadiness: parseNumber(e.target.value) } }))} />
            </Field>
            <Field label="Motors %">
              <Input value={config.dashboard.motors} onChange={(e) => setConfig((prev) => ({ ...prev, dashboard: { ...prev.dashboard, motors: parseNumber(e.target.value) } }))} />
            </Field>
            <Field label="AI %">
              <Input value={config.dashboard.ai} onChange={(e) => setConfig((prev) => ({ ...prev, dashboard: { ...prev.dashboard, ai: parseNumber(e.target.value) } }))} />
            </Field>
            <Field label="Power %">
              <Input value={config.dashboard.power} onChange={(e) => setConfig((prev) => ({ ...prev, dashboard: { ...prev.dashboard, power: parseNumber(e.target.value) } }))} />
            </Field>
            <Field label="Waste Items Collected">
              <Input value={config.dashboard.wasteItemsCollected} onChange={(e) => setConfig((prev) => ({ ...prev, dashboard: { ...prev.dashboard, wasteItemsCollected: parseNumber(e.target.value) } }))} />
            </Field>
            <Field label="Detection Rate %">
              <Input value={config.dashboard.detectionRate} onChange={(e) => setConfig((prev) => ({ ...prev, dashboard: { ...prev.dashboard, detectionRate: parseNumber(e.target.value) } }))} />
            </Field>
            <Field label="CPU Load %">
              <Input value={config.dashboard.cpuLoad} onChange={(e) => setConfig((prev) => ({ ...prev, dashboard: { ...prev.dashboard, cpuLoad: parseNumber(e.target.value) } }))} />
            </Field>
            <Field label="Temperature °C">
              <Input value={config.dashboard.temperature} onChange={(e) => setConfig((prev) => ({ ...prev, dashboard: { ...prev.dashboard, temperature: parseNumber(e.target.value) } }))} />
            </Field>
            <Field label="Uptime Hours">
              <Input value={config.dashboard.uptime} onChange={(e) => setConfig((prev) => ({ ...prev, dashboard: { ...prev.dashboard, uptime: parseNumber(e.target.value) } }))} />
            </Field>
            <Field label="Distance m">
              <Input value={config.dashboard.distance} onChange={(e) => setConfig((prev) => ({ ...prev, dashboard: { ...prev.dashboard, distance: parseNumber(e.target.value) } }))} />
            </Field>
            <Field label="Power Output W">
              <Input value={config.dashboard.powerOutput} onChange={(e) => setConfig((prev) => ({ ...prev, dashboard: { ...prev.dashboard, powerOutput: parseNumber(e.target.value) } }))} />
            </Field>
          </div>
        </TabsContent>

        <TabsContent value="navigation" className="card-surface p-6 space-y-6">
          <SectionTitle
            title="Navigation + radar"
            subtitle="Edit the map metrics and the radar detections. Distance is plotted on a 0-100 scale on the radar."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <Field label="Latitude">
              <Input value={config.navigation.latitude} onChange={(e) => setConfig((prev) => ({ ...prev, navigation: { ...prev.navigation, latitude: parseNumber(e.target.value) } }))} />
            </Field>
            <Field label="Longitude">
              <Input value={config.navigation.longitude} onChange={(e) => setConfig((prev) => ({ ...prev, navigation: { ...prev.navigation, longitude: parseNumber(e.target.value) } }))} />
            </Field>
            <Field label="Speed m/s">
              <Input value={config.navigation.speed} onChange={(e) => setConfig((prev) => ({ ...prev, navigation: { ...prev.navigation, speed: parseNumber(e.target.value) } }))} />
            </Field>
            <Field label="Heading °">
              <Input value={config.navigation.heading} onChange={(e) => setConfig((prev) => ({ ...prev, navigation: { ...prev.navigation, heading: parseNumber(e.target.value) } }))} />
            </Field>
            <Field label="Total Distance m">
              <Input value={config.navigation.totalDistance} onChange={(e) => setConfig((prev) => ({ ...prev, navigation: { ...prev.navigation, totalDistance: parseNumber(e.target.value) } }))} />
            </Field>
            <Field label="Path Efficiency %">
              <Input value={config.navigation.pathEfficiency} onChange={(e) => setConfig((prev) => ({ ...prev, navigation: { ...prev.navigation, pathEfficiency: parseNumber(e.target.value) } }))} />
            </Field>
            <Field label="Current Zone">
              <Input value={config.navigation.currentZone} onChange={(e) => setConfig((prev) => ({ ...prev, navigation: { ...prev.navigation, currentZone: e.target.value } }))} />
            </Field>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-foreground">Obstacle radar points</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setConfig((prev) => ({
                    ...prev,
                    navigation: {
                      ...prev.navigation,
                      obstacles: [
                        ...prev.navigation.obstacles,
                        { angle: 0, distance: 50, type: "Static Object" },
                      ],
                    },
                  }))
                }
              >
                <Plus className="w-4 h-4" />
                Add point
              </Button>
            </div>

            <div className="space-y-3">
              {config.navigation.obstacles.map((obstacle, index) => (
                <div key={`${obstacle.type}-${index}`} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 rounded-xl border border-border bg-secondary/20">
                  <Field label="Angle °">
                    <Input value={obstacle.angle} onChange={(e) => setConfig((prev) => ({ ...prev, navigation: { ...prev.navigation, obstacles: prev.navigation.obstacles.map((item, itemIndex) => itemIndex === index ? { ...item, angle: parseNumber(e.target.value) } : item) } }))} />
                  </Field>
                  <Field label="Distance (0-100)">
                    <Input value={obstacle.distance} onChange={(e) => setConfig((prev) => ({ ...prev, navigation: { ...prev.navigation, obstacles: prev.navigation.obstacles.map((item, itemIndex) => itemIndex === index ? { ...item, distance: parseNumber(e.target.value) } : item) } }))} />
                  </Field>
                  <Field label="Type label">
                    <Input value={obstacle.type} onChange={(e) => setConfig((prev) => ({ ...prev, navigation: { ...prev.navigation, obstacles: prev.navigation.obstacles.map((item, itemIndex) => itemIndex === index ? { ...item, type: e.target.value } : item) } }))} />
                  </Field>
                  <div className="flex items-end">
                    <Button variant="outline" className="w-full" onClick={() => setConfig((prev) => ({ ...prev, navigation: { ...prev.navigation, obstacles: prev.navigation.obstacles.filter((_, itemIndex) => itemIndex !== index) } }))}>
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="energy" className="card-surface p-6 space-y-6">
          <SectionTitle
            title="Energy metrics + charts"
            subtitle="Edit headline values and both chart datasets."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <Field label="Solar Input W">
              <Input value={config.energy.solarInput} onChange={(e) => setConfig((prev) => ({ ...prev, energy: { ...prev.energy, solarInput: parseNumber(e.target.value) } }))} />
            </Field>
            <Field label="Consumption W">
              <Input value={config.energy.consumption} onChange={(e) => setConfig((prev) => ({ ...prev, energy: { ...prev.energy, consumption: parseNumber(e.target.value) } }))} />
            </Field>
            <Field label="Net Power W">
              <Input value={config.energy.netPower} onChange={(e) => setConfig((prev) => ({ ...prev, energy: { ...prev.energy, netPower: parseNumber(e.target.value) } }))} />
            </Field>
            <Field label="Battery Level %">
              <Input value={config.energy.batteryLevel} onChange={(e) => setConfig((prev) => ({ ...prev, energy: { ...prev.energy, batteryLevel: parseNumber(e.target.value) } }))} />
            </Field>
            <Field label="Battery Temp °C">
              <Input value={config.energy.batteryTemp} onChange={(e) => setConfig((prev) => ({ ...prev, energy: { ...prev.energy, batteryTemp: parseNumber(e.target.value) } }))} />
            </Field>
            <Field label="Autonomy Hours">
              <Input value={config.energy.autonomy} onChange={(e) => setConfig((prev) => ({ ...prev, energy: { ...prev.energy, autonomy: parseNumber(e.target.value) } }))} />
            </Field>
            <Field label="Generated Today kWh">
              <Input value={config.energy.generatedToday} onChange={(e) => setConfig((prev) => ({ ...prev, energy: { ...prev.energy, generatedToday: parseNumber(e.target.value) } }))} />
            </Field>
            <Field label="Consumed Today kWh">
              <Input value={config.energy.consumedToday} onChange={(e) => setConfig((prev) => ({ ...prev, energy: { ...prev.energy, consumedToday: parseNumber(e.target.value) } }))} />
            </Field>
            <div className="md:col-span-2 xl:col-span-4 flex items-center justify-between rounded-xl border border-border bg-secondary/20 p-4">
              <div>
                <p className="font-medium text-foreground">Charging state</p>
                <p className="text-sm text-muted-foreground">Controls the battery card status text.</p>
              </div>
              <Switch checked={config.energy.isCharging} onCheckedChange={(checked) => setConfig((prev) => ({ ...prev, energy: { ...prev.energy, isCharging: checked } }))} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-foreground">Solar history</h4>
              <Button variant="outline" size="sm" onClick={() => setConfig((prev) => ({ ...prev, energy: { ...prev.energy, solarHistory: [...prev.energy.solarHistory, { time: "00:00", production: 0, consumption: 0 }] } }))}>
                <Plus className="w-4 h-4" />
                Add point
              </Button>
            </div>
            {config.energy.solarHistory.map((point, index) => (
              <div key={`${point.time}-${index}`} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 rounded-xl border border-border bg-secondary/20">
                <Field label="Time">
                  <Input value={point.time} onChange={(e) => setConfig((prev) => ({ ...prev, energy: { ...prev.energy, solarHistory: prev.energy.solarHistory.map((item, itemIndex) => itemIndex === index ? { ...item, time: e.target.value } : item) } }))} />
                </Field>
                <Field label="Production">
                  <Input value={point.production} onChange={(e) => setConfig((prev) => ({ ...prev, energy: { ...prev.energy, solarHistory: prev.energy.solarHistory.map((item, itemIndex) => itemIndex === index ? { ...item, production: parseNumber(e.target.value) } : item) } }))} />
                </Field>
                <Field label="Consumption">
                  <Input value={point.consumption} onChange={(e) => setConfig((prev) => ({ ...prev, energy: { ...prev.energy, solarHistory: prev.energy.solarHistory.map((item, itemIndex) => itemIndex === index ? { ...item, consumption: parseNumber(e.target.value) } : item) } }))} />
                </Field>
                <div className="flex items-end">
                  <Button variant="outline" className="w-full" onClick={() => setConfig((prev) => ({ ...prev, energy: { ...prev.energy, solarHistory: prev.energy.solarHistory.filter((_, itemIndex) => itemIndex !== index) } }))}>
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-foreground">Battery history</h4>
              <Button variant="outline" size="sm" onClick={() => setConfig((prev) => ({ ...prev, energy: { ...prev.energy, batteryHistory: [...prev.energy.batteryHistory, { time: "00:00", level: 0 }] } }))}>
                <Plus className="w-4 h-4" />
                Add point
              </Button>
            </div>
            {config.energy.batteryHistory.map((point, index) => (
              <div key={`${point.time}-${index}`} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-xl border border-border bg-secondary/20">
                <Field label="Time">
                  <Input value={point.time} onChange={(e) => setConfig((prev) => ({ ...prev, energy: { ...prev.energy, batteryHistory: prev.energy.batteryHistory.map((item, itemIndex) => itemIndex === index ? { ...item, time: e.target.value } : item) } }))} />
                </Field>
                <Field label="Level %">
                  <Input value={point.level} onChange={(e) => setConfig((prev) => ({ ...prev, energy: { ...prev.energy, batteryHistory: prev.energy.batteryHistory.map((item, itemIndex) => itemIndex === index ? { ...item, level: parseNumber(e.target.value) } : item) } }))} />
                </Field>
                <div className="flex items-end">
                  <Button variant="outline" className="w-full" onClick={() => setConfig((prev) => ({ ...prev, energy: { ...prev.energy, batteryHistory: prev.energy.batteryHistory.filter((_, itemIndex) => itemIndex !== index) } }))}>
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-foreground">Thermal map cards</h4>
              <Button variant="outline" size="sm" onClick={() => setConfig((prev) => ({ ...prev, energy: { ...prev.energy, thermalMap: [...prev.energy.thermalMap, { label: "New Component", temp: 0, status: "normal" }] } }))}>
                <Plus className="w-4 h-4" />
                Add card
              </Button>
            </div>
            {config.energy.thermalMap.map((item, index) => (
              <div key={`${item.label}-${index}`} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 rounded-xl border border-border bg-secondary/20">
                <Field label="Label">
                  <Input value={item.label} onChange={(e) => setConfig((prev) => ({ ...prev, energy: { ...prev.energy, thermalMap: prev.energy.thermalMap.map((entry, entryIndex) => entryIndex === index ? { ...entry, label: e.target.value } : entry) } }))} />
                </Field>
                <Field label="Temp °C">
                  <Input value={item.temp} onChange={(e) => setConfig((prev) => ({ ...prev, energy: { ...prev.energy, thermalMap: prev.energy.thermalMap.map((entry, entryIndex) => entryIndex === index ? { ...entry, temp: parseNumber(e.target.value) } : entry) } }))} />
                </Field>
                <Field label="Status">
                  <Input value={item.status} onChange={(e) => setConfig((prev) => ({ ...prev, energy: { ...prev.energy, thermalMap: prev.energy.thermalMap.map((entry, entryIndex) => entryIndex === index ? { ...entry, status: e.target.value } : entry) } }))} />
                </Field>
                <div className="flex items-end">
                  <Button variant="outline" className="w-full" onClick={() => setConfig((prev) => ({ ...prev, energy: { ...prev.energy, thermalMap: prev.energy.thermalMap.filter((_, entryIndex) => entryIndex !== index) } }))}>
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="vision" className="card-surface p-6 space-y-6">
          <SectionTitle title="Vision + detection charts" subtitle="Edit pie-chart slices and the recent detections list." />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <Field label="Total Detections">
              <Input value={config.vision.totalDetections} onChange={(e) => setConfig((prev) => ({ ...prev, vision: { ...prev.vision, totalDetections: parseNumber(e.target.value) } }))} />
            </Field>
            <Field label="Accuracy %">
              <Input value={config.vision.accuracy} onChange={(e) => setConfig((prev) => ({ ...prev, vision: { ...prev.vision, accuracy: parseNumber(e.target.value) } }))} />
            </Field>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-foreground">Waste distribution slices</h4>
              <Button variant="outline" size="sm" onClick={() => setConfig((prev) => ({ ...prev, vision: { ...prev.vision, wasteTypeDistribution: [...prev.vision.wasteTypeDistribution, { name: "New", value: 0, color: "hsl(var(--muted-foreground))" }] } }))}>
                <Plus className="w-4 h-4" />
                Add slice
              </Button>
            </div>
            {config.vision.wasteTypeDistribution.map((item, index) => (
              <div key={`${item.name}-${index}`} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 rounded-xl border border-border bg-secondary/20">
                <Field label="Name">
                  <Input value={item.name} onChange={(e) => setConfig((prev) => ({ ...prev, vision: { ...prev.vision, wasteTypeDistribution: prev.vision.wasteTypeDistribution.map((entry, entryIndex) => entryIndex === index ? { ...entry, name: e.target.value } : entry) } }))} />
                </Field>
                <Field label="Value %">
                  <Input value={item.value} onChange={(e) => setConfig((prev) => ({ ...prev, vision: { ...prev.vision, wasteTypeDistribution: prev.vision.wasteTypeDistribution.map((entry, entryIndex) => entryIndex === index ? { ...entry, value: parseNumber(e.target.value) } : entry) } }))} />
                </Field>
                <Field label="Color string">
                  <Input value={item.color} onChange={(e) => setConfig((prev) => ({ ...prev, vision: { ...prev.vision, wasteTypeDistribution: prev.vision.wasteTypeDistribution.map((entry, entryIndex) => entryIndex === index ? { ...entry, color: e.target.value } : entry) } }))} />
                </Field>
                <div className="flex items-end">
                  <Button variant="outline" className="w-full" onClick={() => setConfig((prev) => ({ ...prev, vision: { ...prev.vision, wasteTypeDistribution: prev.vision.wasteTypeDistribution.filter((_, entryIndex) => entryIndex !== index) } }))}>
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-foreground">Recent detections</h4>
              <Button variant="outline" size="sm" onClick={() => setConfig((prev) => ({ ...prev, vision: { ...prev.vision, recentDetections: [...prev.vision.recentDetections, { id: Date.now(), type: "New Object", confidence: 0, time: "now" }] } }))}>
                <Plus className="w-4 h-4" />
                Add detection
              </Button>
            </div>
            {config.vision.recentDetections.map((item, index) => (
              <div key={`${item.id}-${index}`} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 rounded-xl border border-border bg-secondary/20">
                <Field label="ID">
                  <Input value={item.id} onChange={(e) => setConfig((prev) => ({ ...prev, vision: { ...prev.vision, recentDetections: prev.vision.recentDetections.map((entry, entryIndex) => entryIndex === index ? { ...entry, id: parseNumber(e.target.value) } : entry) } }))} />
                </Field>
                <Field label="Type">
                  <Input value={item.type} onChange={(e) => setConfig((prev) => ({ ...prev, vision: { ...prev.vision, recentDetections: prev.vision.recentDetections.map((entry, entryIndex) => entryIndex === index ? { ...entry, type: e.target.value } : entry) } }))} />
                </Field>
                <Field label="Confidence %">
                  <Input value={item.confidence} onChange={(e) => setConfig((prev) => ({ ...prev, vision: { ...prev.vision, recentDetections: prev.vision.recentDetections.map((entry, entryIndex) => entryIndex === index ? { ...entry, confidence: parseNumber(e.target.value) } : entry) } }))} />
                </Field>
                <Field label="Time label">
                  <Input value={item.time} onChange={(e) => setConfig((prev) => ({ ...prev, vision: { ...prev.vision, recentDetections: prev.vision.recentDetections.map((entry, entryIndex) => entryIndex === index ? { ...entry, time: e.target.value } : entry) } }))} />
                </Field>
                <div className="flex items-end">
                  <Button variant="outline" className="w-full" onClick={() => setConfig((prev) => ({ ...prev, vision: { ...prev.vision, recentDetections: prev.vision.recentDetections.filter((_, entryIndex) => entryIndex !== index) } }))}>
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="card-surface p-6 space-y-6">
          <SectionTitle title="Analytics metrics + charts" subtitle="Edit top metric cards, radar chart, bar chart, and AI insights text." />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
            <Field label="Peak Activity Value">
              <Input value={config.analyticsExtras.peakActivityValue} onChange={(e) => updateAnalyticsExtras("peakActivityValue", e.target.value)} />
            </Field>
            <Field label="Peak Activity Unit">
              <Input value={config.analyticsExtras.peakActivityUnit} onChange={(e) => updateAnalyticsExtras("peakActivityUnit", e.target.value)} />
            </Field>
            <Field label="Hotspot Zone">
              <Input value={config.analyticsExtras.hotspotZone} onChange={(e) => updateAnalyticsExtras("hotspotZone", e.target.value)} />
            </Field>
            <Field label="Pattern Match %">
              <Input value={config.analyticsExtras.patternMatch} onChange={(e) => updateAnalyticsExtras("patternMatch", parseNumber(e.target.value))} />
            </Field>
            <Field label="Trend Score %">
              <Input value={config.analyticsExtras.trendScore} onChange={(e) => updateAnalyticsExtras("trendScore", parseNumber(e.target.value))} />
            </Field>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-foreground">Zonal radar dataset</h4>
              <Button variant="outline" size="sm" onClick={() => setConfig((prev) => ({ ...prev, analytics: { ...prev.analytics, zonalData: [...prev.analytics.zonalData, { zone: "Zone", pollution: 0 }] } }))}>
                <Plus className="w-4 h-4" />
                Add zone
              </Button>
            </div>
            {config.analytics.zonalData.map((item, index) => (
              <div key={`${item.zone}-${index}`} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-xl border border-border bg-secondary/20">
                <Field label="Zone">
                  <Input value={item.zone} onChange={(e) => setConfig((prev) => ({ ...prev, analytics: { ...prev.analytics, zonalData: prev.analytics.zonalData.map((entry, entryIndex) => entryIndex === index ? { ...entry, zone: e.target.value } : entry) } }))} />
                </Field>
                <Field label="Pollution">
                  <Input value={item.pollution} onChange={(e) => setConfig((prev) => ({ ...prev, analytics: { ...prev.analytics, zonalData: prev.analytics.zonalData.map((entry, entryIndex) => entryIndex === index ? { ...entry, pollution: parseNumber(e.target.value) } : entry) } }))} />
                </Field>
                <div className="flex items-end">
                  <Button variant="outline" className="w-full" onClick={() => setConfig((prev) => ({ ...prev, analytics: { ...prev.analytics, zonalData: prev.analytics.zonalData.filter((_, entryIndex) => entryIndex !== index) } }))}>
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-foreground">Peak-time histogram</h4>
              <Button variant="outline" size="sm" onClick={() => setConfig((prev) => ({ ...prev, analytics: { ...prev.analytics, peakTimeData: [...prev.analytics.peakTimeData, { hour: "0:00", count: 0 }] } }))}>
                <Plus className="w-4 h-4" />
                Add bar
              </Button>
            </div>
            {config.analytics.peakTimeData.map((item, index) => (
              <div key={`${item.hour}-${index}`} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-xl border border-border bg-secondary/20">
                <Field label="Hour">
                  <Input value={item.hour} onChange={(e) => setConfig((prev) => ({ ...prev, analytics: { ...prev.analytics, peakTimeData: prev.analytics.peakTimeData.map((entry, entryIndex) => entryIndex === index ? { ...entry, hour: e.target.value } : entry) } }))} />
                </Field>
                <Field label="Count">
                  <Input value={item.count} onChange={(e) => setConfig((prev) => ({ ...prev, analytics: { ...prev.analytics, peakTimeData: prev.analytics.peakTimeData.map((entry, entryIndex) => entryIndex === index ? { ...entry, count: parseNumber(e.target.value) } : entry) } }))} />
                </Field>
                <div className="flex items-end">
                  <Button variant="outline" className="w-full" onClick={() => setConfig((prev) => ({ ...prev, analytics: { ...prev.analytics, peakTimeData: prev.analytics.peakTimeData.filter((_, entryIndex) => entryIndex !== index) } }))}>
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Field label="AI insights (one insight per line)">
            <Textarea
              className="min-h-[180px]"
              value={config.analyticsExtras.insights.join("\n")}
              onChange={(e) => updateAnalyticsExtras("insights", e.target.value.split("\n").map((line) => line.trim()).filter(Boolean))}
            />
          </Field>
        </TabsContent>

        <TabsContent value="impact" className="card-surface p-6 space-y-6">
          <SectionTitle title="Impact page" subtitle="Edit hero numbers, weekly bars, and clean-area progress." />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <Field label="Monthly CO₂ Saved kg">
              <Input value={config.impact.monthlyCo2SavedKg} onChange={(e) => setConfig((prev) => ({ ...prev, impact: { ...prev.impact, monthlyCo2SavedKg: parseNumber(e.target.value) } }))} />
            </Field>
            <Field label="Trees Equivalent">
              <Input value={config.impact.treesEquivalent} onChange={(e) => setConfig((prev) => ({ ...prev, impact: { ...prev.impact, treesEquivalent: parseNumber(e.target.value) } }))} />
            </Field>
            <Field label="Recyclable Value USD">
              <Input value={config.impact.recyclableValueUsd} onChange={(e) => setConfig((prev) => ({ ...prev, impact: { ...prev.impact, recyclableValueUsd: parseNumber(e.target.value) } }))} />
            </Field>
            <Field label="Sorting Success %">
              <Input value={config.impact.sortingSuccessRate} onChange={(e) => setConfig((prev) => ({ ...prev, impact: { ...prev.impact, sortingSuccessRate: parseNumber(e.target.value) } }))} />
            </Field>
            <Field label="Items Recycled">
              <Input value={config.impact.itemsRecycled} onChange={(e) => setConfig((prev) => ({ ...prev, impact: { ...prev.impact, itemsRecycled: parseNumber(e.target.value) } }))} />
            </Field>
            <Field label="Area Cleaned km²">
              <Input value={config.impact.areaCleanedKm2} onChange={(e) => setConfig((prev) => ({ ...prev, impact: { ...prev.impact, areaCleanedKm2: parseNumber(e.target.value) } }))} />
            </Field>
            <Field label="Efficiency Rate %">
              <Input value={config.impact.efficiencyRate} onChange={(e) => setConfig((prev) => ({ ...prev, impact: { ...prev.impact, efficiencyRate: parseNumber(e.target.value) } }))} />
            </Field>
            <Field label="Target Zone Cleared %">
              <Input value={config.impact.targetZoneClearedPct} onChange={(e) => setConfig((prev) => ({ ...prev, impact: { ...prev.impact, targetZoneClearedPct: parseNumber(e.target.value) } }))} />
            </Field>
            <Field label="Target Zone Area m²">
              <Input value={config.impact.targetZoneAreaM2} onChange={(e) => setConfig((prev) => ({ ...prev, impact: { ...prev.impact, targetZoneAreaM2: parseNumber(e.target.value) } }))} />
            </Field>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-foreground">Weekly CO₂ bars</h4>
              <Button variant="outline" size="sm" onClick={() => setConfig((prev) => ({ ...prev, impact: { ...prev.impact, weeklyCo2Savings: [...prev.impact.weeklyCo2Savings, { day: "Day", co2: 0, items: 0 }] } }))}>
                <Plus className="w-4 h-4" />
                Add day
              </Button>
            </div>
            {config.impact.weeklyCo2Savings.map((item, index) => (
              <div key={`${item.day}-${index}`} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 rounded-xl border border-border bg-secondary/20">
                <Field label="Day">
                  <Input value={item.day} onChange={(e) => setConfig((prev) => ({ ...prev, impact: { ...prev.impact, weeklyCo2Savings: prev.impact.weeklyCo2Savings.map((entry, entryIndex) => entryIndex === index ? { ...entry, day: e.target.value } : entry) } }))} />
                </Field>
                <Field label="CO₂">
                  <Input value={item.co2} onChange={(e) => setConfig((prev) => ({ ...prev, impact: { ...prev.impact, weeklyCo2Savings: prev.impact.weeklyCo2Savings.map((entry, entryIndex) => entryIndex === index ? { ...entry, co2: parseNumber(e.target.value) } : entry) } }))} />
                </Field>
                <Field label="Items">
                  <Input value={item.items} onChange={(e) => setConfig((prev) => ({ ...prev, impact: { ...prev.impact, weeklyCo2Savings: prev.impact.weeklyCo2Savings.map((entry, entryIndex) => entryIndex === index ? { ...entry, items: parseNumber(e.target.value) } : entry) } }))} />
                </Field>
                <div className="flex items-end">
                  <Button variant="outline" className="w-full" onClick={() => setConfig((prev) => ({ ...prev, impact: { ...prev.impact, weeklyCo2Savings: prev.impact.weeklyCo2Savings.filter((_, entryIndex) => entryIndex !== index) } }))}>
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="storage" className="card-surface p-6 space-y-6">
          <SectionTitle title="Storage bins" subtitle="Edit bin fill levels, mass, colors, and labels used in the storage page and dashboard widget." />
          <div className="space-y-4">
            {binEntries.map(([binKey, bin]) => (
              <div key={binKey} className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-3 p-4 rounded-xl border border-border bg-secondary/20">
                <Field label="Key">
                  <Input value={binKey} disabled />
                </Field>
                <Field label="Type label">
                  <Input value={bin.type} onChange={(e) => updateBin(binKey, "type", e.target.value)} />
                </Field>
                <Field label="Icon">
                  <Input value={bin.icon} onChange={(e) => updateBin(binKey, "icon", e.target.value)} />
                </Field>
                <Field label="Level %">
                  <Input value={bin.level} onChange={(e) => updateBin(binKey, "level", parseNumber(e.target.value))} />
                </Field>
                <Field label="Mass kg">
                  <Input value={bin.mass} onChange={(e) => updateBin(binKey, "mass", parseNumber(e.target.value))} />
                </Field>
                <Field label="Last Empty label">
                  <Input value={bin.lastEmpty} onChange={(e) => updateBin(binKey, "lastEmpty", e.target.value)} />
                </Field>
                <Field label="Progress color class">
                  <Input value={bin.color} onChange={(e) => updateBin(binKey, "color", e.target.value)} />
                </Field>
                <Field label="Card background classes">
                  <Input value={bin.bgColor} onChange={(e) => updateBin(binKey, "bgColor", e.target.value)} />
                </Field>
                <Field label="Timestamp">
                  <Input value={bin.timestamp} onChange={(e) => updateBin(binKey, "timestamp", parseNumber(e.target.value, Date.now()))} />
                </Field>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="safety" className="card-surface p-6 space-y-6">
          <SectionTitle title="Safety + diagnostics" subtitle="Edit the live-looking safety values, motor cards, and IMU indicators." />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
            <Field label="Status">
              <Input value={config.safety.status} onChange={(e) => updateSafety("status", e.target.value)} />
            </Field>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Network Active</Label>
              <div className="h-10 flex items-center rounded-md border border-input px-3">
                <Switch checked={config.safety.networkActive} onCheckedChange={(checked) => updateSafety("networkActive", checked)} />
              </div>
            </div>
            <Field label="Uptime Hours">
              <Input value={config.safety.uptimeHours} onChange={(e) => updateSafety("uptimeHours", parseNumber(e.target.value))} />
            </Field>
            <Field label="Wi-Fi Signal dBm">
              <Input value={config.safety.wifiSignalDbm} onChange={(e) => updateSafety("wifiSignalDbm", parseNumber(e.target.value))} />
            </Field>
            <Field label="Cloud Latency ms">
              <Input value={config.safety.cloudLatencyMs} onChange={(e) => updateSafety("cloudLatencyMs", parseNumber(e.target.value))} />
            </Field>
            <Field label="Packet Loss %">
              <Input value={config.safety.packetLossPercent} onChange={(e) => updateSafety("packetLossPercent", parseNumber(e.target.value))} />
            </Field>
            <Field label="CPU Load %">
              <Input value={config.safety.cpuLoad} onChange={(e) => updateSafety("cpuLoad", parseNumber(e.target.value))} />
            </Field>
            <Field label="Memory %">
              <Input value={config.safety.memoryPercent} onChange={(e) => updateSafety("memoryPercent", parseNumber(e.target.value))} />
            </Field>
            <Field label="Storage %">
              <Input value={config.safety.storagePercent} onChange={(e) => updateSafety("storagePercent", parseNumber(e.target.value))} />
            </Field>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-foreground">Motor cards</h4>
              <Button variant="outline" size="sm" onClick={() => updateSafety("motorStatus", [...config.safety.motorStatus, { id: Date.now(), name: "Motor", current: 0, max: 1, temp: 0 }])}>
                <Plus className="w-4 h-4" />
                Add motor
              </Button>
            </div>
            {config.safety.motorStatus.map((motor, index) => (
              <div key={`${motor.id}-${index}`} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 rounded-xl border border-border bg-secondary/20">
                <Field label="ID">
                  <Input value={motor.id} onChange={(e) => updateSafety("motorStatus", config.safety.motorStatus.map((item, itemIndex) => itemIndex === index ? { ...item, id: parseNumber(e.target.value) } : item))} />
                </Field>
                <Field label="Name">
                  <Input value={motor.name} onChange={(e) => updateSafety("motorStatus", config.safety.motorStatus.map((item, itemIndex) => itemIndex === index ? { ...item, name: e.target.value } : item))} />
                </Field>
                <Field label="Current A">
                  <Input value={motor.current} onChange={(e) => updateSafety("motorStatus", config.safety.motorStatus.map((item, itemIndex) => itemIndex === index ? { ...item, current: parseNumber(e.target.value) } : item))} />
                </Field>
                <Field label="Max A">
                  <Input value={motor.max} onChange={(e) => updateSafety("motorStatus", config.safety.motorStatus.map((item, itemIndex) => itemIndex === index ? { ...item, max: parseNumber(e.target.value) } : item))} />
                </Field>
                <Field label="Temp °C">
                  <Input value={motor.temp} onChange={(e) => updateSafety("motorStatus", config.safety.motorStatus.map((item, itemIndex) => itemIndex === index ? { ...item, temp: parseNumber(e.target.value) } : item))} />
                </Field>
                <div className="md:col-span-5">
                  <Button variant="outline" onClick={() => updateSafety("motorStatus", config.safety.motorStatus.filter((_, itemIndex) => itemIndex !== index))}>
                    <Trash2 className="w-4 h-4" />
                    Remove motor
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-foreground">IMU indicators</h4>
              <Button variant="outline" size="sm" onClick={() => updateSafety("imuIndicators", [...config.safety.imuIndicators, { axis: "Axis", value: 0, maxDeviation: 15 }])}>
                <Plus className="w-4 h-4" />
                Add axis
              </Button>
            </div>
            {config.safety.imuIndicators.map((axis, index) => (
              <div key={`${axis.axis}-${index}`} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 rounded-xl border border-border bg-secondary/20">
                <Field label="Axis">
                  <Input value={axis.axis} onChange={(e) => updateSafety("imuIndicators", config.safety.imuIndicators.map((item, itemIndex) => itemIndex === index ? { ...item, axis: e.target.value } : item))} />
                </Field>
                <Field label="Value °">
                  <Input value={axis.value} onChange={(e) => updateSafety("imuIndicators", config.safety.imuIndicators.map((item, itemIndex) => itemIndex === index ? { ...item, value: parseNumber(e.target.value) } : item))} />
                </Field>
                <Field label="Max Deviation °">
                  <Input value={axis.maxDeviation} onChange={(e) => updateSafety("imuIndicators", config.safety.imuIndicators.map((item, itemIndex) => itemIndex === index ? { ...item, maxDeviation: parseNumber(e.target.value) } : item))} />
                </Field>
                <div className="flex items-end">
                  <Button variant="outline" className="w-full" onClick={() => updateSafety("imuIndicators", config.safety.imuIndicators.filter((_, itemIndex) => itemIndex !== index))}>
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="card-surface p-6 space-y-6">
          <SectionTitle title="Live alerts feed" subtitle="These alerts appear in the dashboard feed when static mode is enabled." />
          <div className="flex justify-end">
            <Button variant="outline" onClick={addAlert}>
              <Plus className="w-4 h-4" />
              Add alert
            </Button>
          </div>

          <div className="space-y-4">
            {alertEntries.map(([alertId, alert]) => (
              <div key={alertId} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 rounded-xl border border-border bg-secondary/20">
                <Field label="ID">
                  <Input value={alert.id} onChange={(e) => updateAlert(alertId, "id", e.target.value)} />
                </Field>
                <Field label="Type">
                  <Input value={alert.type} onChange={(e) => updateAlert(alertId, "type", e.target.value)} />
                </Field>
                <Field label="Message">
                  <Input value={alert.message} onChange={(e) => updateAlert(alertId, "message", e.target.value)} />
                </Field>
                <Field label="Time label">
                  <Input value={alert.time} onChange={(e) => updateAlert(alertId, "time", e.target.value)} />
                </Field>
                <Field label="Timestamp">
                  <Input value={alert.timestamp} onChange={(e) => updateAlert(alertId, "timestamp", parseNumber(e.target.value, Date.now()))} />
                </Field>
                <div className="md:col-span-5">
                  <Button variant="outline" onClick={() => removeAlert(alertId)}>
                    <Trash2 className="w-4 h-4" />
                    Remove alert
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notes" className="card-surface p-6 space-y-4">
          <SectionTitle title="How this works" subtitle="Important behavior notes for the new configuration system." />
          <div className="space-y-3 text-sm text-muted-foreground leading-6">
            <p>• This page stores the configuration in your browser using local storage. Save once, then refresh the site and the values stay there.</p>
            <p>• If you want the original live/Firebase values again, turn off Static data mode above, then save.</p>
            <p>• The obstacle radar on the Navigation page now reads from the editable obstacle list here, so it no longer depends on hardcoded SVG dots.</p>
            <p>• The charts on Energy, Vision, Analytics, and Impact all read from the datasets edited here.</p>
            <p>• Reset defaults will restore the prepared demo values shipped with the project.</p>
          </div>

          <div className="rounded-xl border border-border bg-secondary/20 p-4">
            <p className="text-sm text-foreground font-medium mb-2">Prepared default profiles</p>
            <Textarea className="min-h-[220px]" value={JSON.stringify(defaultStaticConfig, null, 2)} readOnly />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
