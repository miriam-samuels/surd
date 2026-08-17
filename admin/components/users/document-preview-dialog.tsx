"use client";

import { FileValidationIcon, Image01Icon } from "@hugeicons/core-free-icons";
import { Dialog } from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import type { Disclosure } from "@/hooks/use-disclosure";

/**
 * Preview of an uploaded KYC document.
 *
 * The document image comes from storage at runtime; until that is wired the
 * frame renders a placeholder so the dialog still shows its real proportions.
 */
export function DocumentPreviewDialog({
  control,
}: {
  control: Disclosure<string>;
}) {
  const documentName = control.data ?? "Document";

  return (
    <Dialog
      control={control}
      title="Document Preview"
      icon={FileValidationIcon}
      width="md"
    >
      <div className="flex flex-col gap-3">
        <p className="text-sm text-grey-900">{documentName} (Document Preview)</p>

        <div className="relative grid aspect-[4/3] place-items-center rounded-xl bg-grey-25">
          <Icon icon={Image01Icon} size={28} className="text-grey-300" />
          <span className="sr-only">
            Preview of {documentName} is not available yet
          </span>
        </div>
      </div>
    </Dialog>
  );
}
