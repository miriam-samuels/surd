"use client";

import { useCallback, useMemo, useTransition } from "react";
import { useRouter as useProgressRouter } from "next-nprogress-bar";

export function useNavigate() {
  const router = useProgressRouter();
  const [isNavigating, startTransition] = useTransition();

  const push = useCallback(
    (href: string) => {
      startTransition(() => router.push(href));
    },
    [router],
  );

  const replace = useCallback(
    (href: string) => {
      startTransition(() => router.replace(href));
    },
    [router],
  );

  const back = useCallback(() => {
    startTransition(() => router.back());
  }, [router]);

  const prefetch = useCallback((href: string) => router.prefetch(href), [router]);

  return useMemo(
    () => ({ push, replace, back, prefetch, isNavigating }),
    [push, replace, back, prefetch, isNavigating],
  );
}
