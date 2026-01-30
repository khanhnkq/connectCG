import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserProfileService from "../../services/user/UserProfileService";

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

const userSlice = createSlice({
    name: 'user',
    initialState: {
        profile: JSON.parse(localStorage.getItem('userProfile')) || null, // Khôi phục từ localStorage
        loading: false,
        error: null,
    },
    reducers: {
        clearProfile: (state) => {
            state.profile = null;
            state.error = null;
            localStorage.removeItem('userProfile'); // Xóa khỏi localStorage
        },
        updateFriendsCount: (state, action) => {
            if (state.profile) {
                state.profile.friendsCount = action.payload;
                localStorage.setItem('userProfile', JSON.stringify(state.profile));
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // [FIX] Xóa profile khi logout
            .addCase('auth/logout', (state) => {
                state.profile = null;
                state.error = null;
                state.loading = false;
                localStorage.removeItem('userProfile'); // Xóa khỏi localStorage
            })
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
                // Lưu profile vào localStorage
                localStorage.setItem('userProfile', JSON.stringify(action.payload));
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Avatar Success
            .addCase(updateUserAvatar.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
                localStorage.setItem('userProfile', JSON.stringify(state.profile));
            })
            // Update Cover Success
            .addCase(updateUserCover.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
                localStorage.setItem('userProfile', JSON.stringify(state.profile));
            })
            .addCase(updateProfileInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload; // Cập nhật lại state với data mới
                localStorage.setItem('userProfile', JSON.stringify(state.profile));
            })
            .addCase(updateProfileInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearProfile, updateFriendsCount } = userSlice.actions;
export default userSlice.reducer;
