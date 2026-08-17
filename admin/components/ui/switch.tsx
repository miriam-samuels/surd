"use client";

import { Switch as RadixSwitch } from "radix-ui";
import { Cancel01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

/**
 * On/off toggle built on Radix.
 *
 * `withIcons` draws a ✕ and a ✓ inside the track — useful where the state has
 * to be legible at a glance, such as a permissions matrix.
 *
 *   <Switch checked={live} onCheckedChange={setLive} label="Live mode" />
 */

export const SWITCH_SIZES = ["sm", "md", "lg"] as const;
export type SwitchSize = (typeof SWITCH_SIZES)[number];

type SwitchMetrics = {
  track: string;
  thumb: string;
  travel: string;
  glyph: number;
  label: string;
};

const metrics: Record<SwitchSize, SwitchMetrics> = {
  sm: {
    track: "h-5 w-9",
    thumb: "size-4",
    travel: "data-[state=checked]:translate-x-4",
    glyph: 8,
    label: "text-xs",
  },
  md: {
    track: "h-6 w-11",
    thumb: "size-5",
    travel: "data-[state=checked]:translate-x-5",
    glyph: 10,
    label: "text-sm",
  },
  lg: {
    track: "h-7 w-13",
    thumb: "size-6",
    travel: "data-[state=checked]:translate-x-6",
    glyph: 12,
    label: "text-md",
  },
};

type SwitchProps = React.ComponentProps<typeof RadixSwitch.Root> & {
  size?: SwitchSize;
  label?: string;
  /** Draw ✕ / ✓ marks inside the track. */
  withIcons?: boolean;
};

export function Switch({
  size = "md",
  label,
  withIcons = false,
  className,
  id,
  ...props
}: SwitchProps) {
  const metric = metrics[size];

  const control = (
    <RadixSwitch.Root
      id={id}
      className={cn(
        "relative inline-flex shrink-0 items-center rounded-full p-0.5 transition-colors",
        "bg-grey-100 outline-none data-[state=checked]:bg-surd-blue-500",
        "focus-visible:shadow-ring-primary",
        "disabled:pointer-events-none disabled:opacity-40",
        metric.track,
        className,
      )}
      {...props}
    >
      {withIcons ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-between px-1.5"
        >
          <Icon
            icon={Cancel01Icon}
            size={metric.glyph}
            strokeWidth={3}
            className="text-grey-400"
          />
          <Icon
            icon={Tick02Icon}
            size={metric.glyph}
            strokeWidth={3}
            className="text-white"
          />
        </span>
      ) : null}

      <RadixSwitch.Thumb
        className={cn(
          "relative z-10 block rounded-full bg-white shadow-sm transition-transform",
          metric.thumb,
          metric.travel,
        )}
      />
    </RadixSwitch.Root>
  );

  if (!label) return control;

  return (
    <div className="flex items-center gap-2.5">
      {control}
      <label
        htmlFor={id}
        className={cn(
          "cursor-pointer font-medium text-grey-900 select-none",
          metric.label,
        )}
      >
        {label}
      </label>
    </div>
  );
}
