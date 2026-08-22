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
      return rejectWithValue(error.response?.data || null);
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
  } catch {
    // Clear the in-memory session even when the server cannot be reached.
  }
});

export const logoutAll = createAsyncThunk("auth/logoutAll", async () => {
  await authService.logoutAll();
});

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
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        applySession(state, action.payload);
        state.authChecked = true;
        state.loading = false;
      })
      .addCase(initializeAuth.rejected, (state) => {
        resetSession(state);
        state.authChecked = true;
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
      .addCase(logout.pending, resetSession)
      .addCase(logout.fulfilled, resetSession)
      .addCase(logout.rejected, resetSession)
      .addCase(logoutAll.pending, resetSession)
      .addCase(logoutAll.fulfilled, resetSession)
      .addCase(logoutAll.rejected, resetSession);
  },
});

export const { clearSession } = authSlice.actions;
export default authSlice.reducer;
