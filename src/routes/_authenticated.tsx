import { useState } from "react";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNav } from "@/components/layout/top-nav";
import { CommandMenu } from "@/components/layout/command-menu";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Sidebar */}
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      {/* Main Content Area */}
      <div className="flex flex-col lg:pl-72 min-h-screen">
        <TopNav
          onOpenMobile={() => setIsMobileOpen(true)}
          onOpenCommand={() => setIsCommandOpen(true)}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-300">
          <Outlet />
        </main>
      </div>

      {/* Global Ctrl+K Command Dialog */}
      <CommandMenu open={isCommandOpen} setOpen={setIsCommandOpen} />
    </div>
  );
}
