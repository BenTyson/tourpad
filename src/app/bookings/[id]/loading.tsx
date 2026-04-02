import { Skeleton } from '@/components/ui/Skeleton';

export default function BookingDetailLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="h-5 w-32 mb-6" />
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-5 w-32" />
            </div>
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-px w-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );
}
