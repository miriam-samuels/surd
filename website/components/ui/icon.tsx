import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

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
