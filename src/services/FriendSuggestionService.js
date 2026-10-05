import api from '../config/axiosConfig';

const FriendSuggestionService = {
    // Lấy danh sách gợi ý kết bạn
    getSuggestions: async (page = 0, size = 10) => {
        try {
            const response = await api.get(`/friends/suggestions?page=${page}&size=${size}`);
            const data = response.data || {};
            if (typeof data === "object" && data !== null && !data.data) {
                // Ensure dual compatibility for both response.content and response.data.content
                data.data = data;
            }
            return data;
        } catch (error) {
            console.error("Error fetching friend suggestions:", error);
            throw error;
        }
    },

    // Ẩn/Xóa một gợi ý
    dismissSuggestion: async (userId) => {
        try {
            const response = await api.delete(`/friends/suggestions/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Error dismissing suggestion:", error);
            throw error;
        }
    },

    // Làm mới gợi ý (Refresh)
    refreshSuggestions: async () => {
        try {
            const response = await api.post(`/friends/suggestions/refresh`);
            return response.data;
        } catch (error) {
            console.error("Error refreshing suggestions:", error);
            throw error;
        }
    }
};

export default FriendSuggestionService;
