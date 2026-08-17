import { AvatarLabel } from "@/components/ui/avatar-label";
import { Flag } from "@/components/ui/flag";
import type { Currency, Editor } from "@/content/configuration";
import { CURRENCY_COUNTRY } from "@/content/configuration";
import { cn } from "@/lib/cn";

/**
 * Small cells that repeat across the configuration tables.
 *
 * They live here rather than in each page so a change to how an editor or a
 * currency renders lands everywhere at once.
 */

/** "Last updated by" — avatar, name and email. */
export function EditorCell({ editor }: { editor: Editor }) {
  return <AvatarLabel name={editor.name} caption={editor.email} size="sm" />;
}

/** A currency chip: flag plus code, optionally with a trailing value. */
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
        "inline-flex items-center gap-1.5 rounded-full bg-grey-25 px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-grey-900",
        className,
      )}
    >
      <Flag code={CURRENCY_COUNTRY[currency]} size="sm" />
      {currency}
      {suffix ? <span>{suffix}</span> : null}
    </span>
  );
}

/** A row of currency chips, as used in the templates and fees tables. */
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
