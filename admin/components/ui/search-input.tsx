"use client";

import { Search01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

/**
 * The rounded search field used above every table.
 * Controlled — the page owns the query so it can filter its own data.
 */
type SearchInputProps = Omit<
  React.ComponentProps<"input">,
  "type" | "value" | "onChange"
> & {
  value: string;
  onChange: (value: string) => void;
  label?: string;
};

export function SearchInput({
  value,
  onChange,
  label = "Search",
  placeholder = "Search...",
  className,
  ...props
}: SearchInputProps) {
  return (
    <label className={cn("relative flex items-center", className)}>
      <Icon
        icon={Search01Icon}
        size={16}
        className="pointer-events-none absolute left-4 text-grey-300"
      />
      <span className="sr-only">{label}</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={cn(
          "h-10 w-full rounded-full bg-grey-25 pl-10 pr-4 text-sm text-grey-900",
          "outline-none transition-colors placeholder:text-grey-300",
          "focus:bg-white focus:shadow-ring-gray",
        )}
        {...props}
      />
    </label>
  );
}
