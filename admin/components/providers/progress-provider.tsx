"use client";

import { AppProgressBar } from "next-nprogress-bar";

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <AppProgressBar
        height="3px"
        color="#0066ff"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
}

export default ProgressProvider;
