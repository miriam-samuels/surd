import { Icon, type IconSvgElement } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

/**
 * A compact status pill.
 *
 * Every slot is optional, so the same component covers a bare label, a status
 * dot, an icon pair, or all of them at once:
 *
 *   <Badge tone="success" dot>Active</Badge>
 *   <Badge tone="primary" leadingIcon={ArrowUp01Icon} trailingIcon={ArrowRight01Icon}>
 *     Label
 *   </Badge>
 */

export const BADGE_TONES = [
  "neutral",
  "primary",
  "danger",
  "warning",
  "success",
] as const;

export const BADGE_VARIANTS = ["solid", "soft", "outline"] as const;

export const BADGE_SIZES = ["sm", "md", "lg"] as const;

export type BadgeTone = (typeof BADGE_TONES)[number];
export type BadgeVariant = (typeof BADGE_VARIANTS)[number];
export type BadgeSize = (typeof BADGE_SIZES)[number];

const toneStyles: Record<BadgeTone, Record<BadgeVariant, string>> = {
  neutral: {
    solid: "bg-grey-1000 text-white",
    soft: "bg-grey-50 text-grey-900",
    outline: "border border-grey-150 bg-white text-grey-900",
  },
  primary: {
    solid: "bg-surd-blue-500 text-white",
    soft: "bg-surd-blue-50 text-surd-blue-600",
    outline: "border border-surd-blue-500 bg-white text-surd-blue-500",
  },
  danger: {
    solid: "bg-red-500 text-white",
    soft: "bg-red-50 text-red-600",
    outline: "border border-red-500 bg-white text-red-500",
  },
  warning: {
    solid: "bg-orange-500 text-white",
    soft: "bg-orange-50 text-orange-700",
    outline: "border border-orange-500 bg-white text-orange-700",
  },
  success: {
    solid: "bg-green-600 text-white",
    soft: "bg-green-50 text-green-700",
    outline: "border border-green-600 bg-white text-green-700",
  },
};

/** On a solid surface the dot has to read against the fill, not the page. */
const dotStyles: Record<BadgeTone, Record<BadgeVariant, string>> = {
  neutral: { solid: "bg-white", soft: "bg-grey-900", outline: "bg-grey-900" },
  primary: {
    solid: "bg-white",
    soft: "bg-surd-blue-500",
    outline: "bg-surd-blue-500",
  },
  danger: { solid: "bg-white", soft: "bg-red-500", outline: "bg-red-500" },
  warning: {
    solid: "bg-white",
    soft: "bg-orange-500",
    outline: "bg-orange-500",
  },
  success: { solid: "bg-white", soft: "bg-green-600", outline: "bg-green-600" },
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "h-6 gap-1 px-2 text-2xs",
  md: "h-7 gap-1.5 px-2.5 text-xs",
  lg: "h-9 gap-2 px-3.5 text-sm",
};

const iconSizes: Record<BadgeSize, number> = { sm: 10, md: 12, lg: 16 };
const dotSizes: Record<BadgeSize, string> = {
  sm: "size-1",
  md: "size-1.5",
  lg: "size-2",
};

type BadgeProps = React.ComponentProps<"span"> & {
  tone?: BadgeTone;
  variant?: BadgeVariant;
  size?: BadgeSize;
  /** Show the small status dot before the label. */
  dot?: boolean;
  leadingIcon?: IconSvgElement;
  trailingIcon?: IconSvgElement;
  disabled?: boolean;
};

export function Badge({
  tone = "neutral",
  variant = "solid",
  size = "md",
  dot = false,
  leadingIcon,
  trailingIcon,
  disabled = false,
  className,
  children,
  ...props
}: BadgeProps) {
  const iconSize = iconSizes[size];

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full font-semibold whitespace-nowrap",
        sizeStyles[size],
        toneStyles[tone][variant],
        disabled && "opacity-40",
        className,
      )}
      {...props}
    >
      {leadingIcon ? <Icon icon={leadingIcon} size={iconSize} /> : null}
      {dot ? (
        <span
          aria-hidden
          className={cn(
            "shrink-0 rounded-full",
            dotSizes[size],
            dotStyles[tone][variant],
          )}
        />
      ) : null}
      {children}
      {trailingIcon ? <Icon icon={trailingIcon} size={iconSize} /> : null}
    </span>
  );
}
