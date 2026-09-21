"use client";

import { useCallback, useState } from "react";

export type Disclosure<T = void> = {
  isOpen: boolean;

  data: T | null;
  open: (data?: T) => void;
  close: () => void;

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
