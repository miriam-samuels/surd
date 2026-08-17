import { Icon, type IconSvgElement } from "@/components/ui/icon";
import {
  BUTTON_SHAPES,
  BUTTON_SIZES,
  BUTTON_TONES,
  BUTTON_VARIANTS,
  type ButtonShape,
  type ButtonSize,
  type ButtonTone,
  type ButtonVariant,
} from "@/components/ui/button";
import { cn } from "@/lib/cn";

/**
 * A square-footprint button holding a single icon.
 *
 * It shares the tone/variant/size vocabulary with `Button` but sets its own
 * geometry, since a text button's horizontal padding would make it oblong.
 * `label` is required — an icon alone tells a screen reader nothing.
 */

export {
  BUTTON_SHAPES as ICON_BUTTON_SHAPES,
  BUTTON_SIZES as ICON_BUTTON_SIZES,
  BUTTON_TONES as ICON_BUTTON_TONES,
  BUTTON_VARIANTS as ICON_BUTTON_VARIANTS,
};

const toneStyles: Record<ButtonTone, Record<ButtonVariant, string>> = {
  neutral: {
    solid: "bg-grey-1000 text-white hover:bg-grey-800",
    soft: "bg-grey-50 text-grey-900 hover:bg-grey-100",
    outline: "border border-grey-100 bg-white text-grey-900 hover:bg-grey-25",
    ghost: "text-grey-900 hover:bg-grey-25",
  },
  primary: {
    solid: "bg-surd-blue-500 text-white hover:bg-surd-blue-600",
    soft: "bg-surd-blue-50 text-surd-blue-600 hover:bg-surd-blue-100",
    outline:
      "border border-surd-blue-500 bg-white text-surd-blue-500 hover:bg-surd-blue-50",
    ghost: "text-surd-blue-500 hover:bg-surd-blue-50",
  },
  danger: {
    solid: "bg-red-500 text-white hover:bg-red-600",
    soft: "bg-red-50 text-red-600 hover:bg-red-100",
    outline: "border border-red-500 bg-white text-red-500 hover:bg-red-50",
    ghost: "text-red-500 hover:bg-red-50",
  },
  warning: {
    solid: "bg-orange-500 text-white hover:bg-orange-600",
    soft: "bg-orange-50 text-orange-600 hover:bg-orange-100",
    outline:
      "border border-orange-500 bg-white text-orange-600 hover:bg-orange-50",
    ghost: "text-orange-600 hover:bg-orange-50",
  },
  success: {
    solid: "bg-green-600 text-white hover:bg-green-700",
    soft: "bg-green-50 text-green-700 hover:bg-green-100",
    outline:
      "border border-green-600 bg-white text-green-700 hover:bg-green-50",
    ghost: "text-green-700 hover:bg-green-50",
  },
};

const focusRings: Record<ButtonTone, string> = {
  neutral: "focus-visible:shadow-ring-gray",
  primary: "focus-visible:shadow-ring-primary",
  danger: "focus-visible:shadow-ring-destructive",
  warning: "focus-visible:shadow-ring-brand",
  success: "focus-visible:shadow-ring-success",
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: "size-6",
  sm: "size-7",
  md: "size-8",
  lg: "size-10",
  xl: "size-12",
};

const glyphSizes: Record<ButtonSize, number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
};

const shapeStyles: Record<ButtonShape, string> = {
  rounded: "rounded-lg",
  pill: "rounded-full",
  square: "rounded-md",
};

type IconButtonProps = Omit<React.ComponentProps<"button">, "children"> & {
  icon: IconSvgElement;
  /** Announced to assistive tech and shown as the tooltip. */
  label: string;
  tone?: ButtonTone;
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
};

export function IconButton({
  icon,
  label,
  tone = "neutral",
  variant = "solid",
  size = "md",
  shape = "pill",
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "inline-grid shrink-0 place-items-center transition-colors outline-none",
        "disabled:pointer-events-none disabled:opacity-40",
        sizeStyles[size],
        shapeStyles[shape],
        toneStyles[tone][variant],
        focusRings[tone],
        className,
      )}
      {...props}
    >
      <Icon icon={icon} size={glyphSizes[size]} />
    </button>
  );
}
