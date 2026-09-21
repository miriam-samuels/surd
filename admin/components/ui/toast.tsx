"use client";

import { Bounce, ToastContainer, toast as notify } from "react-toastify";
import {
  Alert02Icon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { Icon, type IconSvgElement } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

export const TOAST_TONES = ["info", "success", "warning", "danger"] as const;
export type ToastTone = (typeof TOAST_TONES)[number];

const tones: Record<ToastTone, { icon: string; glyph: IconSvgElement }> = {
  info: { icon: "text-primary", glyph: InformationCircleIcon },
  success: { icon: "text-green-600", glyph: CheckmarkCircle02Icon },
  warning: { icon: "text-orange-500", glyph: Alert02Icon },
  danger: { icon: "text-red-500", glyph: Alert02Icon },
};

/**
 * Raise a toast from anywhere — a component, a plain function, the request
 * layer. It is not a hook, so there is no provider to be inside of and no
 * ordering to get wrong.
 */
export function toast({
  message,
  tone = "info",
}: {
  message: string;
  tone?: ToastTone;
}) {
  const { icon, glyph } = tones[tone];

  notify(
    <div className="flex items-start gap-3">
      <Icon icon={glyph} size={20} className={cn("mt-px shrink-0", icon)} />
      <p className="text-sm font-medium text-grey-900">{message}</p>
    </div>,
  );
}

/** Mounted once, at the root. Renders whatever `toast()` raises. */
export function ToastViewport() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={4000}
      hideProgressBar
      closeButton={false}
      newestOnTop
      draggable
      transition={Bounce}
      toastClassName="!min-h-0 !rounded-xl !border !border-grey-50 !bg-white !p-4 !shadow-lg"
      className="!w-auto !max-w-sm !p-4"
    />
  );
}
