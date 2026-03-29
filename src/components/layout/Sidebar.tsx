import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Navigation,
  Battery,
  Eye,
  Trash2,
  Shield,
  Leaf,
  Cloud,
  Brain,
  Cpu,
  TrendingUp,
  Users,
  Menu,
  X,
  Wifi,
  Signal,
  Settings2,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import { useRoverOnlineStatus } from "@/hooks/useRoverOnlineStatus";

const navItems = [
  { path: "/", key: "dashboard", icon: LayoutDashboard },
  { path: "/navigation", key: "navigation", icon: Navigation },
  { path: "/energy", key: "energy", icon: Battery },
  { path: "/vision", key: "vision", icon: Eye },
  { path: "/storage", key: "storage", icon: Trash2 },
  { path: "/safety", key: "safety", icon: Shield },
  { path: "/impact", key: "impact", icon: Leaf },
  { path: "/cloud", key: "cloud", icon: Cloud },
  { path: "/analytics", key: "analytics", icon: Brain },
  { path: "/ai-performance", key: "aiPerformance", icon: Cpu },
  { path: "/roi", key: "roi", icon: TrendingUp },
  { path: "/team", key: "team", icon: Users },
  { path: "/configuration", key: "configuration", icon: Settings2, customLabel: "Configuration" },
];

export function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useLanguage();
  const roverStatus = useRoverOnlineStatus();

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Mobile toggle */}
      <Button
        variant="glass"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border z-50 transition-all duration-300 flex flex-col",
          collapsed ? "-translate-x-full lg:translate-x-0 lg:w-20" : "w-72 lg:w-72"
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-eco flex items-center justify-center shadow-eco">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div className="animate-fade-in">
                <h1 className="font-bold text-lg text-foreground tracking-tight">EcoRover</h1>
                <p className="text-xs text-muted-foreground">{t.sidebar.missionControl}</p>
              </div>
            )}
          </div>
        </div>

        {/* Status bar */}
        {!collapsed && (
          <div className="px-4 py-3 border-b border-sidebar-border animate-fade-in">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Wifi
                  className={
                    roverStatus === "online"
                      ? "w-3.5 h-3.5 text-eco-green"
                      : "w-3.5 h-3.5 text-alert-red"
                  }
                />
                <span
                  className={
                    roverStatus === "online"
                      ? "text-muted-foreground"
                      : "text-alert-red"
                  }
                >
                  {roverStatus === "online" ? "Online" : "Offline"}
                </span>
              </div>
              {/* Removed duplicate second status; Wifi+label is enough */}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                      isActive
                        ? "bg-eco-green/10 text-eco-green border border-eco-green/30"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                    onClick={() => window.innerWidth < 1024 && setCollapsed(true)}
                  >
                    <item.icon
                      className={cn(
                        "w-5 h-5 flex-shrink-0 transition-colors",
                        isActive ? "text-eco-green" : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    {!collapsed && (
                      <span className="text-sm font-medium truncate animate-fade-in">
                        {item.customLabel ?? t.nav[item.key as keyof typeof t.nav]}
                      </span>
                    )}
                    {isActive && !collapsed && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-eco-green shadow-[0_0_10px_hsl(var(--eco-green))]" />
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Collapse toggle (desktop) */}
        <div className="hidden lg:block p-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center"
            onClick={() => setCollapsed(!collapsed)}
          >
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      </aside>
    </>
  );
}
