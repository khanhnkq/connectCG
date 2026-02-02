import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import userReducer from "../slices/userSlice";
import notificationReducer from "../slices/notificationSlice";
import onlineUsersReducer from "../slices/onlineUsersSlice";
import chatReducer from "../slices/chatSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        notifications: notificationReducer,
        onlineUsers: onlineUsersReducer,
        chat: chatReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false })
});