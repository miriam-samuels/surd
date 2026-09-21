"use client";

import { QueryProvider } from "@/components/providers/query-provider";
import { ProgressProvider } from "@/components/providers/progress-provider";
import { SessionProvider } from "@/contexts/session";
import { PermissionsProvider } from "@/contexts/permissions";
import { SessionTimeoutDialog } from "@/components/auth/session-timeout-dialog";
import { ToastViewport } from "@/components/ui/toast";
import CurrencyProvider from "@/contexts/currency";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <SessionProvider>
        <PermissionsProvider>
          <CurrencyProvider>
            <ProgressProvider>
              {children}
              <SessionTimeoutDialog />
              <ToastViewport />
            </ProgressProvider>
          </CurrencyProvider>
        </PermissionsProvider>
      </SessionProvider>
    </QueryProvider>
  );
}

export default AppProviders;
