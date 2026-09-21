import { Avatar, type AvatarIndicator, type AvatarSize } from "@/components/ui/avatar";
import { cn } from "@/lib/cn";

const typography: Record<AvatarSize, { name: string; caption: string }> = {
  xs: { name: "text-2xs", caption: "text-2xs" },
  sm: { name: "text-xs", caption: "text-2xs" },
  md: { name: "text-sm", caption: "text-xs" },
  lg: { name: "text-md", caption: "text-sm" },
  xl: { name: "text-lg", caption: "text-md" },
  "2xl": { name: "text-xl", caption: "text-lg" },
};

const gaps: Record<AvatarSize, string> = {
  xs: "gap-2",
  sm: "gap-2",
  md: "gap-2.5",
  lg: "gap-3",
  xl: "gap-3",
  "2xl": "gap-4",
};

type AvatarLabelProps = Omit<React.ComponentProps<"div">, "children"> & {
  name: string;
  caption?: string;
  src?: string;
  size?: AvatarSize;
  indicator?: AvatarIndicator;
};

export function AvatarLabel({
  name,
  caption,
  src,
  size = "md",
  indicator,
  className,
  ...props
}: AvatarLabelProps) {
  const type = typography[size];

  return (
    <div
      className={cn("flex items-center", gaps[size], className)}
      {...props}
    >
      <Avatar src={src} name={name} size={size} indicator={indicator} />
      <div className="flex min-w-0 flex-col">
        <span className={cn("truncate font-medium text-grey-900", type.name)}>
          {name}
        </span>
        {caption ? (
          <span className={cn("truncate text-grey-400", type.caption)}>
            {caption}
          </span>
        ) : null}
      </div>
    </div>
  );
}
