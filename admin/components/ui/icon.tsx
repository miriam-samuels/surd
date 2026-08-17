import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

/**
 * SURD iconography — Hugeicons by HalalLab.
 *
 * Icons are passed as data, not components:
 *
 *   import { Home01Icon } from "@hugeicons/core-free-icons";
 *   <Icon icon={Home01Icon} size="md" />
 *
 * Colour follows `currentColor`, so set it with any text utility
 * (`text-primary`, `text-foreground-muted`, …).
 */

export const iconSizes = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
} as const;

export type IconSize = keyof typeof iconSizes;

type IconProps = Omit<
  React.ComponentProps<typeof HugeiconsIcon>,
  "size" | "icon"
> & {
  icon: IconSvgElement;
  /** Token from the icon scale, or an explicit pixel value. */
  size?: IconSize | number;
};

export function Icon({
  icon,
  size = "md",
  strokeWidth = 1.5,
  className,
  ...props
}: IconProps) {
  return (
    <HugeiconsIcon
      icon={icon}
      size={typeof size === "number" ? size : iconSizes[size]}
      strokeWidth={strokeWidth}
      color="currentColor"
      className={className}
      {...props}
    />
  );
}

export { type IconSvgElement };
