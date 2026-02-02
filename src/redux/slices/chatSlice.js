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
            state.conversations = action.payload;
        },
        updateConversation: (state, action) => {
            const index = state.conversations.findIndex(c => c.id === action.payload.id);
            if (index !== -1) {
                state.conversations[index] = { ...state.conversations[index], ...action.payload };
            }
        },
        updateConversations: (state, action) => {
            // Update multiple conversations at once
            state.conversations = state.conversations.map(conv => {
                const update = action.payload.find(u => u.id === conv.id);
                return update ? { ...conv, ...update } : conv;
            });
        },
        clearUnreadCount: (state, action) => {
            const roomId = action.payload;
            const index = state.conversations.findIndex(c => c.id === roomId);
            if (index !== -1) {
                state.conversations[index].unreadCount = 0;
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
    setLoading,
    setError,
    clearConversations
} = chatSlice.actions;

export default chatSlice.reducer;
