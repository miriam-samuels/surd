"use client";

import { useState } from "react";
import { Dialog } from "radix-ui";
import {
  ArrowRight02Icon,
  Cancel01Icon,
  SentIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

export function ApplyDialog({ jobTitle }: { jobTitle: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button size="lg" block >
          Apply now
          <Icon icon={ArrowRight02Icon} size={20} strokeWidth={2} />
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-grey-1000/60 backdrop-blur-sm" />
        <Dialog.Content
          className={cn(
            "fixed top-1/2 left-1/2 z-50 w-[calc(100vw-2rem)] max-w-md",
            "-translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-6 shadow-2xl outline-none sm:p-8",
          )}
        >
          <div className="flex items-start justify-between">
            <span className="grid size-11 place-items-center rounded-full bg-surd-blue-50 text-primary">
              <Icon icon={SentIcon} size={20} />
            </span>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close"
                className="grid size-8 place-items-center rounded-full text-grey-400 transition-colors hover:bg-grey-25 hover:text-grey-900"
              >
                <Icon icon={Cancel01Icon} size={18} />
              </button>
            </Dialog.Close>
          </div>

          <Dialog.Title className="mt-5 text-xl font-extrabold text-grey-900">
            🎉 Application Submitted Successfully!
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-paragraph-sm text-grey-500">
            We&rsquo;ve received your application for{" "}
            <strong className="font-semibold text-grey-900">{jobTitle}</strong>{" "}
            and our hiring team is already reviewing it. Pay attention to your
            emails for further updates on the hiring process.
          </Dialog.Description>

          <div className="mt-6 flex justify-end">
            <Dialog.Close asChild>
              <Button size="lg">OK, got it.</Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
