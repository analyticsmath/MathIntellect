import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { FeedInteractionBar } from './FeedInteractionBar';
import type { FeedPost } from '../../types/phase5.types';

interface SimulationFeedCardProps {
  post: FeedPost;
  index: number;
  onLike: (id: string) => void;
  onFork: (id: string) => void;
  highlighted?: boolean;
}

const TYPE_LABELS: Record<string, string> = {
  monte_carlo: 'Monte Carlo',
  game_theory: 'Game Theory',
  market: 'Market',
  conflict: 'Conflict',
  custom: 'Custom',
};

function relativeTime(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.floor(ms / 60_000);
  if (m < 60) {
    return `${m}m ago`;
  }
  const h = Math.floor(m / 60);
  if (h < 24) {
    return `${h}h ago`;
  }
  return `${Math.floor(h / 24)}d ago`;
}

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
}

function previewPath(values: number[]) {
  if (!values.length) {
    return '';
  }

  const min = Math.min(...values);
  const max = Math.max(...values);

  return values.map((value, index) => {
    const x = (index / Math.max(1, values.length - 1)) * 100;
    const y = max === min ? 50 : 100 - ((value - min) / (max - min)) * 90;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(' ');
}

export function SimulationFeedCard({ post, index, onLike, onFork, highlighted = false }: SimulationFeedCardProps) {
  const cardRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) {
      return;
    }
    const ctx = gsap.context(() => {
      gsap.from(el, {
        y: 20,
        opacity: 0,
        duration: 0.55,
        ease: 'power3.out',
        delay: (index % 8) * 0.05,
      });
    });
    return () => ctx.revert();
  }, [index]);

  return (
    <article
      ref={cardRef}
      className="premium-card p-5 md:p-6 space-y-4 transition-all duration-300"
      style={{
        borderColor: highlighted ? 'rgba(34,211,238,0.6)' : `${post.thumbnailColor}40`,
        boxShadow: highlighted ? '0 18px 38px rgba(34,211,238,0.24)' : undefined,
        borderRadius: 24,
        overflow: 'visible',
      }}
      data-tilt
    >
      <div
        className="w-full h-1.5 rounded-full"
        style={{ background: `linear-gradient(90deg, ${post.thumbnailColor}88, ${post.thumbnailColor}28, transparent)` }}
      />

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {post.userAvatar ? (
            <img
              src={post.userAvatar}
              alt={post.userName}
              className="w-10 h-10 rounded-full border object-cover"
              style={{ borderColor: `${post.thumbnailColor}66`, background: 'rgba(11,16,32,0.9)' }}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{
                background: `linear-gradient(135deg, ${post.thumbnailColor}44, ${post.thumbnailColor}16)`,
                border: `1px solid ${post.thumbnailColor}42`,
                color: post.thumbnailColor,
              }}
            >
              {initials(post.userName)}
            </div>
          )}

          <div className="min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{post.userName}</p>
            <p className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>
              Rank #{post.userRank ?? '--'} · XP {post.userXp?.toLocaleString() ?? '--'} · {post.userBehaviorTag}
            </p>
          </div>
        </div>

        <span className="text-[11px] shrink-0" style={{ color: 'var(--text-muted)' }}>
          {relativeTime(post.createdAt)}
        </span>
      </div>

      <div>
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <span
            className="text-[10px] uppercase tracking-[0.16em] px-2 py-0.5 rounded-full font-semibold"
            style={{ background: `${post.thumbnailColor}1c`, color: post.thumbnailColor, border: `1px solid ${post.thumbnailColor}40` }}
          >
            {TYPE_LABELS[post.simulationType] ?? post.simulationType}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold" style={{ color: 'var(--signal-cyan)' }}>
            +{post.xpGained} XP
          </span>
          <span
            className="text-[10px] rounded-full px-2 py-0.5"
            style={{ background: 'rgba(59,130,246,0.15)', color: 'var(--brand-blue)', border: '1px solid rgba(59,130,246,0.35)' }}
          >
            Score {post.resultScore}
          </span>
        </div>
        <h3 className="text-[1.04rem] font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>{post.simulationName}</h3>
      </div>

      <div
        className="rounded-xl px-3 py-2.5"
        style={{ border: '1px solid var(--glass-stroke)', background: 'rgba(11,16,32,0.78)' }}
      >
        <div className="h-16 rounded-lg px-1 py-1" style={{ border: '1px solid var(--glass-stroke)', background: 'rgba(17,24,39,0.72)' }}>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polyline
              points={previewPath(post.chartPreview)}
              fill="none"
              stroke={post.thumbnailColor}
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <div
        className="px-3 py-2.5 rounded-xl text-xs leading-relaxed"
        style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', color: 'var(--text-secondary)' }}
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] mr-1.5" style={{ color: 'var(--brand-blue)' }}>AI Insight:</span>
        {post.aiSummary}
      </div>

      {post.topComment && (
        <div className="px-3 py-2 rounded-xl text-xs" style={{ border: '1px solid var(--glass-stroke)', background: 'rgba(17,24,39,0.72)', color: 'var(--text-secondary)' }}>
          “{post.topComment}”
        </div>
      )}

      <FeedInteractionBar
        postId={post.id}
        likeCount={post.likeCount}
        commentCount={post.commentCount ?? 0}
        forkCount={post.forkCount}
        liked={post.liked}
        onLike={onLike}
        onFork={onFork}
      />
    </article>
  );
}
