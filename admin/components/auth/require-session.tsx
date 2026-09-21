"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/contexts/session";
import { DEFAULT_PUBLIC_ROUTE } from "@/constants/routes";
import { Spinner } from "@/components/ui/spinner";

export function RequireSession({ children }: { children: React.ReactNode }) {
  const { state, endedBecause } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (state !== "unauthenticated") return;

    const params = new URLSearchParams();
    if (pathname && pathname !== DEFAULT_PUBLIC_ROUTE) params.set("next", pathname);
    if (endedBecause && endedBecause !== "signout") params.set("reason", endedBecause);

    const query = params.toString();
    router.replace(query ? `${DEFAULT_PUBLIC_ROUTE}?${query}` : DEFAULT_PUBLIC_ROUTE);
  }, [state, endedBecause, pathname, router]);

  if (state !== "authenticated") {
    return (
      <div className="grid min-h-dvh place-items-center bg-grey-25">
        <span className="sr-only" role="status">
          Checking your session
        </span>
        <Spinner size={32} className="text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
