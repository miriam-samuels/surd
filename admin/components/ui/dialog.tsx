"use client";

import { Dialog as RadixDialog } from "radix-ui";
import {
  Alert02Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
  UnavailableIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Icon, type IconSvgElement } from "@/components/ui/icon";
import type { Disclosure } from "@/hooks/use-disclosure";
import { cn } from "@/lib/cn";

/**
 * The console's modal.
 *
 * Two shapes, one component:
 *
 * `tone="form"` (default) — an icon-and-title header with your fields as
 * children and a Cancel / confirm footer. This is the Edit Rate, Invite Admin,
 * New Template dialog.
 *
 * `tone="success" | "warning" | "danger" | "info"` — a centred confirmation.
 * Passing one of these gives you the coloured badge, centred type and matching
 * confirm button for free, so a destructive prompt is one prop rather than a
 * hand-built layout:
 *
 *   <Dialog
 *     control={closeAccount}
 *     tone="danger"
 *     title="Are you sure you want to close this user account?"
 *     description="Closing this account will permanently disable access."
 *     confirmLabel="Yes, close"
 *     onConfirm={handleClose}
 *   />
 */

export const DIALOG_TONES = [
  "form",
  "info",
  "success",
  "warning",
  "danger",
] as const;

export type DialogTone = (typeof DIALOG_TONES)[number];

type ToneConfig = {
  glyph: IconSvgElement;
  badge: string;
  halo: string;
  confirmTone: "primary" | "danger" | "warning" | "success";
};

const tones: Record<Exclude<DialogTone, "form">, ToneConfig> = {
  info: {
    glyph: InformationCircleIcon,
    badge: "bg-primary text-white",
    halo: "bg-surd-blue-50",
    confirmTone: "primary",
  },
  success: {
    glyph: CheckmarkCircle02Icon,
    badge: "bg-green-500 text-white",
    halo: "bg-green-50",
    confirmTone: "primary",
  },
  warning: {
    glyph: Alert02Icon,
    badge: "bg-orange-500 text-white",
    halo: "bg-orange-50",
    confirmTone: "warning",
  },
  danger: {
    glyph: UnavailableIcon,
    badge: "bg-red-500 text-white",
    halo: "bg-red-50",
    confirmTone: "danger",
  },
};

const widths = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
} as const;

export type DialogWidth = keyof typeof widths;

type DialogProps = {
  /** From `useDisclosure()` — owns open state and any payload. */
  control: Pick<Disclosure<unknown>, "isOpen" | "setOpen" | "close">;
  title: string;
  description?: string;
  tone?: DialogTone;
  width?: DialogWidth;
  /** Icon beside the title. `tone="form"` only; other tones use their own. */
  icon?: IconSvgElement;
  children?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  /** Disables the confirm button, e.g. while a form is invalid. */
  confirmDisabled?: boolean;
  isSubmitting?: boolean;
};

