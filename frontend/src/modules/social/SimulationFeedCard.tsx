import { Link } from 'react-router-dom';
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
  market: 'Market Dynamics',
  conflict: 'Agent Interaction',
  custom: 'Custom Model',
};

function relativeTime(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.floor(ms / 60_000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function SimulationFeedCard({
  post,
  onLike,
  onFork,
  highlighted = false,
}: SimulationFeedCardProps) {
  const label = TYPE_LABELS[post.simulationType] ?? 'Simulation';

  return (
    <article
      className={`border bg-mi-paper p-5 transition-colors ${
        highlighted ? 'border-mi-ink' : 'border-mi-rule'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="font-semibold text-mi-ink">{post.userName}</span>
            <span className="text-mi-muted">•</span>
            <span className="text-mi-muted">{relativeTime(post.createdAt)}</span>
            <span className="text-mi-muted">•</span>
            <span className="uppercase text-mi-change font-bold">{label}</span>
          </div>

          <h3 className="text-base font-semibold text-mi-ink mt-1">
            {post.simulationName}
          </h3>

          <p className="text-xs text-mi-text mt-1.5 leading-relaxed">
            {post.aiSummary}
          </p>
        </div>

        <span className="text-xs font-mono uppercase px-2 py-0.5 border border-mi-rule bg-mi-surface-soft text-mi-muted shrink-0">
          Level {post.userLevel}
        </span>
      </div>

      {post.chartPreview && post.chartPreview.length > 0 && (
        <div className="mt-4 p-3 bg-mi-surface-soft border border-mi-rule flex items-center justify-between">
          <span className="text-[10px] font-mono text-mi-muted uppercase">Trajectory trace</span>
          <span className="text-xs font-mono text-mi-ink">{post.chartPreview.length} points sampled</span>
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-mi-rule flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onLike(post.id)}
            className={`hover:text-mi-ink flex items-center gap-1 ${
              post.liked ? 'text-mi-change font-bold' : 'text-mi-muted'
            }`}
          >
            ★ {post.likeCount}
          </button>
          <button
            onClick={() => onFork(post.id)}
            className="text-mi-muted hover:text-mi-ink flex items-center gap-1"
          >
            Fork variant ({post.forkCount})
          </button>
        </div>

        <Link
          to={`/app/analytics/${post.simulationId}`}
          className="text-mi-ink font-semibold hover:text-mi-change"
        >
          Inspect Workbench →
        </Link>
      </div>
    </article>
  );
}
