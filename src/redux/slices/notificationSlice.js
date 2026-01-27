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
        setNotifications: (state, action) => {
            state.items = action.payload;
            state.unreadCount = action.payload.filter(n => !n.isRead).length;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
                state.unreadCount = action.payload.filter(n => !n.isRead).length;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { addNotification, markAsRead, markAllAsRead, setNotifications } = notificationSlice.actions;

export default notificationSlice.reducer;
