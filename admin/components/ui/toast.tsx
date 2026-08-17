"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { Toast as RadixToast } from "radix-ui";
import {
  Alert02Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { Icon, type IconSvgElement } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

/**
 * Transient confirmations — "Admin Account has been suspended."
 *
 * Mount `<ToastProvider>` once in the dashboard layout, then raise one from
 * anywhere below it:
 *
 *   const toast = useToast();
 *   toast.show({ tone: "warning", message: "Admin Account has been suspended." });
 */

export const TOAST_TONES = ["info", "success", "warning", "danger"] as const;
export type ToastTone = (typeof TOAST_TONES)[number];

type ToneConfig = { surface: string; icon: string; glyph: IconSvgElement };

const tones: Record<ToastTone, ToneConfig> = {
  info: {
    surface: "border-surd-blue-100 bg-white",
    icon: "text-primary",
    glyph: InformationCircleIcon,
  },
  success: {
    surface: "border-green-150 bg-white",
    icon: "text-green-600",
    glyph: CheckmarkCircle02Icon,
  },
  warning: {
    surface: "border-orange-200 bg-white",
    icon: "text-orange-500",
    glyph: Alert02Icon,
  },
  danger: {
    surface: "border-red-200 bg-white",
    icon: "text-red-500",
    glyph: Alert02Icon,
  },
};

type ToastRecord = {
  id: number;
  tone: ToastTone;
  message: string;
};

type ToastContextValue = {
  show: (toast: { message: string; tone?: ToastTone }) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);

  const show = useCallback(
    ({ message, tone = "info" }: { message: string; tone?: ToastTone }) => {
      setToasts((current) => [
        ...current,
        { id: Date.now() + Math.random(), tone, message },
      ]);
    },
    [],
  );

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      <RadixToast.Provider swipeDirection="up" duration={4000}>
        {children}

        {toasts.map((toast) => {
          const config = tones[toast.tone];
          return (
            <RadixToast.Root
              key={toast.id}
              onOpenChange={(open) => {
                if (!open) dismiss(toast.id);
              }}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg",
                "data-[state=open]:animate-toast-in",
                config.surface,
              )}
            >
              <Icon
                icon={config.glyph}
                size={20}
                className={cn("shrink-0", config.icon)}
              />
              <RadixToast.Title className="text-sm font-bold text-grey-900">
                {toast.message}
              </RadixToast.Title>
              <RadixToast.Close
                aria-label="Dismiss"
                className="ml-2 grid size-6 shrink-0 place-items-center rounded-md text-grey-400 hover:bg-grey-25"
              >
                <Icon icon={Cancel01Icon} size={14} />
              </RadixToast.Close>
            </RadixToast.Root>
          );
        })}

        {/* Toasts land under the topbar, centred, matching the comps. */}
        <RadixToast.Viewport className="fixed top-4 left-1/2 z-100 flex w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 flex-col gap-2 outline-none" />
      </RadixToast.Provider>
    </ToastContext.Provider>
  );
}
