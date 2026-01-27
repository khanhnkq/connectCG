import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'https://probable-space-goggles-4jw7pp5jxqgqf4j7-8080.app.github.dev/api', // Chỉnh lại để có thể gọi cả /v1/auth và /groups
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor 1: Gửi đi -> Tự đính kèm Token
axiosClient.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptor 2: Nhận về -> Xử lý lỗi chung (VD: 401 thì logout)
axiosClient.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response && error.response.status === 401) {
        // Token hết hạn hoặc không hợp lệ
        localStorage.removeItem('accessToken');
        // window.location.href = '/login'; // Có thể uncomment để force login
    }
    return Promise.reject(error);
});

export default axiosClient;