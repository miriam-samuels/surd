"use client";

import { LockKeyIcon } from "@hugeicons/core-free-icons";
import { EmptyState } from "@/components/ui/empty-state";
import { Spinner } from "@/components/ui/spinner";
import { usePermissions } from "@/contexts/permissions";
import type { Permission } from "@/types/permission";

export function RequirePermission({
  need,
  children,
}: {
  need: Permission;
  children: React.ReactNode;
}) {
  const { can, loading } = usePermissions();

  if (loading) {
    return (
      <div className="grid min-h-64 place-items-center">
        <span className="sr-only" role="status">
          Checking your access
        </span>
        <Spinner size={28} className="text-primary" />
      </div>
    );
  }

  if (!can(need)) {
    return (
      <EmptyState
        icon={LockKeyIcon}
        title="You don't have access to this section"
        description="Ask a super admin to grant your account the permission it needs."
      />
    );
  }

  return <>{children}</>;
}
