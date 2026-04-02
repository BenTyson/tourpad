import { Skeleton, SkeletonTable } from '@/components/ui/Skeleton';

export default function AdminBookingsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="flex gap-4 mb-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-40" />
      </div>
      <SkeletonTable rows={6} />
    </div>
  );
}
