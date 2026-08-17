import { cn } from "@/lib/cn";

/**
 * Title, supporting line and page-level actions.
 *
 * Every dashboard page opens with one, so the heading rhythm never drifts.
 */
type PageHeaderProps = {
  title: string;
  description?: string;
  /** Buttons, filters — anything pinned to the right of the title. */
  actions?: React.ReactNode;
  /** Rendered above the title, e.g. a back link. */
  before?: React.ReactNode;
  className?: string;
};

export function PageHeader({
  title,
  description,
  actions,
  before,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn("flex flex-col gap-4", className)}>
      {before}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-heading-xs font-extrabold text-grey-900">
            {title}
          </h1>
          {description ? (
            <p className="mt-1 text-sm text-grey-400">{description}</p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            {actions}
          </div>
        ) : null}
      </div>
    </header>
  );
}
