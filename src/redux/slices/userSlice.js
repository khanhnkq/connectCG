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
            });
    }
});

export const { clearProfile } = userSlice.actions;
export default userSlice.reducer;
