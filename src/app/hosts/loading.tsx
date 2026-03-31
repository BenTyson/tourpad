import { Skeleton, SkeletonGrid } from '@/components/ui/Skeleton';

export default function HostsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-4 mb-8">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="flex gap-4 mb-8">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-40" />
        </div>
        <SkeletonGrid count={6} />
      </div>
    </div>
  );
}
