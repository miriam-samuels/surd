"use client";

import { createContext, useContext, useMemo } from "react";
import { useSession } from "@/contexts/session";
import {
  ROLE_PERMISSIONS,
  toAdminRole,
  type AdminRole,
  type Permission,
} from "@/types/permission";

type PermissionsValue = {
  role: AdminRole;

  loading: boolean;
  can: (permission: Permission) => boolean;
  canAny: (permissions: readonly Permission[]) => boolean;
  canAll: (permissions: readonly Permission[]) => boolean;
};


export const PERMISSIONS_ENFORCED = false;

const PermissionsContext = createContext<PermissionsValue | null>(null);

export function usePermissions() {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error("usePermissions must be used inside <PermissionsProvider>");
  }
  return context;
}

export function PermissionsProvider({ children }: { children: React.ReactNode }) {
  const { session, isProfileLoading } = useSession();

  const value = useMemo<PermissionsValue>(() => {
    const role = toAdminRole(session?.role);
    const granted = new Set<Permission>(ROLE_PERMISSIONS[role]);

    const can = (permission: Permission) =>
      !PERMISSIONS_ENFORCED || (!isProfileLoading && granted.has(permission));

    return {
      role,
      loading: PERMISSIONS_ENFORCED && isProfileLoading,
      can,
      canAny: (permissions) => permissions.some(can),
      canAll: (permissions) => permissions.every(can),
    };
  }, [session?.role, isProfileLoading]);

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
}

export default PermissionsProvider;
