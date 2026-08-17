"use client";

import { Flag } from "@/components/ui/flag";
import { Input, type InputSize, type InputState } from "@/components/ui/input";
import { Select, type SelectOption } from "@/components/ui/select";
import { cn } from "@/lib/cn";

/**
 * Dialling-code picker beside a national number, as two separate fields —
 * they validate independently, so they read and focus independently too.
 *
 *   <PhoneInput
 *     countries={DIAL_CODES}
 *     country={country}
 *     onCountryChange={setCountry}
 *     value={number}
 *     onChange={(e) => setNumber(e.target.value)}
 *   />
 */

export type DialCode = {
  /** ISO 3166-1 alpha-2, used for the flag. */
  code: string;
  /** Dialling prefix including "+". */
  dial: string;
  name: string;
};

/** A starter set — extend per market rather than shipping every country. */
export const DIAL_CODES: DialCode[] = [
  { code: "NG", dial: "+234", name: "Nigeria" },
  { code: "GH", dial: "+233", name: "Ghana" },
  { code: "KE", dial: "+254", name: "Kenya" },
  { code: "ZA", dial: "+27", name: "South Africa" },
  { code: "GB", dial: "+44", name: "United Kingdom" },
  { code: "US", dial: "+1", name: "United States" },
];

function toOptions(countries: DialCode[]): SelectOption[] {
  return countries.map((country) => ({
    value: country.dial,
    label: country.dial,
    icon: <Flag code={country.code} size="sm" />,
  }));
}

type PhoneInputProps = Omit<
  React.ComponentProps<"input">,
  "size" | "type" | "prefix"
> & {
  countries?: DialCode[];
  country?: string;
  onCountryChange?: (dial: string) => void;
  state?: InputState;
  size?: InputSize;
};

export function PhoneInput({
  countries = DIAL_CODES,
  country,
  onCountryChange,
  state = "default",
  size = "md",
  disabled,
  className,
  ...props
}: PhoneInputProps) {
  return (
    <div className={cn("flex w-full items-center gap-2", className)}>
      <Select
        options={toOptions(countries)}
        value={country}
        onValueChange={onCountryChange}
        defaultValue={countries[0]?.dial}
        state={state}
        size={size}
        disabled={disabled}
        compact
        className="w-28 shrink-0"
      />
      <Input
        type="tel"
        inputMode="tel"
        state={state}
        size={size}
        disabled={disabled}
        {...props}
      />
    </div>
  );
}
