"use client";

import { useRef } from "react";
import { ArrowDown01Icon, ArrowUp01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/ui/icon";
import { Input, type InputSize, type InputState } from "@/components/ui/input";
import { cn } from "@/lib/cn";

/**
 * Numeric field with a stepper.
 *
 * The native spinner is hidden (see `.no-spinner` in globals.css) and replaced
 * with a stacked pair of chevrons, which keeps the control the same height as
 * every other field.
 */

type NumberInputProps = Omit<
  React.ComponentProps<"input">,
  "size" | "type" | "prefix"
> & {
  state?: InputState;
  size?: InputSize;
  step?: number;
};

export function NumberInput({
  state = "default",
  size = "md",
  step = 1,
  disabled,
  className,
  ...props
}: NumberInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  /** Use the native stepper so min/max and `onChange` behave as expected. */
  const nudge = (direction: "up" | "down") => {
    const element = inputRef.current;
    if (!element) return;
    if (direction === "up") element.stepUp();
    else element.stepDown();
    element.dispatchEvent(new Event("change", { bubbles: true }));
    element.focus();
  };

  return (
    <Input
      ref={inputRef}
      type="number"
      step={step}
      state={state}
      size={size}
      disabled={disabled}
      className={cn("no-spinner", className)}
      trailing={
        <span className="flex shrink-0 flex-col justify-center">
          <StepButton
            direction="up"
            onClick={() => nudge("up")}
            disabled={disabled}
          />
          <StepButton
            direction="down"
            onClick={() => nudge("down")}
            disabled={disabled}
          />
        </span>
      }
      {...props}
    />
  );
}

function StepButton({
  direction,
  onClick,
  disabled,
}: {
  direction: "up" | "down";
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      tabIndex={-1}
      aria-label={direction === "up" ? "Increase" : "Decrease"}
      onClick={onClick}
      disabled={disabled}
      className="flex h-3 items-center text-grey-400 transition-colors hover:text-grey-900 disabled:pointer-events-none"
    >
      <Icon
        icon={direction === "up" ? ArrowUp01Icon : ArrowDown01Icon}
        size={14}
      />
    </button>
  );
}
