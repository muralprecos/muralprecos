import { Skeleton } from "../ui/skeleton";

export function LineChartSkeleton() {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-card h-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        <Skeleton className="h-6 w-32" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-32" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex flex-row lg:flex-col gap-3 lg:min-w-[180px]">
          <Skeleton className="rounded-xl h-20 flex-1 lg:flex-none" />
          <Skeleton className="rounded-xl h-20 flex-1 lg:flex-none" />
        </div>
        <div className="flex-1 h-[200px]">
          <Skeleton className="w-full h-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
