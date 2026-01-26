import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import authService from "../../services/authService";

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('accessToken') || null,
    isAuthenticated: !!localStorage.getItem('accessToken'),
    loading: false,
    error: null,
};

export const loginUser = createAsyncThunk('auth/loginUser', async ({email, password}, {rejectWithValue}) => {
    try {
        const response = await authService.login(email, password);
        const data = response.data; // { accessToken: "...", ... }

        // Giải mã token để lấy thông tin user nếu API không trả về user object
        if (data.accessToken && !data.user) {
            try {
                const decoded = jwtDecode(data.accessToken);
                data.user = decoded; // Gán payload của token vào data.user
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
        },
        setCredentials:(state,action)=>{
        const {accessToken,user} = action.payload;
        state.token = accessToken;
        state.user = user||(accessToken ? jwtDecode(accessToken) : null);
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
        localStorage.setItem('accessToken',accessToken);
        if(state.user){
            localStorage.setItem('user',JSON.stringify(state.user));
            }
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(loginUser.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user; // Đã được xử lý trong thunk
            state.token = action.payload.accessToken;
            state.error = null;
            
            localStorage.setItem('accessToken', action.payload.accessToken);
            if (state.user) {
                localStorage.setItem('user', JSON.stringify(state.user));
            }
        })
        .addCase(loginUser.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload||'Đăng nhập thất bại';
        })
    }
    
});
export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;