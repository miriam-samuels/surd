"use client";

import { Search01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { Input } from "./input";

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
    <Input
      type="search"
      leftIcon={<Icon
        icon={Search01Icon}
        size={16}
      />}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className={cn(
        "h-10 w-full ",
        className
      )}
      {...props}
    />
  );
}
