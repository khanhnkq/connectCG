import React from "react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../redux/slices/authSlice";
import userReducer from "../../redux/slices/userSlice";
import notificationReducer from "../../redux/slices/notificationSlice";
import onlineUsersReducer from "../../redux/slices/onlineUsersSlice";
import chatReducer from "../../redux/slices/chatSlice";
import { mockUsers } from "./apiMockData";
import { ThemeProvider } from "../../context/ThemeContext";

/**
 * Creates a mock store for Storybook components
 */
export function createMockStore(preloadedState = {}) {
  const defaultState = {
    auth: {
      user: {
        id: mockUsers.currentUser.id,
        username: mockUsers.currentUser.username,
        role: "ROLE_ADMIN",
        email: "khanhnkq@connect.io",
      },
      isAuthenticated: true,
      authChecked: true,
      loading: false,
      error: null,
    },
    user: {
      profile: {
        id: mockUsers.currentUser.id,
        username: mockUsers.currentUser.username,
        fullName: mockUsers.currentUser.fullName,
        currentAvatarUrl: mockUsers.currentUser.avatarUrl,
        bio: mockUsers.currentUser.bio,
      },
      loading: false,
      error: null,
    },
    notifications: {
      items: [
        {
          id: 1,
          title: "Lời mời kết bạn",
          content: "Trần Hoàng Nam đã gửi cho bạn một lời mời kết bạn",
          isRead: false,
          createdAt: new Date().toISOString(),
          type: "FRIEND_REQUEST",
        },
        {
          id: 2,
          title: "Bình luận mới",
          content: "Lê Mai Chi đã bình luận về bài viết của bạn",
          isRead: true,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          type: "POST_COMMENT",
        },
      ],
      unreadCount: 1,
      loading: false,
      error: null,
    },
    chat: {
      rooms: [],
      conversations: [],
      directRooms: [],
      groupRooms: [],
      activeRoom: null,
      directUnreadCount: 2,
      groupUnreadCount: 1,
      loading: false,
    },
    onlineUsers: {
      onlineUsers: [1, 2],
    },
  };

  return configureStore({
    reducer: {
      auth: authReducer,
      user: userReducer,
      notifications: notificationReducer,
      onlineUsers: onlineUsersReducer,
      chat: chatReducer,
    },
    preloadedState: {
      ...defaultState,
      ...preloadedState,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
  });
}

/**
 * Storybook Decorator Helper wrapping with MemoryRouter and Mock Redux Provider
 */
export function MockAppProviders({
  children,
  initialEntries = ["/dashboard/feed"],
  storeState = {},
}) {
  const store = createMockStore(storeState);

  return (
    <Provider store={store}>
      <ThemeProvider>
        <MemoryRouter initialEntries={initialEntries}>
          {children}
        </MemoryRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default MockAppProviders;
