export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`bg-mi-rule/60 animate-pulse ${className}`}
    />
  );
}

export function SkeletonText({ lines = 1, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={`h-3 ${index === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'}`}
        />
      ))}
    </div>
  );
}

export function SkeletonMetricCard() {
  return (
    <div className="border border-mi-rule bg-mi-paper p-4 space-y-2">
      <Skeleton className="h-2.5 w-1/2" />
      <Skeleton className="h-6 w-2/3" />
    </div>
  );
}

export function SkeletonSimulationCard() {
  return (
    <div className="border border-mi-rule bg-mi-paper p-4 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-3 w-48" />
    </div>
  );
}

export function SkeletonAnalytics() {
  return (
    <div className="space-y-6">
      <div className="border border-mi-rule bg-mi-paper p-5 space-y-4">
        <Skeleton className="h-4 w-28" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonMetricCard key={i} />
          ))}
        </div>
      </div>
      <div className="border border-mi-rule bg-mi-paper p-5 space-y-3">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}
