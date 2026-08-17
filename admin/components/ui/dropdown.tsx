"use client";

import { useMemo, useState } from "react";
import { Popover } from "radix-ui";
import {
  ArrowDown01Icon,
  Cancel01Icon,
  Search01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { Checkbox } from "@/components/ui/checkbox";
import { Icon, type IconSvgElement } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

/**
 * Popover pickers.
 *
 * Three exports, one surface:
 *
 * `Dropdown`       single choice — "All modules" style filters and menus
 * `MultiDropdown`  many choices with checkboxes, an "All" row and an optional
 *                  search box; the trigger shows a count, and once a selection
 *                  exists it collapses to a removable chip
 * `FilterChip`     the chip itself, exported for hand-rolled filter bars
 *
 * Both are built on Radix Popover rather than Select so the panel can hold a
 * search field and avatars, which a native listbox cannot.
 */

export type DropdownOption = {
  value: string;
  label: string;
  /** Rendered before the label in the list and the trigger. */
  icon?: React.ReactNode;
};

const panelClass = cn(
  "z-50 min-w-(--radix-popover-trigger-width) overflow-hidden rounded-2xl",
  "border border-grey-50 bg-white p-1.5 shadow-lg outline-none",
);

const triggerClass = cn(
  "inline-flex h-10 items-center gap-2 rounded-full border border-grey-100 bg-white",
  "px-4 text-sm font-semibold text-grey-900 transition-colors outline-none",
  "hover:border-grey-150 focus-visible:shadow-ring-primary",
  "disabled:pointer-events-none disabled:opacity-40",
);

/* ------------------------------------------------------------------ single */

type DropdownProps = {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  /** Shown when nothing is selected. */
  placeholder?: string;
  icon?: IconSvgElement;
  align?: "start" | "center" | "end";
  disabled?: boolean;
  className?: string;
};

export function Dropdown({
  options,
  value,
  onChange,
  placeholder = "Select",
  icon,
  align = "start",
  disabled = false,
  className,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        disabled={disabled}
        className={cn(triggerClass, className)}
      >
        {icon ? <Icon icon={icon} size={16} className="text-grey-400" /> : null}
        {selected?.icon}
        <span className="truncate">{selected?.label ?? placeholder}</span>
        <Icon
          icon={ArrowDown01Icon}
          size={16}
          className={cn("ml-auto text-grey-400 transition-transform", open && "rotate-180")}
        />
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content align={align} sideOffset={6} className={panelClass}>
          <ul className="flex max-h-72 flex-col overflow-y-auto">
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange?.(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm",
                    "transition-colors hover:bg-grey-25",
                    option.value === value
                      ? "font-semibold text-primary"
                      : "text-grey-900",
                  )}
                >
                  {option.icon}
                  <span className="min-w-0 flex-1 truncate">{option.label}</span>
                  {option.value === value ? (
                    <Icon icon={Tick02Icon} size={14} />
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

/* ------------------------------------------------------------------- multi */

type MultiDropdownProps = {
  options: DropdownOption[];
  value: string[];
  onChange: (value: string[]) => void;
  /** Trigger text when nothing is selected, e.g. "All modules". */
  label: string;
  /** Adds a search field above the list. Worth it past ~8 options. */
  searchable?: boolean;
  searchPlaceholder?: string;
  align?: "start" | "center" | "end";
  className?: string;
};

export function MultiDropdown({
  options,
  value,
  onChange,
  label,
  searchable = false,
  searchPlaceholder = "Search",
  align = "start",
  className,
}: MultiDropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(trimmed),
    );
  }, [options, query]);

  const allSelected = value.length === options.length;

  const toggle = (optionValue: string) => {
    onChange(
      value.includes(optionValue)
        ? value.filter((item) => item !== optionValue)
        : [...value, optionValue],
    );
  };

  /* An empty selection and a full one both mean "no filter" to the caller. */
  const toggleAll = () =>
    onChange(allSelected ? [] : options.map((option) => option.value));

  const selectedOptions = options.filter((option) =>
    value.includes(option.value),
  );

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        className={cn(
          triggerClass,
          value.length > 0 && "border-primary text-primary",
          className,
        )}
      >
        {selectedOptions.length > 0 ? (
          <TriggerSummary label={label} selected={selectedOptions} />
        ) : (
          <span className="truncate">{label}</span>
        )}
        <Icon
          icon={ArrowDown01Icon}
          size={16}
          className={cn("transition-transform", open && "rotate-180")}
        />
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align={align}
          sideOffset={6}
          className={cn(panelClass, "w-72")}
        >
          {searchable ? (
            <label className="mb-1 flex items-center gap-2 border-b border-grey-50 px-3 pb-2.5 pt-1.5">
              <Icon icon={Search01Icon} size={16} className="text-grey-300" />
              <span className="sr-only">{searchPlaceholder}</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={searchPlaceholder}
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-grey-300"
              />
            </label>
          ) : null}

          <ul className="flex max-h-72 flex-col overflow-y-auto">
            <li>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-grey-900 hover:bg-grey-25">
                <span className="min-w-0 flex-1">All</span>
                <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
              </label>
            </li>

            {visible.map((option) => (
              <li key={option.value}>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-grey-900 hover:bg-grey-25">
                  {option.icon}
                  <span className="min-w-0 flex-1 truncate">{option.label}</span>
                  <Checkbox
                    checked={value.includes(option.value)}
                    onCheckedChange={() => toggle(option.value)}
                  />
                </label>
              </li>
            ))}

            {visible.length === 0 ? (
              <li className="px-3 py-6 text-center text-sm text-grey-400">
                No matches
              </li>
            ) : null}
          </ul>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

/** One selection shows its own label; several collapse to a count. */
function TriggerSummary({
  label,
  selected,
}: {
  label: string;
  selected: DropdownOption[];
}) {
  if (selected.length === 1) {
    return (
      <span className="flex min-w-0 items-center gap-2">
        {selected[0].icon}
        <span className="truncate">{selected[0].label}</span>
      </span>
    );
  }

  return (
    <span className="flex min-w-0 items-center gap-2">
      {selected.slice(0, 2).map((option) => option.icon)}
      <span className="truncate">
        {selected.length} {label}
      </span>
    </span>
  );
}

/* -------------------------------------------------------------------- chip */

type FilterChipProps = {
  label: string;
  icon?: React.ReactNode;
  onRemove: () => void;
};

/** A removable applied-filter pill, as used above the audit log table. */
export function FilterChip({ label, icon, onRemove }: FilterChipProps) {
  return (
    <span className="inline-flex h-10 items-center gap-2 rounded-full border border-primary bg-white px-4 text-sm font-semibold text-primary">
      {icon}
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="grid size-4 place-items-center rounded-full bg-primary text-white transition-opacity hover:opacity-80"
      >
        <Icon icon={Cancel01Icon} size={10} strokeWidth={3} />
      </button>
    </span>
  );
}
