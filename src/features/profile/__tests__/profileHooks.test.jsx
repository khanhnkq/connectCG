import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { renderHook, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";

import { useProfile } from "../hooks/useProfile";
import authReducer from "../../../redux/slices/authSlice";
import userReducer from "../../../redux/slices/userSlice";
import UserProfileService from "../../../services/user/UserProfileService";
import FriendService from "../../../services/friend/FriendService";
import FriendRequestService from "../../../services/friend/FriendRequestService";
import ChatService from "../../../services/chat/ChatService";
import PostService from "../../../services/PostService";
import toast from "react-hot-toast";

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn().mockReturnValue("toast-id"),
  },
}));

vi.mock("../../../services/user/UserProfileService", () => ({
  default: {
    getUserProfile: vi.fn(),
    updateAvatar: vi.fn(),
    updateCover: vi.fn(),
    updateProfileInfo: vi.fn(),
  },
}));

vi.mock("../../../services/friend/FriendService", () => ({
  default: {
    unfriend: vi.fn(),
  },
}));

vi.mock("../../../services/friend/FriendRequestService", () => ({
  default: {
    getPendingRequests: vi.fn(),
    sendRequest: vi.fn(),
    cancelRequest: vi.fn(),
    acceptRequest: vi.fn(),
    rejectRequest: vi.fn(),
  },
}));

vi.mock("../../../services/chat/ChatService", () => ({
  default: {
    getOrCreateDirectChat: vi.fn(),
  },
}));

vi.mock("../../../services/PostService", () => ({
  default: {
    getPostsByUserId: vi.fn(),
    deletePost: vi.fn(),
    updatePost: vi.fn(),
  },
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: "100" }),
  };
});

function createTestStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      auth: authReducer,
      user: userReducer,
    },
    preloadedState: {
      auth: {
        user: { id: "99", username: "current_user", fullName: "Quốc Khánh" },
        isAuthenticated: true,
      },
      user: {
        profile: {
          id: "99",
          userId: "99",
          fullName: "Quốc Khánh",
          username: "current_user",
          currentAvatarUrl: "https://example.com/avatar.jpg",
          currentCoverUrl: "https://example.com/cover.jpg",
          friendsCount: 10,
          postsCount: 5,
        },
        loading: false,
      },
      ...preloadedState,
    },
  });
}

function createWrapper(store) {
  return function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <MemoryRouter>{children}</MemoryRouter>
      </Provider>
    );
  };
}

