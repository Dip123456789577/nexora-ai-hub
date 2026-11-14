import {
  Search,
  Sparkles,
  Activity,
  Menu,
  Settings as SettingsIcon,
  Sun,
  Moon,
} from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";

interface TopNavProps {
  onOpenMobile: () => void;
  onOpenCommand: () => void;
}

export function TopNav({ onOpenMobile, onOpenCommand }: TopNavProps) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const getBreadcrumb = (path: string) => {
    if (path.startsWith("/study"))
      return { section: "Study Intelligence", title: path.split("/").pop()?.replace(/-/g, " ") };
    if (path.startsWith("/assistant"))
      return { section: "AI Assistant", title: path.split("/").pop()?.replace(/-/g, " ") };
    if (path.startsWith("/writing"))
      return { section: "Writing Studio", title: path.split("/").pop()?.replace(/-/g, " ") };
    if (path.startsWith("/developer"))
      return { section: "Developer Hub", title: path.split("/").pop()?.replace(/-/g, " ") };
    if (path.startsWith("/career"))
      return { section: "Career Studio", title: path.split("/").pop()?.replace(/-/g, " ") };
    if (path.startsWith("/research"))
      return { section: "Research Lab", title: path.split("/").pop()?.replace(/-/g, " ") };
    if (path.startsWith("/productivity"))
      return { section: "Productivity", title: path.split("/").pop()?.replace(/-/g, " ") };
    if (path === "/history") return { section: "Cloud Workspace", title: "History & Analytics" };
    if (path === "/settings") return { section: "Configuration", title: "API & Preferences" };
    if (path === "/admin") return { section: "System", title: "Admin Panel" };
    return { section: "Mission Control", title: "Dashboard" };
  };

  const breadcrumb = getBreadcrumb(currentPath);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/40 bg-surface-container-lowest/80 px-4 md:px-8 backdrop-blur-xl">
      {/* Left: Mobile hamburger & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="rounded-lg p-2 text-muted-foreground hover:bg-surface-container lg:hidden"
          aria-label="Open Navigation"
        >
          <Menu className="size-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <span className="flex size-2 rounded-full bg-secondary animate-pulse" />
          <span className="font-semibold text-foreground">{breadcrumb.section}</span>
          <span>/</span>
          <span className="capitalize text-secondary">{breadcrumb.title}</span>
        </div>
      </div>

      {/* Center: Global Search Bar / Command Launcher */}
      <div className="flex-1 max-w-md mx-4">
        <button
          onClick={onOpenCommand}
          className="flex h-9 w-full items-center justify-between rounded-xl border border-border/50 bg-surface-container/50 px-3 text-xs text-muted-foreground transition-all hover:border-primary/40 hover:bg-surface-container"
        >
          <div className="flex items-center gap-2">
            <Search className="size-3.5 text-secondary" />
            <span className="truncate">Ask NEXORA or find any tool...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border/60 bg-surface-container-high px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Model status, Latency indicator, Settings link */}
      <div className="flex items-center gap-2.5">
        <div className="hidden md:flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] font-mono text-primary">
          <Sparkles className="size-3 text-secondary" />
          <span>Gemini 2.5 Flash</span>
        </div>

        <div className="hidden xl:flex items-center gap-1.5 rounded-full border border-border/40 bg-surface-container/60 px-2.5 py-1 text-[11px] font-mono text-muted-foreground">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          <span>Operational</span>
        </div>

        <Link
          to="/settings"
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-surface-container hover:text-foreground"
          title="Settings & API Keys"
        >
          <SettingsIcon className="size-4" />
        </Link>
      </div>
    </header>
  );
}
