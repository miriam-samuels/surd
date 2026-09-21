"use client";

import { useEffect, useState } from "react";
import { msUntilExpiry, touchSession } from "@/api/session-token";

const THROTTLE_MS = 10_000;

export const WARNING_WINDOW_MS = 60_000;

const TICK_MS = 1_000;

const ACTIVITY_EVENTS = [
  "pointerdown",
  "keydown",
  "wheel",
  "touchstart",
  "scroll",
] as const;

export function useIdleTimer(enabled: boolean) {
  const [msLeft, setMsLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let lastTouch = 0;

    const record = () => {
      const now = Date.now();
      if (now - lastTouch < THROTTLE_MS) return;
      lastTouch = now;
      touchSession();
      setMsLeft(null);
    };

    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, record, { passive: true });
    }

    const tick = window.setInterval(() => {
      const remaining = msUntilExpiry();
      setMsLeft(remaining <= WARNING_WINDOW_MS ? remaining : null);
    }, TICK_MS);

    return () => {
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, record);
      }
      window.clearInterval(tick);
    };
  }, [enabled]);

  return enabled ? msLeft : null;
}
