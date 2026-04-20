interface FeedInteractionBarProps {
  postId: string;
  likeCount: number;
  commentCount: number;
  forkCount: number;
  liked: boolean;
  onLike: (id: string) => void;
  onFork: (id: string) => void;
}

export function FeedInteractionBar({ postId, likeCount, commentCount, forkCount, liked, onLike, onFork }: FeedInteractionBarProps) {
  return (
    <div className="flex items-center gap-2 pt-1 flex-wrap">
      <button
        type="button"
        onClick={() => onLike(postId)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200"
        style={{
          background: liked ? 'rgba(244, 63, 94, 0.16)' : 'rgba(148, 163, 184, 0.12)',
          border: liked ? '1px solid rgba(244, 63, 94, 0.36)' : '1px solid var(--glass-stroke)',
          color: liked ? 'var(--rose-alert)' : 'var(--text-muted)',
          animation: liked ? 'heartPop 260ms cubic-bezier(0.2, 0.8, 0.2, 1)' : undefined,
        }}
        data-ripple
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        {likeCount}
      </button>

      <span
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
        style={{
          background: 'rgba(59,130,246,0.12)',
          border: '1px solid rgba(59,130,246,0.28)',
          color: 'var(--brand-blue)',
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        {commentCount}
      </span>

      <button
        type="button"
        onClick={() => onFork(postId)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200"
        style={{
          background: 'rgba(34,211,238,0.12)',
          border: '1px solid rgba(34,211,238,0.3)',
          color: 'var(--signal-cyan)',
        }}
        data-ripple
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><circle cx="18" cy="6" r="3" />
          <path d="M18 9a9 9 0 0 1-9 9M6 9a9 9 0 0 0 9 9" />
        </svg>
        Fork · {forkCount}
      </button>
    </div>
  );
}
