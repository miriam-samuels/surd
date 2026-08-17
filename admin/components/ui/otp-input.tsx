"use client";

import { useId, useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Segmented one-time-code field.
 *
 * Controlled by a single string, so the parent never juggles six pieces of
 * state. Handles the behaviours people expect from these fields but rarely get:
 * typing advances, backspace on an empty box steps back, arrow keys move,
 * and pasting a full code fills every box at once.
 *
 *   <OtpInput value={code} onChange={setCode} state={wrong ? "error" : "default"} />
 */

export type OtpState = "default" | "error";

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  /** Total digits. A separator is drawn at the midpoint when even. */
  length?: number;
  state?: OtpState;
  disabled?: boolean;
  /** Fires once the last box is filled. */
  onComplete?: (value: string) => void;
  className?: string;
};

export function OtpInput({
  value,
  onChange,
  length = 6,
  state = "default",
  disabled = false,
  onComplete,
  className,
}: OtpInputProps) {
  const groupId = useId();
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(length, " ").slice(0, length).split("");
  const separatorAt = length % 2 === 0 ? length / 2 : -1;

  const commit = (next: string) => {
    onChange(next);
    if (next.trim().length === length) onComplete?.(next);
  };

  const focusBox = (index: number) => {
    inputs.current[Math.max(0, Math.min(length - 1, index))]?.focus();
  };

  const setDigit = (index: number, digit: string) => {
    const chars = value.padEnd(length, " ").slice(0, length).split("");
    chars[index] = digit || " ";
    commit(chars.join("").trimEnd());
  };

  const handleChange = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    if (!digit) return;
    setDigit(index, digit);
    focusBox(index + 1);
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      if (digits[index].trim()) {
        setDigit(index, "");
      } else {
        setDigit(index - 1, "");
        focusBox(index - 1);
      }
      return;
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusBox(index - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusBox(index + 1);
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    if (!pasted) return;
    commit(pasted);
    focusBox(pasted.length);
  };

  return (
    <div
      role="group"
      aria-label={`${length}-digit verification code`}
      className={cn("flex items-center gap-2 sm:gap-3", className)}
    >
      {digits.map((digit, index) => (
        <div key={index} className="flex items-center gap-2 sm:gap-3">
          {index === separatorAt ? (
            <span aria-hidden className="px-0.5 text-grey-300">
              –
            </span>
          ) : null}

          <input
            ref={(element) => {
              inputs.current[index] = element;
            }}
            id={`${groupId}-${index}`}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={1}
            disabled={disabled}
            aria-label={`Digit ${index + 1}`}
            value={digit.trim()}
            onChange={(event) => handleChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={handlePaste}
            onFocus={(event) => event.target.select()}
            className={cn(
              "size-12 rounded-xl border text-center text-lg font-semibold sm:size-14",
              "outline-none transition-colors",
              "disabled:pointer-events-none disabled:opacity-40",
              state === "error"
                ? "border-red-400 bg-red-50 text-red-600"
                : cn(
                    "border-grey-100 bg-white text-grey-900",
                    "placeholder:text-grey-300",
                    "focus:border-grey-900 focus:shadow-ring-gray",
                  ),
            )}
            placeholder="0"
          />
        </div>
      ))}
    </div>
  );
}
