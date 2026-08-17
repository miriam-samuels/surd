import {
  ArrowDownRight01Icon,
  ArrowUpRight01Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { Icon, type IconSvgElement } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

/**
 * Metric tiles.
 *
 * `StatCard` is the white card in the secondary row; `HeroStat` is a column of
 * the blue banner. They share the delta treatment so a rise or fall reads the
 * same wherever it appears.
 */

export type StatDelta = {
  value: string;
  direction: "up" | "down" | "flat";
};

const deltaTones = {
  onLight: { up: "text-green-600", down: "text-red-500", flat: "text-grey-400" },
  onBrand: { up: "text-green-300", down: "text-red-300", flat: "text-white/70" },
} as const;

function DeltaLabel({
  delta,
  surface,
}: {
  delta: StatDelta;
  surface: keyof typeof deltaTones;
}) {
  const glyph =
    delta.direction === "down" ? ArrowDownRight01Icon : ArrowUpRight01Icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-semibold",
        deltaTones[surface][delta.direction],
      )}
    >
      {delta.direction === "flat" ? null : <Icon icon={glyph} size={14} />}
      {delta.value}
    </span>
  );
}

type StatCardProps = {
  label: string;
  value: string;
  delta?: StatDelta;
  /** Plain supporting line, used when there is no delta to show. */
  note?: string;
  icon?: IconSvgElement;
  hint?: string;
};

export function StatCard({
  label,
  value,
  delta,
  note,
  icon,
  hint,
}: StatCardProps) {
  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-grey-50 bg-white p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <h3 className="text-sm font-semibold text-grey-500">{label}</h3>
          {hint ? (
            <Icon
              icon={InformationCircleIcon}
              size={14}
              className="text-grey-300"
              aria-label={hint}
            />
          ) : null}
        </div>
        {icon ? (
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-surd-blue-50 text-primary">
            <Icon icon={icon} size={18} />
          </span>
        ) : null}
      </div>

      <p className="text-heading-xs font-extrabold text-grey-900">{value}</p>

      {delta ? <DeltaLabel delta={delta} surface="onLight" /> : null}
      {note ? (
        <span className="text-xs font-semibold text-green-600">{note}</span>
      ) : null}
    </article>
  );
}

export function HeroStat({
  label,
  value,
  delta,
  note,
  icon,
}: Omit<StatCardProps, "hint">) {
  return (
    <div className="flex flex-col gap-2.5">
      {icon ? (
        <span className="grid size-9 place-items-center rounded-lg bg-white/15 text-white">
          <Icon icon={icon} size={18} />
        </span>
      ) : null}

      <div className="flex items-center gap-1.5">
        <h3 className="text-sm font-medium text-white/80">{label}</h3>
        <Icon
          icon={InformationCircleIcon}
          size={14}
          className="text-white/50"
        />
      </div>

      <p className="text-heading-xs font-extrabold text-white">{value}</p>

      {delta ? <DeltaLabel delta={delta} surface="onBrand" /> : null}
      {note ? (
        <span className="text-xs font-semibold text-green-300">{note}</span>
      ) : null}
    </div>
  );
}

/** The blue banner that groups the four headline figures. */
export function HeroStatBanner({ children }: { children: React.ReactNode }) {
  return (
    <section className="brand-ribbon grid gap-6 rounded-2xl p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-4">
      {children}
    </section>
  );
}
