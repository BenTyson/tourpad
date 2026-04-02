import { Skeleton } from '@/components/ui/Skeleton';

export default function MessagesLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Skeleton className="h-8 w-32 mb-6" />
      <div className="grid md:grid-cols-3 gap-6">
        {/* Conversation list */}
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3">
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          ))}
        </div>
        {/* Message area */}
        <div className="md:col-span-2 space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? '' : 'justify-end'}`}>
                <Skeleton className={`h-12 ${i % 2 === 0 ? 'w-2/3' : 'w-1/2'} rounded-lg`} />
              </div>
            ))}
          </div>
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
