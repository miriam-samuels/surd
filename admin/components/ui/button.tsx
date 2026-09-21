import { Slot } from "radix-ui";
import { Icon, type IconSvgElement } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/cn";

export const BUTTON_TONES = [
  "neutral",
  "primary",
  "danger",
  "warning",
  "success",
] as const;

export const BUTTON_VARIANTS = ["solid", "soft", "outline", "ghost"] as const;

export const BUTTON_SIZES = ["xs", "sm", "md", "lg", "xl", "xxl"] as const;

export const BUTTON_SHAPES = ["rounded", "pill", "square"] as const;

export type ButtonTone = (typeof BUTTON_TONES)[number];
export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];
export type ButtonSize = (typeof BUTTON_SIZES)[number];
export type ButtonShape = (typeof BUTTON_SHAPES)[number];

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
  xxl: "h-15 gap-2.5 px-5 text-md",
};

const ghostSizeStyles: Record<ButtonSize, string> = {
  xs: "h-7 gap-1.5 px-1 text-2xs",
  sm: "h-8 gap-1.5 px-1 text-xs",
  md: "h-9 gap-2 px-1.5 text-sm",
  lg: "h-11 gap-2 px-1.5 text-sm",
  xl: "h-12 gap-2.5 px-2 text-md",
  xxl: "h-15 gap-2.5 px-5 text-md",
};

const shapeStyles: Record<ButtonShape, string> = {
  rounded: "rounded-xl",
  pill: "rounded-full",
  square: "rounded-md",
};

export const BUTTON_ICON_SIZES: Record<ButtonSize, number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 16,
  xl: 20,
  xxl: 30,
};

type ButtonProps = Omit<React.ComponentProps<"button">, "prefix"> & {
  tone?: ButtonTone;
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  leadingIcon?: IconSvgElement;
  trailingIcon?: IconSvgElement;
  block?: boolean;
  asChild?: boolean;
  canSee?:boolean
  loading?: boolean;
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
  loading = false,
  canSee = true,
  disabled,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot.Root : "button";
  const iconSize = BUTTON_ICON_SIZES[size];
  const inert = disabled || loading;

  if (!canSee) return null

  return (
    <Component

      {...(asChild ? { "aria-disabled": inert || undefined } : { disabled: inert })}
      aria-busy={loading || undefined}
      data-loading={loading || undefined}
      className={cn(
        "inline-flex shrink-0 items-center justify-center font-semibold whitespace-nowrap",
        "transition-colors outline-none",
        "disabled:pointer-events-none",

        !loading &&
          (variant === "solid"
            ? "disabled:bg-grey-50 disabled:text-grey-300"
            : "disabled:opacity-40"),
        variant === "ghost" ? ghostSizeStyles[size] : sizeStyles[size],
        shapeStyles[shape],
        toneStyles[tone][variant],
        focusRings[tone],

        block && "w-full shrink",
        loading && "pointer-events-none",
        className,
      )}
      {...props}
    >

      {loading ? (
        <Spinner size={iconSize} label="" className="shrink-0" />
      ) : leadingIcon ? (
        <Icon icon={leadingIcon} size={iconSize} />
      ) : null}

      <Slot.Slottable>{children}</Slot.Slottable>
      {trailingIcon ? <Icon icon={trailingIcon} size={iconSize} /> : null}
    </Component>
  );
}
