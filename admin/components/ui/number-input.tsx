"use client";

import { useRef } from "react";
import { ArrowDown01Icon, ArrowUp01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";

type NumberInputProps = Omit<
  React.ComponentProps<"input">,
  "size" | "type" | "prefix"
> & {
  variant?: "default" | "error" | "success";
  inputSize?: "default" | "sm";
  step?: number;
};

export function NumberInput({
  variant = "default",
  inputSize = "default",
  step = 1,
  disabled,
  className,
  ...props
}: NumberInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const nudge = (direction: "up" | "down") => {
    const element = inputRef.current;
    if (!element) return;

    const current = Number(element.value.replace(/,/g, "")) || 0;
    const next = direction === "up" ? current + step : current - step;

    const setValue = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value",
    )?.set;
    setValue?.call(element, String(next));
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.focus();
  };

  return (
    <Input
      ref={inputRef}
      type="number"
      step={step}

      variant={variant}
      inputSize={inputSize}
      disabled={disabled}
      className={cn("no-spinner pr-12", className)}
      rightIcon={
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
