import { Icon, type IconSvgElement } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

/**
 * The input shell, and the plain text input built on it.
 *
 * `InputShell` owns every piece of field styling — surface, border, radius,
 * height and the hover/focus/error/disabled transitions. Each specialised
 * field (select, phone, currency…) renders its own contents inside a shell
 * rather than restyling a box from scratch, so all of them stay in step.
 *
 * Hover and focus are CSS states, not props. The only states you set are:
 *
 *   default   resting
 *   error     failed validation
 *   active    deliberately highlighted, e.g. the row being edited
 */

export const INPUT_STATES = ["default", "error", "active"] as const;
export const INPUT_SIZES = ["sm", "md", "lg"] as const;

export type InputState = (typeof INPUT_STATES)[number];
export type InputSize = (typeof INPUT_SIZES)[number];

const stateStyles: Record<InputState, string> = {
  default: cn(
    "border-transparent bg-grey-25",
    "hover:border-grey-100",
    "focus-within:border-grey-300 focus-within:bg-white",
    "focus-within:shadow-ring-gray",
  ),
  error: cn(
    "border-red-500 bg-red-50 text-red-600",
    "focus-within:shadow-ring-destructive",
  ),
  active: "border-grey-1000 bg-white",
};

const sizeStyles: Record<InputSize, string> = {
  sm: "h-9 gap-2 px-3 text-xs",
  md: "h-11 gap-2.5 px-3.5 text-sm",
  lg: "h-12 gap-3 px-4 text-md",
};

export const INPUT_ICON_SIZES: Record<InputSize, number> = {
  sm: 14,
  md: 16,
  lg: 18,
};

type InputShellProps = React.ComponentProps<"div"> & {
  state?: InputState;
  size?: InputSize;
  disabled?: boolean;
};

export function InputShell({
  state = "default",
  size = "md",
  disabled = false,
  className,
  ...props
}: InputShellProps) {
  return (
    <div
      data-disabled={disabled || undefined}
      className={cn(
        "flex w-full items-center rounded-lg border transition-colors",
        sizeStyles[size],
        disabled
          ? "pointer-events-none border-transparent bg-grey-50 text-grey-300"
          : stateStyles[state],
        className,
      )}
      {...props}
    />
  );
}

type InputProps = Omit<React.ComponentProps<"input">, "size" | "prefix"> & {
  state?: InputState;
  size?: InputSize;
  leadingIcon?: IconSvgElement;
  trailingIcon?: IconSvgElement;
  /** Arbitrary node pinned to the right — a button, a unit, a select. */
  trailing?: React.ReactNode;
  /** Arbitrary node pinned to the left — a prefix such as "https://". */
  leading?: React.ReactNode;
  shellClassName?: string;
};

export function Input({
  state = "default",
  size = "md",
  leadingIcon,
  trailingIcon,
  leading,
  trailing,
  disabled,
  className,
  shellClassName,
  ...props
}: InputProps) {
  const iconSize = INPUT_ICON_SIZES[size];
  const iconTone = state === "error" ? "text-red-500" : "text-grey-300";

  return (
    <InputShell
      state={state}
      size={size}
      disabled={disabled}
      className={shellClassName}
    >
      {leadingIcon ? (
        <Icon icon={leadingIcon} size={iconSize} className={cn("shrink-0", iconTone)} />
      ) : null}
      {leading}
      <input
        disabled={disabled}
        className={cn(
          "min-w-0 flex-1 bg-transparent font-medium outline-none",
          "placeholder:font-normal placeholder:text-grey-300",
          "disabled:cursor-not-allowed",
          className,
        )}
        {...props}
      />
      {trailing}
      {trailingIcon ? (
        <Icon icon={trailingIcon} size={iconSize} className={cn("shrink-0", iconTone)} />
      ) : null}
    </InputShell>
  );
}
