import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import authService from "../../services/authService";

const getInitialUser = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && !user.id && user.sub) {
      user.id = parseInt(user.sub, 10);
    }
    return user;
  } catch {
    return null;
  }
};

const initialState = {
  user: getInitialUser(),
  token: localStorage.getItem('accessToken') || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  loading: false,
  error: null,
  hasProfile: localStorage.getItem('hasProfile') === 'true',
};

export const loginUser = createAsyncThunk('auth/loginUser', async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await authService.login(email, password);
    const data = response.data; // { accessToken: "...", ... }

    // Giải mã token để lấy thông tin user nếu API không trả về user object
    if (data.accessToken && !data.user) {
      try {
        const decoded = jwtDecode(data.accessToken);
        // Map 'sub' to 'id' if missing
        if (decoded.sub && !decoded.id) {
          decoded.id = parseInt(decoded.sub, 10);
        }
        data.user = decoded;
      } catch (e) {
        console.error("Token decode failed:", e);
      }
    }
    return data;
  } catch (error) {
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue('Đăng nhập thất bại');
  }
});

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (registrationData, { rejectWithValue }) => {
    try {
      const response = await authService.register(registrationData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Đăng ký thất bại');
    }
  }
);

// [NEW] Thêm thunk createProfile
export const createProfile = createAsyncThunk(
  'auth/createProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await authService.createProfile(profileData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Cập nhật hồ sơ thất bại');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      authService.logout();
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.hasProfile = false;
    },
    setCredentials: (state, action) => {
      const { accessToken, user } = action.payload;
      state.token = accessToken;
      if (user) {
        state.user = user;
      } else if (accessToken) {
        const decoded = jwtDecode(accessToken);
        if (decoded.sub && !decoded.id) {
          decoded.id = parseInt(decoded.sub, 10);
        }
        state.user = decoded;
      } else {
        state.user = null;
      }
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      state.hasProfile = action.payload.hasProfile || false;
      localStorage.setItem('hasProfile', state.hasProfile);
      localStorage.setItem('accessToken', accessToken);
      if (state.user) {
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user; // Đã được xử lý trong thunk
        state.token = action.payload.accessToken;
        state.error = null;
        state.hasProfile = action.payload.hasProfile || false;
        localStorage.setItem('hasProfile', state.hasProfile);
        localStorage.setItem('accessToken', action.payload.accessToken);
        if (state.user) {
          localStorage.setItem('user', JSON.stringify(state.user));
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Đăng nhập thất bại';
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProfile.fulfilled, (state) => {
    state.hasProfile = true;
    localStorage.setItem('hasProfile', 'true');
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        // Đăng ký xong thường sẽ redirect về login nên không cần set user/token ở đây ngay
        // Nếu API tự login sau khi đăng ký thì bạn có thể set state giống loginUser
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Đăng ký thất bại';
      })
  }

});
export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
