import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMyNotifications } from '../../services/NotificationService';
import { clearSession, loginUser, logout, logoutAll } from './authSlice';

const resetNotificationState = (state) => {
    state.items = [];
    state.loading = false;
    state.error = null;
    state.unreadCount = 0;
    state.groupDeletionAlert = null;
    state.groupBanAlert = null;
    state.currentRequestId = null;
};

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
        currentRequestId: null,
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
            .addCase(fetchNotifications.pending, (state, action) => {
                state.loading = true;
                state.currentRequestId = action.meta.requestId;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                if (action.meta.requestId !== state.currentRequestId) return;
                state.loading = false;
                state.currentRequestId = null;
                // Safe check if payload is array. If backend returns Page object, we might need .content
                const payload = action.payload || [];
                state.items = Array.isArray(payload) ? payload : (payload.content || []);
                state.unreadCount = state.items.filter(n => !n.isRead).length;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                if (action.meta.requestId !== state.currentRequestId) return;
                state.loading = false;
                state.error = action.payload;
                state.currentRequestId = null;
            })
            .addCase(loginUser.pending, resetNotificationState)
            .addCase(logout.pending, resetNotificationState)
            .addCase(logoutAll.pending, resetNotificationState)
            .addCase(clearSession, resetNotificationState);
    },
});

export const { addNotification, markAsRead, markAllAsRead, deleteNotification, setNotifications, setGroupDeletionAlert, clearGroupDeletionAlert, setGroupBanAlert, clearGroupBanAlert } = notificationSlice.actions;

export default notificationSlice.reducer;
