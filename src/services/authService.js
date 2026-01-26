import axiosClient from "../config/axiosConfig";

const authService = {
    login: (username, password) => {
        // Đường dẫn này nối đuôi vào baseURL -> http://localhost:8080/api/v1/auth/login
        return axiosClient.post('/v1/auth/login', { username, password });
    },

    register: (data) => {
        return axiosClient.post('/v1/auth/register', data);
    },
    createProfile: (data) => {
        return axiosClient.post('/v1/auth/profile', data);
    },

    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        if (userStr) return JSON.parse(userStr);
        return null;
    },
    forgotPassword(email) {
        return axiosClient.post(`/v1/auth/forgot-password`, null, { params: { email } });
    },
    resetPassword(token, newPassword) {
        return axiosClient.post(`/v1/auth/reset-password`, null, { params: { token, newPassword } });
    }
};

export default authService;