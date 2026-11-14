import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  FileQuestion,
  MessageSquare,
  Sparkles,
  BrainCircuit,
  Code2,
  Database,
  Languages,
  ArrowRight,
  Shield,
  Zap,
  Layers,
  Activity,
  CheckCircle2,
  Terminal,
  Cpu,
  Download,
  Copy,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import nexoraMark from "@/assets/nexora-mark.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NEXORA AI PRO MAX — One Intelligence. Infinite Possibilities." },
      {
        name: "description",
        content:
          "NEXORA AI Pro Max: Enterprise intelligence workspace featuring University Exam Solvers, Multimodal Vision, Code Kernels, and Research Synthesizers.",
      },
      {
        property: "og:title",
        content: "NEXORA AI PRO MAX — One Intelligence. Infinite Possibilities.",
      },
      {
        property: "og:description",
        content:
          "Enterprise AI suite with real backend service integrations and Synthetic Obsidian UI.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@NexoraAI" },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const [activeTab, setActiveTab] = useState<"exam" | "chat" | "code">("exam");

  const highlights = [
    {
      icon: FileQuestion,
      title: "University Exam Answer Writer",
      description:
        "University Model Solver Rubric Engine v4.2. Formulates structured exam answers from 2 to 20 marks with definitions, numbered arguments, examples, and diagrammatic breakdowns.",
      badge: "FLAGSHIP",
      badgeColor: "bg-secondary/15 text-secondary border-secondary/30",
      to: "/study/exam-answer",
    },
    {
      icon: MessageSquare,
      title: "Cognitive Multi-Turn Chat",
      description:
        "Low-latency streaming assistant powered by Google Gemini, OpenAI, and Anthropic with syntax highlighting, markdown rendering, and thread memory.",
      badge: "STREAMING",
      badgeColor: "bg-primary/15 text-primary border-primary/30",
      to: "/assistant/chat",
    },
    {
      icon: BrainCircuit,
      title: "Interactive Quiz & Flashcards",
      description:
        "Adaptive spaced-repetition flashcards with 3D flip physics and automated interactive quizzes with pedagogical explanations and scoring.",
      badge: "ACTIVE RECALL",
      badgeColor: "bg-secondary/15 text-secondary border-secondary/30",
      to: "/study/quiz",
    },
    {
      icon: Code2,
      title: "Developer Hub & Debugger",
      description:
        "Algorithm synthesizer, runtime stack trace debugger, and Big-O computational complexity analyzer across 10+ programming languages.",
      badge: "DEV HUB",
      badgeColor: "bg-primary/15 text-primary border-primary/30",
      to: "/developer/debugger",
    },
    {
      icon: Database,
      title: "SQL Plan Studio",
      description:
        "Synthesize recursive CTEs, window functions, and cross-dialect translations between PostgreSQL, MySQL, SQLite, and Oracle.",
      badge: "DATA ACCELERATOR",
      badgeColor: "bg-secondary/15 text-secondary border-secondary/30",
      to: "/developer/sql",
    },
    {
      icon: Languages,
      title: "Polyglot Neural Translator",
      description:
        "Context-aware neural translation preserving syntax, markdown structures, and code blocks across 30+ international languages.",
      badge: "POLYGLOT",
      badgeColor: "bg-primary/15 text-primary border-primary/30",
      to: "/writing/translate",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary relative overflow-hidden">
      {/* Cosmic Obsidian Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-primary/18 via-secondary/8 to-transparent blur-[160px] pointer-events-none" />
      <div className="absolute top-80 right-0 w-[500px] h-[500px] bg-secondary/8 blur-[140px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5 border-b border-outline-variant/30 bg-surface-container-lowest/60 backdrop-blur-xl">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            className="size-9 object-contain transition-transform group-hover:scale-105"
            src={nexoraMark}
            alt="NEXORA AI"
          />
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-on-surface">NEXORA AI</span>
            <span className="text-[10px] font-mono text-secondary uppercase tracking-wider">
              Pro Max Platform v2.4
            </span>
          </div>
        </Link>

        {/* Center Live Telemetry Chip */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-low border border-outline-variant/30 text-[11px] font-mono text-on-surface-variant">
          <span className="size-2 rounded-full bg-secondary shadow-[0_0_8px_#4cd7f6] animate-pulse" />
          <span>H100 Tensor Cluster Online</span>
          <span>•</span>
          <span className="text-primary">42ms Latency</span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/auth/login"
            className="rounded-xl border border-outline-variant/40 bg-surface-container-low px-4 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-container via-purple-600 to-inverse-primary px-5 py-2 text-xs font-bold text-white shadow-[0_0_20px_rgba(160,120,255,0.35)] hover:shadow-[0_0_28px_rgba(160,120,255,0.5)] transition-all"
          >
            <span>Launch Workspace</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center justify-center px-6 pt-16 pb-12 text-center space-y-6">
        <div className="inline-flex items-center gap-2.5 rounded-full border border-secondary/30 bg-secondary/10 px-4 py-1.5 text-xs font-mono text-secondary shadow-[0_0_16px_rgba(76,215,246,0.15)]">
          <span className="size-2 rounded-full bg-secondary shadow-[0_0_8px_#4cd7f6] animate-pulse" />
          <span>SYNTHETIC OBSIDIAN • GEMINI FIRST ARCHITECTURE • UNIVERSITY RUBRIC SOLVER</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] text-on-surface max-w-4xl">
          One Intelligence.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-secondary">
            Infinite Possibilities.
          </span>
        </h1>

        <p className="max-w-2xl text-base sm:text-lg text-on-surface-variant leading-relaxed">
          The next-generation enterprise AI platform engineered with actual backend boundaries.
          Formulate university-grade exam answers from 2 to 20 marks, analyze multimodal vision,
          synthesize algorithms, and orchestrate deep research.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-primary-container via-purple-600 to-inverse-primary px-8 py-3.5 text-sm font-bold text-white shadow-[0_0_24px_rgba(160,120,255,0.4)] hover:shadow-[0_0_36px_rgba(160,120,255,0.6)] hover:scale-[1.02] transition-all"
          >
            <Sparkles className="size-4 text-secondary" />
            <span>Launch Mission Control</span>
            <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/study/exam-answer"
            className="inline-flex items-center justify-center gap-2.5 rounded-2xl border border-secondary/40 bg-surface-container-lowest/80 px-7 py-3.5 text-sm font-semibold text-secondary hover:bg-surface-container-low shadow-[0_0_16px_rgba(76,215,246,0.15)] transition-all"
          >
            <FileQuestion className="size-4" />
            <span>Try Exam Answer Writer</span>
          </Link>
        </div>

        {/* Live Interactive Terminal Preview */}
        <div className="w-full max-w-4xl mt-10 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest shadow-2xl overflow-hidden text-left">
          {/* Terminal Window Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/25 bg-surface-container-low">
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-red-500/80" />
              <span className="size-3 rounded-full bg-amber-500/80" />
              <span className="size-3 rounded-full bg-emerald-500/80" />
              <span className="ml-3 font-mono text-xs text-outline">
                nexora-intelligence-node // live preview
              </span>
            </div>

            {/* Preview Tabs */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab("exam")}
                className={`px-3 py-1 rounded-lg font-mono text-xs transition-colors ${
                  activeTab === "exam"
                    ? "bg-primary-container text-on-primary-container font-semibold"
                    : "text-outline hover:text-on-surface"
                }`}
              >
                Exam Rubric (10M)
              </button>
              <button
                onClick={() => setActiveTab("chat")}
                className={`px-3 py-1 rounded-lg font-mono text-xs transition-colors ${
                  activeTab === "chat"
                    ? "bg-primary-container text-on-primary-container font-semibold"
                    : "text-outline hover:text-on-surface"
                }`}
              >
                Cognitive Chat
              </button>
              <button
                onClick={() => setActiveTab("code")}
                className={`px-3 py-1 rounded-lg font-mono text-xs transition-colors ${
                  activeTab === "code"
                    ? "bg-primary-container text-on-primary-container font-semibold"
                    : "text-outline hover:text-on-surface"
                }`}
              >
                Kernel Debugger
              </button>
            </div>
          </div>

          {/* Terminal Content */}
          <div className="p-6 font-mono text-xs space-y-4">
            {activeTab === "exam" && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-secondary">
                  <span className="size-2 rounded-full bg-secondary shadow-[0_0_8px_#4cd7f6]" />
                  <span>RUBRIC EVALUATOR: 10 MARKS • UNIVERSITY MODEL ANSWER</span>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 text-on-surface">
                  <p className="text-secondary font-semibold">
                    Q: Differentiate between Monolithic and Microservices Architecture regarding
                    Fault Isolation and Deployment Overhead.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/25 text-on-surface-variant space-y-2 leading-relaxed">
                  <p className="text-primary font-bold">
                    1. Executive Definition & Boundary Conditions
                  </p>
                  <p>
                    Monolithic architectures encapsulate database schemas, business logic, and UI
                    bindings in a single deployable binary. In contrast, Microservices segregate
                    domains across bounded contexts communicating via gRPC/REST APIs.
                  </p>
                  <p className="text-primary font-bold pt-1">2. Fault Isolation Mechanics</p>
                  <p>
                    • Monolith: Memory leak or unhandled exception in reporting sub-system
                    terminates the entire worker daemon (Single Point of Failure).
                  </p>
                  <p>
                    • Microservices: Circuit breakers (e.g. Resilience4j) isolate degradation to
                    non-critical service meshes, preserving 99.99% uptime.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "chat" && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-primary">
                  <span className="size-2 rounded-full bg-primary shadow-[0_0_8px_#d0bcff]" />
                  <span>STREAMING SESSION: GEMINI-2.5-FLASH</span>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 text-on-surface">
                  <p className="text-secondary font-semibold">
                    User: Explain how Raft consensus algorithm prevents split-brain during network
                    partition.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/25 text-on-surface-variant space-y-2 leading-relaxed">
                  <p className="text-primary font-bold">
                    Raft Quorum Guarantee ($Q = \lfloor n/2 \rfloor + 1$)
                  </p>
                  <p>
                    Raft guarantees that only the partition containing a strict majority (quorum)
                    can elect a leader and commit log entries. The minority partition cannot achieve
                    quorum votes, thus rejecting writes and eliminating split-brain.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "code" && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-secondary">
                  <span className="size-2 rounded-full bg-secondary shadow-[0_0_8px_#4cd7f6]" />
                  <span>AST COMPLEXITY & STACK TRACE ANALYZER</span>
                </div>
                <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/25 text-on-surface-variant space-y-2 leading-relaxed">
                  <p className="text-primary font-bold">
                    Time Complexity: O(n log n) • Space: O(1) in-place
                  </p>
                  <pre className="p-3 rounded-lg bg-surface-container-lowest text-secondary overflow-x-auto">
                    {`async function acquireDistributedLock(redis: Client, resource: string): Promise<string> {
  const token = crypto.randomUUID();
  const acquired = await redis.set(\`lock:\${resource}\`, token, "NX", "PX", 30000);
  if (!acquired) throw new Error("Resource currently locked by parallel worker");
  return token;
}`}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Flagship Feature Matrix Grid */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-16 space-y-8">
        <div className="text-center space-y-2.5">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
            Enterprise Cognitive Studio Matrix
          </h2>
          <p className="text-sm text-on-surface-variant max-w-xl mx-auto">
            Every studio connects to genuine backend server functions with transparent configuration
            guidance when API credentials are required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {highlights.map((h, i) => {
            const Icon = h.icon;
            return (
              <Link
                key={i}
                to={h.to}
                className="group relative flex flex-col justify-between rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 backdrop-blur-xl transition-all duration-300 hover:border-primary/50 hover:bg-surface-container-low hover:shadow-[0_0_24px_rgba(208,188,255,0.15)]"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-surface-container-high border border-outline-variant/40 group-hover:scale-110 group-hover:border-primary/50 transition-all shadow-md">
                      <Icon className="size-5 text-secondary" />
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-mono border font-bold ${h.badgeColor}`}
                    >
                      {h.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors">
                    {h.title}
                  </h3>
                  <p className="mt-2 text-xs text-on-surface-variant leading-relaxed">
                    {h.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-secondary">
                  <span>Open Studio</span>
                  <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-outline-variant/30 bg-surface-container-lowest px-6 py-10 text-xs text-outline">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <img className="size-6 object-contain" src={nexoraMark} alt="" />
            <span className="font-bold text-on-surface text-sm">NEXORA AI</span>
            <span>• One Intelligence. Infinite Possibilities.</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Powered by Google Gemini</span>
            <span>•</span>
            <span>Supabase PostgreSQL + RLS</span>
            <span>•</span>
            <span className="text-secondary">v2.4 Enterprise</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
