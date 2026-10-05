import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFeed } from "../hooks/useFeed";
import { usePostActions } from "../hooks/usePostActions";
import postService from "../../../services/PostService";
import reportService from "../../../services/ReportService";

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
  });
});
