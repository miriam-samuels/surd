"use client";

import { useState } from "react";
import {
  ArrowDown01Icon,
  Menu01Icon,
  Notification03Icon,
  Search01Icon,
  SidebarLeft01Icon,
} from "@hugeicons/core-free-icons";
import { Avatar } from "@/components/ui/avatar";
import { Flag } from "@/components/ui/flag";
import { Icon } from "@/components/ui/icon";
import { Dropdown } from "@/components/ui/dropdown";
import { cn } from "@/lib/cn";

/**
 * The bar above the workspace: navigation toggles, search, and account chrome.
 *
 * Two separate toggles rather than one that changes meaning — the hamburger
 * opens the drawer below `lg`, the rail button collapses the sidebar above it.
 */

const CURRENCIES = [
  { value: "NGN", label: "NGN", country: "NG" },
  { value: "USD", label: "USD", country: "US" },
  { value: "GBP", label: "GBP", country: "GB" },
];

type DashboardTopbarProps = {
  onOpenDrawer: () => void;
  onToggleCollapse: () => void;
  collapsed: boolean;
  notificationCount?: number;
};

export function DashboardTopbar({
  onOpenDrawer,
  onToggleCollapse,
  collapsed,
  notificationCount = 0,
}: DashboardTopbarProps) {
  /* Display currency for every figure in the console. */
  const [currency, setCurrency] = useState("NGN");

  return (
    /* No `sticky` needed — the shell never scrolls, only the workspace below. */
    <header className="z-30 flex h-16 shrink-0 items-center gap-3 border-b border-grey-50 bg-white px-4 sm:px-6">
      <button
        type="button"
        onClick={onOpenDrawer}
        aria-label="Open navigation"
        className="grid size-9 shrink-0 place-items-center rounded-lg text-grey-500 hover:bg-grey-25 lg:hidden"
      >
        <Icon icon={Menu01Icon} size={20} />
      </button>

      <button
        type="button"
        onClick={onToggleCollapse}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-pressed={collapsed}
        className="hidden size-9 shrink-0 place-items-center rounded-lg text-grey-500 hover:bg-grey-25 lg:grid"
      >
        <Icon icon={SidebarLeft01Icon} size={20} />
      </button>

      <label className="relative hidden min-w-0 flex-1 items-center sm:flex md:max-w-sm">
        <Icon
          icon={Search01Icon}
          size={16}
          className="pointer-events-none absolute left-3 text-grey-300"
        />
        <span className="sr-only">Search</span>
        <input
          type="search"
          placeholder="Search..."
          className={cn(
            "h-10 w-full rounded-lg border border-grey-50 bg-white pl-9 pr-3 text-sm",
            "outline-none transition-colors placeholder:text-grey-300",
            "focus:border-grey-300 focus:shadow-ring-gray",
          )}
        />
      </label>

      <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
        <Dropdown
          options={CURRENCIES.map((currency) => ({
            value: currency.value,
            label: currency.label,
            icon: <Flag code={currency.country} size="sm" />,
          }))}
          value={currency}
          onChange={setCurrency}
          align="end"
          className="hidden sm:inline-flex"
        />

        <button
          type="button"
          aria-label={`Notifications${notificationCount ? `, ${notificationCount} unread` : ""}`}
          className="relative grid size-9 place-items-center rounded-full text-grey-500 hover:bg-grey-25"
        >
          <Icon icon={Notification03Icon} size={20} />
          {notificationCount > 0 ? (
            <span className="absolute -top-0.5 -right-0.5 grid size-4 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {notificationCount}
            </span>
          ) : null}
        </button>

        <button
          type="button"
          aria-label="Account menu"
          className="flex items-center gap-1.5 rounded-full outline-none focus-visible:shadow-ring-primary"
        >
          <Avatar name="Surd Admin" size="sm" tone="inverse" />
          <Icon
            icon={ArrowDown01Icon}
            size={16}
            className="hidden text-grey-400 sm:block"
          />
        </button>
      </div>
    </header>
  );
}
