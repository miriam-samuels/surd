"use client";

import { Flag } from "@/components/ui/flag";
import { Input, type InputSize, type InputState } from "@/components/ui/input";
import { Select, type SelectOption } from "@/components/ui/select";
import { cn } from "@/lib/cn";

/**
 * Amount plus currency, sharing one field so they read as a single value.
 *
 * The currency picker sits inside the shell on the trailing edge; the amount
 * takes the remaining width.
 *
 *   <CurrencyInput currency={ccy} onCurrencyChange={setCcy} value={amount} />
 */

export type Currency = {
  /** ISO 4217, e.g. "USD". */
  code: string;
  /** ISO 3166-1 alpha-2 for the flag. */
  country: string;
};

export const CURRENCIES: Currency[] = [
  { code: "USD", country: "US" },
  { code: "NGN", country: "NG" },
  { code: "GBP", country: "GB" },
  { code: "EUR", country: "EU" },
  { code: "GHS", country: "GH" },
  { code: "KES", country: "KE" },
];

function toOptions(currencies: Currency[]): SelectOption[] {
  return currencies.map((currency) => ({
    value: currency.code,
    label: currency.code,
    icon: <Flag code={currency.country} size="sm" />,
  }));
}

type CurrencyInputProps = Omit<
  React.ComponentProps<"input">,
  "size" | "type" | "prefix"
> & {
  currencies?: Currency[];
  currency?: string;
  onCurrencyChange?: (code: string) => void;
  state?: InputState;
  size?: InputSize;
};

export function CurrencyInput({
  currencies = CURRENCIES,
  currency,
  onCurrencyChange,
  state = "default",
  size = "md",
  disabled,
  className,
  ...props
}: CurrencyInputProps) {
  return (
    <Input
      type="text"
      inputMode="decimal"
      state={state}
      size={size}
      disabled={disabled}
      className={className}
      shellClassName="pr-1.5"
      trailing={
        <Select
          options={toOptions(currencies)}
          value={currency}
          onValueChange={onCurrencyChange}
          defaultValue={currencies[0]?.code}
          size={size}
          disabled={disabled}
          compact
          /* Sits flush inside the parent shell, so it drops its own surface. */
          className="w-auto shrink-0 border-transparent bg-transparent px-2 hover:border-transparent"
        />
      }
      {...props}
    />
  );
}

type InputActionProps = React.ComponentProps<"button"> & {
  children: React.ReactNode;
};

/**
 * A text action pinned inside a field — "Get OTP", "Max", "Paste".
 * Pass it to any `Input` via the `trailing` prop.
 */
export function InputAction({ className, ...props }: InputActionProps) {
  return (
    <button
      type="button"
      className={cn(
        "shrink-0 text-sm font-semibold text-surd-blue-500 transition-colors",
        "outline-none hover:text-surd-blue-600 focus-visible:underline",
        "disabled:pointer-events-none disabled:text-grey-300",
        className,
      )}
      {...props}
    />
  );
}
