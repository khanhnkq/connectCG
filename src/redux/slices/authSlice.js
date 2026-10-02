import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "../../services/authService";

const initialState = {
  user: null,
  isAuthenticated: false,
  authChecked: false,
  loading: false,
  error: null,
  hasProfile: false,
};

const sessionUser = (session) => ({
  id: session.id,
  username: session.username,
  role: session.role,
  fullName: session.fullName,
});

export const initializeAuth = createAsyncThunk(
  "auth/initialize",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentSession();
      return response.data;
    } catch (error) {
      return rejectWithValue({
        status: error.response?.status,
        data: error.response?.data || null,
        message: error.response?.data?.message || error.message || "Lỗi kiểm tra phiên đăng nhập",
      });
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authService.login(email, password);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Đăng nhập thất bại");
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (registrationData, { rejectWithValue }) => {
    try {
      const response = await authService.register(registrationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Đăng ký thất bại");
    }
  },
);

export const createProfile = createAsyncThunk(
  "auth/createProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await authService.createProfile(profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Cập nhật hồ sơ thất bại");
    }
  },
);

export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    await authService.logout();
    return { serverRevoked: true };
  } catch (error) {
    return { serverRevoked: false, error: error.message };
  }
});

export const logoutAll = createAsyncThunk(
  "auth/logoutAll",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logoutAll();
      return { success: true };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Không thể đăng xuất tất cả thiết bị",
      );
    }
  },
);

const applySession = (state, session) => {
  state.user = sessionUser(session);
  state.isAuthenticated = true;
  state.hasProfile = Boolean(session.hasProfile);
  state.error = null;
};

const resetSession = (state) => {
  state.user = null;
  state.isAuthenticated = false;
  state.hasProfile = false;
  state.loading = false;
  state.error = null;
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearSession: resetSession,
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        applySession(state, action.payload);
        state.authChecked = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        const status = action.payload?.status;
        if (status === 401 || status === 403) {
          resetSession(state);
          state.error = null;
        } else {
          // Lỗi mạng hoặc 5xx: giữ trạng thái hiện tại, lưu thông báo lỗi
          state.error = action.payload?.message || "Lỗi kết nối máy chủ";
        }
        state.authChecked = true;
        state.loading = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        applySession(state, action.payload);
        state.authChecked = true;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Đăng nhập thất bại";
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Đăng ký thất bại";
      })
      .addCase(createProfile.fulfilled, (state) => {
        state.hasProfile = true;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state, action) => {
        resetSession(state);
        if (!action.payload?.serverRevoked) {
          console.warn("Logout: Server revocation failed, session cleared locally only");
        }
      })
      .addCase(logout.rejected, (state) => {
        resetSession(state);
      })
      .addCase(logoutAll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutAll.fulfilled, (state) => {
        resetSession(state);
      })
      .addCase(logoutAll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Đăng xuất tất cả thiết bị thất bại";
      });
  },
});

export const { clearSession } = authSlice.actions;
export default authSlice.reducer;
