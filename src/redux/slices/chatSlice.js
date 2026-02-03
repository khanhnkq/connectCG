import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        conversations: [],
        activeRoomId: null,
        loading: false,
        error: null,
    },
    reducers: {
        setActiveRoomId: (state, action) => {
            state.activeRoomId = action.payload;
        },
        setConversations: (state, action) => {
            state.conversations = [...action.payload].sort((a, b) => {
                const timeA = a.lastMessageTimestamp || (a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0);
                const timeB = b.lastMessageTimestamp || (b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0);
                return timeB - timeA;
            });
        },
        updateConversation: (state, action) => {
            const index = state.conversations.findIndex(c => c.id === action.payload.id);
            if (index !== -1) {
                // Merge and update
                const updated = { ...state.conversations[index], ...action.payload };
                state.conversations[index] = updated;
            } else {
                // If not found, add it
                state.conversations.push(action.payload);
            }

            // Resort to ensure recent message is at top
            state.conversations.sort((a, b) => {
                const timeA = a.lastMessageTimestamp || (a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0);
                const timeB = b.lastMessageTimestamp || (b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0);
                return timeB - timeA;
            });
        },
        updateConversations: (state, action) => {
            // Update multiple conversations at once
            action.payload.forEach(update => {
                const index = state.conversations.findIndex(c => c.id === update.id);
                if (index !== -1) {
                    state.conversations[index] = { ...state.conversations[index], ...update };
                } else {
                    state.conversations.push(update);
                }
            });

            // Resort
            state.conversations.sort((a, b) => {
                const timeA = a.lastMessageTimestamp || (a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0);
                const timeB = b.lastMessageTimestamp || (b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0);
                return timeB - timeA;
            });
        },
        clearUnreadCount: (state, action) => {
            const roomId = action.payload;
            const index = state.conversations.findIndex(c => c.id === roomId);
            if (index !== -1) {
                state.conversations[index].unreadCount = 0;
            }
        },
        removeConversation: (state, action) => {
            const roomId = action.payload;
            state.conversations = state.conversations.filter(c => c.id !== roomId);
            if (state.activeRoomId === roomId) {
                state.activeRoomId = null;
            }
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearConversations: (state) => {
            state.conversations = [];
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // Clear conversations on logout
        builder.addCase('auth/logout', (state) => {
            state.conversations = [];
            state.error = null;
            state.loading = false;
        });
    }
});

export const {
    setActiveRoomId,
    setConversations,
    updateConversation,
    updateConversations,
    clearUnreadCount,
    removeConversation,
    setLoading,
    setError,
    clearConversations
} = chatSlice.actions;

export default chatSlice.reducer;
