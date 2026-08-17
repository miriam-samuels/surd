import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { IconSvgElement } from "@hugeicons/react";



const tones = {
  light: "bg-surd-blue-50 text-surd-blue-500",
  dark: "bg-grey-900 text-surd-blue-400",
} as const;

type EyebrowProps = React.ComponentProps<"span"> & {
  tone?: keyof typeof tones;
  icon?: IconSvgElement;
};

export function Eyebrow({
  tone = "light",
  icon,
  className,
  children,
  ...props
}: EyebrowProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5",
        "text-xs font-semibold tracking-[0.1em] uppercase",
        tones[tone],
        className,
      )}
      {...props}
    >
      {icon ? <Icon icon={icon} size={20} /> : null}
      {children}
    </span>
  );
}
