import { Spinner } from "@/components/ui/spinner";

export default function RootLoading() {
  return (
    <div className="grid min-h-dvh place-items-center bg-grey-25">
      <Spinner size={32} className="text-primary" />
    </div>
  );
}
