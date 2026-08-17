import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * Country flag, keyed by ISO 3166-1 alpha-2 code.
 *
 *   <Flag code="NG" />
 *   <Flag code="US" shape="circle" size="lg" />
 *
 * Artwork comes from `country-flag-icons` (MIT). The SVGs are copied into
 * `public/flags/` by `npm run sync:flags` and served as static files, so a
 * page only downloads the handful of flags it actually renders instead of
 * bundling all 265.
 *
 * Codes are case-insensitive. An unknown code renders a neutral placeholder
 * rather than a broken image.
 */

export const FLAG_SIZES = ["sm", "md", "lg"] as const;
export type FlagSize = (typeof FLAG_SIZES)[number];

/** Flags are drawn 3:2, so height follows from width. */
const dimensions: Record<FlagSize, { width: number; height: number }> = {
  sm: { width: 16, height: 11 },
  md: { width: 20, height: 14 },
  lg: { width: 28, height: 19 },
};

const circleSizes: Record<FlagSize, string> = {
  sm: "size-4",
  md: "size-5",
  lg: "size-7",
};

type FlagProps = Omit<React.ComponentProps<"span">, "children"> & {
  /** ISO 3166-1 alpha-2, e.g. "NG", "US", "GB". */
  code: string;
  size?: FlagSize;
  /** `rect` keeps the 3:2 artwork; `circle` crops it to a disc. */
  shape?: "rect" | "circle";
};

export function Flag({
  code,
  size = "md",
  shape = "rect",
  className,
  ...props
}: FlagProps) {
  const normalised = code.trim().toUpperCase();
  const { width, height } = dimensions[size];
  const isCircle = shape === "circle";

  return (
    <span
      className={cn(
        "inline-block shrink-0 overflow-hidden bg-grey-50",
        isCircle ? cn("rounded-full", circleSizes[size]) : "rounded-[3px]",
        className,
      )}
      style={isCircle ? undefined : { width, height }}
      {...props}
    >
      <Image
        src={`/flags/${normalised}.svg`}
        alt={`${normalised} flag`}
        width={width}
        height={height}
        className={cn("size-full", isCircle ? "object-cover" : "object-fill")}
      />
    </span>
  );
}
