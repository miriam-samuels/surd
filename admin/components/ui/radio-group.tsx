"use client";

import { RadioGroup as RadixRadioGroup } from "radix-ui";
import { cn } from "@/lib/cn";

/**
 * Radio group built on Radix — arrow-key roving focus and single selection are
 * handled for us.
 *
 *   <RadioGroup value={plan} onValueChange={setPlan}>
 *     <RadioGroupItem value="flexi" label="Flexi wallet" />
 *     <RadioGroupItem value="fixed" label="Fixed deposit" />
 *   </RadioGroup>
 */

export const RADIO_SIZES = ["sm", "md", "lg"] as const;
export type RadioSize = (typeof RADIO_SIZES)[number];

const ringSizes: Record<RadioSize, string> = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
};

const dotSizes: Record<RadioSize, string> = {
  sm: "size-1.5",
  md: "size-2",
  lg: "size-2.5",
};

const labelSizes: Record<RadioSize, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-md",
};

export function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadixRadioGroup.Root>) {
  return (
    <RadixRadioGroup.Root
      className={cn("flex flex-col gap-3", className)}
      {...props}
    />
  );
}

type RadioGroupItemProps = React.ComponentProps<
  typeof RadixRadioGroup.Item
> & {
  size?: RadioSize;
  label?: string;
};

export function RadioGroupItem({
  size = "md",
  label,
  className,
  id,
  value,
  ...props
}: RadioGroupItemProps) {
  const controlId = id ?? `radio-${value}`;

  const control = (
    <RadixRadioGroup.Item
      id={controlId}
      value={value}
      className={cn(
        "grid shrink-0 place-items-center rounded-full border-2 transition-colors",
        "border-grey-150 bg-white outline-none",
        "data-[state=checked]:border-surd-blue-500",
        "hover:border-surd-blue-400",
        "focus-visible:shadow-ring-primary",
        "disabled:pointer-events-none disabled:opacity-40",
        ringSizes[size],
        className,
      )}
      {...props}
    >
      <RadixRadioGroup.Indicator
        className={cn("rounded-full bg-surd-blue-500", dotSizes[size])}
      />
    </RadixRadioGroup.Item>
  );

  if (!label) return control;

  return (
    <div className="flex items-center gap-2.5">
      {control}
      <label
        htmlFor={controlId}
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
