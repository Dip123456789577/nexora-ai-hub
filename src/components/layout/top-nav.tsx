import { Search, Sparkles, Activity, Menu, Settings as SettingsIcon } from "lucide-react";
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
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-outline-variant/30 bg-surface/80 px-4 md:px-8 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.15)]">
      {/* Left: Mobile hamburger & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="rounded-lg p-2 text-outline hover:bg-surface-container hover:text-on-surface lg:hidden"
          aria-label="Open Navigation"
        >
          <Menu className="size-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-outline">
          <span className="flex size-2 rounded-full bg-secondary shadow-[0_0_8px_#4cd7f6] animate-pulse" />
          <span className="text-secondary font-semibold">NEXORA OS</span>
          <span>›</span>
          <span className="text-on-surface-variant font-medium">{breadcrumb.section}</span>
          <span>›</span>
          <span className="capitalize text-primary font-semibold">{breadcrumb.title}</span>
        </div>
      </div>

      {/* Center: Global Search Bar / Command Launcher */}
      <div className="flex-1 max-w-md mx-4">
        <button
          onClick={onOpenCommand}
          className="flex h-9 w-full items-center justify-between rounded-xl border border-outline-variant/40 bg-surface-container-lowest px-3.5 text-xs text-outline transition-all hover:border-primary/50 hover:text-on-surface hover:shadow-[0_0_12px_rgba(208,188,255,0.15)]"
        >
          <div className="flex items-center gap-2.5">
            <Search className="size-3.5 text-secondary" />
            <span className="truncate">Ask NEXORA anything or search tools...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-outline-variant/50 bg-surface-container-high px-1.5 py-0.5 text-[10px] font-mono text-on-surface-variant">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Right: Model status, Latency indicator, Settings link */}
      <div className="flex items-center gap-2.5">
        <div className="hidden md:flex items-center gap-1.5 rounded-full border border-primary/30 bg-surface-container-high px-3 py-1 text-[11px] font-mono text-primary shadow-sm">
          <Sparkles className="size-3 text-secondary" />
          <span>Gemini 2.5 Flash</span>
        </div>

        <div className="hidden xl:flex items-center gap-1.5 rounded-full border border-outline-variant/30 bg-surface-container px-3 py-1 text-[11px] font-mono text-on-surface-variant">
          <span className="size-1.5 rounded-full bg-secondary shadow-[0_0_6px_#4cd7f6]" />
          <span>42ms • Operational</span>
        </div>

        <Link
          to="/settings"
          className="rounded-lg p-2 text-outline transition-colors hover:bg-surface-container hover:text-on-surface"
          title="Settings & API Keys"
        >
          <SettingsIcon className="size-4" />
        </Link>
      </div>
    </header>
  );
}
