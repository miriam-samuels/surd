"use client";

import Link from "next/link";
import { NavigationMenu } from "radix-ui";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { Icon, type IconSvgElement } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

export type DropdownItem = {
  label: string;
  href: string;
  description?: string;
  icon?: IconSvgElement;
};

type NavDropdownProps = {
  label: string;
  items: DropdownItem[];
  className?: string;
};

export function NavDropdown({ label, items, className }: NavDropdownProps) {
  const isMega = items.some((i) => i.icon && i.description);

  return (
    <NavigationMenu.Root className="relative z-50">
      <NavigationMenu.List className="flex">
        <NavigationMenu.Item>
          <NavigationMenu.Trigger
            className={cn(
              "group flex h-12 items-center gap-1 rounded px-4 text-sm font-semibold",
              "transition-colors hover:text-grey-900 dark:hover:text-grey-50",
              "text-grey-400 outline-none",
              className,
            )}
          >
            {label}
            <Icon
              icon={ArrowDown01Icon}
              strokeWidth={2}
              size={20}
              className="transition-transform duration-200 group-data-[state=open]:rotate-180"
            />
          </NavigationMenu.Trigger>

          <NavigationMenu.Content
            className={cn(
              "absolute top-full left-1/2 mt-3 -translate-x-1/2",
              "rounded-2xl border border-grey-100 bg-white shadow-2xl",
              "dark:border-grey-800 dark:bg-grey-950",
              "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
              "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
              isMega ? "w-[calc(100vw-2rem)] max-w-[650px] md:w-[650px]" : "w-56",
            )}
          >
            {isMega ? (
              <MegaMenuPanel items={items} />
            ) : (
              <SimpleDropdownPanel items={items} />
            )}
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>

      <NavigationMenu.Viewport className="absolute top-full left-0" />
    </NavigationMenu.Root>
  );
}

function MegaMenuPanel({ items }: { items: DropdownItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-2 p-3 sm:grid-cols-2">
      {items.map((item) => (
        <NavigationMenu.Link key={item.label} asChild>
          <Link
            href={item.href}
            className={cn(
              "group/card flex items-start gap-3 rounded-xl p-4",
              "transition-colors hover:bg-grey-25 dark:hover:bg-grey-900",
            )}
          >
            {item.icon && (
              <span
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-xl",
                  "bg-surd-blue-50 text-surd-blue-500",
                  "transition-colors group-hover/card:bg-surd-blue-100",
                )}
              >
                <Icon icon={item.icon} size={22} />
              </span>
            )}
            <div className="flex flex-col gap-0.5">
              <span className="text-base font-semibold text-grey-900 dark:text-grey-50">
                {item.label}
              </span>
              {item.description && (
                <span className="text-sm font-medium leading-snug text-grey-400">
                  {item.description}
                </span>
              )}
            </div>
          </Link>
        </NavigationMenu.Link>
      ))}
    </div>
  );
}

function SimpleDropdownPanel({ items }: { items: DropdownItem[] }) {
  return (
    <div className="flex flex-col gap-0.5 p-2">
      {items.map((item) => (
        <NavigationMenu.Link key={item.label} asChild>
          <Link
            href={item.href}
            className={cn(
              "flex h-10 items-center rounded-lg px-3 text-sm font-medium text-grey-700",
              "transition-colors hover:bg-grey-25 hover:text-grey-900",
              "dark:text-grey-300 dark:hover:bg-grey-900 dark:hover:text-grey-50",
            )}
          >
            {item.label}
          </Link>
        </NavigationMenu.Link>
      ))}
    </div>
  );
}
