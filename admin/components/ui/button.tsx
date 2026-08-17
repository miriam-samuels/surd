import { Slot } from "radix-ui";
import { Icon, type IconSvgElement } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

/**
 * The button primitive.
 *
 * Four independent axes, so any cell of the Figma matrix is reachable:
 *
 *   tone     which colour family        neutral | primary | danger | warning | success
 *   variant  how much weight it carries solid | soft | outline | ghost
 *   size     xs → xl
 *   shape    rounded | pill | square
 *
 * Icons are passed as data, not markup, so the button controls their size:
 *
 *   <Button leadingIcon={PlusSignIcon} trailingIcon={ArrowRight01Icon}>Save</Button>
 */

export const BUTTON_TONES = [
  "neutral",
  "primary",
  "danger",
  "warning",
  "success",
] as const;

export const BUTTON_VARIANTS = ["solid", "soft", "outline", "ghost"] as const;

export const BUTTON_SIZES = ["xs", "sm", "md", "lg", "xl"] as const;

export const BUTTON_SHAPES = ["rounded", "pill", "square"] as const;

export type ButtonTone = (typeof BUTTON_TONES)[number];
export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];
export type ButtonSize = (typeof BUTTON_SIZES)[number];
export type ButtonShape = (typeof BUTTON_SHAPES)[number];

/** Colour per tone × variant. Layout and typography live in `sizeStyles`. */
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
  xs: "h-7 gap-1.5 px-2.5 text-2xs",
  sm: "h-8 gap-1.5 px-3 text-xs",
  md: "h-9 gap-2 px-3.5 text-sm",
  lg: "h-11 gap-2 px-4 text-sm",
  xl: "h-12 gap-2.5 px-5 text-md",
};

/** Ghost buttons have no surface, so they lose the horizontal padding. */
const ghostSizeStyles: Record<ButtonSize, string> = {
  xs: "h-7 gap-1.5 px-1 text-2xs",
  sm: "h-8 gap-1.5 px-1 text-xs",
  md: "h-9 gap-2 px-1.5 text-sm",
  lg: "h-11 gap-2 px-1.5 text-sm",
  xl: "h-12 gap-2.5 px-2 text-md",
};

const shapeStyles: Record<ButtonShape, string> = {
  rounded: "rounded-xl",
  pill: "rounded-full",
  square: "rounded-md",
};

/** Icons stay proportional to the label rather than to the button height. */
export const BUTTON_ICON_SIZES: Record<ButtonSize, number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 16,
  xl: 20,
};

type ButtonProps = Omit<React.ComponentProps<"button">, "prefix"> & {
  tone?: ButtonTone;
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  leadingIcon?: IconSvgElement;
  trailingIcon?: IconSvgElement;
  /** Stretch to the width of the parent. */
  block?: boolean;
  /** Render as the single child element instead of a `<button>`. */
  asChild?: boolean;
};

export function Button({
  tone = "neutral",
  variant = "solid",
  size = "md",
  shape = "rounded",
  leadingIcon,
  trailingIcon,
  block = false,
  asChild = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot.Root : "button";
  const iconSize = BUTTON_ICON_SIZES[size];

  return (
    <Component
      className={cn(
        "inline-flex shrink-0 items-center justify-center font-semibold whitespace-nowrap",
        "transition-colors outline-none",
        /* Solid buttons drop to a neutral surface when disabled rather than
           fading the tone, which would read as a washed-out live control. */
        variant === "solid"
          ? "disabled:pointer-events-none disabled:bg-grey-50 disabled:text-grey-300"
          : "disabled:pointer-events-none disabled:opacity-40",
        variant === "ghost" ? ghostSizeStyles[size] : sizeStyles[size],
        shapeStyles[shape],
        toneStyles[tone][variant],
        focusRings[tone],
        /* `shrink` overrides the base `shrink-0` so two block buttons can
           share a flex row without overflowing it. */
        block && "w-full shrink",
        className,
      )}
      {...props}
    >
      {leadingIcon ? <Icon icon={leadingIcon} size={iconSize} /> : null}
      {/* Slottable keeps `asChild` working while icons sit outside the child. */}
      <Slot.Slottable>{children}</Slot.Slottable>
      {trailingIcon ? <Icon icon={trailingIcon} size={iconSize} /> : null}
    </Component>
  );
}
