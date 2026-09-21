import { Icon, type IconSvgElement } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

export type DetailField = {
  label: string;

  value: React.ReactNode;
  icon?: IconSvgElement;
};

export function DetailGrid({
  fields,
  className,
}: {
  fields: DetailField[];
  className?: string;
}) {
  return (
    <dl
      className={cn(
        "grid gap-6 rounded-2xl border border-grey-50 p-5 sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {fields.map((field) => (
        <div key={field.label} className="flex min-w-0 flex-col gap-2">
          <dt className="flex items-center gap-2 text-sm text-grey-400">
            {field.icon ? <Icon icon={field.icon} size={16} /> : null}
            {field.label}
          </dt>
          <dd className="text-md font-medium break-words text-grey-900">
            {field.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
