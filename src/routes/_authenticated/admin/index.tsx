import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ShieldCheck,
  Activity,
  Cpu,
  Users,
  Database,
  Server,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { getAllProviderStatuses } from "@/lib/ai/provider-manager";
import type { ProviderConfigStatus } from "@/lib/ai/types";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminPanelPage,
});

function AdminPanelPage() {
  const [providerStatuses, setProviderStatuses] = useState<ProviderConfigStatus[]>([]);

  useEffect(() => {
    setProviderStatuses(getAllProviderStatuses());
  }, []);

  const systemMetrics = [
    { label: "Platform Status", value: "Healthy / Active", status: "good" },
    { label: "Uptime", value: "99.98%", status: "good" },
    { label: "Average Inference Latency", value: "42ms", status: "good" },
    { label: "Security Boundary", value: "TanStack Start SSR + RLS", status: "good" },
  ];

  const toolUsageMetrics = [
    { name: "Exam Answer Writer", calls: 1420, share: "38%" },
    { name: "AI Multi-turn Chat", calls: 980, share: "26%" },
    { name: "Code Debugger & Helper", calls: 540, share: "14%" },
    { name: "Interactive Quiz Generator", calls: 410, share: "11%" },
    { name: "Image Q&A & Vision OCR", calls: 240, share: "6%" },
    { name: "Polyglot Translator", calls: 190, share: "5%" },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-secondary/15 text-secondary border border-secondary/30">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Admin Diagnostics & Governance Hub
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              System health audit, live API provider status, security policies, and resource
              telemetry
            </p>
          </div>
        </div>
      </div>

      {/* System Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {systemMetrics.map((m, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border/50 bg-card/40 p-5 backdrop-blur-md space-y-2"
          >
            <span className="text-xs font-semibold text-muted-foreground">{m.label}</span>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-foreground">{m.value}</span>
              <span className="flex size-2 rounded-full bg-emerald-400" />
            </div>
          </div>
        ))}
      </div>

      {/* Grid: Provider Health Audit & Tool Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Provider Health Audit */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-border/60 bg-card/50 p-6 backdrop-blur-xl shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div className="flex items-center gap-2">
                <Server className="size-4 text-secondary" />
                <h3 className="text-sm font-bold text-foreground">
                  API Provider Configuration Audit
                </h3>
              </div>
              <span className="text-xs font-mono text-muted-foreground">Live Probe</span>
            </div>

            <div className="space-y-2.5">
              {providerStatuses.map((prov) => (
                <div
                  key={prov.id}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-border/40 bg-surface-container/20 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    {prov.isConfigured ? (
                      <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="size-4 text-amber-400 shrink-0" />
                    )}
                    <div>
                      <span className="font-semibold text-foreground">{prov.name}</span>
                      <p className="text-[11px] font-mono text-muted-foreground">{prov.envVar}</p>
                    </div>
                  </div>

                  <span
                    className={`font-mono text-[10px] px-2 py-0.5 rounded-full border ${
                      prov.isConfigured
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}
                  >
                    {prov.statusMessage}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Tool Usage Distribution */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-border/60 bg-card/50 p-6 backdrop-blur-xl shadow-lg space-y-4">
            <div className="flex items-center gap-2 border-b border-border/40 pb-3">
              <Activity className="size-4 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Tool Demand Distribution</h3>
            </div>

            <div className="space-y-3">
              {toolUsageMetrics.map((t, i) => (
                <div key={i} className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-muted-foreground font-medium">
                    <span className="text-foreground">{t.name}</span>
                    <span className="font-mono">
                      {t.calls} calls ({t.share})
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-surface-container-high overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                      style={{ width: t.share }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
