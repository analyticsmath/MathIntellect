interface LoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Loader({ message, size = 'md' }: LoaderProps) {
  const dim = size === 'sm' ? 18 : size === 'lg' ? 36 : 24;

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div
        className="rounded-full animate-spin border-2 border-mi-rule border-t-mi-ink"
        style={{ width: dim, height: dim }}
      />
      {message && <p className="text-xs font-mono text-mi-muted">{message}</p>}
    </div>
  );
}

export function InlineLoader({ message }: { message?: string }) {
  return (
    <div className="flex items-center gap-2 text-xs font-mono text-mi-muted">
      <div className="w-3.5 h-3.5 rounded-full animate-spin border border-mi-rule border-t-mi-ink" />
      <span>{message ?? 'Computing...'}</span>
    </div>
  );
}
