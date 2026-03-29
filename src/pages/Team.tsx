import { Users, Github, Linkedin, Box, Calendar, DollarSign } from "lucide-react";

const teamMembers = [
  {
    name: "Fady Bottros",
    role: "Electronics & Sensors",
    avatar: "FB",
    color: "bg-ai-cyan",
    description: "Hardware integration, sensor calibration, and power management systems",
  },
  {
    name: "Safwat Haitham",
    role: "Mechanical Design",
    avatar: "SH",
    color: "bg-solar-amber",
    description: "CAD modeling, 3D printing, chassis design, and robotic arm mechanics",
  },
  {
    name: "Giovanni Ayman",
    role: "AI / ESP32 / App",
    avatar: "GA",
    color: "bg-eco-green",
    description: "Computer vision, machine learning models, and firmware development",
  },
  {
    name: "Beshoy Nader",
    role: "AI / ESP32 / App",
    avatar: "BN",
    color: "bg-primary",
    description: "Edge computing, cloud integration, and mobile application development",
  },
];

const timeline = [
  { day: "1-7", task: "Research & Planning", status: "complete" },
  { day: "8-14", task: "CAD Design & Prototyping", status: "complete" },
  { day: "15-21", task: "Electronics Assembly", status: "complete" },
  { day: "22-28", task: "Firmware Development", status: "complete" },
  { day: "29-35", task: "AI Model Training", status: "complete" },
  { day: "36-40", task: "Integration & Testing", status: "active" },
];

export default function Team() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Team & System Info</h1>
        <p className="text-muted-foreground">Project transparency and team credits</p>
      </div>

      {/* Team Members */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {teamMembers.map((member) => (
          <div key={member.name} className="card-surface p-6 text-center">
            <div
              className={`w-16 h-16 rounded-full ${member.color} flex items-center justify-center mx-auto mb-4 text-xl font-bold text-primary-foreground`}
            >
              {member.avatar}
            </div>
            <h3 className="font-semibold text-foreground">{member.name}</h3>
            <p className="text-sm text-eco-green font-medium">{member.role}</p>
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
              {member.description}
            </p>
            <div className="flex justify-center gap-2 mt-4">
              <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
                <Github className="w-4 h-4 text-muted-foreground" />
              </button>
              <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
                <Linkedin className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 3D CAD Viewer Placeholder */}
      <div className="card-surface p-6">
        <div className="flex items-center gap-2 mb-4">
          <Box className="w-5 h-5 text-ai-cyan" />
          <h3 className="font-semibold text-foreground">3D CAD Model</h3>
        </div>
        <div className="aspect-video rounded-lg bg-surface-elevated border border-border flex items-center justify-center">
          <div className="text-center">
            <Box className="w-16 h-16 text-ai-cyan/30 mx-auto mb-4 animate-spin-slow" />
            <p className="text-muted-foreground">Interactive 3D Model Viewer</p>
            <span className="text-xs text-muted-foreground">(Rotate to explore)</span>
          </div>
        </div>
      </div>

      {/* Budget & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget */}
        <div className="card-surface p-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-solar-amber" />
            <h3 className="font-semibold text-foreground">Project Budget</h3>
          </div>
          <div className="space-y-3">
            {[
              { item: "Raspberry Pi 4 + Camera", cost: "$85" },
              { item: "ESP32 Modules (x2)", cost: "$24" },
              { item: "Solar Panels + Controller", cost: "$120" },
              { item: "Motors + Drivers", cost: "$95" },
              { item: "5DOF Robotic Arm", cost: "$150" },
              { item: "Chassis & Materials", cost: "$110" },
              { item: "Sensors & Misc", cost: "$66" },
            ].map((item) => (
              <div key={item.item} className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">{item.item}</span>
                <span className="font-mono text-sm text-foreground">{item.cost}</span>
              </div>
            ))}
            <div className="flex justify-between items-center py-3 mt-2 border-t-2 border-eco-green/30">
              <span className="font-semibold text-foreground">Total Budget</span>
              <span className="font-mono text-xl font-bold text-eco-green">$650</span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="card-surface p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-eco-green" />
            <h3 className="font-semibold text-foreground">40-Day Project Timeline</h3>
          </div>
          <div className="space-y-3">
            {timeline.map((phase, index) => (
              <div key={phase.day} className="flex items-center gap-4">
                <div className="flex-shrink-0 w-16 text-xs font-mono text-muted-foreground">
                  Day {phase.day}
                </div>
                <div className="flex-1 h-8 rounded-lg overflow-hidden bg-secondary relative">
                  <div
                    className={`h-full rounded-lg ${
                      phase.status === "complete"
                        ? "bg-eco-green"
                        : phase.status === "active"
                        ? "bg-solar-amber animate-pulse"
                        : "bg-secondary"
                    }`}
                    style={{
                      width: phase.status === "active" ? "60%" : phase.status === "complete" ? "100%" : "0%",
                    }}
                  />
                  <span className="absolute inset-0 flex items-center px-3 text-xs font-medium text-foreground">
                    {phase.task}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Project Info */}
      <div className="card-eco p-6 text-center">
        <h3 className="text-2xl font-bold text-foreground mb-2">EcoRover</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          An autonomous 4WD robotic rover for intelligent waste collection and sorting,
          powered by solar energy and AI computer vision. Designed and built in 40 days
          as a demonstration of sustainable robotics technology.
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <span className="px-3 py-1 rounded-full bg-eco-green/10 text-eco-green text-sm">
            Solar Powered
          </span>
          <span className="px-3 py-1 rounded-full bg-ai-cyan/10 text-ai-cyan text-sm">
            AI Vision
          </span>
          <span className="px-3 py-1 rounded-full bg-solar-amber/10 text-solar-amber text-sm">
            Autonomous
          </span>
        </div>
      </div>
    </div>
  );
}
