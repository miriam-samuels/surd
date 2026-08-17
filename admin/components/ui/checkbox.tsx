"use client";

import { Checkbox as RadixCheckbox } from "radix-ui";
import { MinusSignIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

/**
 * Checkbox built on Radix, so keyboard, label association and the
 * indeterminate state come for free.
 *
 * Pass `checked="indeterminate"` for the mixed state of a parent row.
 *
 *   <Checkbox checked={all} onCheckedChange={setAll} label="Select all" />
 */

export const CHECKBOX_SIZES = ["sm", "md", "lg"] as const;
export type CheckboxSize = (typeof CHECKBOX_SIZES)[number];

const boxSizes: Record<CheckboxSize, string> = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
};

const glyphSizes: Record<CheckboxSize, number> = { sm: 10, md: 12, lg: 14 };

const labelSizes: Record<CheckboxSize, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-md",
};

type CheckboxProps = React.ComponentProps<typeof RadixCheckbox.Root> & {
  size?: CheckboxSize;
  /** Renders a `<label>` beside the control and wires it up. */
  label?: string;
  /** Square corners instead of the default rounded ones. */
  shape?: "rounded" | "square";
};

export function Checkbox({
  size = "md",
  label,
  shape = "rounded",
  className,
  id,
  ...props
}: CheckboxProps) {
  const control = (
    <RadixCheckbox.Root
      id={id}
      className={cn(
        "grid shrink-0 place-items-center border-2 transition-colors outline-none",
        "border-grey-150 bg-white text-white",
        "data-[state=checked]:border-surd-blue-500 data-[state=checked]:bg-surd-blue-500",
        "data-[state=indeterminate]:border-surd-blue-500 data-[state=indeterminate]:bg-surd-blue-500",
        "hover:border-surd-blue-400",
        "focus-visible:shadow-ring-primary",
        "disabled:pointer-events-none disabled:opacity-40",
        shape === "rounded" ? "rounded-md" : "rounded-sm",
        boxSizes[size],
        className,
      )}
      {...props}
    >
      <RadixCheckbox.Indicator className="grid place-items-center">
        {props.checked === "indeterminate" ? (
          <Icon icon={MinusSignIcon} size={glyphSizes[size]} strokeWidth={3} />
        ) : (
          <Icon icon={Tick02Icon} size={glyphSizes[size]} strokeWidth={3} />
        )}
      </RadixCheckbox.Indicator>
    </RadixCheckbox.Root>
  );

  if (!label) return control;

  return (
    <div className="flex items-center gap-2.5">
      {control}
      <label
        htmlFor={id}
        className={cn(
          "cursor-pointer font-medium text-grey-900 select-none",
          labelSizes[size],
        )}
      >
        {label}
      </label>
    </div>
  );
}
