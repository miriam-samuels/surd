"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/ui/icon";
import { SIDEBAR_GROUPS, type NavGroup, type NavItem } from "@/content/navigation";
import { cn } from "@/lib/cn";

/**
 * The navigation list shared by the desktop rail and the mobile drawer.
 *
 * Each titled group is a collapse toggle, per the design's chevrons. Groups
 * start open and the state is per-session — a signed-in admin lives on two or
 * three of these sections, so remembering the choice matters less than the
 * list staying predictable between visits.
 *
 * `collapsed` shrinks the whole rail to icons only. Group headings become a
 * hairline in that mode so the sections still read as separate, and every
 * label falls back to a native tooltip via `title`.
 */

export function SidebarNav({
  collapsed = false,
  onNavigate,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin sections" className="flex flex-col gap-5">
      {SIDEBAR_GROUPS.map((group) => (
        <NavSection
          key={group.id}
          group={group}
          pathname={pathname}
          collapsed={collapsed}
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  );
}

function NavSection({
  group,
  pathname,
  collapsed,
  onNavigate,
}: {
  group: NavGroup;
  pathname: string;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const [open, setOpen] = useState(true);
  /* A collapsed rail has no room for headings, so nothing can be folded away. */
  const showItems = open || collapsed;

  return (
    <div className="flex flex-col gap-1">
      {group.title ? (
        collapsed ? (
          <span aria-hidden className="mx-auto my-1 h-px w-6 bg-grey-100" />
        ) : (
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            className={cn(
              "flex items-center justify-between gap-2 rounded-lg px-3 py-1.5",
              "text-sm font-medium text-grey-400 outline-none",
              "transition-colors hover:text-grey-600 focus-visible:shadow-ring-primary",
            )}
          >
            {group.title}
            <GroupChevron open={open} />
          </button>
        )
      ) : null}

      {showItems ? (
        <ul className="flex flex-col gap-0.5">
          {group.items.map((item) => (
            <li key={item.href}>
              <SidebarLink
                item={item}
                active={isActive(pathname, item.href)}
                collapsed={collapsed}
                onNavigate={onNavigate}
              />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/** `/users` should stay lit on `/users/42`, but `/` must not match everything. */
function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarLink({
  item,
  active,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      title={collapsed ? item.label : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-md font-medium",
        "outline-none transition-colors focus-visible:shadow-ring-primary",
        collapsed && "justify-center px-0",
        active
          ? /* The animated ring lives here — see `rotating-border` in globals.css. */
            "rotating-border font-semibold text-primary"
          : "text-grey-800 hover:bg-grey-25 hover:text-grey-900",
      )}
    >
      <Icon
        icon={item.icon}
        size={20}
        className={cn("shrink-0", active ? "text-primary" : "text-grey-600")}
      />

      {collapsed ? (
        <span className="sr-only">{item.label}</span>
      ) : (
        <span className="min-w-0 flex-1 truncate">{item.label}</span>
      )}

      {!collapsed && item.badge ? (
        <span className="shrink-0 rounded-full bg-red-500 px-1.5 py-0.5 text-2xs font-bold text-white">
          {item.badge}
        </span>
      ) : null}
    </Link>
  );
}

/** Collapse chevron used by the group headers, and elsewhere in the console. */
export function GroupChevron({ open }: { open: boolean }) {
  return (
    <Icon
      icon={ArrowDown01Icon}
      size={16}
      className={cn(
        "shrink-0 text-grey-400 transition-transform",
        open && "rotate-180",
      )}
    />
  );
}
