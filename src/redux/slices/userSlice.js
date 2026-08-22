import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserProfileService from "../../services/user/UserProfileService";
import {
    clearSession,
    initializeAuth,
    loginUser,
    logout,
    logoutAll,
} from "./authSlice";

// Thunk để lấy thông tin profile từ Backend
export const fetchUserProfile = createAsyncThunk(
    'user/fetchUserProfile',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await UserProfileService.getUserProfile(userId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Không thể tải thông tin hồ sơ");
        }
    }
);

export const updateUserAvatar = createAsyncThunk(
    'user/updateAvatar',
    async (imageUrl, { rejectWithValue }) => {
        try {
            const response = await UserProfileService.updateAvatar(imageUrl);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Lỗi cập nhật ảnh đại diện");
        }
    }
);

export const updateUserCover = createAsyncThunk(
    'user/updateCover',
    async (imageUrl, { rejectWithValue }) => {
        try {
            const response = await UserProfileService.updateCover(imageUrl);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Lỗi cập nhật ảnh bìa");
        }
    }
);

export const updateProfileInfo = createAsyncThunk(
    'user/updateProfileInfo',
    async (data, { rejectWithValue }) => {
        try {
            const response = await UserProfileService.updateProfileInfo(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Lỗi cập nhật hồ sơ");
        }
    }
);

const resetProfileState = (state) => {
    state.profile = null;
    state.loading = false;
    state.error = null;
    state.requestedUserId = null;
    localStorage.removeItem('userProfile');
};

const userSlice = createSlice({
    name: 'user',
    initialState: {
        profile: null,
        loading: false,
        error: null,
        requestedUserId: null,
    },
    reducers: {
        clearProfile: resetProfileState,
        updateFriendsCount: (state, action) => {
            if (state.profile) {
                state.profile.friendsCount = action.payload;
            }
        },
        updatePostsCount: (state, action) => {
             if (state.profile) {
                 state.profile.postsCount = action.payload;
             }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(initializeAuth.pending, resetProfileState)
            .addCase(initializeAuth.rejected, resetProfileState)
            .addCase(loginUser.pending, resetProfileState)
            .addCase(logout.pending, resetProfileState)
            .addCase(logout.fulfilled, resetProfileState)
            .addCase(logout.rejected, resetProfileState)
            .addCase(logoutAll.pending, resetProfileState)
            .addCase(logoutAll.fulfilled, resetProfileState)
            .addCase(logoutAll.rejected, resetProfileState)
            .addCase(clearSession, resetProfileState)
            .addCase(fetchUserProfile.pending, (state, action) => {
                state.loading = true;
                state.error = null;
                state.requestedUserId = action.meta.arg;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                if (action.meta.arg !== state.requestedUserId) return;
                state.loading = false;
                state.profile = action.payload;
                state.requestedUserId = null;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                if (action.meta.arg !== state.requestedUserId) return;
                state.loading = false;
                state.error = action.payload;
                state.requestedUserId = null;
            })
            // Update Avatar Success
            .addCase(updateUserAvatar.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            // Update Cover Success
            .addCase(updateUserCover.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(updateProfileInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(updateProfileInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearProfile, updateFriendsCount, updatePostsCount } = userSlice.actions;
export default userSlice.reducer;
