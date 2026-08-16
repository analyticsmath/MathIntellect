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
    if (!el) return;
    const observer = new IntersectionObserver(handleIntersect, { rootMargin: '220px' });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersect]);

  const handleFork = async (postId: string) => {
    const { simulationId } = await socialService.forkSimulation(postId);
    if (simulationId) {
      navigate(`/app/analytics/${simulationId}`);
    }
  };

  if (loading) {
    return <Loader message="Loading activity stream…" />;
  }
  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div className="space-y-4">
      <div className="border border-mi-rule bg-mi-surface-soft px-4 py-3 flex items-center justify-between text-xs font-mono">
        <span className="text-mi-ink font-semibold">
          EDITORIAL ACTIVITY STREAM
        </span>
        <span className="text-mi-muted">
          {posts.length} published models recorded
        </span>
      </div>

      <div className="space-y-4">
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
        <div className="text-center py-4 text-xs font-mono text-mi-muted">
          Loading additional stream records...
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="text-center text-xs font-mono text-mi-muted py-6 border-t border-mi-rule">
          End of activity stream
        </div>
      )}
    </div>
  );
}
