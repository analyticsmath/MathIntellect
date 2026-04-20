interface LoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Loader({ message, size = 'md' }: LoaderProps) {
  const ring = {
    sm: { outer: 20, inner: 12, stroke: 2.5 },
    md: { outer: 36, inner: 22, stroke: 3 },
    lg: { outer: 56, inner: 34, stroke: 3.5 },
  }[size];

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="relative" style={{ width: ring.outer, height: ring.outer }}>
        <div
          className="absolute inset-0 rounded-full"
          style={{ border: `${ring.stroke}px solid rgba(148, 163, 184, 0.28)` }}
        />
        <div
          className="absolute inset-0 rounded-full animate-spin"
          style={{
            border: `${ring.stroke}px solid transparent`,
            borderTopColor: '#2563EB',
            borderRightColor: 'rgba(6, 182, 212, 0.72)',
          }}
        />
        <div
          className="absolute inset-0 m-auto rounded-full animate-pulse"
          style={{
            width: ring.inner * 0.3,
            height: ring.inner * 0.3,
            background: 'radial-gradient(circle, rgba(37, 99, 235, 0.95) 0%, transparent 70%)',
          }}
        />
      </div>
      {message && <p className="text-xs font-medium tracking-wide" style={{ color: 'var(--text-secondary)' }}>{message}</p>}
    </div>
  );
}

export function InlineLoader({ message }: { message?: string }) {
  return (
    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
      <div
        className="rounded-full animate-spin"
        style={{
          width: 14,
          height: 14,
          border: '2px solid rgba(148, 163, 184, 0.3)',
          borderTopColor: '#2563EB',
        }}
      />
      {message ?? 'Loading...'}
    </div>
  );
}