describe("Unified Profile Hook (useProfile)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Owner / Self mode", () => {
    it("initializes with owner permissions and loads owner posts", async () => {
      const mockPosts = [
        { id: 1, content: "Bài 1", createdAt: "2026-10-01T10:00:00Z" },
        { id: 2, content: "Bài 2", createdAt: "2026-10-02T10:00:00Z" },
      ];
      PostService.getPostsByUserId.mockResolvedValueOnce({ data: mockPosts });

      const store = createTestStore();
      const { result } = renderHook(() => useProfile({ mode: "self" }), {
        wrapper: createWrapper(store),
      });

      expect(result.current.isOwner).toBe(true);
      expect(result.current.profile.fullName).toBe("Quốc Khánh");

      await act(async () => {
        await Promise.resolve();
      });

      expect(PostService.getPostsByUserId).toHaveBeenCalledWith("99");
      expect(result.current.posts).toHaveLength(2);
      expect(result.current.posts[0].id).toBe(2); // Sorted newest first
    });

    it("handles post creation and updates post count in Redux", async () => {
      PostService.getPostsByUserId.mockResolvedValueOnce({ data: [] });
      const store = createTestStore();
      const { result } = renderHook(() => useProfile({ mode: "self" }), {
        wrapper: createWrapper(store),
      });

      await act(async () => {
        await Promise.resolve();
      });

      await act(async () => {
        result.current.handlePostCreated({
          id: 3,
          content: "Bài mới đã duyệt",
          status: "APPROVED",
        });
      });

      expect(result.current.posts).toHaveLength(1);
      expect(result.current.posts[0].id).toBe(3);
      expect(store.getState().user.profile.postsCount).toBe(6);
    });

    it("handles post deletion and decrements post count in Redux", async () => {
      PostService.getPostsByUserId.mockResolvedValueOnce({
        data: [{ id: 10, content: "Bài cần xóa" }],
      });
      PostService.deletePost.mockResolvedValueOnce({ success: true });

      const store = createTestStore();
      const { result } = renderHook(() => useProfile({ mode: "self" }), {
        wrapper: createWrapper(store),
      });

      await act(async () => {
        await Promise.resolve();
      });

      act(() => {
        result.current.handleDeletePost(10);
      });

      expect(result.current.deleteModal.isOpen).toBe(true);
      expect(result.current.deleteModal.postId).toBe(10);

      await act(async () => {
        await result.current.confirmDelete();
      });

      expect(PostService.deletePost).toHaveBeenCalledWith(10);
      expect(result.current.posts).toHaveLength(0);
      expect(store.getState().user.profile.postsCount).toBe(4);
      expect(toast.success).toHaveBeenCalledWith("Xóa bài viết thành công");
    });

    it("rejects avatar and cover uploads exceeding 2MB", async () => {
      PostService.getPostsByUserId.mockResolvedValueOnce({ data: [] });
      const store = createTestStore();
      const { result } = renderHook(() => useProfile({ mode: "self" }), {
        wrapper: createWrapper(store),
      });

      const oversizedFile = new File(["dummy content"], "large.png", {
        type: "image/png",
      });
      Object.defineProperty(oversizedFile, "size", {
        value: 3 * 1024 * 1024,
      });

      await act(async () => {
        await result.current.handleAvatarChange(oversizedFile);
      });

      expect(toast.error).toHaveBeenCalledWith(
        "Kích thước ảnh đại diện không được vượt quá 2MB"
      );

      await act(async () => {
        await result.current.handleCoverChange(oversizedFile);
      });

      expect(toast.error).toHaveBeenCalledWith(
        "Kích thước ảnh bìa không được vượt quá 2MB"
      );
    });
  });

  describe("Member mode", () => {
    it("fetches member profile and detects incoming pending request", async () => {
      const memberData = {
        userId: "100",
        fullName: "Thành viên B",
        relationshipStatus: "STRANGER",
        friendsCount: 2,
        postsCount: 1,
      };
      UserProfileService.getUserProfile.mockResolvedValueOnce({ data: memberData });
      FriendRequestService.getPendingRequests.mockResolvedValueOnce({
        data: {
          content: [{ requestId: "req-456", senderId: "100" }],
        },
      });
      PostService.getPostsByUserId.mockResolvedValueOnce({ data: [] });

      const store = createTestStore();
      const { result } = renderHook(
        () => useProfile({ userId: "100", mode: "member" }),
        { wrapper: createWrapper(store) }
      );

      expect(result.current.isOwner).toBe(false);

      await act(async () => {
        await Promise.resolve();
      });

      expect(UserProfileService.getUserProfile).toHaveBeenCalledWith("100");
      expect(FriendRequestService.getPendingRequests).toHaveBeenCalled();
      expect(result.current.profile.relationshipStatus).toBe("WAITING");
      expect(result.current.profile.isRequestReceiver).toBe(true);
      expect(result.current.profile.requestId).toBe("req-456");
    });

    it("sends a friend request and updates relationshipStatus", async () => {
      UserProfileService.getUserProfile.mockResolvedValueOnce({
        data: {
          userId: "100",
          fullName: "Thành viên B",
          relationshipStatus: "NONE",
          friendsCount: 2,
        },
      });
      FriendRequestService.sendRequest.mockResolvedValueOnce({ success: true });
      PostService.getPostsByUserId.mockResolvedValueOnce({ data: [] });

      const store = createTestStore();
      const { result } = renderHook(
        () => useProfile({ userId: "100", mode: "member" }),
        { wrapper: createWrapper(store) }
      );

      await act(async () => {
        await Promise.resolve();
      });

      await act(async () => {
        await result.current.sendFriendRequest();
      });

      expect(FriendRequestService.sendRequest).toHaveBeenCalledWith("100");
      expect(result.current.profile.relationshipStatus).toBe("PENDING");
      expect(toast.success).toHaveBeenCalledWith("Đã gửi lời mời kết bạn!");
    });

    it("unfriends a member and updates friendsCount", async () => {
      UserProfileService.getUserProfile.mockResolvedValueOnce({
        data: {
          userId: "100",
          fullName: "Thành viên B",
          relationshipStatus: "FRIEND",
          friendsCount: 5,
        },
      });
      FriendService.unfriend.mockResolvedValueOnce({ success: true });
      PostService.getPostsByUserId.mockResolvedValueOnce({ data: [] });

      const store = createTestStore();
      const { result } = renderHook(
        () => useProfile({ userId: "100", mode: "member" }),
        { wrapper: createWrapper(store) }
      );

      await act(async () => {
        await Promise.resolve();
      });

      await act(async () => {
        await result.current.unfriend();
      });

      expect(FriendService.unfriend).toHaveBeenCalledWith("100");
      expect(result.current.profile.relationshipStatus).toBe("NONE");
      expect(result.current.profile.friendsCount).toBe(4);
      expect(toast.success).toHaveBeenCalledWith(
        "Đã hủy kết bạn với Thành viên B"
      );
    });

    it("initiates direct chat and navigates with firebaseRoomKey", async () => {
      UserProfileService.getUserProfile.mockResolvedValueOnce({
        data: {
          userId: "100",
          fullName: "Thành viên B",
          relationshipStatus: "FRIEND",
        },
      });
      ChatService.getOrCreateDirectChat.mockResolvedValueOnce({
        data: { firebaseRoomKey: "room-abc-xyz" },
      });
      PostService.getPostsByUserId.mockResolvedValueOnce({ data: [] });

      const store = createTestStore();
      const { result } = renderHook(
        () => useProfile({ userId: "100", mode: "member" }),
        { wrapper: createWrapper(store) }
      );

      await act(async () => {
        await Promise.resolve();
      });

      await act(async () => {
        await result.current.startChat();
      });

      expect(ChatService.getOrCreateDirectChat).toHaveBeenCalledWith("100");
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard/chat", {
        state: { selectedRoomKey: "room-abc-xyz" },
      });
    });
  });
});
