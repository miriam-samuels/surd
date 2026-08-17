import { cn } from "@/lib/cn";

/**
 * Layout helpers for the component gallery at `/components`.
 *
 * These exist only to keep the gallery readable — they are not part of the
 * product UI and should not be imported by application code.
 */

export function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-6 border-t border-grey-50 py-12">
      <div className="flex flex-col gap-1">
        <h2 className="text-heading-xs font-bold text-grey-900">{title}</h2>
        {description ? (
          <p className="max-w-2xl text-sm text-grey-400">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export function Specimen({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-2xs font-bold uppercase tracking-wide text-grey-300">
        {label}
      </span>
      <div className={cn("flex flex-wrap items-center gap-3", className)}>
        {children}
      </div>
    </div>
  );
}

export function SpecimenGrid({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-6">{children}</div>;
}
