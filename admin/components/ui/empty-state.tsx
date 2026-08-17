import { Icon, type IconSvgElement } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

/**
 * What a list shows when it has nothing to list.
 *
 * The illustrations from the comps were never exported, so the default is a
 * tinted glyph. Pass `illustration` to swap in artwork when it lands.
 */
type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: IconSvgElement;
  illustration?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  description,
  icon,
  illustration,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 px-6 py-16 text-center",
        className,
      )}
    >
      {illustration ??
        (icon ? (
          <span className="grid size-20 place-items-center rounded-full bg-surd-blue-50 text-primary">
            <Icon icon={icon} size={32} />
          </span>
        ) : null)}

      <h3 className="text-lg font-bold text-grey-900">{title}</h3>
      {description ? (
        <p className="max-w-md text-sm text-balance text-grey-400">
          {description}
        </p>
      ) : null}
      {action}
    </div>
  );
}
