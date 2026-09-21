"use client";

import { useEffect, useState } from "react";

/**
 * Holds a value still until typing stops.
 *
 * Search boxes here feed straight into a query key, so without this every
 * keystroke is a request — and with `keepPreviousData` the table would flicker
 * through partial matches on the way to the real one.
 */
export function useDebounced<T>(value: T, delay = 350): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
