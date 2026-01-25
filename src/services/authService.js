import axiosClient from "../config/axiosConfig";

const authService = {
    login: (username, password) => {
        // Đường dẫn này nối đuôi vào baseURL -> http://localhost:8080/api/v1/auth/login
        return axiosClient.post('/v1/auth/login', { username, password });
    },

    register: (data) => {
        return axiosClient.post('/v1/auth/register', data);
    },

    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        if (userStr) return JSON.parse(userStr);
        return null;
    }
};

export default authService;