export function Dialog({
  control,
  title,
  description,
  tone = "form",
  width = "md",
  icon,
  children,
  confirmLabel,
  cancelLabel = "Cancel",
  onConfirm,
  confirmDisabled = false,
  isSubmitting = false,
}: DialogProps) {
  const isConfirmation = tone !== "form";
  const config = isConfirmation ? tones[tone] : null;

  return (
    <RadixDialog.Root open={control.isOpen} onOpenChange={control.setOpen}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-50 bg-grey-1000/40 backdrop-blur-sm" />
        <RadixDialog.Content
          className={cn(
            "fixed top-1/2 left-1/2 z-50 w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2",
            "max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl outline-none",
            widths[width],
          )}
        >
          {isConfirmation && config ? (
            <ConfirmationBody
              config={config}
              title={title}
              description={description}
              confirmLabel={confirmLabel}
              cancelLabel={cancelLabel}
              onConfirm={onConfirm}
              onClose={control.close}
              isSubmitting={isSubmitting}
            >
              {children}
            </ConfirmationBody>
          ) : (
            <FormBody
              icon={icon}
              title={title}
              description={description}
              confirmLabel={confirmLabel}
              cancelLabel={cancelLabel}
              onConfirm={onConfirm}
              confirmDisabled={confirmDisabled}
              isSubmitting={isSubmitting}
            >
              {children}
            </FormBody>
          )}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}

function CloseButton({ className }: { className?: string }) {
  return (
    <RadixDialog.Close asChild>
      <button
        type="button"
        aria-label="Close"
        className={cn(
          "grid size-8 shrink-0 place-items-center rounded-lg bg-grey-25 text-grey-500",
          "transition-colors hover:bg-grey-50 hover:text-grey-900",
          className,
        )}
      >
        <Icon icon={Cancel01Icon} size={16} />
      </button>
    </RadixDialog.Close>
  );
}

function FormBody({
  icon,
  title,
  description,
  children,
  confirmLabel,
  cancelLabel,
  onConfirm,
  confirmDisabled,
  isSubmitting,
}: {
  icon?: IconSvgElement;
  title: string;
  description?: string;
  children?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel: string;
  onConfirm?: () => void;
  confirmDisabled: boolean;
  isSubmitting: boolean;
}) {
  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <RadixDialog.Title className="flex items-center gap-2 text-lg font-bold text-grey-900">
          {icon ? (
            <Icon icon={icon} size={20} className="text-primary" />
          ) : null}
          {title}
        </RadixDialog.Title>
        <CloseButton />
      </div>

      {description ? (
        <RadixDialog.Description className="mt-2 text-sm text-grey-500">
          {description}
        </RadixDialog.Description>
      ) : null}

      {children ? <div className="mt-6 flex flex-col gap-5">{children}</div> : null}

      {confirmLabel ? (
        <div className="mt-8 grid grid-cols-2 gap-3">
          <RadixDialog.Close asChild>
            <Button variant="soft" size="xl" shape="pill" block>
              {cancelLabel}
            </Button>
          </RadixDialog.Close>
          <Button
            tone="primary"
            size="xl"
            shape="pill"
            block
            onClick={onConfirm}
            disabled={confirmDisabled || isSubmitting}
          >
            {isSubmitting ? "Saving…" : confirmLabel}
          </Button>
        </div>
      ) : null}
    </>
  );
}

function ConfirmationBody({
  config,
  title,
  description,
  children,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onClose,
  isSubmitting,
}: {
  config: ToneConfig;
  title: string;
  description?: string;
  children?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel: string;
  onConfirm?: () => void;
  onClose: () => void;
  isSubmitting: boolean;
}) {
  return (
    <>
      <div className="flex justify-end">
        <CloseButton />
      </div>

      <div className="flex flex-col items-center px-2 pb-2 text-center">
        <span
          className={cn("grid size-14 place-items-center rounded-full", config.halo)}
        >
          <span
            className={cn(
              "grid size-11 place-items-center rounded-full",
              config.badge,
            )}
          >
            <Icon icon={config.glyph} size={24} strokeWidth={2} />
          </span>
        </span>

        <RadixDialog.Title className="mt-5 text-xl font-bold text-balance text-grey-900">
          {title}
        </RadixDialog.Title>

        {description ? (
          <RadixDialog.Description className="mt-2 text-sm text-balance text-grey-500">
            {description}
          </RadixDialog.Description>
        ) : null}

        {children}

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {/* A single action reads as an acknowledgement, so the cancel drops. */}
          {onConfirm ? (
            <RadixDialog.Close asChild>
              <Button variant="soft" size="xl" shape="pill">
                {cancelLabel}
              </Button>
            </RadixDialog.Close>
          ) : null}

          <Button
            tone={onConfirm ? config.confirmTone : "primary"}
            size="xl"
            shape="pill"
            disabled={isSubmitting}
            onClick={() => {
              onConfirm?.();
              if (!onConfirm) onClose();
            }}
          >
            {confirmLabel ?? "Ok got it"}
          </Button>
        </div>
      </div>
    </>
  );
}
