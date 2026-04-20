import { useState, useCallback, useRef, useEffect } from 'react';
import { socialService } from '../services/social.service';
import type { FeedPost } from '../types/phase5.types';

interface UseSocialFeedReturn {
  posts: FeedPost[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  loadMore: () => void;
  toggleLike: (postId: string) => void;
  newestPostId: string | null;
}

export function useSocialFeed(): UseSocialFeedReturn {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newestPostId, setNewestPostId] = useState<string | null>(null);
  const pageRef = useRef(1);
  const seenIdsRef = useRef(new Set<string>());

  useEffect(() => {
    let cancelled = false;

    socialService.getFeed(1).then((result) => {
      if (cancelled) {
        return;
      }
      const unique = result.posts.filter((p) => !seenIdsRef.current.has(p.id));
      unique.forEach((p) => seenIdsRef.current.add(p.id));
      setPosts(unique);
      setHasMore(result.hasMore);
      pageRef.current = 2;
      setLoading(false);
    }).catch((err) => {
      if (cancelled) {
        return;
      }
      setError(err instanceof Error ? err.message : 'Failed to load feed');
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const seed = Date.now();
      const live = {
        ...socialService.getLivePost(seed),
        id: `live-${seed}`,
        createdAt: new Date().toISOString(),
      };

      if (seenIdsRef.current.has(live.id)) {
        return;
      }

      seenIdsRef.current.add(live.id);
      setPosts((current) => {
        const next = [live, ...current];
        return next.slice(0, 90);
      });
      setNewestPostId(live.id);
      window.setTimeout(() => {
        setNewestPostId((current) => (current === live.id ? null : current));
      }, 1800);
    }, 15000);

    return () => window.clearInterval(timer);
  }, []);

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) {
      return;
    }
    setLoadingMore(true);
    socialService.getFeed(pageRef.current).then((result) => {
      const unique = result.posts.filter((p) => !seenIdsRef.current.has(p.id));
      unique.forEach((p) => seenIdsRef.current.add(p.id));
      setPosts((prev) => [...prev, ...unique]);
      setHasMore(result.hasMore);
      pageRef.current += 1;
    }).catch(() => {
      setHasMore(false);
    }).finally(() => setLoadingMore(false));
  }, [loadingMore, hasMore]);

  const toggleLike = useCallback((postId: string) => {
    setPosts((prev) => prev.map((p) =>
      p.id === postId
        ? { ...p, liked: !p.liked, likeCount: p.liked ? p.likeCount - 1 : p.likeCount + 1 }
        : p
    ));
    socialService.likePost(postId).catch(() => {
      setPosts((prev) => prev.map((p) =>
        p.id === postId
          ? { ...p, liked: !p.liked, likeCount: p.liked ? p.likeCount - 1 : p.likeCount + 1 }
          : p
      ));
    });
  }, []);

  return { posts, loading, loadingMore, hasMore, error, loadMore, toggleLike, newestPostId };
}
