"use client";

import { useState } from "react";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Sidebar, SidebarDrawer } from "@/components/dashboard/sidebar";
import { useSidebarCollapsed } from "@/hooks/use-sidebar-collapsed";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [collapsed, toggleCollapsed] = useSidebarCollapsed();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
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
  );
}
