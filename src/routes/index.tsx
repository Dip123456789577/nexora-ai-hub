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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import nexoraMark from "@/assets/nexora-mark.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NEXORA AI — One Intelligence. Infinite Possibilities." },
      {
        name: "description",
        content:
          "NEXORA AI is an enterprise all-in-one AI platform featuring University Exam Answer Writers, multi-turn reasoning, vision OCR, developer tooling, and cloud persistence.",
      },
      { property: "og:title", content: "NEXORA AI — One Intelligence. Infinite Possibilities." },
      {
        property: "og:description",
        content: "Enterprise AI suite with real backend service integrations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const highlights = [
    {
      icon: FileQuestion,
      title: "Exam Answer Writer",
      description:
        "University Model Solver Rubric Engine v4.2. Formulates structured exam answers from 2 to 20 marks with definitions, numbered arguments, examples, and diagrammatic breakdowns.",
      badge: "FLAGSHIP",
      badgeColor: "bg-secondary/15 text-secondary border-secondary/30",
      to: "/study/exam-answer",
    },
    {
      icon: MessageSquare,
      title: "Cognitive AI Chat",
      description:
        "Multi-turn streaming assistant powered by Google Gemini with code highlighting, copy, export, and thread history.",
      badge: "STREAMING",
      badgeColor: "bg-primary/15 text-primary border-primary/30",
      to: "/assistant/chat",
    },
    {
      icon: BrainCircuit,
      title: "Interactive Quiz & Flashcards",
      description:
        "Adaptive spaced-repetition flashcards with 3D flip physics and automated interactive quizzes with pedagogical explanations.",
      badge: "ACTIVE RECALL",
      badgeColor: "bg-secondary/15 text-secondary border-secondary/30",
      to: "/study/quiz",
    },
    {
      icon: Code2,
      title: "Developer Hub & Kernel Debugger",
      description:
        "Algorithm synthesizer, runtime stack trace debugger, and Big-O complexity analyzer across 10+ programming languages.",
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
      title: "Polyglot Translator",
      description:
        "Context-aware neural translation preserving syntax and code blocks across 30+ international languages.",
      badge: "POLYGLOT",
      badgeColor: "bg-primary/15 text-primary border-primary/30",
      to: "/writing/translate",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-primary/15 via-secondary/5 to-transparent blur-[140px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 border-b border-border/30">
        <Link to="/" className="flex items-center gap-3">
          <img className="size-9 object-contain" src={nexoraMark} alt="NEXORA AI" />
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-foreground">NEXORA AI</span>
            <span className="text-[10px] font-mono text-secondary uppercase tracking-wider">
              Pro Max Platform
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/auth/login"
            className="rounded-xl border border-border/60 bg-surface-container/50 px-4 py-2 text-xs font-semibold text-foreground hover:bg-surface-container transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-primary-container px-4 py-2 text-xs font-bold text-on-primary shadow-lg shadow-primary/20 hover:opacity-95 transition-all"
          >
            <span>Launch Workspace</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center justify-center px-6 pt-20 pb-16 text-center space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-3.5 py-1 text-xs font-mono text-secondary">
          <span className="size-2 rounded-full bg-secondary animate-pulse" />
          <span>GEMINI FIRST ARCHITECTURE • UNIVERSITY RUBRIC SOLVER</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-foreground max-w-4xl">
          One Intelligence.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary">
            Infinite Possibilities.
          </span>
        </h1>

        <p className="max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
          The all-in-one AI productivity platform engineered with real backend services. Featuring
          structured university exam scoring from 2 to 20 marks, cognitive chat, vision OCR,
          developer sandboxes, and cloud persistence.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary via-secondary to-primary bg-size-200 px-8 py-3.5 text-sm font-bold text-surface-container-lowest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
          >
            <Sparkles className="size-4" />
            <span>Open Mission Control</span>
            <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/study/exam-answer"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border/70 bg-card/60 px-6 py-3.5 text-sm font-semibold text-foreground hover:border-primary/50 transition-colors"
          >
            <FileQuestion className="size-4 text-secondary" />
            <span>Try Exam Answer Writer</span>
          </Link>
        </div>
      </section>

      {/* Flagship Feature Matrix Grid */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-12 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            Complete Cognitive Studio Matrix
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Every studio is connected to real backend endpoints with transparent API configuration
            status
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-4">
          {highlights.map((h, i) => {
            const Icon = h.icon;
            return (
              <Link
                key={i}
                to={h.to}
                className="group relative flex flex-col justify-between rounded-3xl border border-border/50 bg-card/40 p-6 backdrop-blur-xl transition-all duration-300 hover:border-primary/50 hover:bg-card hover:shadow-2xl hover:shadow-primary/5"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-surface-container border border-border/50 group-hover:scale-105 transition-transform">
                      <Icon className="size-5 text-secondary" />
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[9px] font-mono border font-bold ${h.badgeColor}`}
                    >
                      {h.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {h.title}
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    {h.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-secondary">
                  <span>Launch Studio</span>
                  <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/30 bg-surface-container-lowest/80 px-6 py-8 text-center text-xs text-muted-foreground">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img className="size-6 object-contain" src={nexoraMark} alt="" />
            <span className="font-bold text-foreground">NEXORA AI</span>
            <span>• One Intelligence. Infinite Possibilities.</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Powered by Google Gemini</span>
            <span>•</span>
            <span>Supabase PostgreSQL + RLS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
