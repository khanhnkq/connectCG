import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import userReducer from "../slices/userSlice";
import notificationReducer from "../slices/notificationSlice";
import onlineUsersReducer from "../slices/onlineUsersSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        notifications: notificationReducer,
        onlineUsers: onlineUsersReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false })
});