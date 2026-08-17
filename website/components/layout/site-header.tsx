"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog } from "radix-ui";
import { ArrowDown01Icon, Cancel01Icon, Menu01Icon } from "@hugeicons/core-free-icons";
import { Logo } from "@/components/brand/logo";
import { Icon } from "@/components/ui/icon";
import { NavDropdown } from "@/components/ui/nav-dropdown";
import { DownloadAppButton } from "@/components/ui/download-app-button";
import { PRIMARY_NAV, type NavLink } from "@/content/nav";
import { cn } from "@/lib/cn";


export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href.startsWith("/#") ? false : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 flex justify-center py-4 sm:py-6">
      <nav
        aria-label="Main"
        className={cn(
          "flex items-center gap-4 rounded-full border border-grey-100 bg-white p-2",
          "shadow-xl lg:gap-10 xl:gap-20",
          "dark:border-grey-800 dark:bg-grey-950",
        )}
      >
        <Logo className="ml-3 lg:ml-4" />

        <ul className="hidden items-center gap-0.5 lg:flex">
          {PRIMARY_NAV.map((link) => (
            <li key={link.label}>
              {link.children ? (
                <NavDropdown
                  label={link.label}
                  items={link.children}
                  className={cn(
                    isActive(link.href)
                      ? "text-grey-900 dark:text-grey-50"
                      : "text-grey-400",
                  )}
                />
              ) : (
                <Link
                  href={link.href}
                  className={cn(
                    "flex h-12 items-center rounded px-4 text-sm font-semibold",
                    "transition-colors hover:text-grey-900 dark:hover:text-grey-50",
                    isActive(link.href)
                      ? "text-grey-900 dark:text-grey-50"
                      : "text-grey-400",
                  )}
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <DownloadAppButton className="hidden sm:inline-flex" />

        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <button
              type="button"
              aria-label="Open menu"
              className={cn(
                "grid size-12 shrink-0 place-items-center rounded-full text-grey-900 lg:hidden",
                "transition-colors hover:bg-grey-25 dark:text-grey-50 dark:hover:bg-grey-900",
              )}
            >
              <Icon icon={Menu01Icon} />
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-grey-1000/40 backdrop-blur-sm" />
            <Dialog.Content
              className={cn(
                "fixed inset-x-4 top-4 z-50 rounded-3xl border border-grey-100 bg-white p-6",
                "shadow-2xl outline-none dark:border-grey-800 dark:bg-grey-950",
                "max-h-[calc(100vh-2rem)] overflow-y-auto",
              )}
            >
              <Dialog.Title className="sr-only">Menu</Dialog.Title>
              <div className="flex items-center justify-between">
                <Logo />
                <Dialog.Close asChild>
                  <button
                    type="button"
                    aria-label="Close menu"
                    className="grid size-10 place-items-center rounded-full hover:bg-grey-25 dark:hover:bg-grey-900"
                  >
                    <Icon icon={Cancel01Icon} size="sm" />
                  </button>
                </Dialog.Close>
              </div>

              <ul className="mt-6 flex flex-col gap-1">
                {PRIMARY_NAV.map((link) => (
                  <li key={link.label}>
                    {link.children ? (
                      <MobileNavAccordion link={link} />
                    ) : (
                      <Dialog.Close asChild>
                        <Link
                          href={link.href}
                          className="flex h-12 items-center rounded-xl px-3 text-lg font-semibold text-grey-900 hover:bg-grey-25 dark:text-grey-50 dark:hover:bg-grey-900"
                        >
                          {link.label}
                        </Link>
                      </Dialog.Close>
                    )}
                  </li>
                ))}
              </ul>

              <DownloadAppButton className="mt-6 w-full" />
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </nav>
    </header>
  );
}

function MobileNavAccordion({ link }: { link: NavLink }) {
  const [expanded, setExpanded] = useState(false);

  if (!link.children) return null;

  return (
    <div className="flex flex-col ">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex h-12 w-full items-center justify-between rounded-xl px-3 text-lg font-semibold text-grey-900 hover:bg-grey-25 dark:text-grey-50 dark:hover:bg-grey-900"
      >
        <span>{link.label}</span>
        <Icon
          icon={ArrowDown01Icon}
          size={20}
          className={cn(
            "text-grey-400 transition-transform duration-200",
            expanded && "rotate-180 text-grey-900 dark:text-grey-50",
          )}
        />
      </button>

      {expanded && (
        <div className="mt-1 flex flex-col gap-1.5 pl-2">
          {link.children.map((child) => (
            <Dialog.Close key={child.label} asChild>
              <Link
                href={child.href}
                className="flex items-start gap-3 rounded-xl p-3 hover:bg-grey-25 dark:hover:bg-grey-900"
              >
                {child.icon && (
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surd-blue-50 text-surd-blue-500">
                    <Icon icon={child.icon} size={20} />
                  </span>
                )}
                <div className="flex flex-col gap-0.5">
                  <span className="text-base font-semibold text-grey-900 dark:text-grey-50">
                    {child.label}
                  </span>
                  {child.description && (
                    <span className="text-xs text-grey-400">
                      {child.description}
                    </span>
                  )}
                </div>
              </Link>
            </Dialog.Close>
          ))}
        </div>
      )}
    </div>
  );
}
