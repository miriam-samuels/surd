import { cn } from "@/lib/cn";



const widths = {
  default: "max-w-[1352px]",
  prose: "max-w-[880px]",
  full: "max-w-none",
} as const;

export type ContainerWidth = keyof typeof widths;

type ContainerProps = React.ComponentProps<"div"> & {
  width?: ContainerWidth;
  noPadding?: boolean;
};

export function Container({
  width = "default",
  className,
  noPadding,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        !noPadding && "px-5 sm:px-8 lg:px-12 xl:px-20",
        "mx-auto w-full",
        widths[width],
        className,
      )}
      {...props}
    />
  );
}
