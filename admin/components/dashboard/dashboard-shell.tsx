"use client";

import { useState } from "react";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Sidebar, SidebarDrawer } from "@/components/dashboard/sidebar";
import { ToastProvider } from "@/components/ui/toast";
import { useSidebarCollapsed } from "@/hooks/use-sidebar-collapsed";

/**
 * Chrome for every signed-in page: rail, topbar, and the scrolling workspace.
 *
 * The shell is exactly one viewport tall and never scrolls itself, so the rail
 * and the topbar stay put while only the workspace moves. A long nav therefore
 * scrolls inside the rail rather than dragging the page with it.
 *
 * Owns the two independent pieces of navigation state — whether the desktop
 * rail is collapsed (persisted, see `useSidebarCollapsed`) and whether the
 * mobile drawer is open (transient).
 */
export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [collapsed, toggleCollapsed] = useSidebarCollapsed();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="flex h-dvh overflow-hidden bg-grey-25">
        <Sidebar collapsed={collapsed} />
        <SidebarDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />

        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardTopbar
            collapsed={collapsed}
            onToggleCollapse={toggleCollapsed}
            onOpenDrawer={() => setDrawerOpen(true)}
            notificationCount={3}
          />
          <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
