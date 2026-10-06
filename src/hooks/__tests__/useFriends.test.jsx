import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { renderHook, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import { useFriends } from "../useFriends";
import FriendService from "../../services/friend/FriendService";
import FriendRequestService from "../../services/friend/FriendRequestService";
import authReducer from "../../redux/slices/authSlice";
import userReducer from "../../redux/slices/userSlice";

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn().mockReturnValue("toast-id"),
  },
}));

vi.mock("../../services/friend/FriendService", () => ({
  default: {
    getMyFriends: vi.fn(),
    getFriends: vi.fn(),
    unfriend: vi.fn(),
  },
}));

vi.mock("../../services/friend/FriendRequestService", () => ({
  default: {
    getPendingRequests: vi.fn(),
  },
}));

describe("useFriends hook", () => {
  let store;

  beforeEach(() => {
    vi.clearAllMocks();

    store = configureStore({
      reducer: {
        auth: authReducer,
        user: userReducer,
      },
      preloadedState: {
        auth: {
          user: { id: 1, email: "test@example.com" },
          isAuthenticated: true,
        },
        user: {
          profile: { userId: 1, fullName: "Test User" },
        },
      },
    });
  });

  const wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );

  it("fetches my friends when userId is null", async () => {
    const mockFriends = [
      { id: 10, fullName: "Friend 1", relationshipStatus: "ACCEPTED" },
      { id: 20, fullName: "Friend 2", relationshipStatus: "ACCEPTED" },
    ];

    FriendService.getMyFriends.mockResolvedValueOnce({
      data: {
        content: mockFriends,
        last: true,
      },
    });

    const { result } = renderHook(() => useFriends(null), { wrapper });

    await act(async () => {
      await Promise.resolve();
    });

    expect(FriendService.getMyFriends).toHaveBeenCalledWith({
      page: 0,
      size: 12,
      name: "",
    });
    expect(result.current.friends).toHaveLength(2);
    expect(result.current.hasMore).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it("fetches member friends and enriches pending status with pending requests", async () => {
    const memberFriends = [
      { id: 101, fullName: "Pending Friend", relationshipStatus: "PENDING" },
      { id: 102, fullName: "Regular Friend", relationshipStatus: "ACCEPTED" },
    ];

    FriendService.getFriends.mockResolvedValueOnce({
      data: {
        content: memberFriends,
        last: false,
      },
    });

    FriendRequestService.getPendingRequests.mockResolvedValueOnce({
      data: {
        content: [{ senderId: 101, requestId: 999 }],
      },
    });

    const { result } = renderHook(() => useFriends(99), { wrapper });

    await act(async () => {
      await Promise.resolve();
    });

    expect(FriendService.getFriends).toHaveBeenCalledWith(99, {
      page: 0,
      size: 12,
      name: "",
    });
    expect(FriendRequestService.getPendingRequests).toHaveBeenCalledTimes(1);

    const pendingFriend = result.current.friends.find((f) => f.id === 101);
    expect(pendingFriend?.isRequestReceiver).toBe(true);
    expect(pendingFriend?.requestId).toBe(999);
  });

  it("does NOT call getPendingRequests again when loadMore is triggered (eliminates N+1 queries)", async () => {
    const page0Friends = Array.from({ length: 12 }, (_, i) => ({
      id: 100 + i,
      fullName: `Friend ${i}`,
      relationshipStatus: i === 0 ? "PENDING" : "ACCEPTED",
    }));
    const page1Friends = [
      { id: 201, fullName: "Pending Friend 2", relationshipStatus: "PENDING" },
    ];

    FriendService.getFriends
      .mockResolvedValueOnce({
        data: { content: page0Friends, last: false },
      })
      .mockResolvedValueOnce({
        data: { content: page1Friends, last: true },
      });

    FriendRequestService.getPendingRequests.mockResolvedValueOnce({
      data: {
        content: [{ senderId: 100, requestId: 999 }, { senderId: 201, requestId: 1000 }],
      },
    });

    const { result } = renderHook(() => useFriends(99), { wrapper });

    await act(async () => {
      await Promise.resolve();
    });

    expect(FriendRequestService.getPendingRequests).toHaveBeenCalledTimes(1);
    expect(result.current.friends).toHaveLength(12);

    // Trigger loadMore
    await act(async () => {
      result.current.loadMore();
      await Promise.resolve();
    });

    // Check that getFriends was called for page 1
    expect(FriendService.getFriends).toHaveBeenCalledWith(99, {
      page: 1,
      size: 12,
      name: "",
    });

    // CRITICAL: getPendingRequests was NOT called a second time
    expect(FriendRequestService.getPendingRequests).toHaveBeenCalledTimes(1);
    expect(result.current.friends).toHaveLength(13);

    const secondFriend = result.current.friends.find((f) => f.id === 201);
    expect(secondFriend?.isRequestReceiver).toBe(true);
    expect(secondFriend?.requestId).toBe(1000);
  });

  it("resets list and re-fetches when search filter changes", async () => {
    FriendService.getMyFriends
      .mockResolvedValueOnce({
        data: { content: [{ id: 1, fullName: "Alice" }], last: true },
      })
      .mockResolvedValueOnce({
        data: { content: [{ id: 2, fullName: "Bob" }], last: true },
      });

    const { result } = renderHook(() => useFriends(null), { wrapper });

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.friends[0].fullName).toBe("Alice");

    // Update filter
    act(() => {
      result.current.updateFilter({ name: "Bob" });
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(FriendService.getMyFriends).toHaveBeenLastCalledWith({
      page: 0,
      size: 12,
      name: "Bob",
    });
    expect(result.current.friends[0].fullName).toBe("Bob");
  });

  it("handles unfriend action and updates list locally", async () => {
    FriendService.getMyFriends.mockResolvedValueOnce({
      data: {
        content: [{ id: 50, fullName: "Former Friend" }],
        last: true,
      },
    });
    FriendService.unfriend.mockResolvedValueOnce({ status: 200 });

    const { result } = renderHook(() => useFriends(null), { wrapper });

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.friends).toHaveLength(1);

    let success;
    await act(async () => {
      success = await result.current.handleUnfriend(50);
    });

    expect(success).toBe(true);
    expect(FriendService.unfriend).toHaveBeenCalledWith(50);
    expect(result.current.friends).toHaveLength(0);
  });
});
