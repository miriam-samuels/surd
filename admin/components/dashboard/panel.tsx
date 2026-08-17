import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { Icon, type IconSvgElement } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

/**
 * The white card that wraps each dashboard module — charts, lists, tables.
 *
 * `actions` sits on the right of the header and is where the period filters
 * and expand buttons go.
 */
type PanelProps = React.ComponentProps<"section"> & {
  title: string;
  icon?: IconSvgElement;
  hint?: string;
  actions?: React.ReactNode;
  /** Rendered flush against the card edges, e.g. a full-bleed table. */
  bleed?: boolean;
};

export function Panel({
  title,
  icon,
  hint,
  actions,
  bleed = false,
  className,
  children,
  ...props
}: PanelProps) {
  return (
    <section
      className={cn(
        "flex flex-col rounded-2xl border border-grey-50 bg-white",
        className,
      )}
      {...props}
    >
      <header className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
        <h2 className="flex items-center gap-2 text-md font-bold text-grey-900">
          {icon ? (
            <Icon icon={icon} size={20} className="text-primary" />
          ) : null}
          {title}
          {hint ? (
            <Icon
              icon={InformationCircleIcon}
              size={14}
              className="text-grey-300"
              aria-label={hint}
            />
          ) : null}
        </h2>
        {actions ? (
          <div className="flex items-center gap-2">{actions}</div>
        ) : null}
      </header>

      <div
        className={cn(
          "flex flex-1 flex-col gap-4",
          bleed ? "" : "px-4 pb-5 sm:px-5",
        )}
      >
        {children}
      </div>
    </section>
  );
}

/** Compact pill select used for the period filters in panel headers. */
export function PanelFilter({
  label,
  options,
}: {
  label: string;
  options: string[];
}) {
  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">{label}</span>
      <select
        className={cn(
          "appearance-none rounded-lg border border-grey-50 bg-white",
          "py-1.5 pr-7 pl-3 text-xs font-semibold text-grey-700",
          "outline-none focus-visible:shadow-ring-primary",
        )}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <span
        aria-hidden
        className="pointer-events-none absolute right-2.5 text-grey-400"
      >
        ▾
      </span>
    </label>
  );
}
