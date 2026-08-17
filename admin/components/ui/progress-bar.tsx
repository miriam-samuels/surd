import { cn } from "@/lib/cn";

/**
 * How far a savings plan has come.
 *
 * `value` is a percentage. The bar turns green once the target is reached, so
 * a completed plan reads at a glance in a long table.
 */
export function ProgressBar({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const isComplete = clamped >= 100;

  return (
    <span className={cn("flex items-center gap-2", className)}>
      <span
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-1.5 w-24 shrink-0 overflow-hidden rounded-full bg-grey-50"
      >
        <span
          className={cn(
            "block h-full rounded-full transition-[width]",
            isComplete ? "bg-green-500" : "bg-primary",
          )}
          style={{ width: `${clamped}%` }}
        />
      </span>
      <span className="text-xs font-semibold tabular-nums text-grey-500">
        {clamped}%
      </span>
    </span>
  );
}
