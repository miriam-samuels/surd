"use client";

import Image from "next/image";
import Link from "next/link";
import { Dialog } from "radix-ui";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/ui/icon";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { cn } from "@/lib/cn";

/**
 * Two presentations of the same navigation.
 *
 * `Sidebar` is the persistent rail from `lg` up; it collapses to an icon strip.
 * `SidebarDrawer` is the overlay used below `lg`, built on a Radix dialog so
 * focus trapping and scroll locking come for free.
 *
 * Both render `SidebarNav`, so there is only ever one list to maintain.
 */

const EXPANDED_WIDTH = "w-64";
const COLLAPSED_WIDTH = "w-18";

export function Sidebar({ collapsed }: { collapsed: boolean }) {
  return (
    <aside
      data-collapsed={collapsed || undefined}
      className={cn(
        "hidden h-full shrink-0 border-r border-grey-50 bg-white lg:flex lg:flex-col",
        "transition-[width] duration-200 ease-out",
        collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
      )}
    >
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-grey-50 px-4",
          collapsed && "justify-center px-0",
        )}
      >
        <BrandLink collapsed={collapsed} />
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-5">
        <SidebarNav collapsed={collapsed} />
      </div>
    </aside>
  );
}

export function SidebarDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-grey-1000/40 backdrop-blur-sm lg:hidden" />
        <Dialog.Content
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white outline-none lg:hidden",
            "data-[state=open]:animate-drawer-in",
          )}
        >
          <Dialog.Title className="sr-only">Admin navigation</Dialog.Title>

          <div className="flex h-16 shrink-0 items-center justify-between border-b border-grey-50 px-4">
            <BrandLink collapsed={false} />
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close navigation"
                className="grid size-9 place-items-center rounded-full text-grey-500 hover:bg-grey-25"
              >
                <Icon icon={Cancel01Icon} size={18} />
              </button>
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-5">
            <SidebarNav onNavigate={() => onOpenChange(false)} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function BrandLink({ collapsed }: { collapsed: boolean }) {
  return (
    <Link
      href="/dashboard"
      aria-label="SURD Admin"
      className="flex items-center gap-2 outline-none focus-visible:shadow-ring-primary"
    >
      <Image
        src="/brand/surd-wordmark-blue.svg"
        alt="SURD"
        width={86}
        height={32}
        priority
        className={cn("w-auto", collapsed ? "h-6" : "h-7")}
      />
      {collapsed ? null : (
        <span className="rounded-full bg-primary px-2 py-0.5 text-2xs font-bold text-white">
          Admin
        </span>
      )}
    </Link>
  );
}
