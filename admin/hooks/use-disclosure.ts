"use client";

import { useCallback, useState } from "react";

/**
 * Open/close state for dialogs, drawers and popovers.
 *
 * Optionally carries a payload, so a table row can open a dialog *and* hand it
 * the record in one call:
 *
 *   const editRate = useDisclosure<Rate>();
 *   <button onClick={() => editRate.open(rate)}>Edit</button>
 *   <EditRateDialog control={editRate} />
 */
export type Disclosure<T = void> = {
  isOpen: boolean;
  /** The value passed to `open`, or null when closed. */
  data: T | null;
  open: (data?: T) => void;
  close: () => void;
  /** Matches the `onOpenChange` signature Radix expects. */
  setOpen: (open: boolean) => void;
};

export function useDisclosure<T = void>(initialOpen = false): Disclosure<T> {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [data, setData] = useState<T | null>(null);

  const open = useCallback((value?: T) => {
    setData(value ?? null);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const setOpen = useCallback((next: boolean) => {
    setIsOpen(next);
    if (!next) setData(null);
  }, []);

  return { isOpen, data, open, close, setOpen };
}
