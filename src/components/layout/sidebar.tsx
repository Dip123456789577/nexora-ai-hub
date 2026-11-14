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
  Menu,
  X,
  Zap,
  Image,
  Layers,
  FileSpreadsheet,
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
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col justify-between border-r border-border/50 bg-surface-container-lowest transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-border/40 px-5">
          <Link to="/dashboard" className="flex items-center gap-3">
            <img src={nexoraMark} alt="NEXORA" className="size-8 object-contain" />
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-foreground text-base">NEXORA AI</span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-secondary">
                Pro Max Edition
              </span>
            </div>
          </Link>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-surface-container lg:hidden"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-none">
          {/* Main */}
          <div className="space-y-1">
            <Link
              to="/dashboard"
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                isActive("/dashboard")
                  ? "bg-primary/15 text-primary border border-primary/25 shadow-sm"
                  : "text-muted-foreground hover:bg-surface-container hover:text-foreground"
              }`}
            >
              <LayoutDashboard className="size-4" />
              <span>Mission Control</span>
              <span className="ml-auto flex size-2 rounded-full bg-secondary animate-pulse" />
            </Link>
          </div>

          {/* AI Assistant */}
          <div className="space-y-1">
            <button
              onClick={() => setAssistantOpen(!assistantOpen)}
              className="flex w-full items-center justify-between px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80 hover:text-foreground"
            >
              <span className="flex items-center gap-2">
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
              <div className="ml-2 space-y-0.5 border-l border-border/40 pl-2 pt-1">
                <Link
                  to="/assistant/chat"
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                    isActive("/assistant/chat")
                      ? "bg-primary/20 text-primary font-medium"
                      : "text-muted-foreground hover:bg-surface-container hover:text-foreground"
                  }`}
                >
                  <MessageSquare className="size-3.5" />
                  <span>AI Chat</span>
                  <span className="ml-auto text-[9px] font-mono text-secondary">STREAM</span>
                </Link>
                <Link
                  to="/assistant/image-qa"
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                    isActive("/assistant/image-qa")
                      ? "bg-primary/20 text-primary font-medium"
                      : "text-muted-foreground hover:bg-surface-container hover:text-foreground"
                  }`}
                >
                  <Image className="size-3.5" />
                  <span>Image Q&A & OCR</span>
                </Link>
                <Link
                  to="/assistant/image-generator"
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                    isActive("/assistant/image-generator")
                      ? "bg-primary/20 text-primary font-medium"
                      : "text-muted-foreground hover:bg-surface-container hover:text-foreground"
                  }`}
                >
                  <Sparkles className="size-3.5" />
                  <span>Image Studio</span>
                </Link>
              </div>
            )}
          </div>

          {/* Study Intelligence */}
          <div className="space-y-1">
            <button
              onClick={() => setStudyOpen(!studyOpen)}
              className="flex w-full items-center justify-between px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80 hover:text-foreground"
            >
              <span className="flex items-center gap-2">
                <GraduationCap className="size-3 text-primary" />
                Study Intelligence
              </span>
              {studyOpen ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
            </button>
            {studyOpen && (
              <div className="ml-2 space-y-0.5 border-l border-border/40 pl-2 pt-1">
                <Link
                  to="/study/exam-answer"
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                    isActive("/study/exam-answer")
                      ? "bg-primary/20 text-primary font-medium"
                      : "text-muted-foreground hover:bg-surface-container hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FileQuestion className="size-3.5 text-secondary" />
                    <span>Exam Answer Writer</span>
                  </div>
                  <span className="rounded-full bg-secondary/15 px-1.5 py-0.2 text-[9px] font-mono text-secondary">
                    TOP
                  </span>
                </Link>
                <Link
                  to="/study/quiz"
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                    isActive("/study/quiz")
                      ? "bg-primary/20 text-primary font-medium"
                      : "text-muted-foreground hover:bg-surface-container hover:text-foreground"
                  }`}
                >
                  <BrainCircuit className="size-3.5" />
                  <span>Interactive Quiz</span>
                </Link>
                <Link
                  to="/study/flashcards"
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                    isActive("/study/flashcards")
                      ? "bg-primary/20 text-primary font-medium"
                      : "text-muted-foreground hover:bg-surface-container hover:text-foreground"
                  }`}
                >
                  <Layers className="size-3.5" />
                  <span>Flashcard Engine</span>
                </Link>
                <Link
                  to="/study/summarizer"
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                    isActive("/study/summarizer")
                      ? "bg-primary/20 text-primary font-medium"
                      : "text-muted-foreground hover:bg-surface-container hover:text-foreground"
                  }`}
                >
                  <FileText className="size-3.5" />
                  <span>AI Summarizer</span>
                </Link>
              </div>
            )}
          </div>

          {/* Writing Studio */}
          <div className="space-y-1">
            <button
              onClick={() => setWritingOpen(!writingOpen)}
              className="flex w-full items-center justify-between px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80 hover:text-foreground"
            >
              <span className="flex items-center gap-2">
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
              <div className="ml-2 space-y-0.5 border-l border-border/40 pl-2 pt-1">
                <Link
                  to="/writing/translate"
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                    isActive("/writing/translate")
                      ? "bg-primary/20 text-primary font-medium"
                      : "text-muted-foreground hover:bg-surface-container hover:text-foreground"
                  }`}
                >
                  <Languages className="size-3.5" />
                  <span>Translator</span>
                </Link>
                <Link
                  to="/writing/paraphrase"
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                    isActive("/writing/paraphrase")
                      ? "bg-primary/20 text-primary font-medium"
                      : "text-muted-foreground hover:bg-surface-container hover:text-foreground"
                  }`}
                >
                  <PenTool className="size-3.5" />
                  <span>Paraphraser</span>
                </Link>
                <Link
                  to="/writing/grammar"
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                    isActive("/writing/grammar")
                      ? "bg-primary/20 text-primary font-medium"
                      : "text-muted-foreground hover:bg-surface-container hover:text-foreground"
                  }`}
                >
                  <FileSpreadsheet className="size-3.5" />
                  <span>Grammar Checker</span>
                </Link>
              </div>
            )}
          </div>

          {/* Developer Hub */}
          <div className="space-y-1">
            <button
              onClick={() => setDevOpen(!devOpen)}
              className="flex w-full items-center justify-between px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80 hover:text-foreground"
            >
              <span className="flex items-center gap-2">
                <Code2 className="size-3 text-secondary" />
                Developer Hub
              </span>
              {devOpen ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
            </button>
            {devOpen && (
              <div className="ml-2 space-y-0.5 border-l border-border/40 pl-2 pt-1">
                <Link
                  to="/developer/debugger"
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                    isActive("/developer/debugger")
                      ? "bg-primary/20 text-primary font-medium"
                      : "text-muted-foreground hover:bg-surface-container hover:text-foreground"
                  }`}
                >
                  <Code2 className="size-3.5" />
                  <span>Code Helper & Debugger</span>
                </Link>
                <Link
                  to="/developer/sql"
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                    isActive("/developer/sql")
                      ? "bg-primary/20 text-primary font-medium"
                      : "text-muted-foreground hover:bg-surface-container hover:text-foreground"
                  }`}
                >
                  <Database className="size-3.5" />
                  <span>SQL Assistant</span>
                </Link>
              </div>
            )}
          </div>

          {/* Career & Research & Productivity */}
          <div className="space-y-1">
            <button
              onClick={() => setCareerOpen(!careerOpen)}
              className="flex w-full items-center justify-between px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80 hover:text-foreground"
            >
              <span className="flex items-center gap-2">
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
              <div className="ml-2 space-y-0.5 border-l border-border/40 pl-2 pt-1">
                <Link
                  to="/career/resume-builder"
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                    isActive("/career/resume-builder")
                      ? "bg-primary/20 text-primary font-medium"
                      : "text-muted-foreground hover:bg-surface-container hover:text-foreground"
                  }`}
                >
                  <Briefcase className="size-3.5" />
                  <span>Resume Builder</span>
                </Link>
                <Link
                  to="/research/web"
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                    isActive("/research/web")
                      ? "bg-primary/20 text-primary font-medium"
                      : "text-muted-foreground hover:bg-surface-container hover:text-foreground"
                  }`}
                >
                  <Search className="size-3.5" />
                  <span>Web Research</span>
                </Link>
                <Link
                  to="/productivity/tasks"
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                    isActive("/productivity/tasks")
                      ? "bg-primary/20 text-primary font-medium"
                      : "text-muted-foreground hover:bg-surface-container hover:text-foreground"
                  }`}
                >
                  <CheckSquare className="size-3.5" />
                  <span>Task Manager</span>
                </Link>
              </div>
            )}
          </div>

          {/* History, Settings, Admin */}
          <div className="border-t border-border/40 pt-4 space-y-1">
            <Link
              to="/history"
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                isActive("/history")
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-surface-container hover:text-foreground"
              }`}
            >
              <History className="size-4" />
              <span>Cloud History</span>
            </Link>
            <Link
              to="/settings"
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                isActive("/settings")
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-surface-container hover:text-foreground"
              }`}
            >
              <Settings className="size-4" />
              <span>Settings & APIs</span>
            </Link>
            <Link
              to="/admin"
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                isActive("/admin")
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-surface-container hover:text-foreground"
              }`}
            >
              <ShieldCheck className="size-4 text-secondary" />
              <span>Admin Panel</span>
            </Link>
          </div>
        </div>

        {/* User Card at bottom */}
        <div className="border-t border-border/40 bg-surface-container/30 p-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                NX
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-foreground">Workspace User</span>
                <span className="text-[10px] text-muted-foreground">Pro Plan • Active</span>
              </div>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-secondary/10 px-2 py-0.5 text-[10px] font-mono text-secondary border border-secondary/20">
              <Zap className="size-2.5" />
              <span>Gemini</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
