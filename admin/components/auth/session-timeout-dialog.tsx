"use client";

import { Dialog } from "@/components/ui/dialog";
import { useSession } from "@/contexts/session";

export function SessionTimeoutDialog() {
  const { idleMsLeft, extendSession } = useSession();

  const seconds = Math.max(0, Math.ceil((idleMsLeft ?? 0) / 1000));

  return (
    <Dialog
      control={{
        isOpen: idleMsLeft !== null,
        setOpen: (open) => {
          if (!open) extendSession();
        },
        close: extendSession,
      }}
      tone="warning"
      width="sm"
      title="Still there?"
      description={`For security, this session ends in ${seconds} second${
        seconds === 1 ? "" : "s"
      } unless you carry on.`}
      confirmLabel="Stay signed in"
    />
  );
}
