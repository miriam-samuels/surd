"use client";

import { Popover } from "radix-ui";
import { ArrowDown01Icon, Logout03Icon } from "@hugeicons/core-free-icons";
import { Avatar } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icon";
import { useSession } from "@/contexts/session";
import { usePermissions } from "@/contexts/permissions";
import { formatEnum, formatName } from "@/lib/format";
import { cn } from "@/lib/cn";

export function AccountMenu() {
  const { session, signOut } = useSession();
  const { role } = usePermissions();

  const name = session ? formatName(session) : "Admin";

  return (
    <Popover.Root>
      <Popover.Trigger
        aria-label="Account menu"
        className="flex items-center gap-1 rounded-full outline-none focus-visible:shadow-ring-primary"
      >
        <Avatar name={name} src={session?.avatar ?? undefined} size="sm" tone="inverse" />
        <Icon
          icon={ArrowDown01Icon}
          size={16}
          strokeWidth={3}
          className="hidden text-grey-400 sm:block"
        />
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          className={cn(
            "z-50 w-64 overflow-hidden rounded-2xl border border-grey-50",
            "bg-white p-1.5 shadow-lg outline-none",
          )}
        >
          <div className="flex flex-col gap-0.5 px-3 py-2.5">
            <p className="truncate text-sm font-bold text-grey-900">{name}</p>
            {session?.email ? (
              <p className="truncate text-xs text-grey-400">{session.email}</p>
            ) : null}
            <p className="mt-1 text-xs font-semibold text-primary">
              {formatEnum(role)}
            </p>
          </div>

          <div className="my-1 h-px bg-grey-50" />

          <button
            type="button"
            onClick={signOut}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left",
              "text-sm font-semibold text-red-500 outline-none transition-colors",
              "hover:bg-red-50 focus-visible:bg-red-50",
            )}
          >
            <Icon icon={Logout03Icon} size={18} />
            Sign out
          </button>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
