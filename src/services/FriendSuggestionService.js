import api from '../config/axiosConfig';

const FriendSuggestionService = {
    // Lấy danh sách gợi ý kết bạn
    getSuggestions: async (page = 0, size = 10) => {
        try {
            const response = await api.get(`/v1/friends/suggestions?page=${page}&size=${size}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching friend suggestions:", error);
            throw error;
        }
    },

    // Ẩn/Xóa một gợi ý
    dismissSuggestion: async (userId) => {
        try {
            const response = await api.delete(`/v1/friends/suggestions/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Error dismissing suggestion:", error);
            throw error;
        }
    },

    // Làm mới gợi ý (Refresh)
    refreshSuggestions: async () => {
        try {
            const response = await api.post(`/v1/friends/suggestions/refresh`);
            return response.data;
        } catch (error) {
            console.error("Error refreshing suggestions:", error);
            throw error;
        }
    }
};

export default FriendSuggestionService;
