import { Slot } from "radix-ui";
import { cn } from "@/lib/cn";

const variants = {
  primary: "bg-primary text-white hover:bg-primary-hover",
  secondary:
    "bg-grey-1000 text-white hover:bg-grey-900 dark:bg-white dark:text-grey-1000",
  outline:
    "border border-grey-100 bg-white text-grey-900 hover:bg-grey-25 dark:border-grey-800 dark:bg-grey-950 dark:text-grey-50 dark:hover:bg-grey-900",
  ghost: "text-grey-400 hover:bg-grey-25 hover:text-grey-900",
  subtle: "bg-primary-subtle text-primary-subtle-foreground hover:bg-surd-blue-100",
} as const;

const sizes = {
  sm: "h-10 gap-2 px-4 text-sm",
  md: "h-12 gap-3 px-5 text-md",
  lg: "h-14 gap-3 px-5 text-base sm:h-14",
} as const;

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

type ButtonProps = React.ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  asChild?: boolean;
};

export function Button({
  variant = "primary",
  size = "md",
  block = false,
  asChild = false,
  className,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot.Root : "button";

  return (
    <Component
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold",
        "whitespace-nowrap transition-colors outline-none",
        "focus-visible:shadow-ring-primary",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        block && "w-full",
        className,
      )}
      {...props}
    />
  );
}
