"use client";

import { Flag } from "@/components/ui/flag";
import { Input } from "@/components/ui/input";
import { Select, type SelectOption } from "@/components/ui/select";
import { cn } from "@/lib/cn";

export type DialCode = {
  code: string;

  dial: string;
  name: string;
};

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
  variant?: "default" | "error" | "success";
  inputSize?: "default" | "sm";
};

export function PhoneInput({
  countries = DIAL_CODES,
  country,
  onCountryChange,
  variant = "default",
  inputSize = "default",
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
        variant={variant}
        inputSize={inputSize}
        disabled={disabled}
        compact
        className="w-28 shrink-0"
      />
      <Input
        type="tel"
        inputMode="tel"
        variant={variant}
        inputSize={inputSize}
        disabled={disabled}
        {...props}
      />
    </div>
  );
}
