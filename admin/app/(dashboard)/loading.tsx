export default function DashboardLoading() {
  return (
    <div className="flex animate-pulse flex-col gap-5" aria-busy>
      <span className="sr-only" role="status">
        Loading dashboard
      </span>

      <div className="flex flex-col gap-2">
        <div className="h-7 w-40 rounded-lg bg-grey-50" />
        <div className="h-4 w-64 rounded bg-grey-50" />
      </div>

      <div className="h-40 rounded-2xl bg-grey-50" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-32 rounded-2xl bg-grey-50" />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="flex flex-col gap-4 xl:col-span-2">
          <div className="h-96 rounded-2xl bg-grey-50" />
          <div className="h-72 rounded-2xl bg-grey-50" />
        </div>
        <div className="h-140 rounded-2xl bg-grey-50" />
      </div>

      <div className="h-96 rounded-2xl bg-grey-50" />
    </div>
  );
}
