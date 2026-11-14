import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Sparkles,
  FileQuestion,
  BrainCircuit,
  MessageSquare,
  Image,
  Code2,
  Database,
  Languages,
  Search,
  ArrowRight,
  Zap,
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  Layers,
  History as HistoryIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllProviderStatuses } from "@/lib/ai/provider-manager";
import type { ProviderConfigStatus } from "@/lib/ai/types";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const [providerStatuses, setProviderStatuses] = useState<ProviderConfigStatus[]>([]);

  useEffect(() => {
    setProviderStatuses(getAllProviderStatuses());
  }, []);

  const quickTools = [
    {
      title: "Exam Answer Writer",
      description:
        "University model solver with 2 to 20 marks rubric engine and structured answers.",
      to: "/study/exam-answer",
      icon: FileQuestion,
      color: "text-secondary",
      badge: "TOP TOOL",
      badgeColor: "bg-secondary/15 text-secondary border-secondary/30",
    },
    {
      title: "AI Multi-turn Chat",
      description: "Streaming cognitive assistant with code highlighting and thread memory.",
      to: "/assistant/chat",
      icon: MessageSquare,
      color: "text-primary",
      badge: "STREAMING",
      badgeColor: "bg-primary/15 text-primary border-primary/30",
    },
    {
      title: "Image Q&A & Vision OCR",
      description: "Upload diagrams, math problems, or screenshots for step-by-step solutions.",
      to: "/assistant/image-qa",
      icon: Image,
      color: "text-secondary",
      badge: "MULTIMODAL",
      badgeColor: "bg-secondary/15 text-secondary border-secondary/30",
    },
    {
      title: "Interactive Quiz Generator",
      description:
        "Active testing engine with automatic scoring and detailed pedagogical explanations.",
      to: "/study/quiz",
      icon: BrainCircuit,
      color: "text-primary",
      badge: "STUDY",
      badgeColor: "bg-primary/15 text-primary border-primary/30",
    },
    {
      title: "Code Helper & Debugger",
      description: "Synthesize algorithms, fix stack traces, and analyze computational complexity.",
      to: "/developer/debugger",
      icon: Code2,
      color: "text-secondary",
      badge: "DEV",
      badgeColor: "bg-secondary/15 text-secondary border-secondary/30",
    },
    {
      title: "SQL Plan Studio",
      description: "Postgres, MySQL, and SQLite query generation, optimization, and conversion.",
      to: "/developer/sql",
      icon: Database,
      color: "text-primary",
      badge: "DATA",
      badgeColor: "bg-primary/15 text-primary border-primary/30",
    },
    {
      title: "Polyglot Translator",
      description: "Context-aware translation across 30+ languages preserving code blocks.",
      to: "/writing/translate",
      icon: Languages,
      color: "text-secondary",
      badge: "POLYGLOT",
      badgeColor: "bg-secondary/15 text-secondary border-secondary/30",
    },
    {
      title: "Live Web Research Lab",
      description:
        "Autonomous research synthesis citing verified live sources with academic rigor.",
      to: "/research/web",
      icon: Search,
      color: "text-primary",
      badge: "SYNTHESIS",
      badgeColor: "bg-primary/15 text-primary border-primary/30",
    },
  ];

  const suggestedPrompts = [
    {
      title: "Explain Quantum Annealing vs Gate Teleportation for 10 marks",
      tool: "/study/exam-answer",
    },
    {
      title: "Generate a 5-question Quiz on Transformers & Attention Mechanisms",
      tool: "/study/quiz",
    },
    {
      title: "Optimize an async Redis distributed locking algorithm in TypeScript",
      tool: "/developer/debugger",
    },
    {
      title: "Translate this legal terms clause into formal German and Japanese",
      tool: "/writing/translate",
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-surface-container-high/80 via-surface-container/60 to-surface-container-lowest p-6 md:p-8 backdrop-blur-xl shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex size-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-wider text-secondary">
                Mission Control Matrix
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Welcome to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary">
                NEXORA AI
              </span>
            </h1>
            <p className="max-w-2xl text-sm md:text-base text-muted-foreground leading-relaxed">
              One Intelligence. Infinite Possibilities. Enterprise-grade AI suite equipped with
              university rubric solvers, multi-turn reasoning, and full database persistence.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => navigate({ to: "/study/exam-answer" })}
              className="gap-2 bg-gradient-to-r from-primary to-primary-container text-on-primary font-semibold shadow-lg shadow-primary/20"
            >
              <FileQuestion className="size-4" />
              <span>Launch Exam Solver</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate({ to: "/assistant/chat" })}
              className="gap-2 border-border/70 hover:border-primary/50"
            >
              <MessageSquare className="size-4" />
              <span>Start AI Chat</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Suggested Prompt Chips */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <Zap className="size-3.5 text-secondary" />
          <span>Recommended Fast Workflows</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {suggestedPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => navigate({ to: p.tool })}
              className="flex flex-col justify-between p-3.5 text-left rounded-xl border border-border/50 bg-card/40 hover:bg-card hover:border-primary/40 transition-all duration-200 group"
            >
              <span className="text-xs font-medium text-foreground/90 group-hover:text-primary transition-colors line-clamp-2">
                "{p.title}"
              </span>
              <div className="mt-2.5 flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="font-mono text-secondary">Launch</span>
                <ArrowRight className="size-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Quick Access Tool Matrix */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Mission Control Tool Matrix</h2>
          </div>
          <span className="text-xs text-muted-foreground font-mono">8 Flagship Workspaces</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.to}
                to={tool.to}
                className="group relative flex flex-col justify-between rounded-2xl border border-border/50 bg-card/50 p-5 backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:bg-card hover:shadow-xl hover:shadow-primary/5"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-surface-container border border-border/40 group-hover:scale-105 transition-transform">
                      <Icon className={`size-5 ${tool.color}`} />
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-mono border font-semibold ${tool.badgeColor}`}
                    >
                      {tool.badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    {tool.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-secondary">
                  <span>Open Tool</span>
                  <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Real Provider Integration Status */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="size-4 text-secondary" />
            <h2 className="text-lg font-bold text-foreground">
              Connected Intelligence & Backend Services
            </h2>
          </div>
          <Link
            to="/settings"
            className="flex items-center gap-1 text-xs font-mono text-primary hover:underline"
          >
            <span>Manage API Keys</span>
            <ExternalLink className="size-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {providerStatuses.map((prov) => (
            <div
              key={prov.id}
              className="flex flex-col justify-between rounded-2xl border border-border/50 bg-card/40 p-4 backdrop-blur-md"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">{prov.name}</span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-mono border ${
                      prov.isConfigured
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}
                  >
                    {prov.isConfigured ? (
                      <CheckCircle2 className="size-3 text-emerald-400" />
                    ) : (
                      <AlertCircle className="size-3 text-amber-400" />
                    )}
                    <span>{prov.isConfigured ? "Operational" : "Waiting for Key"}</span>
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{prov.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-border/30 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span className="text-secondary">{prov.defaultModel}</span>
                <span>{prov.envVar}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
