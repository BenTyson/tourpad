import { Skeleton } from '@/components/ui/Skeleton';

export default function NewBookingLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <Skeleton className="h-8 w-48 mb-8" />
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ))}
        <Skeleton className="h-10 w-40 rounded-md" />
      </div>
    </div>
  );
}
