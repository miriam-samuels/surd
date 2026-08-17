"use client";

import { Tabs as RadixTabs } from "radix-ui";
import { Icon, type IconSvgElement } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

/**
 * Two tab treatments, both Radix-backed so keyboard navigation and ARIA come
 * for free:
 *
 * `variant="underline"` — the page-level tabs on a record (Balances, Profile,
 * Account…). The strip scrolls horizontally on narrow screens.
 *
 * `variant="pill"` — the inline segmented switch inside a card (Templates /
 * Fees & Charges, Target Savings / Fixed Deposits).
 *
 *   <Tabs items={USER_TABS} value={tab} onValueChange={setTab}>
 *     <TabPanel value="profile"><ProfileCard … /></TabPanel>
 *   </Tabs>
 */

export type TabItem = {
  value: string;
  label: string;
  icon?: IconSvgElement;
  /** Count rendered after the label. */
  badge?: number;
};

type TabsProps = {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: "underline" | "pill";
  children?: React.ReactNode;
  className?: string;
  listClassName?: string;
};

export function Tabs({
  items,
  value,
  defaultValue,
  onValueChange,
  variant = "underline",
  children,
  className,
  listClassName,
}: TabsProps) {
  const isPill = variant === "pill";

  return (
    <RadixTabs.Root
      value={value}
      defaultValue={defaultValue ?? items[0]?.value}
      onValueChange={onValueChange}
      className={cn("flex flex-col", className)}
    >
      <RadixTabs.List
        className={cn(
          "flex shrink-0 items-center overflow-x-auto",
          isPill ? "gap-3" : "gap-1 border-b border-grey-50",
          listClassName,
        )}
      >
        {items.map((item) => (
          <RadixTabs.Trigger
            key={item.value}
            value={item.value}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 font-semibold whitespace-nowrap",
              "transition-colors outline-none focus-visible:shadow-ring-primary",
              isPill
                ? cn(
                    "h-10 rounded-full px-5 text-sm",
                    "bg-grey-25 text-grey-900 hover:bg-grey-50",
                    "data-[state=active]:bg-surd-blue-50 data-[state=active]:text-primary",
                  )
                : cn(
                    "relative px-4 pb-3 pt-2 text-md text-grey-400 hover:text-grey-900",
                    "data-[state=active]:text-primary",
                    "after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:rounded-full",
                    "data-[state=active]:after:bg-primary",
                  ),
            )}
          >
            {item.icon ? <Icon icon={item.icon} size={16} /> : null}
            {item.label}
            {item.badge !== undefined ? (
              <span className="rounded-full bg-grey-50 px-1.5 py-0.5 text-2xs text-grey-600">
                {item.badge}
              </span>
            ) : null}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>

      {children}
    </RadixTabs.Root>
  );
}

export function TabPanel({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <RadixTabs.Content
      value={value}
      className={cn("outline-none", className)}
    >
      {children}
    </RadixTabs.Content>
  );
}
