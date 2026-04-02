import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton';

export default function TourPlannerLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Skeleton className="h-8 w-40 mb-6" />
      <div className="flex gap-4 mb-6">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <SkeletonCard />
        <Skeleton className="h-64 rounded-lg" />
      </div>
    </div>
  );
}
