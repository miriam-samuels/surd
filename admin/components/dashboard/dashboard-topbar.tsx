"use client";
import {
  Search01Icon,
  SidebarLeft01Icon,
  PanelLeftIcon,
  BellIcon
} from "@hugeicons/core-free-icons";
import { useCurrency } from "@/contexts/currency";

import { Flag } from "@/components/ui/flag";
import { Icon } from "@/components/ui/icon";
import { Dropdown } from "@/components/ui/dropdown";
import { AccountMenu } from "@/components/dashboard/account-menu";
import { cn } from "@/lib/cn";
import { Input } from "../ui/input";
import { Currency } from "@/types/enum";
import { CURRENCIES } from "@/constants/currency";

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
  const { currency, setCurrency } = useCurrency();

  return (

    <header className="z-30 flex h-16 shrink-0 items-center gap-3 border-b border-grey-50 bg-white px-4 sm:px-6">
      <button
        type="button"
        onClick={onOpenDrawer}
        aria-label="Open navigation"
        className="grid size-9 shrink-0 place-items-center rounded-lg text-grey-500 hover:bg-grey-25 lg:hidden"
      >
        <Icon icon={PanelLeftIcon} size={20} />
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


      <Input
        type="search"
        placeholder="Search..."
        leftIcon={
          <Icon
            icon={Search01Icon}
            size={16}
          />}
        className={cn(
          "bg-grey-50 text-sm h-10 w-60",
        )}
      />

      <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
        <Dropdown
          options={CURRENCIES.map((currency) => ({
            value: currency.value,
            label: currency.label,
            icon: <Flag code={currency.country} size="sm" />,
          }))}
          value={currency}
          onChange={(value) => setCurrency(value as Currency)}
          align="end"
          className="hidden sm:inline-flex"
        />

        <button
          type="button"
          aria-label={`Notifications${notificationCount ? `, ${notificationCount} unread` : ""}`}
          className="relative grid size-9 place-items-center rounded-full text-grey-500 hover:bg-grey-25"
        >
          <Icon icon={BellIcon} size={20} />
          {notificationCount > 0 ? (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {notificationCount}
            </span>
          ) : null}
        </button>

        <AccountMenu />
      </div>
    </header>
  );
}
