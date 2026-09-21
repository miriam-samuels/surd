import Image from "next/image";
import { cn } from "@/lib/cn";

export const FLAG_SIZES = ["sm", "md", "lg"] as const;
export type FlagSize = (typeof FLAG_SIZES)[number];

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
  code: string;
  size?: FlagSize;

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
        className={cn("size-full rounded-full", isCircle ? "object-cover" : "object-fill")}
      />
    </span>
  );
}
