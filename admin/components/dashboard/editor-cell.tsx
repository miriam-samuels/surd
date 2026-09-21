import { AvatarLabel } from "@/components/ui/avatar-label";
import { Flag } from "@/components/ui/flag";
import type { Currency, Editor } from "@/content/configuration";
import { CURRENCY_COUNTRY } from "@/content/configuration";
import { cn } from "@/lib/cn";

export function EditorCell({ editor }: { editor: Editor }) {
  return <AvatarLabel name={editor.name} caption={editor.email} size="sm" />;
}

export function CurrencyChip({
  currency,
  suffix,
  className,
}: {
  currency: Currency;
  suffix?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full  px-2.5 py-1 text-sm font-normal whitespace-nowrap text-grey-900",
        className,
      )}
    >
      <Flag code={CURRENCY_COUNTRY[currency]} size="sm" />
      {currency}
      {suffix ? <span>{suffix}</span> : null}
    </span>
  );
}

export function CurrencyChips({
  currencies,
  suffix,
}: {
  currencies: Currency[];
  suffix?: string;
}) {
  return (
    <span className="flex flex-wrap items-center gap-2">
      {currencies.map((currency) => (
        <CurrencyChip key={currency} currency={currency} suffix={suffix} />
      ))}
    </span>
  );
}
