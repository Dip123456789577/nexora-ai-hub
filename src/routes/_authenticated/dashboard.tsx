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
  Cpu,
  Terminal,
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
      title: "University Exam Answer Writer",
      description:
        "University model solver with 2 to 20 marks rubric engine, structured arguments, and diagram specifications.",
      to: "/study/exam-answer",
      icon: FileQuestion,
      color: "text-secondary",
      badge: "FLAGSHIP",
      badgeColor: "bg-secondary/15 text-secondary border-secondary/30",
    },
    {
      title: "AI Cognitive Chat",
      description:
        "Streaming assistant powered by Gemini 2.5 Flash, Claude, and GPT-4o with multi-turn memory.",
      to: "/assistant/chat",
      icon: MessageSquare,
      color: "text-primary",
      badge: "STREAMING",
      badgeColor: "bg-primary/15 text-primary border-primary/30",
    },
    {
      title: "Image Q&A & Vision OCR",
      description:
        "Upload diagrams, mathematical formulas, or lecture slides for step-by-step analytical breakdown.",
      to: "/assistant/image-qa",
      icon: Image,
      color: "text-secondary",
      badge: "MULTIMODAL",
      badgeColor: "bg-secondary/15 text-secondary border-secondary/30",
    },
    {
      title: "AI Image Studio",
      description:
        "Neural diffusion visual synthesis supporting FLUX.1 and SDXL with 4K latent upscaling.",
      to: "/assistant/image-generator",
      icon: Sparkles,
      color: "text-primary",
      badge: "DIFFUSION",
      badgeColor: "bg-primary/15 text-primary border-primary/30",
    },
    {
      title: "Interactive Quiz Generator",
      description:
        "Active recall test generator with instant scoring, timer options, and detailed pedagogical explanations.",
      to: "/study/quiz",
      icon: BrainCircuit,
      color: "text-secondary",
      badge: "STUDY",
      badgeColor: "bg-secondary/15 text-secondary border-secondary/30",
    },
    {
      title: "Code Helper & Kernel Debugger",
      description:
        "Synthesize algorithms, fix stack traces, and analyze computational time and space complexity.",
      to: "/developer/debugger",
      icon: Code2,
      color: "text-primary",
      badge: "DEV HUB",
      badgeColor: "bg-primary/15 text-primary border-primary/30",
    },
    {
      title: "SQL Plan Studio",
      description:
        "Postgres, MySQL, and SQLite query generation, optimization, and cross-dialect translation.",
      to: "/developer/sql",
      icon: Database,
      color: "text-secondary",
      badge: "DATA",
      badgeColor: "bg-secondary/15 text-secondary border-secondary/30",
    },
    {
      title: "Polyglot Translator",
      description:
        "Context-aware translation across 30+ languages preserving markdown formatting and code syntax.",
      to: "/writing/translate",
      icon: Languages,
      color: "text-primary",
      badge: "POLYGLOT",
      badgeColor: "bg-primary/15 text-primary border-primary/30",
    },
    {
      title: "Live Web Research Lab",
      description:
        "Autonomous research literature synthesis citing verified live sources with academic rigor.",
      to: "/research/web",
      icon: Search,
      color: "text-secondary",
      badge: "SYNTHESIS",
      badgeColor: "bg-secondary/15 text-secondary border-secondary/30",
    },
  ];

  const suggestedPrompts = [
    {
      title: "Explain Quantum Annealing vs Gate Teleportation for 10 marks",
      tool: "/study/exam-answer",
    },
    {
      title: "Generate a 5-question Quiz on Transformers & Self-Attention",
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
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Hero Welcome Banner (Stitch 4 Aesthetic) */}
      <section className="relative overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 md:p-8 backdrop-blur-xl shadow-xl">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-secondary/8 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="flex size-2 rounded-full bg-secondary shadow-[0_0_8px_#4cd7f6] animate-pulse" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-secondary">
                Mission Control Matrix • Pro Max v2.4
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-on-surface">
              Welcome to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-secondary">
                NEXORA AI
              </span>
            </h1>
            <p className="max-w-2xl text-xs md:text-sm text-on-surface-variant leading-relaxed">
              One Intelligence. Infinite Possibilities. Enterprise intelligence suite equipped with
              university rubric solvers, multi-turn reasoning, vision OCR, and cloud persistence.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate({ to: "/study/exam-answer" })}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-container via-purple-600 to-inverse-primary px-5 py-2.5 text-xs font-bold text-white shadow-[0_0_20px_rgba(160,120,255,0.35)] hover:shadow-[0_0_28px_rgba(160,120,255,0.5)] transition-all"
            >
              <FileQuestion className="size-4 text-secondary" />
              <span>Launch Exam Solver</span>
            </button>
            <button
              onClick={() => navigate({ to: "/assistant/chat" })}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-outline-variant/40 bg-surface-container-high px-4 py-2.5 text-xs font-semibold text-on-surface hover:bg-surface-container-highest transition-colors shadow-sm"
            >
              <MessageSquare className="size-4 text-primary" />
              <span>Start AI Chat</span>
            </button>
          </div>
        </div>
      </section>

      {/* Cluster Telemetry Strip (Stitch 4 Spec) */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface-variant font-mono text-xs border border-outline-variant/30 shadow-sm">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2 text-secondary">
            <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_#4cd7f6] animate-pulse" />
            <span>Cluster: H100 Tensor-Core x8 Online</span>
          </div>
          <div className="flex items-center gap-1.5 text-outline">
            <span>VRAM: 14.2 / 80 GB (17.7%)</span>
          </div>
          <div className="flex items-center gap-1.5 text-outline">
            <span>Latency: ~1.4s / Generation</span>
          </div>
          <div className="flex items-center gap-1.5 text-outline">
            <span>
              Active Model: <span className="text-primary font-medium">Gemini 2.5 Flash</span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-outline">
          <span className="text-primary font-medium">FP8 TensorRT</span>
          <span>•</span>
          <span className="text-secondary font-mono">Real Backend Boundary</span>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-outline">
          Fast-Track Prompts
        </span>
        <div className="flex flex-wrap gap-2">
          {suggestedPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => navigate({ to: p.tool as string })}
              className="group flex items-center gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-3 py-1.5 text-xs text-on-surface-variant transition-all hover:border-primary/40 hover:bg-surface-container-low hover:text-on-surface"
            >
              <Sparkles className="size-3 text-secondary group-hover:rotate-12 transition-transform" />
              <span className="truncate max-w-xs">{p.title}</span>
              <ArrowRight className="size-3 text-outline group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </button>
          ))}
        </div>
      </div>

      {/* Quick Launch Studios Grid (Stitch 4 Obsidian Cards) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-on-surface tracking-tight">
            Cognitive Studio Matrix
          </h2>
          <span className="text-[10px] font-mono text-outline">9 Studios Connected</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickTools.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <div
                key={idx}
                onClick={() => navigate({ to: tool.to as string })}
                className="group relative flex flex-col justify-between rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-surface-container-low hover:shadow-[0_0_20px_rgba(208,188,255,0.12)]"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-surface-container-high border border-outline-variant/40 group-hover:border-primary/40 transition-colors shadow-sm">
                      <Icon className={`size-4 ${tool.color}`} />
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-mono font-bold border ${tool.badgeColor}`}
                    >
                      {tool.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                    {tool.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-on-surface-variant leading-relaxed line-clamp-2">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between pt-3 border-t border-outline-variant/20 text-xs">
                  <span className="font-mono text-[10px] text-outline">
                    Connected to Gemini API
                  </span>
                  <div className="flex items-center gap-1 text-secondary font-medium group-hover:translate-x-1 transition-transform">
                    <span>Launch</span>
                    <ArrowRight className="size-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Real-time Provider Telemetry Matrix */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="size-4 text-secondary" />
            <h2 className="text-sm font-bold text-on-surface uppercase tracking-wider font-mono">
              Provider & Infrastructure Telemetry
            </h2>
          </div>
          <Link
            to="/settings"
            className="text-xs font-mono text-primary hover:underline flex items-center gap-1"
          >
            <span>Manage Credentials</span>
            <ExternalLink className="size-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {providerStatuses.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-xl border border-outline-variant/25 bg-surface-container-lowest p-3.5"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex size-2.5 rounded-full ${
                    p.isConfigured ? "bg-secondary shadow-[0_0_8px_#4cd7f6]" : "bg-amber-400/80"
                  }`}
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-on-surface">{p.name}</span>
                    <span className="text-[9px] font-mono text-outline uppercase">
                      [{p.category}]
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-on-surface-variant">
                    {p.defaultModel}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`rounded-full px-2 py-0.5 text-[9px] font-mono border font-semibold ${
                    p.isConfigured
                      ? "bg-secondary/15 text-secondary border-secondary/30"
                      : "bg-surface-container-high text-outline border-outline-variant/40"
                  }`}
                >
                  {p.isConfigured ? "READY" : "OPTIONAL"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
