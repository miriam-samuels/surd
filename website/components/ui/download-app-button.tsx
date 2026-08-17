import Image from "next/image";
import { Button, type ButtonSize } from "@/components/ui/button";
import { cn } from "@/lib/cn";

/**
 * The recurring call to action: a label, a hairline divider, then the two
 * store glyphs. It appears in the header, the footer and most page sections,
 * so the composition lives here rather than being rebuilt each time.
 */

export const STORES = [
  { src: "/icons/play-store.svg", alt: "Google Play" },
  { src: "/icons/app-store.svg", alt: "App Store" },
] as const;

type DownloadAppButtonProps = {
  label?: string;
  size?: ButtonSize;
  href?: string;
  className?: string;
};

export function DownloadAppButton({
  label = "Download the app",
  size = "md",
  href = "#download",
  className,
}: DownloadAppButtonProps) {
  return (
    <Button asChild size={size} className={className}>
      <a href={href}>
        {label}
        <span
          aria-hidden
          className={cn("h-5 w-px shrink-0 bg-white/30", size === "lg" && "h-6")}
        />
        <span className="flex shrink-0 items-center gap-2">
          {STORES.map((store) => (
            <Image
              key={store.alt}
              src={store.src}
              alt={store.alt}
              width={20}
              height={20}
              className="size-5"
            />
          ))}
        </span>
      </a>
    </Button>
  );
}
