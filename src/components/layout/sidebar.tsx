import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  MessageSquare,
  Sparkles,
  FileQuestion,
  GraduationCap,
  BrainCircuit,
  Languages,
  PenTool,
  Code2,
  Database,
  Briefcase,
  FileText,
  Search,
  CheckSquare,
  History,
  Settings,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  X,
  Zap,
  Image,
  Layers,
  FileSpreadsheet,
  Calendar,
  Terminal,
} from "lucide-react";
import nexoraMark from "@/assets/nexora-mark.png";

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export function Sidebar({ isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const [studyOpen, setStudyOpen] = useState(true);
  const [assistantOpen, setAssistantOpen] = useState(true);
  const [devOpen, setDevOpen] = useState(false);
  const [writingOpen, setWritingOpen] = useState(false);
  const [careerOpen, setCareerOpen] = useState(false);

  const isActive = (path: string) => currentPath === path;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col justify-between border-r border-outline-variant/30 bg-surface-container-lowest transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="flex h-16 items-center justify-between border-b border-outline-variant/25 px-5">
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <img
                src={nexoraMark}
                alt="NEXORA AI"
                className="size-8 object-contain transition-transform group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="font-bold tracking-tight text-on-surface text-base">
                  NEXORA AI
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-secondary">
                  Enterprise v2.4
                </span>
              </div>
            </Link>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="rounded-lg p-1.5 text-outline hover:bg-surface-container hover:text-on-surface lg:hidden"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Quick Action: New Chat / Task */}
          <div className="p-3 border-b border-outline-variant/20">
            <Link
              to="/assistant/chat"
              onClick={() => setIsMobileOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-primary font-medium text-xs transition-all shadow-[0_0_12px_rgba(208,188,255,0.12)] border border-primary/25"
            >
              <Sparkles className="size-3.5 text-secondary" />
              <span>New Task / Session</span>
            </Link>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-none">
          {/* Main */}
          <div className="space-y-1">
            <div className="px-2.5 pb-1 font-mono text-[10px] uppercase tracking-wider text-outline">
              Command
            </div>
            <Link
              to="/dashboard"
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                isActive("/dashboard")
                  ? "bg-primary-container text-on-primary-container font-semibold shadow-[0_0_16px_rgba(160,120,255,0.35)]"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="size-4" />
                <span>Mission Control</span>
              </div>
              <span className="flex size-1.5 rounded-full bg-secondary shadow-[0_0_6px_#4cd7f6] animate-pulse" />
            </Link>
          </div>

          {/* AI Assistant */}
          <div className="space-y-1">
            <button
              onClick={() => setAssistantOpen(!assistantOpen)}
              className="flex w-full items-center justify-between px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-outline hover:text-on-surface"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="size-3 text-secondary" />
                AI Assistant
              </span>
              {assistantOpen ? (
                <ChevronDown className="size-3" />
              ) : (
                <ChevronRight className="size-3" />
              )}
            </button>
            {assistantOpen && (
              <div className="ml-2 space-y-0.5 border-l border-outline-variant/30 pl-2 pt-1">
                <Link
                  to="/assistant/chat"
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                    isActive("/assistant/chat")
                      ? "bg-primary-container text-on-primary-container font-semibold shadow-[0_0_12px_rgba(160,120,255,0.3)]"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="size-3.5" />
                    <span>AI Chat</span>
                  </div>
                  <span className="text-[9px] font-mono text-secondary">STREAM</span>
                </Link>
                <Link
                  to="/assistant/image-qa"
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                    isActive("/assistant/image-qa")
                      ? "bg-primary-container text-on-primary-container font-semibold shadow-[0_0_12px_rgba(160,120,255,0.3)]"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  }`}
                >
                  <Image className="size-3.5" />
                  <span>Image Q&A & OCR</span>
                </Link>
                <Link
                  to="/assistant/image-generator"
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                    isActive("/assistant/image-generator")
                      ? "bg-primary-container text-on-primary-container font-semibold shadow-[0_0_12px_rgba(160,120,255,0.3)]"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-3.5" />
                    <span>Image Studio</span>
                  </div>
                  <span className="text-[9px] font-mono text-primary">FLUX.1</span>
                </Link>
                <Link
                  to="/assistant/voice"
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                    isActive("/assistant/voice")
                      ? "bg-primary-container text-on-primary-container font-semibold shadow-[0_0_12px_rgba(160,120,255,0.3)]"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  }`}
                >
                  <Terminal className="size-3.5 text-secondary" />
                  <span>Voice Assistant</span>
                </Link>
              </div>
            )}
          </div>

          {/* Study Intelligence */}
          <div className="space-y-1">
            <button
              onClick={() => setStudyOpen(!studyOpen)}
              className="flex w-full items-center justify-between px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-outline hover:text-on-surface"
            >
              <span className="flex items-center gap-1.5">
                <GraduationCap className="size-3 text-secondary" />
                Study Intelligence
              </span>
              {studyOpen ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
            </button>
            {studyOpen && (
              <div className="ml-2 space-y-0.5 border-l border-outline-variant/30 pl-2 pt-1">
                <Link
                  to="/study/exam-answer"
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                    isActive("/study/exam-answer")
                      ? "bg-primary-container text-on-primary-container font-semibold shadow-[0_0_12px_rgba(160,120,255,0.3)]"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileQuestion className="size-3.5 text-secondary" />
                    <span>Exam Answer Writer</span>
                  </div>
                  <span className="rounded-full bg-secondary/15 px-1.5 py-0.2 text-[9px] font-mono text-secondary border border-secondary/30">
                    TOP
                  </span>
                </Link>
                <Link
                  to="/study/quiz"
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                    isActive("/study/quiz")
                      ? "bg-primary-container text-on-primary-container font-semibold shadow-[0_0_12px_rgba(160,120,255,0.3)]"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  }`}
                >
                  <BrainCircuit className="size-3.5" />
                  <span>Interactive Quiz</span>
                </Link>
                <Link
                  to="/study/flashcards"
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                    isActive("/study/flashcards")
                      ? "bg-primary-container text-on-primary-container font-semibold shadow-[0_0_12px_rgba(160,120,255,0.3)]"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  }`}
                >
                  <Layers className="size-3.5" />
                  <span>Flashcard Engine</span>
                </Link>
                <Link
                  to="/study/summarizer"
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                    isActive("/study/summarizer")
                      ? "bg-primary-container text-on-primary-container font-semibold shadow-[0_0_12px_rgba(160,120,255,0.3)]"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  }`}
                >
                  <FileText className="size-3.5" />
                  <span>AI Summarizer</span>
                </Link>
                <Link
                  to="/study/planner"
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                    isActive("/study/planner")
                      ? "bg-primary-container text-on-primary-container font-semibold shadow-[0_0_12px_rgba(160,120,255,0.3)]"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  }`}
                >
                  <Calendar className="size-3.5 text-secondary" />
                  <span>Study Timetable</span>
                </Link>
              </div>
            )}
          </div>

          {/* Writing Studio */}
          <div className="space-y-1">
            <button
              onClick={() => setWritingOpen(!writingOpen)}
              className="flex w-full items-center justify-between px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-outline hover:text-on-surface"
            >
              <span className="flex items-center gap-1.5">
                <PenTool className="size-3" />
                Writing Studio
              </span>
              {writingOpen ? (
                <ChevronDown className="size-3" />
              ) : (
                <ChevronRight className="size-3" />
              )}
            </button>
            {writingOpen && (
              <div className="ml-2 space-y-0.5 border-l border-outline-variant/30 pl-2 pt-1">
                <Link
                  to="/writing/translate"
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                    isActive("/writing/translate")
                      ? "bg-primary-container text-on-primary-container font-semibold shadow-[0_0_12px_rgba(160,120,255,0.3)]"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  }`}
                >
                  <Languages className="size-3.5" />
                  <span>Translator (30+ Langs)</span>
                </Link>
                <Link
                  to="/writing/paraphrase"
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                    isActive("/writing/paraphrase")
                      ? "bg-primary-container text-on-primary-container font-semibold shadow-[0_0_12px_rgba(160,120,255,0.3)]"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  }`}
                >
                  <PenTool className="size-3.5" />
                  <span>Paraphraser</span>
                </Link>
                <Link
                  to="/writing/grammar"
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                    isActive("/writing/grammar")
                      ? "bg-primary-container text-on-primary-container font-semibold shadow-[0_0_12px_rgba(160,120,255,0.3)]"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  }`}
                >
                  <FileSpreadsheet className="size-3.5" />
                  <span>Grammar Proofreader</span>
                </Link>
              </div>
            )}
          </div>

          {/* Developer Hub */}
          <div className="space-y-1">
            <button
              onClick={() => setDevOpen(!devOpen)}
              className="flex w-full items-center justify-between px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-outline hover:text-on-surface"
            >
              <span className="flex items-center gap-1.5">
                <Code2 className="size-3 text-secondary" />
                Developer Hub
              </span>
              {devOpen ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
            </button>
            {devOpen && (
              <div className="ml-2 space-y-0.5 border-l border-outline-variant/30 pl-2 pt-1">
                <Link
                  to="/developer/debugger"
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                    isActive("/developer/debugger")
                      ? "bg-primary-container text-on-primary-container font-semibold shadow-[0_0_12px_rgba(160,120,255,0.3)]"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  }`}
                >
                  <Code2 className="size-3.5" />
                  <span>Code Helper & Debugger</span>
                </Link>
                <Link
                  to="/developer/sql"
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                    isActive("/developer/sql")
                      ? "bg-primary-container text-on-primary-container font-semibold shadow-[0_0_12px_rgba(160,120,255,0.3)]"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  }`}
                >
                  <Database className="size-3.5" />
                  <span>SQL Plan Studio</span>
                </Link>
                <Link
                  to="/developer/regex"
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                    isActive("/developer/regex")
                      ? "bg-primary-container text-on-primary-container font-semibold shadow-[0_0_12px_rgba(160,120,255,0.3)]"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  }`}
                >
                  <Terminal className="size-3.5 text-secondary" />
                  <span>Regex Engine</span>
                </Link>
              </div>
            )}
          </div>

          {/* Operations & Ops */}
          <div className="space-y-1">
            <button
              onClick={() => setCareerOpen(!careerOpen)}
              className="flex w-full items-center justify-between px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-outline hover:text-on-surface"
            >
              <span className="flex items-center gap-1.5">
                <Briefcase className="size-3" />
                Career & Research
              </span>
              {careerOpen ? (
                <ChevronDown className="size-3" />
              ) : (
                <ChevronRight className="size-3" />
              )}
            </button>
            {careerOpen && (
              <div className="ml-2 space-y-0.5 border-l border-outline-variant/30 pl-2 pt-1">
                <Link
                  to="/career/resume-builder"
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                    isActive("/career/resume-builder")
                      ? "bg-primary-container text-on-primary-container font-semibold shadow-[0_0_12px_rgba(160,120,255,0.3)]"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  }`}
                >
                  <Briefcase className="size-3.5" />
                  <span>ATS Resume Builder</span>
                </Link>
                <Link
                  to="/research/web"
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                    isActive("/research/web")
                      ? "bg-primary-container text-on-primary-container font-semibold shadow-[0_0_12px_rgba(160,120,255,0.3)]"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  }`}
                >
                  <Search className="size-3.5" />
                  <span>Deep Research Lab</span>
                </Link>
                <Link
                  to="/productivity/tasks"
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                    isActive("/productivity/tasks")
                      ? "bg-primary-container text-on-primary-container font-semibold shadow-[0_0_12px_rgba(160,120,255,0.3)]"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  }`}
                >
                  <CheckSquare className="size-3.5" />
                  <span>Productivity Tasks</span>
                </Link>
              </div>
            )}
          </div>

          {/* System & History */}
          <div className="space-y-1 pt-2 border-t border-outline-variant/20">
            <div className="px-2.5 pb-1 font-mono text-[10px] uppercase tracking-wider text-outline">
              Workspace & Cloud
            </div>
            <Link
              to="/history"
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                isActive("/history")
                  ? "bg-primary-container text-on-primary-container font-semibold shadow-[0_0_12px_rgba(160,120,255,0.3)]"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              }`}
            >
              <History className="size-4" />
              <span>Workspace History</span>
            </Link>
            <Link
              to="/settings"
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                isActive("/settings")
                  ? "bg-primary-container text-on-primary-container font-semibold shadow-[0_0_12px_rgba(160,120,255,0.3)]"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              }`}
            >
              <Settings className="size-4" />
              <span>API & Preferences</span>
            </Link>
            <Link
              to="/admin"
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                isActive("/admin")
                  ? "bg-primary-container text-on-primary-container font-semibold shadow-[0_0_12px_rgba(160,120,255,0.3)]"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              }`}
            >
              <ShieldCheck className="size-4 text-secondary" />
              <span>Admin Telemetry</span>
            </Link>
          </div>
        </div>

        {/* Stitch 4 Bottom User & Credits Quota HUD Card */}
        <div className="border-t border-outline-variant/30 bg-surface-container-low p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary ring-1 ring-primary/40 shadow-[0_0_8px_rgba(208,188,255,0.25)]">
                NX
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-on-surface">Alex Vance</span>
                <span className="text-[10px] text-secondary font-mono">Enterprise Plan</span>
              </div>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-surface-container-high px-2 py-0.5 text-[10px] font-mono text-secondary border border-secondary/30">
              <Zap className="size-2.5 text-secondary" />
              <span>H100</span>
            </div>
          </div>
          <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-secondary h-1.5 rounded-full shadow-[0_0_6px_#4cd7f6]"
              style={{ width: "84%" }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-outline">
            <span>Intelligence Quota</span>
            <span className="text-on-surface-variant">84,250 / 100k</span>
          </div>
        </div>
      </aside>
    </>
  );
}
