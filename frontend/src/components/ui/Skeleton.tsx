export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-skeleton rounded-lg ${className}`}
      style={{ background: 'rgba(148, 163, 184, 0.22)' }}
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
    <div
      className="rounded-2xl p-4 space-y-2.5"
      style={{ border: '1px solid rgba(148, 163, 184, 0.24)', background: 'rgba(255, 255, 255, 0.88)' }}
    >
      <Skeleton className="h-2.5 w-1/2" />
      <Skeleton className="h-7 w-2/3" />
    </div>
  );
}

export function SkeletonSimulationCard() {
  return (
    <div
      className="rounded-3xl p-4 space-y-4"
      style={{ border: '1px solid rgba(148, 163, 184, 0.24)', background: 'rgba(255, 255, 255, 0.9)' }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-2.5 w-20" />
          </div>
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-px w-full" />
      <Skeleton className="h-2.5 w-24" />
    </div>
  );
}

export function SkeletonAnalytics() {
  return (
    <div className="flex flex-col gap-6">
      <div
        className="rounded-3xl p-5 space-y-5"
        style={{ border: '1px solid rgba(148, 163, 184, 0.24)', background: 'rgba(255, 255, 255, 0.9)' }}
      >
        <Skeleton className="h-3 w-24" />
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, index) => <SkeletonMetricCard key={index} />)}
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-3xl p-5 space-y-3"
            style={{ border: '1px solid rgba(148, 163, 184, 0.24)', background: 'rgba(255, 255, 255, 0.9)' }}
          >
            <Skeleton className="h-2.5 w-28" />
            <Skeleton className="h-52 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
