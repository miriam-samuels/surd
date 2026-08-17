"use client";

import { Dialog as RadixDialog } from "radix-ui";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { Icon, type IconSvgElement } from "@/components/ui/icon";
import type { Disclosure } from "@/hooks/use-disclosure";
import { cn } from "@/lib/cn";

/**
 * Panel that slides in from an edge.
 *
 * Built on the same Radix dialog primitive as `Dialog`, so it inherits focus
 * trapping, scroll locking and Escape handling. Reach for a drawer over a
 * dialog when the content is long or the user needs to keep referring to the
 * page behind it — record detail, filter builders, activity feeds.
 *
 * `footer` is pinned to the bottom while the body scrolls.
 */

const sides = {
  right: {
    position: "inset-y-0 right-0",
    enter: "data-[state=open]:animate-drawer-in-right",
  },
  left: {
    position: "inset-y-0 left-0",
    enter: "data-[state=open]:animate-drawer-in",
  },
} as const;

const widths = {
  sm: "w-full max-w-sm",
  md: "w-full max-w-md",
  lg: "w-full max-w-lg",
  xl: "w-full max-w-2xl",
} as const;

type DrawerProps = {
  control: Pick<Disclosure<unknown>, "isOpen" | "setOpen">;
  title: string;
  description?: string;
  icon?: IconSvgElement;
  side?: keyof typeof sides;
  width?: keyof typeof widths;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function Drawer({
  control,
  title,
  description,
  icon,
  side = "right",
  width = "md",
  children,
  footer,
}: DrawerProps) {
  const config = sides[side];

  return (
    <RadixDialog.Root open={control.isOpen} onOpenChange={control.setOpen}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-50 bg-grey-1000/40 backdrop-blur-sm" />
        <RadixDialog.Content
          className={cn(
            "fixed z-50 flex flex-col bg-white shadow-2xl outline-none",
            config.position,
            config.enter,
            widths[width],
          )}
        >
          <header className="flex shrink-0 items-start justify-between gap-4 border-b border-grey-50 p-5">
            <div className="min-w-0">
              <RadixDialog.Title className="flex items-center gap-2 text-lg font-bold text-grey-900">
                {icon ? (
                  <Icon icon={icon} size={20} className="text-primary" />
                ) : null}
                {title}
              </RadixDialog.Title>
              {description ? (
                <RadixDialog.Description className="mt-1 text-sm text-grey-500">
                  {description}
                </RadixDialog.Description>
              ) : null}
            </div>

            <RadixDialog.Close asChild>
              <button
                type="button"
                aria-label="Close"
                className="grid size-8 shrink-0 place-items-center rounded-lg bg-grey-25 text-grey-500 transition-colors hover:bg-grey-50 hover:text-grey-900"
              >
                <Icon icon={Cancel01Icon} size={16} />
              </button>
            </RadixDialog.Close>
          </header>

          <div className="flex-1 overflow-y-auto p-5">{children}</div>

          {footer ? (
            <footer className="shrink-0 border-t border-grey-50 p-5">
              {footer}
            </footer>
          ) : null}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
