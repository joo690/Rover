import { Cpu, Timer, Target, AlertTriangle, RefreshCw, CheckCircle } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";

const failedDetections = [
  { id: 1, type: "Unknown Object", confidence: 42, reason: "Occlusion" },
  { id: 2, type: "Partial Match", confidence: 58, reason: "Low light" },
  { id: 3, type: "Misclassified", confidence: 67, reason: "Similar appearance" },
];

export default function AIPerformance() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">AI Performance</h1>
        <p className="text-muted-foreground">Sorting logic and model validation</p>
      </div>

      {/* Performance metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Avg Pickup Time"
          value="3.2"
          unit="sec"
          icon={Timer}
          variant="ai"
        />
        <MetricCard
          title="Success Rate"
          value="97.8"
          unit="%"
          icon={CheckCircle}
          variant="eco"
        />
        <MetricCard
          title="Inference Speed"
          value="45"
          unit="ms"
          icon={Cpu}
          variant="default"
        />
        <MetricCard
          title="Failed Attempts"
          value="12"
          unit="today"
          icon={AlertTriangle}
          variant="alert"
        />
      </div>

      {/* Efficiency timeline */}
      <div className="card-surface p-6">
        <h3 className="font-semibold text-foreground mb-4">Pickup Efficiency Timeline</h3>
        <div className="space-y-4">
          {["Detection", "Approach", "Pickup", "Classification", "Deposit"].map((stage, index) => {
            const times = [0.4, 1.2, 0.8, 0.3, 0.5];
            const maxTime = 3.2;
            const width = (times[index] / maxTime) * 100;
            
            return (
              <div key={stage} className="flex items-center gap-4">
                <span className="w-28 text-sm text-muted-foreground">{stage}</span>
                <div className="flex-1 h-6 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-ai-cyan to-eco-green transition-all duration-1000"
                    style={{ width: `${width}%` }}
                  />
                </div>
                <span className="w-16 text-right font-mono text-sm text-foreground">
                  {times[index]}s
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Failed Recognitions */}
      <div className="card-surface p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Failed Recognition Gallery</h3>
          <span className="text-sm text-muted-foreground">Last 24 hours</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {failedDetections.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-lg bg-alert-red/5 border border-alert-red/20"
            >
              <div className="aspect-video rounded-lg bg-surface-elevated mb-3 flex items-center justify-center border border-border">
                <Target className="w-8 h-8 text-alert-red/30" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{item.type}</span>
                  <span className="font-mono text-sm text-alert-red">{item.confidence}%</span>
                </div>
                <p className="text-sm text-muted-foreground">Reason: {item.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Retraining Section */}
      <div className="card-surface p-6 border border-ai-cyan/20">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-ai-cyan/10 border border-ai-cyan/20">
            <RefreshCw className="w-6 h-6 text-ai-cyan" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-2">Model Retraining Insights</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• 47 new samples added to training dataset this week</p>
              <p>• Low-light detection improved by 12% after last update</p>
              <p>• Recommended: Add more samples for "crushed cans" category</p>
              <p>• Next scheduled retraining: 3 days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
