"use client";

import { useState } from "react";
import { Select as RadixSelect } from "radix-ui";
import { ArrowDown01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/ui/icon";
import { inputVariants } from "@/components/ui/input";
import { cn } from "@/lib/cn";

export type SelectOption = {
  value: string;
  label: string;

  icon?: React.ReactNode;
};

type SelectProps = {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  variant?: "default" | "error" | "success";
  inputSize?: "default" | "sm";
  disabled?: boolean;
  id?: string;

  compact?: boolean;
  className?: string;
};

export function Select({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Select",
  variant = "default",
  inputSize = "default",
  disabled = false,
  id,
  compact = false,
  className,
}: SelectProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = value ?? internalValue;
  const selected = options.find((option) => option.value === currentValue);

  const handleValueChange = (next: string) => {
    setInternalValue(next);
    onValueChange?.(next);
  };

  return (
    <RadixSelect.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={handleValueChange}
      disabled={disabled}
    >
      <RadixSelect.Trigger asChild id={id}>
        <div
          data-disabled={disabled || undefined}
          className={cn(
            inputVariants({ variant, inputSize }),
            "cursor-pointer items-center justify-between gap-2 outline-none",
            disabled && "pointer-events-none opacity-50",
            compact && "w-auto",
            className,
          )}
        >
          <span className="flex min-w-0 items-center gap-2 font-medium">
            {selected?.icon}
            <RadixSelect.Value placeholder={placeholder} />
          </span>
          <RadixSelect.Icon>
            <Icon
              icon={ArrowDown01Icon}
              size={inputSize === "sm" ? 16 : 20}
              className={variant === "error" ? "text-red-500" : "text-grey-400"}
            />
          </RadixSelect.Icon>
        </div>
      </RadixSelect.Trigger>

      <RadixSelect.Portal>
        <RadixSelect.Content
          position="popper"
          sideOffset={6}
          className={cn(
            "z-50 min-w-(--radix-select-trigger-width) overflow-hidden rounded-xl",
            "border border-grey-50 bg-white p-1 shadow-lg",
          )}
        >
          <RadixSelect.Viewport>
            {options.map((option) => (
              <RadixSelect.Item
                key={option.value}
                value={option.value}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2",
                  "text-sm font-medium text-grey-900 outline-none select-none",
                  "data-[highlighted]:bg-grey-25",
                  "data-[state=checked]:text-surd-blue-600",
                )}
              >
                {option.icon}
                <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                <RadixSelect.ItemIndicator className="ml-auto">
                  <Icon icon={Tick02Icon} size={14} />
                </RadixSelect.ItemIndicator>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}
