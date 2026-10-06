import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFeed } from "../hooks/useFeed";
import { usePostActions } from "../hooks/usePostActions";
import postService from "../../../services/PostService";

describe("Feed Custom Hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useFeed hook", () => {
    it("fetches posts on initial mount with pagination metadata", async () => {
      const mockPosts = [
        { id: 1, content: "Bài viết 1" },
        { id: 2, content: "Bài viết 2" },
      ];
      const fetcher = vi.fn().mockResolvedValue({
        data: {
          content: mockPosts,
          last: true,
        },
      });

      const { result } = renderHook(() =>
        useFeed({ fetcher, pageSize: 2, autoFetch: true })
      );

      // Wait for async fetch
      await act(async () => {
        await Promise.resolve();
      });

      expect(fetcher).toHaveBeenCalledWith(0, 2);
      expect(result.current.posts).toHaveLength(2);
      expect(result.current.hasMore).toBe(false);
      expect(result.current.loading).toBe(false);
    });

    it("appends new page and prevents duplicates", async () => {
      const page0 = [{ id: 1, content: "Post 1" }];
      const page1 = [
        { id: 1, content: "Post 1 duplicate" },
        { id: 2, content: "Post 2 new" },
      ];

      const fetcher = vi.fn()
        .mockResolvedValueOnce({ data: { content: page0, last: false } })
        .mockResolvedValueOnce({ data: { content: page1, last: true } });

      const { result } = renderHook(() =>
        useFeed({ fetcher, pageSize: 1, autoFetch: true })
      );

      await act(async () => {
        await Promise.resolve();
      });

      expect(result.current.posts).toHaveLength(1);

      // Load next page
      await act(async () => {
        result.current.loadMore();
      });

      expect(fetcher).toHaveBeenCalledWith(1, 1);
      expect(result.current.posts).toHaveLength(2);
      expect(result.current.posts.map((p) => p.id)).toEqual([1, 2]);
    });

    it("supports prependPost, updatePost, and removePost", async () => {
      const { result } = renderHook(() =>
        useFeed({ autoFetch: false, initialPosts: [{ id: 1, content: "Original" }] })
      );

      expect(result.current.posts).toHaveLength(1);

      // Prepend
      act(() => {
        result.current.prependPost({ id: 2, content: "New Post" });
      });
      expect(result.current.posts).toHaveLength(2);
      expect(result.current.posts[0].id).toBe(2);

      // Update
      act(() => {
        result.current.updatePost(1, { content: "Updated content" });
      });
      expect(result.current.posts.find((p) => p.id === 1)?.content).toBe("Updated content");

      // Remove
      act(() => {
        result.current.removePost(2);
      });
      expect(result.current.posts).toHaveLength(1);
      expect(result.current.posts[0].id).toBe(1);
    });

    it("maintains stable fetcher reference and avoids redundant calls on re-renders", async () => {
      const fetcher1 = vi.fn().mockResolvedValue({
        data: { content: [{ id: 1, content: "Post 1" }], last: false },
      });
      const fetcher2 = vi.fn().mockResolvedValue({
        data: { content: [{ id: 1, content: "Post 1" }], last: false },
      });

      const { rerender } = renderHook(
        ({ fetcher }) => useFeed({ fetcher, pageSize: 5, autoFetch: true }),
        { initialProps: { fetcher: fetcher1 } }
      );

      await act(async () => {
        await Promise.resolve();
      });

      expect(fetcher1).toHaveBeenCalledTimes(1);

      // Re-render with new function identity
      rerender({ fetcher: fetcher2 });

      await act(async () => {
        await Promise.resolve();
      });

      expect(fetcher2).not.toHaveBeenCalled();
    });

    it("cleans up observer on unmount safely", () => {
      const disconnectMock = vi.fn();
      class MockIntersectionObserver {
        constructor() {
          this.observe = vi.fn();
          this.disconnect = disconnectMock;
        }
      }
      window.IntersectionObserver = MockIntersectionObserver;

      const { result, unmount } = renderHook(() =>
        useFeed({ autoFetch: false })
      );

      const dummyNode = document.createElement("div");
      act(() => {
        result.current.lastPostElementRef(dummyNode);
      });

      unmount();
      expect(disconnectMock).toHaveBeenCalled();
    });
  });

  describe("usePostActions hook", () => {
    it("handles optimistic reaction updates and API calls", async () => {
      vi.spyOn(postService, "reactToPost").mockResolvedValue({ status: 200 });
      vi.spyOn(postService, "unreactToPost").mockResolvedValue({ status: 200 });

      const postData = {
        id: 100,
        currentUserReaction: null,
        reactCount: 5,
        commentCount: 2,
        shareCount: 1,
      };

      const { result } = renderHook(() =>
        usePostActions({ postData })
      );

      expect(result.current.localReaction).toBeNull();
      expect(result.current.localReactCount).toBe(5);

      // React with LIKE
      await act(async () => {
        await result.current.handleReact("LIKE");
      });

      expect(result.current.localReaction).toBe("LIKE");
      expect(result.current.localReactCount).toBe(6);
      expect(postService.reactToPost).toHaveBeenCalledWith(100, "LIKE");

      // Unreact
      await act(async () => {
        await result.current.handleReact(null);
      });

      expect(result.current.localReaction).toBeNull();
      expect(result.current.localReactCount).toBe(5);
      expect(postService.unreactToPost).toHaveBeenCalledWith(100);
    });

    it("reverts reaction state when API call fails", async () => {
      vi.spyOn(postService, "reactToPost").mockRejectedValue(new Error("Network failed"));

      const postData = {
        id: 200,
        currentUserReaction: null,
        reactCount: 10,
      };

      const { result } = renderHook(() =>
        usePostActions({ postData })
      );

      await act(async () => {
        await result.current.handleReact("LOVE");
      });

      // After failure, rolled back
      expect(result.current.localReaction).toBeNull();
      expect(result.current.localReactCount).toBe(10);
    });

    it("handles pin post toggle", async () => {
      vi.spyOn(postService, "togglePinPost").mockResolvedValue({ status: 200 });

      const postData = {
        id: 300,
        groupId: 5,
        isPinned: false,
      };

      const { result } = renderHook(() =>
        usePostActions({ postData, canPin: true })
      );

      await act(async () => {
        await result.current.handleTogglePin();
      });

      expect(postService.togglePinPost).toHaveBeenCalledWith(5, 300);
    });

    it("manages modal states for share and report", () => {
      const postData = { id: 400 };
      const { result } = renderHook(() => usePostActions({ postData }));

      expect(result.current.showShareModal).toBe(false);
      expect(result.current.showReportModal).toBe(false);

      act(() => {
        result.current.openShareModal();
      });
      expect(result.current.showShareModal).toBe(true);

      act(() => {
        result.current.closeShareModal();
        result.current.openReportModal();
      });
      expect(result.current.showShareModal).toBe(false);
      expect(result.current.showReportModal).toBe(true);
    });

    it("does not attach window event listeners for individual posts", () => {
      const addEventListenerSpy = vi.spyOn(window, "addEventListener");
      const postData = { id: 500, reactCount: 0 };

      renderHook(() => usePostActions({ postData }));

      // usePostActions must NOT add reactionEvent, commentEvent or postEvent to window
      const calls = addEventListenerSpy.mock.calls.map((call) => call[0]);
      expect(calls).not.toContain("reactionEvent");
      expect(calls).not.toContain("commentEvent");
      expect(calls).not.toContain("postEvent");
    });

    it("synchronizes local reaction and counters when postData props change", () => {
      let currentPostData = {
        id: 600,
        currentUserReaction: null,
        reactCount: 1,
        commentCount: 2,
        shareCount: 3,
      };

      const { result, rerender } = renderHook(
        ({ data }) => usePostActions({ postData: data }),
        { initialProps: { data: currentPostData } }
      );

      expect(result.current.localReactCount).toBe(1);
      expect(result.current.localCommentCount).toBe(2);
      expect(result.current.localShareCount).toBe(3);

      // Parent updates props with new counts from centralized feed
      currentPostData = {
        id: 600,
        currentUserReaction: "LIKE",
        reactCount: 20,
        commentCount: 10,
        shareCount: 5,
      };
      rerender({ data: currentPostData });

      expect(result.current.localReaction).toBe("LIKE");
      expect(result.current.localReactCount).toBe(20);
      expect(result.current.localCommentCount).toBe(10);
      expect(result.current.localShareCount).toBe(5);
    });
  });

  describe("useFeed centralized realtime sync", () => {
    it("updates post reactCount and commentCount on window postEvent", async () => {
      const initialPosts = [
        { id: 10, content: "Bài 10", reactCount: 2, commentCount: 0 },
        { id: 20, content: "Bài 20", reactCount: 5, commentCount: 3 },
      ];

      const { result } = renderHook(() =>
        useFeed({ autoFetch: false, initialPosts, enableRealtime: true })
      );

      expect(result.current.posts[0].reactCount).toBe(2);

      // Simulate centralized realtime event for post 10
      act(() => {
        window.dispatchEvent(
          new CustomEvent("postEvent", {
            detail: {
              postId: 10,
              newReactCount: 15,
              newCommentCount: 4,
            },
          })
        );
      });

      expect(result.current.posts[0].reactCount).toBe(15);
      expect(result.current.posts[0].commentCount).toBe(4);
      // Post 20 should remain untouched
      expect(result.current.posts[1].reactCount).toBe(5);
    });

    it("removes deleted post when postEvent with action DELETED is dispatched", async () => {
      const initialPosts = [
        { id: 100, content: "Bài 100" },
        { id: 200, content: "Bài 200" },
      ];

      const { result } = renderHook(() =>
        useFeed({ autoFetch: false, initialPosts, enableRealtime: true })
      );

      expect(result.current.posts).toHaveLength(2);

      act(() => {
        window.dispatchEvent(
          new CustomEvent("postEvent", {
            detail: {
              postId: 100,
              action: "DELETED",
            },
          })
        );
      });

      expect(result.current.posts).toHaveLength(1);
      expect(result.current.posts[0].id).toBe(200);
    });

    it("cleans up postEvent listener on unmount", () => {
      const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

      const { unmount } = renderHook(() =>
        useFeed({ autoFetch: false, initialPosts: [], enableRealtime: true })
      );

      unmount();

      const calls = removeEventListenerSpy.mock.calls.map((call) => call[0]);
      expect(calls).toContain("postEvent");
    });
  });
});
