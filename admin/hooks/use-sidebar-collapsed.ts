"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Whether the desktop sidebar is collapsed, persisted to localStorage.
 *
 * `localStorage` is an external store, so it is read through
 * `useSyncExternalStore` rather than copied into state inside an effect. That
 * gives a correct server snapshot (always expanded) with no hydration
 * mismatch, and keeps every tab in sync via the `storage` event.
 */

const STORAGE_KEY = "surd-admin:sidebar-collapsed";

/** Same-tab writes don't fire `storage`, so components subscribe here too. */
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot() {
  return window.localStorage.getItem(STORAGE_KEY) === "true";
}

/** The rail is expanded during server render; the client corrects on mount. */
function getServerSnapshot() {
  return false;
}

export function useSidebarCollapsed() {
  const collapsed = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const toggle = useCallback(() => {
    const next = !getSnapshot();
    window.localStorage.setItem(STORAGE_KEY, String(next));
    for (const listener of listeners) listener();
  }, []);

  return [collapsed, toggle] as const;
}
