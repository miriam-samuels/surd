import { Image01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

/**
 * A sized, neutral stand-in for artwork we do not have yet.
 *
 * The Figma boards are full of photography, phone mockups and illustrations
 * that were never exported, so pages reserve the correct space with one of
 * these instead of shipping a broken `<img>` or an invented graphic.
 *
 * **Replace, don't restyle.** When the real asset lands, swap the whole
 * element for `next/image` — the surrounding layout already holds the shape.
 */

type MediaPlaceholderProps = React.ComponentProps<"div"> & {
  /** Shown in the centre so it is obvious which asset is missing. */
  label?: string;
  /** Any Tailwind aspect utility, e.g. "aspect-video". */
  aspect?: string;
};

export function MediaPlaceholder({
  label,
  aspect = "aspect-[4/3]",
  className,
  ...props
}: MediaPlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={label ? `Placeholder: ${label}` : "Image placeholder"}
      className={cn(
        "flex flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl",
        "bg-grey-50 text-grey-300",
        aspect,
        className,
      )}
      {...props}
    >
      <Icon icon={Image01Icon} size={24} />
      {label ? (
        <span className="px-4 text-center text-2xs font-semibold">{label}</span>
      ) : null}
    </div>
  );
}
