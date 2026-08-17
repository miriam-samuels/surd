import { Spinner } from "@/components/ui/spinner";

/**
 * Root-level fallback. Next renders this while any top-level route segment
 * loads, so a slow navigation never shows a blank document.
 */
export default function RootLoading() {
  return (
    <div className="grid min-h-dvh place-items-center bg-grey-25">
      <Spinner size={32} className="text-primary" />
    </div>
  );
}
