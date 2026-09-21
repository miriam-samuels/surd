"use client";

import { usePermissions } from "@/contexts/permissions";
import type { Permission } from "@/types/permission";

export function Can({
  do: permission,
  any,
  fallback = null,
  children,
}: {
  do?: Permission;
  any?: readonly Permission[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { can, canAny } = usePermissions();
  const allowed = permission ? can(permission) : any ? canAny(any) : false;
  return <>{allowed ? children : fallback}</>;
}
