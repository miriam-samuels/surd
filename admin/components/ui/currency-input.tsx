"use client";

import { Flag } from "@/components/ui/flag";
import { Input } from "@/components/ui/input";
import { Select, type SelectOption } from "@/components/ui/select";
import { cn } from "@/lib/cn";

export type Currency = {
  code: string;

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
  variant?: "default" | "error" | "success";
  inputSize?: "default" | "sm";
};

export function CurrencyInput({
  currencies = CURRENCIES,
  currency,
  onCurrencyChange,
  variant = "default",
  inputSize = "default",
  disabled,
  className,
  ...props
}: CurrencyInputProps) {
  return (
    <Input
      type="text"
      inputMode="decimal"
      variant={variant}
      inputSize={inputSize}
      disabled={disabled}
      className={cn("pr-28", className)}
      rightIcon={
        <Select
          options={toOptions(currencies)}
          value={currency}
          onValueChange={onCurrencyChange}
          defaultValue={currencies[0]?.code}
          inputSize={inputSize}
          disabled={disabled}
          compact

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
