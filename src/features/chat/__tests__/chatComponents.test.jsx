import { describe, it, expect, vi } from "vitest";
import React from "react";
import "@testing-library/jest-dom/vitest";
import { render, screen, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import { ChatInterface } from "../ChatInterface";
import chatReducer from "../../../redux/slices/chatSlice";
import authReducer from "../../../redux/slices/authSlice";
import userReducer from "../../../redux/slices/userSlice";

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn().mockReturnValue("toast-id"),
  },
}));

const { mockRooms } = vi.hoisted(() => ({
  mockRooms: [
    {
      id: "r1",
      name: "Trần Văn A",
      type: "DIRECT",
      firebaseRoomKey: "room_key_1",
      members: [{ id: "1", fullName: "User 1" }, { id: "2", fullName: "Trần Văn A" }],
      lastMessageVisible: "Xin chào mọi người",
      unreadCount: 0,
    },
  ],
}));

vi.mock("../../../services/chat/ChatService", () => ({
  default: {
    getMyChatRooms: vi.fn().mockResolvedValue({ data: mockRooms }),
    getOrCreateDirectChat: vi.fn().mockResolvedValue({ data: mockRooms[0] }),
    createGroupChat: vi.fn().mockResolvedValue({ data: mockRooms[0] }),
    markAsRead: vi.fn().mockResolvedValue({}),
    updateLastMessageAt: vi.fn().mockResolvedValue({}),
    renameRoom: vi.fn().mockResolvedValue({ data: mockRooms[0] }),
    leaveGroup: vi.fn().mockResolvedValue({}),
    deleteChatRoom: vi.fn().mockResolvedValue({}),
    clearHistory: vi.fn().mockResolvedValue({}),
    inviteMembers: vi.fn().mockResolvedValue({ data: mockRooms[0] }),
    removeMember: vi.fn().mockResolvedValue({}),
  },
}));

vi.mock("../../../services/chat/FirebaseChatService", () => ({
  default: {
    subscribeToMessages: vi.fn().mockImplementation((roomKey, callback) => {
      return () => {};
    }),
    sendMessage: vi.fn().mockResolvedValue({}),
    deleteMessage: vi.fn().mockResolvedValue({}),
  },
}));

vi.mock("../../../services/friend/FriendService", () => ({
  default: {
    getMyFriends: vi.fn().mockResolvedValue({ data: { content: [] } }),
  },
}));

vi.mock("../../../context/WebSocketContext", () => ({
  useWebSocket: () => ({
    stompClient: null,
    isConnected: false,
  }),
}));

function createTestStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      auth: authReducer,
      user: userReducer,
      chat: chatReducer,
    },
    preloadedState: {
      auth: {
        user: { id: "1", username: "current_user", fullName: "Quốc Khánh" },
        isAuthenticated: true,
      },
      user: {
        profile: { id: "1", fullName: "Quốc Khánh" },
      },
      chat: {
        conversations: mockRooms,
        activeRoomId: null,
      },
      ...preloadedState,
    },
  });
}

describe("Chat Feature Components", () => {
  describe("<ChatInterface /> Orchestrator", () => {
    it("renders chat interface with sidebar and conversations", async () => {
      const store = createTestStore();
      render(
        <Provider store={store}>
          <MemoryRouter>
            <ChatInterface />
          </MemoryRouter>
        </Provider>
      );

      // Verify that conversation from store is rendered in sidebar
      expect(await screen.findByText("Trần Văn A")).toBeInTheDocument();
    });
  });
});
