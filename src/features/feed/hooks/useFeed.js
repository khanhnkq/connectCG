import { useState, useEffect, useRef, useCallback } from "react";
import postService from "../../../services/PostService";
import toast from "react-hot-toast";

/**
 * Custom Hook for Feed & Infinite Scrolling
 * Manages post listing, pagination, loading states, deduplication, and intersection observer.
 */
export function useFeed({
  fetcher = (page, size) => postService.getPublicHomepagePosts(page, size),
  pageSize = 10,
  initialPosts = [],
  autoFetch = true,
} = {}) {
  const [posts, setPosts] = useState(initialPosts);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Intersection observer for infinite scroll
  const observerRef = useRef(null);

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

        const response = await fetcher(pageToFetch, pageSize);
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
    [fetcher, pageSize]
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
