import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMyNotifications } from '../../services/NotificationService';

export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getMyNotifications();
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        items: [],
        loading: false,
        error: null,
        unreadCount: 0,
        groupDeletionAlert: null, // Stores payload for group deletion modal { type, content, ... }
        groupBanAlert: null, // { groupId, groupName, action }
    },
    reducers: {
        addNotification: (state, action) => {
            state.items.unshift(action.payload);
            if (!action.payload.isRead) {
                state.unreadCount += 1;
            }
        },
        markAsRead: (state, action) => {
            const notification = state.items.find(n => n.id === action.payload);
            if (notification && !notification.isRead) {
                notification.isRead = true;
                state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
        },
        markAllAsRead: (state) => {
            state.items.forEach(n => n.isRead = true);
            state.unreadCount = 0;
        },
        deleteNotification: (state, action) => {
            const notification = state.items.find(n => n.id === action.payload);
            if (notification && !notification.isRead) {
                state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
            state.items = state.items.filter(n => n.id !== action.payload);
        },
        setNotifications: (state, action) => {
            state.items = Array.isArray(action.payload) ? action.payload : [];
            state.unreadCount = state.items.filter(n => !n.isRead).length;
        },
        setGroupDeletionAlert: (state, action) => {
            state.groupDeletionAlert = action.payload; // Payload contains the deletion message details
        },
        clearGroupDeletionAlert: (state) => {
            state.groupDeletionAlert = null;
        },
        setGroupBanAlert: (state, action) => {
            state.groupBanAlert = action.payload;
        },
        clearGroupBanAlert: (state) => {
            state.groupBanAlert = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                // Safe check if payload is array. If backend returns Page object, we might need .content
                const payload = action.payload || [];
                state.items = Array.isArray(payload) ? payload : (payload.content || []);
                state.unreadCount = state.items.filter(n => !n.isRead).length;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { addNotification, markAsRead, markAllAsRead, deleteNotification, setNotifications, setGroupDeletionAlert, clearGroupDeletionAlert, setGroupBanAlert, clearGroupBanAlert } = notificationSlice.actions;

export default notificationSlice.reducer;
