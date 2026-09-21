import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RequireSession } from "@/components/auth/require-session";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s — SURD Admin",
  },
};

export default function DashboardLayout({ children }: LayoutProps<"/">) {
  return (
    <RequireSession>
      <DashboardShell>{children}</DashboardShell>
    </RequireSession>
  );
}
