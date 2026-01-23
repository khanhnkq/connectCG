import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8080/api/v1', // Đảm bảo đúng port và đường dẫn backend
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