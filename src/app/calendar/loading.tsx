import { Skeleton } from '@/components/ui/Skeleton';

export default function CalendarLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header skeleton */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-6 w-px" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-9 w-40" />
          </div>
        </div>
      </div>
      {/* Calendar grid skeleton */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="rounded-xl border border-neutral-200 overflow-hidden">
          <div className="grid grid-cols-7 gap-0">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={`h-${i}`} className="h-10 rounded-none" />
            ))}
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="min-h-[100px] p-2 border-b border-r border-neutral-200">
                <Skeleton className="h-4 w-6 mb-2" />
                {i % 5 === 0 && <Skeleton className="h-5 w-full" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
