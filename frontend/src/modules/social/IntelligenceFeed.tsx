import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocialFeed } from '../../hooks/useSocialFeed';
import { SimulationFeedCard } from './SimulationFeedCard';
import { socialService } from '../../services/social.service';
import { Loader } from '../../components/ui/Loader';
import { ErrorState } from '../../components/ui/ErrorState';

export function IntelligenceFeed() {
  const { posts, loading, loadingMore, hasMore, error, loadMore, toggleLike, newestPostId } = useSocialFeed();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleIntersect = useCallback<IntersectionObserverCallback>((entries) => {
    if (entries[0].isIntersecting && hasMore && !loadingMore) {
      loadMore();
    }
  }, [hasMore, loadingMore, loadMore]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) {
      return;
    }
    const observer = new IntersectionObserver(handleIntersect, { rootMargin: '220px' });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersect]);

  const handleFork = async (postId: string) => {
    const { simulationId } = await socialService.forkSimulation(postId);
    if (simulationId) {
      navigate(`/app/analytics/${simulationId}`, { viewTransition: true });
    }
  };

  if (loading) {
    return <Loader message="Loading intelligence feed…" />;
  }
  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div className="space-y-5">
      <div
        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs"
        style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.32)' }}
      >
        <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--brand-blue)' }} />
        <span style={{ color: 'var(--text-primary)' }}>
          Live intelligence feed · {posts.length} simulations in stream
        </span>
      </div>

      {newestPostId && (
        <div
          className="rounded-2xl px-4 py-2.5 text-xs"
          style={{ border: '1px solid rgba(34,211,238,0.35)', background: 'rgba(34,211,238,0.12)', color: 'var(--signal-cyan)' }}
        >
          New simulation insight inserted live.
        </div>
      )}

      <div className="space-y-5">
        {posts.map((post, i) => (
          <SimulationFeedCard
            key={post.id}
            post={post}
            index={i}
            onLike={toggleLike}
            onFork={handleFork}
            highlighted={newestPostId === post.id}
          />
        ))}
      </div>

      <div ref={sentinelRef} className="h-4" />

      {loadingMore && (
        <div className="flex justify-center py-5">
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--brand-blue)' }} />
            Loading more...
          </div>
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <p className="text-center text-xs py-4" style={{ color: 'var(--text-muted)' }}>
          All {posts.length} simulations loaded
        </p>
      )}
    </div>
  );
}
