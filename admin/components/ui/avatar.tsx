import Image from "next/image";
import { UserIcon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

/**
 * Avatar, and the pieces that hang off it.
 *
 * An avatar renders one of three things, in order of preference: a photo, a
 * set of initials, or the fallback user glyph. Pass `src` for a photo and
 * `name` for initials — `name` also becomes the alt text, so pass it either
 * way.
 *
 * The optional `indicator` sits in the bottom-right corner and is a
 * discriminated union, so a count badge cannot be built without its value:
 *
 *   <Avatar name="Sam Lee" indicator={{ type: "dot", tone: "success" }} />
 *   <Avatar name="Sam Lee" indicator={{ type: "count", value: 2 }} />
 *   <Avatar name="Sam Lee" indicator={{ type: "verified" }} />
 *
 * `tone` only shows through when there is no photo. `brand` is the tinted chip
 * used in tables and lists; `inverse` is the solid dark disc the topbar uses
 * for the signed-in admin, which needs to read as a control rather than data.
 */

export const AVATAR_SIZES = ["xs", "sm", "md", "lg", "xl", "2xl"] as const;
export type AvatarSize = (typeof AVATAR_SIZES)[number];

export const INDICATOR_TONES = [
  "neutral",
  "primary",
  "danger",
  "warning",
  "success",
] as const;
export type IndicatorTone = (typeof INDICATOR_TONES)[number];

export type AvatarIndicator =
  | { type: "dot"; tone?: IndicatorTone }
  | { type: "count"; value: number; tone?: IndicatorTone }
  | { type: "verified" };

/** Pixel geometry per size, kept in one table so the parts stay in proportion. */
const metrics: Record<
  AvatarSize,
  { box: number; glyph: number; dot: number; badge: number; text: string }
> = {
  xs: { box: 24, glyph: 12, dot: 6, badge: 12, text: "text-2xs" },
  sm: { box: 32, glyph: 16, dot: 8, badge: 14, text: "text-2xs" },
  md: { box: 40, glyph: 20, dot: 10, badge: 16, text: "text-xs" },
  lg: { box: 48, glyph: 24, dot: 12, badge: 18, text: "text-sm" },
  xl: { box: 56, glyph: 28, dot: 14, badge: 20, text: "text-md" },
  "2xl": { box: 64, glyph: 32, dot: 16, badge: 24, text: "text-lg" },
};

const dotTones: Record<IndicatorTone, string> = {
  neutral: "bg-grey-300",
  primary: "bg-surd-blue-500",
  danger: "bg-red-500",
  warning: "bg-orange-500",
  success: "bg-green-500",
};

const countTones: Record<IndicatorTone, string> = {
  neutral: "bg-grey-300 text-white",
  primary: "bg-surd-blue-500 text-white",
  danger: "bg-red-500 text-white",
  warning: "bg-orange-500 text-white",
  success: "bg-green-500 text-white",
};

/**
 * "Ada Lovelace" → "AL", "Sam" → "SA", "X_AE_A-13" → "XA".
 * Punctuation is ignored so handles and usernames still produce letters.
 */
export function initialsFrom(name: string) {
  const words = name
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);

  if (words.length === 0) return "";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

const fallbackTones = {
  brand: "bg-surd-blue-50 text-surd-blue-500",
  inverse: "bg-grey-900 text-white",
} as const;

type AvatarProps = Omit<React.ComponentProps<"span">, "children"> & {
  src?: string;
  /** Person's name — used for initials and alt text. */
  name?: string;
  size?: AvatarSize;
  /** Colour of the initials chip when there is no photo. */
  tone?: keyof typeof fallbackTones;
  indicator?: AvatarIndicator;
};

export function Avatar({
  src,
  name,
  size = "md",
  tone = "brand",
  indicator,
  className,
  ...props
}: AvatarProps) {
  const { box, glyph, text } = metrics[size];
  const initials = name ? initialsFrom(name) : "";

  return (
    <span
      className={cn("relative inline-block shrink-0", className)}
      style={{ width: box, height: box }}
      {...props}
    >
      <span
        className={cn(
          "grid size-full place-items-center overflow-hidden rounded-full font-bold",
          fallbackTones[tone],
          text,
        )}
      >
        {src ? (
          <Image
            src={src}
            alt={name ?? ""}
            width={box}
            height={box}
            className="size-full object-cover"
          />
        ) : initials ? (
          initials
        ) : (
          <Icon icon={UserIcon} size={glyph} strokeWidth={2} />
        )}
      </span>

      {indicator ? <AvatarIndicatorDot size={size} indicator={indicator} /> : null}
    </span>
  );
}

function AvatarIndicatorDot({
  size,
  indicator,
}: {
  size: AvatarSize;
  indicator: AvatarIndicator;
}) {
  const { dot, badge } = metrics[size];

  if (indicator.type === "verified") {
    return (
      <span
        className="absolute right-0 bottom-0 grid translate-x-[15%] translate-y-[15%] place-items-center rounded-full bg-white"
        style={{ width: badge, height: badge }}
      >
        <VerifiedBadge size={badge} />
      </span>
    );
  }

  if (indicator.type === "count") {
    return (
      <span
        className={cn(
          "absolute right-0 bottom-0 grid translate-x-[15%] translate-y-[15%]",
          "place-items-center rounded-full font-bold ring-2 ring-white",
          countTones[indicator.tone ?? "danger"],
        )}
        style={{
          minWidth: badge,
          height: badge,
          fontSize: Math.round(badge * 0.55),
          paddingInline: Math.round(badge * 0.15),
        }}
      >
        {indicator.value}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "absolute right-0 bottom-0 rounded-full ring-2 ring-white",
        dotTones[indicator.tone ?? "success"],
      )}
      style={{ width: dot, height: dot }}
    />
  );
}

/** The scalloped verification mark. Decorative — the label carries the meaning. */
function VerifiedBadge({ size }: { size: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden
      focusable="false"
    >
      <path
        fill="currentColor"
        className="text-green-500"
        d="M12 1.5l2.2 1.9 2.9-.4 1.2 2.7 2.7 1.2-.4 2.9L22.5 12l-1.9 2.2.4 2.9-2.7 1.2-1.2 2.7-2.9-.4L12 22.5l-2.2-1.9-2.9.4-1.2-2.7-2.7-1.2.4-2.9L1.5 12l1.9-2.2-.4-2.9 2.7-1.2 1.2-2.7 2.9.4L12 1.5z"
      />
      <path
        d="M8 12.2l2.6 2.6L16 9.4"
        fill="none"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
