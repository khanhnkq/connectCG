import { createSlice } from "@reduxjs/toolkit";

const onlineUsersSlice = createSlice({
    name: "onlineUsers",
    initialState: {
        onlineUserIds: [], // Array of online User IDs
    },
    reducers: {
        setOnlineUsers: (state, action) => {
            // Expects an array of IDs
            state.onlineUserIds = action.payload;
        },
        userCameOnline: (state, action) => {
            // Expects a single ID
            const userId = action.payload;
            if (!state.onlineUserIds.includes(userId)) {
                state.onlineUserIds.push(userId);
            }
        },
        userWentOffline: (state, action) => {
            // Expects a single ID
            const userId = action.payload;
            state.onlineUserIds = state.onlineUserIds.filter(id => id !== userId);
        },
    },
});

export const { setOnlineUsers, userCameOnline, userWentOffline } = onlineUsersSlice.actions;

// Selectors
export const selectOnlineUserIds = (state) => state.onlineUsers.onlineUserIds;
export const selectIsUserOnline = (state, userId) => state.onlineUsers.onlineUserIds.includes(userId);

export default onlineUsersSlice.reducer;
