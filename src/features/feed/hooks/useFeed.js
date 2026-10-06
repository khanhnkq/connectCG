import { useState, useEffect, useRef, useCallback } from "react";
import postService from "../../../services/PostService";
import toast from "react-hot-toast";

const defaultFetcher = (page, size) => postService.getPublicHomepagePosts(page, size);

/**
 * Custom Hook for Feed & Infinite Scrolling
 * Manages post listing, pagination, loading states, deduplication, and intersection observer.
 */
export function useFeed({
  fetcher = defaultFetcher,
  pageSize = 10,
  initialPosts = [],
  autoFetch = true,
  enableRealtime = true,
} = {}) {
  const [posts, setPosts] = useState(initialPosts);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Keep fetcher reference stable to prevent cascading re-fetch cycles
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  // Intersection observer for infinite scroll
  const observerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const lastPostElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore]
  );

  const fetchPage = useCallback(
    async (pageToFetch, isRefresh = false) => {
      try {
        setLoading(true);
        setError(null);

        const currentFetcher = fetcherRef.current || defaultFetcher;
        const response = await currentFetcher(pageToFetch, pageSize);
        const data = response?.data;
        const newPosts = Array.isArray(data)
          ? data
          : data?.content || [];
        const isLast = data?.last ?? (newPosts.length < pageSize);

        setPosts((prev) => {
          if (pageToFetch === 0 || isRefresh) return newPosts;
          const existingIds = new Set(prev.map((p) => p.id));
          const filteredNew = newPosts.filter((p) => !existingIds.has(p.id));
          return [...prev, ...filteredNew];
        });

        setHasMore(!isLast && newPosts.length > 0);
      } catch (err) {
        console.error("Error fetching feed:", err);
        setError(err);
        toast.error("Không thể tải danh sách bài viết");
      } finally {
        setLoading(false);
      }
    },
    [pageSize]
  );

  useEffect(() => {
    if (!autoFetch) return;
    fetchPage(page);
  }, [page, autoFetch, fetchPage]);

  const refresh = useCallback(() => {
    setPage(0);
    fetchPage(0, true);
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore, loading]);

  // Centralized realtime post updates (reactions, comments, shares, updates, deletes)
  useEffect(() => {
    if (!enableRealtime) return undefined;

    const handleFeedEvent = (e) => {
      const detail = e.detail;
      if (!detail) return;

      const { postId, action, newReactCount, newCommentCount, newShareCount, post: updatedPost } = detail;
      if (!postId) return;

      setPosts((prevPosts) => {
        // If post deleted by author or moderation
        if (action === "DELETED" && !detail.commentId) {
          return prevPosts.filter((p) => String(p.id) !== String(postId));
        }

        const index = prevPosts.findIndex((p) => String(p.id) === String(postId));
        if (index === -1) return prevPosts;

        const currentPost = prevPosts[index];
        const updated = { ...currentPost };

        if (typeof newReactCount === "number") updated.reactCount = newReactCount;
        if (typeof newCommentCount === "number") updated.commentCount = newCommentCount;
        if (typeof newShareCount === "number") updated.shareCount = newShareCount;
        if (updatedPost) {
          Object.assign(updated, updatedPost);
        }

        const next = [...prevPosts];
        next[index] = updated;
        return next;
      });
    };

    window.addEventListener("postEvent", handleFeedEvent);
    return () => {
      window.removeEventListener("postEvent", handleFeedEvent);
    };
  }, [enableRealtime]);

  const prependPost = useCallback((newPost) => {
    if (!newPost) return;
    setPosts((prev) => [newPost, ...prev]);
  }, []);

  const updatePost = useCallback((postId, updatedData) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, ...updatedData } : p))
    );
  }, []);

  const removePost = useCallback((postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  }, []);

  return {
    posts,
    setPosts,
    page,
    setPage,
    hasMore,
    loading,
    error,
    refresh,
    loadMore,
    prependPost,
    updatePost,
    removePost,
    lastPostElementRef,
  };
}

export default useFeed;
